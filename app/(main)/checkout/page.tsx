import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { Package, ArrowLeft } from 'lucide-react'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { getCartWithItems } from '@/lib/cart'
import { formatRupiah } from '@/lib/order-status'
import CheckoutForm from './CheckoutForm'

export const metadata = { title: 'Checkout' }

const FREE_SHIPPING_THRESHOLD = 300_000

export default async function CheckoutPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login?callbackUrl=/checkout')

  const [user, cart] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, phone: true, address: true },
    }),
    getCartWithItems(session.user.id),
  ])

  if (!cart || cart.items.length === 0) {
    redirect('/cart')
  }

  const subtotal = cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const totalQty = cart.items.reduce((sum, i) => sum + i.quantity, 0)
  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD

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
          Lengkapi data pengiriman dan pilih metode pembayaran.
        </p>
      </div>

      {/* Grid: form + summary */}
      <div className="checkout-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 380px',
        gap: '52px',
        alignItems: 'flex-start',
      }}>
        {/* Form column */}
        <div>
          <CheckoutForm
            defaults={{
              shippingName: user?.name ?? '',
              shippingPhone: user?.phone ?? '',
              shippingAddress: user?.address ?? '',
            }}
          />
        </div>

        {/* Summary column (sticky) */}
        <aside style={{
          position: 'sticky', top: '88px',
          padding: '28px 28px 32px',
          border: '1px dotted rgba(212,210,203,0.3)',
          borderRadius: '20px',
          background: 'rgba(212,210,203,0.03)',
        }}>
          <p className="text-label" style={{ marginBottom: '20px' }}>
            Ringkasan Pesanan ({totalQty})
          </p>

          {/* Items list */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '14px',
            paddingBottom: '20px',
            borderBottom: '1px dotted rgba(212,210,203,0.2)',
          }}>
            {cart.items.map((item) => (
              <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  position: 'relative',
                  width: '52px', height: '64px',
                  borderRadius: '8px', overflow: 'hidden',
                  border: '1px dotted rgba(212,210,203,0.2)',
                  background: 'rgba(212,210,203,0.04)',
                  flexShrink: 0,
                }}>
                  {item.product.image ? (
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      sizes="52px"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Package size={16} color="rgba(212,210,203,0.25)" />
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: '11px', fontWeight: 700, color: '#d4d2cb',
                    letterSpacing: '0.04em', textTransform: 'uppercase',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    marginBottom: '4px',
                  }}>
                    {item.product.name}
                  </p>
                  <p style={{ fontSize: '10px', color: '#a8a69f' }}>
                    {item.quantity} × {formatRupiah(item.product.price)}
                  </p>
                </div>
                <p style={{
                  fontSize: '11px', fontWeight: 700, color: '#d4d2cb',
                  textAlign: 'right', whiteSpace: 'nowrap',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {formatRupiah(item.product.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Subtotal lines */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '14px',
            padding: '20px 0',
            borderBottom: '1px dotted rgba(212,210,203,0.2)',
          }}>
            <Row label="Subtotal" value={formatRupiah(subtotal)} />
            <Row
              label="Pengiriman"
              value={freeShipping ? 'GRATIS' : 'Diatur admin'}
              accent={freeShipping}
            />
          </div>

          {/* Total */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            padding: '20px 0 0',
          }}>
            <span style={{
              fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase',
              color: '#a8a69f',
            }}>
              Total
            </span>
            <span style={{
              fontSize: '24px', fontWeight: 700, color: '#d4d2cb',
              letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums',
            }}>
              {formatRupiah(subtotal)}
            </span>
          </div>
        </aside>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .checkout-grid {
            grid-template-columns: 1fr !important;
          }
          .checkout-grid aside {
            position: static !important;
            order: -1;
          }
        }
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

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '11px', color: '#a8a69f', letterSpacing: '0.05em' }}>
        {label}
      </span>
      <span style={{
        fontSize: '12px',
        color: accent ? '#86efac' : '#d4d2cb',
        fontWeight: accent ? 700 : 400,
        letterSpacing: '0.03em',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </span>
    </div>
  )
}
