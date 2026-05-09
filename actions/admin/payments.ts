'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export type ActionResult = { error?: string; success?: string }

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'admin') return null
  return session
}

export async function verifyPaymentAction(
  paymentId: string,
  action: 'approve' | 'reject',
  notes?: string,
): Promise<ActionResult> {
  if (!(await requireAdmin())) return { error: 'Forbidden' }

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { order: true },
  })
  if (!payment) return { error: 'Pembayaran tidak ditemukan.' }

  if (action === 'approve') {
    // Per workflow doc 5.5: valid → status pesanan ke 'diproses'
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'valid',
          verifiedAt: new Date(),
          notes: notes || payment.notes,
        },
      }),
      prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'diproses' },
      }),
    ])
  } else {
    // tidak_valid → status pesanan kembali ke 'menunggu_pembayaran'
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'tidak_valid',
          notes: notes || 'Bukti tidak valid, customer perlu upload ulang.',
        },
      }),
      prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'menunggu_pembayaran' },
      }),
    ])
  }

  revalidatePath('/admin/payments')
  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${payment.orderId}`)
  return {
    success: action === 'approve'
      ? 'Pembayaran dikonfirmasi, pesanan masuk tahap diproses.'
      : 'Pembayaran ditolak, customer diminta upload ulang.',
  }
}
