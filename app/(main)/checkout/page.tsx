import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { getCartWithItems } from '@/lib/cart'
import CheckoutClient from './CheckoutClient'

export const metadata = { title: 'Checkout' }

export default async function CheckoutPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login?callbackUrl=/checkout')

  const [user, cart] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true, phone: true,
        shipProvinceId: true, shipCity: true, shipDistrict: true,
        shipPostalCode: true, shipAddressDetail: true,
      },
    }),
    getCartWithItems(session.user.id),
  ])

  if (!cart || cart.items.length === 0) {
    redirect('/cart')
  }

  const subtotal = cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const totalQty = cart.items.reduce((sum, i) => sum + i.quantity, 0)

  const items = cart.items.map((i) => ({
    id: i.id,
    name: i.product.name,
    image: i.product.image,
    price: i.product.price,
    quantity: i.quantity,
  }))

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 40px 80px' }}>
      <Link
        href="/cart"
        className="checkout-back"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase',
          color: '#a8a69f', textDecoration: 'none',
          marginBottom: '32px',
        }}
      >
        <ArrowLeft size={13} />
        Kembali ke keranjang
      </Link>

      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <p className="text-label" style={{ marginBottom: '12px' }}>Checkout</p>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '-0.035em',
          color: '#d4d2cb', lineHeight: 1, marginBottom: '14px',
        }}>
          Konfirmasi Pesanan
        </h1>
        <p style={{ color: '#a8a69f', fontSize: '12px', lineHeight: 1.8 }}>
          Lengkapi data pengiriman dan pilih metode pembayaran. Ongkir dihitung otomatis dari lokasi tujuan.
        </p>
      </div>

      <CheckoutClient
        items={items}
        subtotal={subtotal}
        totalQty={totalQty}
        defaults={{
          shippingName: user?.name ?? '',
          shippingPhone: user?.phone ?? '',
          provinceId: user?.shipProvinceId ?? '',
          city: user?.shipCity ?? '',
          district: user?.shipDistrict ?? '',
          postalCode: user?.shipPostalCode ?? '',
          addressDetail: user?.shipAddressDetail ?? '',
        }}
      />

      <style>{`
        .checkout-back {
          transition: color 300ms ease,
                      transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .checkout-back:hover {
          color: #d4d2cb;
          transform: translateX(-4px);
        }
      `}</style>
    </div>
  )
}
