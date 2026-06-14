'use server'

import { randomBytes } from 'crypto'
import { prisma } from '@/lib/prisma'
import { signIn, signOut } from '@/auth'
import { AuthError } from 'next-auth'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { sendVerificationEmail, sendPasswordResetEmail } from '@/lib/email'

const VERIFY_TOKEN_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

export type ActionResult = { error?: string; success?: string }

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
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + VERIFY_TOKEN_TTL_MS)

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password: hashed,
      verifyToken: token,
      verifyTokenExpiresAt: expiresAt,
    },
  })

  try {
    await sendVerificationEmail(user.email, user.name, token)
  } catch (err) {
    // Roll back so the email can be reused for a fresh attempt.
    await prisma.user.delete({ where: { id: user.id } })
    const message = err instanceof Error ? err.message : 'Gagal mengirim email verifikasi.'
    return { error: message }
  }

  return { success: 'Akun dibuat! Cek email kamu untuk link verifikasi.' }
}

// ─────────────────────────────────────────────────────────────────
// Email verification
// ─────────────────────────────────────────────────────────────────

export async function verifyEmailAction(token: string): Promise<ActionResult> {
  if (!token || token.length < 10) {
    return { error: 'Token verifikasi tidak valid.' }
  }

  const user = await prisma.user.findUnique({
    where: { verifyToken: token },
    select: { id: true, emailVerified: true, verifyTokenExpiresAt: true },
  })

  if (!user) {
    return { error: 'Token verifikasi tidak valid atau sudah digunakan.' }
  }
  if (user.emailVerified) {
    return { success: 'Email sudah terverifikasi. Silakan login.' }
  }
  if (!user.verifyTokenExpiresAt || user.verifyTokenExpiresAt < new Date()) {
    return { error: 'Link verifikasi sudah kadaluarsa. Silakan minta link baru.' }
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      verifyToken: null,
      verifyTokenExpiresAt: null,
    },
  })

  return { success: 'Email berhasil diverifikasi! Silakan login.' }
}

export async function resendVerificationAction(email: string): Promise<ActionResult> {
  const parsed = z.string().email().safeParse(email)
  // Generic response — don't leak which emails exist.
  const generic = { success: 'Jika email terdaftar dan belum diverifikasi, link baru telah dikirim.' }
  if (!parsed.success) return generic

  const user = await prisma.user.findUnique({
    where: { email: parsed.data },
    select: { id: true, name: true, email: true, emailVerified: true },
  })
  if (!user || user.emailVerified) return generic

  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + VERIFY_TOKEN_TTL_MS)
  await prisma.user.update({
    where: { id: user.id },
    data: { verifyToken: token, verifyTokenExpiresAt: expiresAt },
  })

  try {
    await sendVerificationEmail(user.email, user.name, token)
  } catch {
    return { error: 'Gagal mengirim email. Coba lagi nanti.' }
  }
  return generic
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
    select: { role: true, password: true, emailVerified: true },
  })

  // If credentials are actually correct but the email isn't verified,
  // show a helpful message instead of the generic "invalid" error.
  if (user && !user.emailVerified) {
    const passwordOk = await bcrypt.compare(data.password, user.password)
    if (passwordOk) {
      return { error: 'Email belum diverifikasi. Cek inbox kamu untuk link verifikasi.' }
    }
  }

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
})

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000 // 1 hour

export async function forgotPasswordAction(data: {
  email: string
}): Promise<ActionResult> {
  const parsed = forgotSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  // Always return the same response so attackers can't tell which emails exist.
  const generic = {
    success: 'Jika email terdaftar, link reset password telah dikirim ke email tersebut.',
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true, name: true, email: true, role: true },
  })

  // Don't reveal non-existence; admins can't self-reset for safety.
  if (!user || user.role === 'admin') return generic

  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS)

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken: token, resetTokenExpiresAt: expiresAt },
  })

  try {
    await sendPasswordResetEmail(user.email, user.name, token)
  } catch (err) {
    // Log for the developer but keep the response generic (anti-enumeration).
    console.error('Gagal mengirim email reset password:', err)
  }

  return generic
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
