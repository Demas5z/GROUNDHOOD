import 'server-only'
import { prisma } from '@/lib/prisma'
import { STORE_CONFIG } from '@/lib/store-config'
import { BANK_INFO, QRIS_IMAGE_URL, QRIS_MERCHANT_NAME } from '@/lib/payment-config'

/**
 * DB-backed site settings. Editable merchant config (payment + store info) is
 * stored in the MySQL `site_setting` table and read through here, falling back
 * to the code constants (lib/store-config, lib/payment-config) when a row is
 * missing. This keeps a single source of truth in MySQL while the constants act
 * as sane defaults / seed values.
 *
 * NOTE: the ongkir origin *coordinates* (STORE_CONFIG.origin) intentionally stay
 * in code — they are needed synchronously on the client and are not free-text.
 */
export type SettingGroup = 'store' | 'payment'
export type SettingType = 'text' | 'textarea' | 'image'

export type SettingDef = {
  key: string
  group: SettingGroup
  label: string
  type: SettingType
  def: string
  help?: string
}

export const SETTING_DEFS: SettingDef[] = [
  // Store / company info
  { key: 'store.name', group: 'store', label: 'Nama Toko', type: 'text', def: STORE_CONFIG.name },
  {
    key: 'store.address', group: 'store', label: 'Alamat Toko', type: 'textarea', def: STORE_CONFIG.address,
    help: 'Tampil di halaman About & Contact. Catatan: titik asal perhitungan ongkir tetap memakai koordinat di lib/store-config.ts.',
  },
  { key: 'store.email', group: 'store', label: 'Email', type: 'text', def: STORE_CONFIG.email },
  { key: 'store.instagram', group: 'store', label: 'Instagram', type: 'text', def: STORE_CONFIG.instagram },
  { key: 'store.operatingHours', group: 'store', label: 'Jam Operasional', type: 'text', def: STORE_CONFIG.operatingHours },
  // Payment info
  { key: 'payment.bankName', group: 'payment', label: 'Nama Bank', type: 'text', def: BANK_INFO.bankName },
  { key: 'payment.accountNumber', group: 'payment', label: 'Nomor Rekening', type: 'text', def: BANK_INFO.accountNumber },
  { key: 'payment.accountName', group: 'payment', label: 'Atas Nama', type: 'text', def: BANK_INFO.accountName },
  { key: 'payment.bankBranch', group: 'payment', label: 'Cabang Bank (opsional)', type: 'text', def: BANK_INFO.branch },
  {
    key: 'payment.qrisImageUrl', group: 'payment', label: 'Gambar QRIS', type: 'image', def: QRIS_IMAGE_URL,
    help: 'Path/URL gambar QR. Upload lewat halaman ini atau isi path manual (mis. /QRIS.jpeg).',
  },
  { key: 'payment.qrisMerchantName', group: 'payment', label: 'Nama Merchant QRIS', type: 'text', def: QRIS_MERCHANT_NAME },
]

const DEF_BY_KEY = new Map(SETTING_DEFS.map((d) => [d.key, d]))

async function getValueMap(): Promise<Record<string, string>> {
  const rows = await prisma.siteSetting.findMany()
  const map: Record<string, string> = {}
  for (const r of rows) map[r.key] = r.value
  return map
}

function resolve(map: Record<string, string>, key: string): string {
  const stored = map[key]
  if (stored !== undefined && stored !== null && stored !== '') return stored
  return DEF_BY_KEY.get(key)?.def ?? ''
}

export type StoreSettings = {
  name: string
  address: string
  email: string
  instagram: string
  operatingHours: string
}

export async function getStoreSettings(): Promise<StoreSettings> {
  const map = await getValueMap()
  return {
    name: resolve(map, 'store.name'),
    address: resolve(map, 'store.address'),
    email: resolve(map, 'store.email'),
    instagram: resolve(map, 'store.instagram'),
    operatingHours: resolve(map, 'store.operatingHours'),
  }
}

export type PaymentSettings = {
  bankName: string
  accountNumber: string
  accountName: string
  branch: string
  qrisImageUrl: string
  qrisMerchantName: string
}

export async function getPaymentSettings(): Promise<PaymentSettings> {
  const map = await getValueMap()
  return {
    bankName: resolve(map, 'payment.bankName'),
    accountNumber: resolve(map, 'payment.accountNumber'),
    accountName: resolve(map, 'payment.accountName'),
    branch: map['payment.bankBranch'] ?? BANK_INFO.branch,
    qrisImageUrl: resolve(map, 'payment.qrisImageUrl'),
    qrisMerchantName: resolve(map, 'payment.qrisMerchantName'),
  }
}

/** Full list with current resolved values, for the admin settings form. */
export async function getAllSettings(): Promise<(SettingDef & { value: string })[]> {
  const map = await getValueMap()
  return SETTING_DEFS.map((d) => ({ ...d, value: resolve(map, d.key) }))
}
