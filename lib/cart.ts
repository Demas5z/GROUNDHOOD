import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function getCartCount(): Promise<number> {
  const session = await auth()
  if (!session?.user?.id) return 0

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    select: { items: { select: { quantity: true } } },
  })
  if (!cart) return 0
  return cart.items.reduce((sum, item) => sum + item.quantity, 0)
}

export async function getCartWithItems(userId: string) {
  return prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        orderBy: { id: 'asc' },
        include: {
          product: {
            include: { category: true },
          },
        },
      },
    },
  })
}
