'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import { deleteUploadedFile } from '@/lib/uploads'

export type ActionResult = { error?: string; success?: string }
export type UploadResult = { url?: string; mimeType?: string; error?: string }

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'admin') return null
  return session
}

const schema = z.object({
  key: z
    .string()
    .min(2, 'Key minimal 2 karakter')
    .regex(/^[a-z0-9-]+$/, 'Key hanya boleh huruf kecil, angka, dan tanda hubung'),
  name: z.string().min(2, 'Nama aset minimal 2 karakter'),
  type: z.enum(['image', 'video'], { errorMap: () => ({ message: 'Tipe harus image atau video' }) }),
  url: z.string().min(1, 'URL/path aset wajib diisi'),
  mimeType: z.string().optional().nullable(),
  alt: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
})

export type AssetInput = z.infer<typeof schema>

export async function createAssetAction(data: AssetInput): Promise<ActionResult> {
  if (!(await requireAdmin())) return { error: 'Forbidden' }
  const parsed = schema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  const exists = await prisma.assetWeb.findUnique({ where: { key: parsed.data.key } })
  if (exists) return { error: `Aset dengan key "${parsed.data.key}" sudah ada.` }

  await prisma.assetWeb.create({
    data: {
      key: parsed.data.key,
      name: parsed.data.name,
      type: parsed.data.type,
      url: parsed.data.url,
      mimeType: parsed.data.mimeType || null,
      alt: parsed.data.alt || null,
      isActive: parsed.data.isActive ?? true,
    },
  })
  revalidatePath('/admin/assets')
  revalidatePath('/')
  revalidatePath('/login')
  return { success: 'Aset ditambahkan.' }
}

export async function updateAssetAction(id: string, data: AssetInput): Promise<ActionResult> {
  if (!(await requireAdmin())) return { error: 'Forbidden' }
  const parsed = schema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  // Key must stay unique across other rows.
  const clash = await prisma.assetWeb.findFirst({
    where: { key: parsed.data.key, NOT: { id } },
  })
  if (clash) return { error: `Aset lain sudah memakai key "${parsed.data.key}".` }

  await prisma.assetWeb.update({
    where: { id },
    data: {
      key: parsed.data.key,
      name: parsed.data.name,
      type: parsed.data.type,
      url: parsed.data.url,
      mimeType: parsed.data.mimeType || null,
      alt: parsed.data.alt || null,
      isActive: parsed.data.isActive ?? true,
    },
  })
  revalidatePath('/admin/assets')
  revalidatePath('/')
  revalidatePath('/login')
  return { success: 'Aset diupdate.' }
}

export async function deleteAssetAction(id: string): Promise<ActionResult> {
  if (!(await requireAdmin())) return { error: 'Forbidden' }

  const asset = await prisma.assetWeb.findUnique({ where: { id } })
  if (!asset) return { error: 'Aset tidak ditemukan.' }

  await prisma.assetWeb.delete({ where: { id } })
  // Clean up the underlying file only if it was uploaded via the admin panel.
  await deleteUploadedFile(asset.url)
  revalidatePath('/admin/assets')
  revalidatePath('/')
  revalidatePath('/login')
  return { success: 'Aset dihapus.' }
}

const MAX_SIZE = 45 * 1024 * 1024 // 45MB
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
}

export async function uploadAssetFileAction(formData: FormData): Promise<UploadResult> {
  if (!(await requireAdmin())) return { error: 'Forbidden' }

  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) {
    return { error: 'File tidak ditemukan.' }
  }

  const ext = ALLOWED_TYPES[file.type]
  if (!ext) {
    return { error: 'Format harus JPG, PNG, WEBP, GIF, MP4, atau WEBM.' }
  }
  if (file.size > MAX_SIZE) {
    return { error: 'Ukuran file maksimal 45MB.' }
  }

  const filename = `${randomUUID()}.${ext}`
  const dir = path.join(process.cwd(), 'public', 'uploads', 'assets')
  await mkdir(dir, { recursive: true })

  const bytes = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(dir, filename), bytes)

  return { url: `/uploads/assets/${filename}`, mimeType: file.type }
}
