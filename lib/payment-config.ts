export type PaymentMethod = 'transfer' | 'qris'

export const PAYMENT_METHODS: { value: PaymentMethod; label: string; description: string }[] = [
  {
    value: 'transfer',
    label: 'Transfer Bank',
    description: 'Transfer manual ke rekening Mandiri.',
  },
  {
    value: 'qris',
    label: 'QRIS',
    description: 'Scan QR code dari aplikasi e-wallet atau mobile banking.',
  },
]

export const BANK_INFO = {
  bankName: 'Bank Mandiri',
  accountNumber: '1190027032703',
  accountName: 'FARREL AMIRTA IRBAH',
  branch: '',
}

// Static QRIS image stored in public/. Replaceable by the merchant's own QRIS.
export const QRIS_IMAGE_URL = '/QRIS.jpeg'

export const QRIS_MERCHANT_NAME = 'FARREL AMIRTA IRBAH'

export const PAYMENT_METHOD_LABEL: Record<string, string> = {
  transfer: 'Transfer Bank',
  qris: 'QRIS',
}
