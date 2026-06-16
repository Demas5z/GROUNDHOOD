/* eslint-disable @typescript-eslint/no-require-imports */
// Seeds the `asset_web` table with the website's heavy media assets.
// Idempotent: re-running updates existing rows (matched on `key`).
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const assets = [
  {
    key: 'hero-bg',
    name: 'Homepage hero background',
    type: 'video',
    url: '/hero-bg.mp4',
    mimeType: 'video/mp4',
    alt: 'GROUNDHOOD hero background video',
    fileSize: 18593193,
    isActive: true,
  },
  {
    key: 'login-bg',
    name: 'Login page background',
    type: 'video',
    url: '/Login_BG.mp4',
    mimeType: 'video/mp4',
    alt: 'GROUNDHOOD login background video',
    fileSize: 19532597,
    isActive: true,
  },
  {
    key: 'qris',
    name: 'QRIS payment code',
    type: 'image',
    url: '/QRIS.jpeg',
    mimeType: 'image/jpeg',
    alt: 'QRIS payment QR code',
    fileSize: 87983,
    isActive: true,
  },
]

async function main() {
  console.log('Seeding asset_web...\n')
  for (const asset of assets) {
    const row = await prisma.assetWeb.upsert({
      where: { key: asset.key },
      update: asset,
      create: asset,
    })
    console.log(`  ✓ ${row.key} -> ${row.url}`)
  }
  console.log('\nDone.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
