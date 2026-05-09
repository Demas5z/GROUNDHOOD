import { Suspense } from 'react'
import ShopClient from './ShopClient'

export const metadata = {
  title: 'Shop',
  description: 'Jelajahi koleksi thrift GROUNDHOOD. T-shirts, hoodies, outerwear, aksesoris — produk secondhand pilihan.',
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '80px 40px', textAlign: 'center', color: '#a8a69f' }}>
        <p className="text-label">Loading collection...</p>
      </div>
    }>
      <ShopClient />
    </Suspense>
  )
}
