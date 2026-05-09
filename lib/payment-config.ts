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
  accountNumber: '1370012345678',
  accountName: 'GROUNDHOOD STORE',
  branch: 'Jakarta Cabang Sudirman',
}

// QR code generated via qrserver.com — replaceable by admin's static QRIS image.
export const QRIS_IMAGE_URL =
  'https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=12&data=GROUNDHOOD-STORE-QRIS-MERCHANT-ID'

export const QRIS_MERCHANT_NAME = 'GROUNDHOOD STORE'

export const PAYMENT_METHOD_LABEL: Record<string, string> = {
  transfer: 'Transfer Bank',
  qris: 'QRIS',
}
