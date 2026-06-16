import { prisma } from './prisma'

/**
 * Web asset (image/video) metadata, sourced from the `asset_web` table.
 *
 * Centralising asset lookups here means heavy media (hero / login backgrounds)
 * can be swapped via the database without touching component source code.
 */
export type WebAsset = {
  key: string
  name: string
  type: string
  url: string
  mimeType: string | null
  alt: string | null
}

/** Fallbacks used when the DB has no matching active asset (e.g. fresh install). */
const FALLBACKS: Record<string, WebAsset> = {
  'hero-bg': {
    key: 'hero-bg',
    name: 'Homepage hero background',
    type: 'video',
    url: '/hero-bg.mp4',
    mimeType: 'video/mp4',
    alt: null,
  },
  'login-bg': {
    key: 'login-bg',
    name: 'Login page background',
    type: 'video',
    url: '/Login_BG.mp4',
    mimeType: 'video/mp4',
    alt: null,
  },
}

/**
 * Fetch a single active asset by its logical key, falling back to a sane
 * default so pages never break if the row is missing.
 */
export async function getAsset(key: string): Promise<WebAsset> {
  try {
    const row = await prisma.assetWeb.findFirst({
      where: { key, isActive: true },
    })
    if (row) {
      return {
        key: row.key,
        name: row.name,
        type: row.type,
        url: row.url,
        mimeType: row.mimeType,
        alt: row.alt,
      }
    }
  } catch {
    // DB unreachable / table missing — fall through to fallback.
  }
  return FALLBACKS[key] ?? { key, name: key, type: 'image', url: '', mimeType: null, alt: null }
}
