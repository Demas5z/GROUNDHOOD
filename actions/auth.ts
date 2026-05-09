'use server'

import { prisma } from '@/lib/prisma'
import { signIn, signOut } from '@/auth'
import { AuthError } from 'next-auth'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

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
