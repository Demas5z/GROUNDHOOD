'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type ActionResult = { error?: string; success?: string }

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'admin') {
    return null
  }
  return session
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const productSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  price: z.number().int().positive('Harga harus lebih dari 0'),
  stock: z.number().int().min(0, 'Stok tidak boleh negatif'),
  description: z.string().optional(),
  image: z
    .string()
    .refine(
      (v) => v === '' || v.startsWith('/') || /^https?:\/\//i.test(v),
      'Gambar tidak valid'
    )
    .optional()
    .or(z.literal('')),
  categoryId: z.string().min(1, 'Kategori wajib dipilih'),
})

type ProductInput = z.infer<typeof productSchema>

export async function createProductAction(data: ProductInput): Promise<ActionResult> {
  const session = await requireAdmin()
  if (!session) return { error: 'Forbidden' }

  const parsed = productSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  let slug = slugify(parsed.data.name)
  const existing = await prisma.product.findUnique({ where: { slug } })
  if (existing) slug = `${slug}-${Date.now().toString(36)}`

  await prisma.product.create({
    data: {
      name: parsed.data.name,
      slug,
      price: parsed.data.price,
      stock: parsed.data.stock,
      description: parsed.data.description || null,
      image: parsed.data.image || null,
      categoryId: parsed.data.categoryId,
    },
  })

  revalidatePath('/admin/products')
  redirect('/admin/products')
}

export async function updateProductAction(id: string, data: ProductInput): Promise<ActionResult> {
  const session = await requireAdmin()
  if (!session) return { error: 'Forbidden' }

  const parsed = productSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  await prisma.product.update({
    where: { id },
    data: {
      name: parsed.data.name,
      price: parsed.data.price,
      stock: parsed.data.stock,
      description: parsed.data.description || null,
      image: parsed.data.image || null,
      categoryId: parsed.data.categoryId,
    },
  })

  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/${id}/edit`)
  return { success: 'Produk berhasil diupdate.' }
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
  const session = await requireAdmin()
  if (!session) return { error: 'Forbidden' }

  // Check for existing order items
  const orderItemCount = await prisma.orderItem.count({ where: { productId: id } })
  if (orderItemCount > 0) {
    return { error: 'Produk tidak dapat dihapus karena sudah pernah dipesan.' }
  }

  await prisma.product.delete({ where: { id } })
  revalidatePath('/admin/products')
  return { success: 'Produk dihapus.' }
}
