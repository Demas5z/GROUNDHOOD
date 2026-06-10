'use server'

import { randomBytes } from 'crypto'
import { prisma } from '@/lib/prisma'
import { signIn, signOut } from '@/auth'
import { AuthError } from 'next-auth'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

export type ActionResult = { error?: string; success?: string }
export type ForgotPasswordResult = ActionResult & { token?: string }

function normalizePhone(p: string) {
  return p.replace(/[\s\-()]/g, '')
}

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
})

export async function registerAction(data: {
  name: string
  email: string
  password: string
}): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  })
  if (existing) {
    return { error: 'Email address is already registered' }
  }

  const hashed = await bcrypt.hash(parsed.data.password, 12)

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password: hashed,
    },
  })

  return { success: 'Account created! Please sign in.' }
}

function isSafeCallbackUrl(url: string | undefined | null): url is string {
  if (!url) return false
  // Only allow relative paths to avoid open-redirects.
  return url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/\\')
}

export async function loginAction(data: {
  email: string
  password: string
  callbackUrl?: string
}): Promise<ActionResult> {
  // Look up role to choose redirect destination
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    select: { role: true },
  })

  // Admin always lands on admin dashboard regardless of callbackUrl.
  // Customer honors callbackUrl when safe, else lands on home.
  const redirectTo = user?.role === 'admin'
    ? '/admin'
    : isSafeCallbackUrl(data.callbackUrl) ? data.callbackUrl : '/'

  try {
    await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirectTo,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid email or password' }
        default:
          return { error: 'Something went wrong. Please try again.' }
      }
    }
    throw error // Re-throw NEXT_REDIRECT
  }
  return {}
}

export async function logoutAction() {
  await signOut({ redirectTo: '/' })
}

// ─────────────────────────────────────────────────────────────────
// Forgot / Reset Password
// ─────────────────────────────────────────────────────────────────

const forgotSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  phone: z.string().min(6, 'Nomor HP tidak valid'),
})

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000 // 1 hour

export async function forgotPasswordAction(data: {
  email: string
  phone: string
}): Promise<ForgotPasswordResult> {
  const parsed = forgotSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true, phone: true, role: true },
  })

  // Generic message — don't leak whether email exists or phone mismatch
  const genericError = 'Email atau nomor HP tidak cocok dengan data terdaftar.'
  if (!user || !user.phone) return { error: genericError }
  if (normalizePhone(user.phone) !== normalizePhone(parsed.data.phone)) {
    return { error: genericError }
  }

  // Admin accounts cannot self-reset for safety
  if (user.role === 'admin') {
    return { error: 'Akun admin tidak dapat reset password secara mandiri.' }
  }

  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS)

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken: token, resetTokenExpiresAt: expiresAt },
  })

  return { success: 'Verifikasi berhasil.', token }
}

const resetSchema = z.object({
  token: z.string().min(10, 'Token tidak valid'),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .regex(/[A-Z]/, 'Harus mengandung huruf besar')
    .regex(/[0-9]/, 'Harus mengandung angka'),
})

export async function resetPasswordAction(data: {
  token: string
  password: string
}): Promise<ActionResult> {
  const parsed = resetSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const user = await prisma.user.findUnique({
    where: { resetToken: parsed.data.token },
    select: { id: true, resetTokenExpiresAt: true },
  })

  if (!user || !user.resetTokenExpiresAt || user.resetTokenExpiresAt < new Date()) {
    return { error: 'Token reset password tidak valid atau sudah kadaluarsa.' }
  }

  const hashed = await bcrypt.hash(parsed.data.password, 12)

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashed,
      resetToken: null,
      resetTokenExpiresAt: null,
    },
  })

  return { success: 'Password berhasil diubah. Silakan login.' }
}
