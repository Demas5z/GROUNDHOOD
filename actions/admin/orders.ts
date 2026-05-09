'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { ORDER_STATUSES, type OrderStatus } from '@/lib/order-status'

export type ActionResult = { error?: string; success?: string }

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'admin') return null
  return session
}

export async function updateOrderStatusAction(
  id: string,
  status: OrderStatus,
): Promise<ActionResult> {
  if (!(await requireAdmin())) return { error: 'Forbidden' }
  if (!ORDER_STATUSES.includes(status)) return { error: 'Status tidak valid.' }

  await prisma.order.update({
    where: { id },
    data: { status },
  })

  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${id}`)
  return { success: 'Status pesanan diupdate.' }
}
