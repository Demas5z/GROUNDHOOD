'use server'

import { auth } from '@/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

export type UploadResult = { url?: string; error?: string }

const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

export async function uploadProductImageAction(formData: FormData): Promise<UploadResult> {
  const session = await auth()
  if (!session?.user || session.user.role !== 'admin') {
    return { error: 'Forbidden' }
  }

  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) {
    return { error: 'File gambar tidak ditemukan.' }
  }

  const ext = ALLOWED_TYPES[file.type]
  if (!ext) {
    return { error: 'Format harus JPG, PNG, WEBP, atau GIF.' }
  }
  if (file.size > MAX_SIZE) {
    return { error: 'Ukuran gambar maksimal 5MB.' }
  }

  const filename = `${randomUUID()}.${ext}`
  const dir = path.join(process.cwd(), 'public', 'uploads', 'products')
  await mkdir(dir, { recursive: true })

  const bytes = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(dir, filename), bytes)

  return { url: `/uploads/products/${filename}` }
}
