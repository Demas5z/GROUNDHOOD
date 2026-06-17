'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { SETTING_DEFS } from '@/lib/settings'

export type ActionResult = { error?: string; success?: string }

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'admin') return null
  return session
}

const GROUP_BY_KEY = new Map(SETTING_DEFS.map((d) => [d.key, d.group]))

export async function updateSettingsAction(values: Record<string, string>): Promise<ActionResult> {
  if (!(await requireAdmin())) return { error: 'Forbidden' }

  // Only persist keys we know about; ignore anything else.
  const entries = Object.entries(values).filter(([key]) => GROUP_BY_KEY.has(key))
  if (entries.length === 0) return { error: 'Tidak ada pengaturan yang dikirim.' }

  try {
    await prisma.$transaction(
      entries.map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value: value ?? '' },
          create: { key, value: value ?? '', group: GROUP_BY_KEY.get(key)! },
        }),
      ),
    )
  } catch (error) {
    console.error('updateSettingsAction failed:', error)
    return { error: 'Gagal menyimpan pengaturan.' }
  }

  // Surfaces in About/Contact, checkout & order payment instructions.
  revalidatePath('/admin/settings')
  revalidatePath('/about')
  revalidatePath('/contact')
  revalidatePath('/', 'layout')
  return { success: 'Pengaturan disimpan ke database.' }
}
