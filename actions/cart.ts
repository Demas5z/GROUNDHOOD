'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export type ActionResult = { error?: string; success?: string }

const addToCartSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1, 'Jumlah minimal 1'),
})

export async function addToCartAction(data: {
  productId: string
  quantity: number
}): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/product/${data.productId}`)
  }

  const parsed = addToCartSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  const product = await prisma.product.findUnique({
    where: { id: parsed.data.productId },
    select: { id: true, stock: true },
  })
  if (!product) return { error: 'Produk tidak ditemukan.' }
  if (product.stock < parsed.data.quantity) {
    return { error: `Stok tidak cukup. Tersedia: ${product.stock}.` }
  }

  const cart = await prisma.cart.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id },
    update: {},
  })

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId: product.id } },
  })

  const nextQty = (existing?.quantity ?? 0) + parsed.data.quantity
  if (nextQty > product.stock) {
    return { error: `Total di keranjang melebihi stok (max ${product.stock}).` }
  }

  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId: product.id } },
    create: { cartId: cart.id, productId: product.id, quantity: parsed.data.quantity },
    update: { quantity: nextQty },
  })

  revalidatePath('/cart')
  revalidatePath('/', 'layout')
  return { success: 'Ditambahkan ke keranjang.' }
}

const updateSchema = z.object({
  itemId: z.string().min(1),
  quantity: z.number().int().min(1, 'Jumlah minimal 1'),
})

export async function updateCartItemAction(data: {
  itemId: string
  quantity: number
}): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Sesi berakhir, silakan login ulang.' }

  const parsed = updateSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  const item = await prisma.cartItem.findUnique({
    where: { id: parsed.data.itemId },
    include: {
      cart: { select: { userId: true } },
      product: { select: { stock: true } },
    },
  })
  if (!item) return { error: 'Item tidak ditemukan.' }
  if (item.cart.userId !== session.user.id) return { error: 'Forbidden.' }
  if (parsed.data.quantity > item.product.stock) {
    return { error: `Stok hanya tersedia ${item.product.stock}.` }
  }

  await prisma.cartItem.update({
    where: { id: parsed.data.itemId },
    data: { quantity: parsed.data.quantity },
  })

  revalidatePath('/cart')
  revalidatePath('/', 'layout')
  return { success: 'Jumlah diperbarui.' }
}

export async function removeCartItemAction(itemId: string): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Sesi berakhir, silakan login ulang.' }
  if (!itemId) return { error: 'Item tidak valid.' }

  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: { select: { userId: true } } },
  })
  if (!item) return { error: 'Item tidak ditemukan.' }
  if (item.cart.userId !== session.user.id) return { error: 'Forbidden.' }

  await prisma.cartItem.delete({ where: { id: itemId } })

  revalidatePath('/cart')
  revalidatePath('/', 'layout')
  return { success: 'Item dihapus dari keranjang.' }
}
