'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export type ActionResult = { error?: string; success?: string }

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'admin') {
    return null
  }
  return session
}

export async function deleteUserAction(id: string): Promise<ActionResult> {
  const session = await requireAdmin()
  if (!session) return { error: 'Forbidden' }

  // Guard against an admin deleting their own account and locking themselves out.
  if (session.user.id === id) {
    return { error: 'Kamu tidak dapat menghapus akunmu sendiri.' }
  }

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return { error: 'User tidak ditemukan.' }
  if (user.deletedAt) return { error: 'User sudah dihapus.' }

  // Soft-delete: mark as deleted instead of removing the row, so the user's
  // order history stays intact for reporting. The account is hidden from the
  // admin list and can no longer log in (see auth.ts).
  await prisma.user.update({
    where: { id },
    data: { deletedAt: new Date() },
  })

  revalidatePath('/admin/users')
  return { success: 'User dihapus.' }
}
