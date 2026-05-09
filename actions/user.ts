'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'

export type ActionResult = { error?: string; success?: string }

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  address: z.string().optional(),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'At least 8 characters')
      .regex(/[A-Z]/, 'Include at least one uppercase letter')
      .regex(/[0-9]/, 'Include at least one number'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export async function updateProfileAction(data: {
  name: string
  phone?: string
  address?: string
}): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated' }

  const parsed = profileSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      address: parsed.data.address || null,
    },
  })

  revalidatePath('/account')
  revalidatePath('/account/profile')
  return { success: 'Profile updated successfully' }
}

export async function changePasswordAction(data: {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated' }

  const parsed = passwordSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) return { error: 'User not found' }

  const valid = await bcrypt.compare(parsed.data.currentPassword, user.password)
  if (!valid) return { error: 'Current password is incorrect' }

  const hashed = await bcrypt.hash(parsed.data.newPassword, 12)

  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashed },
  })

  return { success: 'Password changed successfully' }
}

export async function deleteAccountAction(): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Not authenticated' }

  await prisma.user.delete({ where: { id: session.user.id } })
  return { success: 'Account deleted' }
}
