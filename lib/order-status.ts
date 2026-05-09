export const ORDER_STATUSES = [
  'menunggu_pembayaran',
  'menunggu_konfirmasi',
  'diproses',
  'dikirim',
  'selesai',
  'dibatalkan',
] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]

export const STATUS_LABEL: Record<OrderStatus, string> = {
  menunggu_pembayaran: 'Menunggu Pembayaran',
  menunggu_konfirmasi: 'Menunggu Konfirmasi',
  diproses: 'Diproses',
  dikirim: 'Dikirim',
  selesai: 'Selesai',
  dibatalkan: 'Dibatalkan',
}

export const STATUS_COLOR: Record<OrderStatus, string> = {
  menunggu_pembayaran: '#fbbf24',
  menunggu_konfirmasi: '#60a5fa',
  diproses: '#a78bfa',
  dikirim: '#38bdf8',
  selesai: '#86efac',
  dibatalkan: '#f87171',
}

export const PAYMENT_STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  valid: 'Valid',
  tidak_valid: 'Tidak Valid',
}

export const PAYMENT_STATUS_COLOR: Record<string, string> = {
  pending: '#fbbf24',
  valid: '#86efac',
  tidak_valid: '#f87171',
}

export function formatRupiah(amount: number) {
  return `Rp ${amount.toLocaleString('id-ID')}`
}
