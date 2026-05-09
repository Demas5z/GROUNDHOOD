'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

export type ActionResult = { error?: string; success?: string }

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'admin') return null
  return session
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const schema = z.object({
  name: z.string().min(2, 'Nama kategori minimal 2 karakter'),
})

export async function createCategoryAction(data: { name: string }): Promise<ActionResult> {
  if (!(await requireAdmin())) return { error: 'Forbidden' }
  const parsed = schema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  const slug = slugify(parsed.data.name)
  const exists = await prisma.category.findFirst({
    where: { OR: [{ name: parsed.data.name }, { slug }] },
  })
  if (exists) return { error: 'Kategori dengan nama tersebut sudah ada.' }

  await prisma.category.create({ data: { name: parsed.data.name, slug } })
  revalidatePath('/admin/categories')
  return { success: 'Kategori ditambahkan.' }
}

export async function updateCategoryAction(id: string, data: { name: string }): Promise<ActionResult> {
  if (!(await requireAdmin())) return { error: 'Forbidden' }
  const parsed = schema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  const slug = slugify(parsed.data.name)
  await prisma.category.update({
    where: { id },
    data: { name: parsed.data.name, slug },
  })
  revalidatePath('/admin/categories')
  return { success: 'Kategori diupdate.' }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  if (!(await requireAdmin())) return { error: 'Forbidden' }

  const productCount = await prisma.product.count({ where: { categoryId: id } })
  if (productCount > 0) {
    return { error: `Kategori tidak bisa dihapus karena masih ada ${productCount} produk.` }
  }

  await prisma.category.delete({ where: { id } })
  revalidatePath('/admin/categories')
  return { success: 'Kategori dihapus.' }
}
