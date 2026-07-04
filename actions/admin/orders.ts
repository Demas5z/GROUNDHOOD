'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { ORDER_STATUSES, type OrderStatus } from '@/lib/order-status'
import { publish, userTopic, ADMIN_TOPIC } from '@/lib/realtime'

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

  const order = await prisma.order.update({
    where: { id },
    data: { status },
    select: { userId: true },
  })

  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${id}`)

  // Push a realtime signal so the customer's open order page refreshes itself.
  publish([userTopic(order.userId), ADMIN_TOPIC])
  return { success: 'Status pesanan diupdate.' }
}
