import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const rows = [
  { key: 'store.name', group: 'store', value: 'GROUNDHOOD' },
  { key: 'store.address', group: 'store', value: 'Jl. Andong 3 No. 1, Jakarta Barat' },
  { key: 'store.email', group: 'store', value: 'hello@groundhood.com' },
  { key: 'store.instagram', group: 'store', value: '@groundhood.id' },
  { key: 'store.operatingHours', group: 'store', value: 'Senin – Jumat, 10.00 – 18.00 WIB' },
  { key: 'payment.bankName', group: 'payment', value: 'Bank Mandiri' },
  { key: 'payment.accountNumber', group: 'payment', value: '1190027032703' },
  { key: 'payment.accountName', group: 'payment', value: 'FARREL AMIRTA IRBAH' },
  { key: 'payment.bankBranch', group: 'payment', value: '' },
  { key: 'payment.qrisImageUrl', group: 'payment', value: '/QRIS.jpeg' },
  { key: 'payment.qrisMerchantName', group: 'payment', value: 'FARREL AMIRTA IRBAH' },
]

for (const r of rows) {
  await prisma.siteSetting.upsert({
    where: { key: r.key },
    update: {}, // do not overwrite existing admin-edited values
    create: r,
  })
}
const count = await prisma.siteSetting.count()
console.log(`site_setting rows now: ${count}`)
await prisma.$disconnect()
