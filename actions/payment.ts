'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { deleteUploadedFile } from '@/lib/uploads'

export type ActionResult = { error?: string; success?: string }

const uploadSchema = z.object({
  orderId: z.string().min(1),
  proofImage: z
    .string()
    .min(1, 'Bukti pembayaran wajib diunggah')
    .refine(
      (v) => v.startsWith('/') || /^https?:\/\//i.test(v),
      'Bukti pembayaran tidak valid'
    ),
  notes: z.string().max(500, 'Catatan terlalu panjang').optional(),
})

export async function uploadPaymentProofAction(data: {
  orderId: string
  proofImage: string
  notes?: string
}): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Sesi berakhir, silakan login ulang.' }

  const parsed = uploadSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  const order = await prisma.order.findUnique({
    where: { id: parsed.data.orderId },
    include: { payment: true },
  })
  if (!order) return { error: 'Pesanan tidak ditemukan.' }
  if (order.userId !== session.user.id) return { error: 'Forbidden.' }
  if (order.status === 'dibatalkan') {
    return { error: 'Pesanan ini sudah dibatalkan.' }
  }

  // If a previous proof file exists and is being replaced, remember it so we
  // can remove the orphaned file after the update succeeds.
  const previousProof = order.payment?.proofImage ?? null

  // Update payment + transition order status atomically
  try {
    await prisma.$transaction(async (tx) => {
      if (order.payment) {
        await tx.payment.update({
          where: { id: order.payment.id },
          data: {
            proofImage: parsed.data.proofImage,
            notes: parsed.data.notes ?? null,
            status: 'pending',
          },
        })
      } else {
        await tx.payment.create({
          data: {
            orderId: order.id,
            method: 'transfer',
            proofImage: parsed.data.proofImage,
            notes: parsed.data.notes ?? null,
            status: 'pending',
          },
        })
      }

      // Only auto-transition if still in awaiting-payment stage.
      // (If admin already rejected, customer can re-upload — keep status as is.)
      if (order.status === 'menunggu_pembayaran') {
        await tx.order.update({
          where: { id: order.id },
          data: { status: 'menunggu_konfirmasi' },
        })
      }
    })

    // Remove the replaced file so old proofs don't pile up on disk.
    if (previousProof && previousProof !== parsed.data.proofImage) {
      await deleteUploadedFile(previousProof)
    }

    revalidatePath(`/account/orders/${order.id}`)
    revalidatePath('/account/orders')
    revalidatePath('/admin/payments')
    revalidatePath('/admin/orders')
    return { success: 'Bukti pembayaran terkirim. Menunggu konfirmasi admin.' }
  } catch (error) {
    console.error('uploadPaymentProofAction failed:', error)
    return { error: 'Gagal mengirim bukti. Silakan coba lagi.' }
  }
}
