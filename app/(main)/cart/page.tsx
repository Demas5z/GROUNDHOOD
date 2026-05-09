import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { auth } from '@/auth'
import { getCartWithItems } from '@/lib/cart'
import { formatRupiah } from '@/lib/order-status'
import CartItemRow from './CartItemRow'

export const metadata = { title: 'Keranjang Belanja' }

const FREE_SHIPPING_THRESHOLD = 300_000

export default async function CartPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login?callbackUrl=/cart')

  const cart = await getCartWithItems(session.user.id)
  const items = cart?.items ?? []
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0)
  const freeShippingProgress = Math.min(subtotal / FREE_SHIPPING_THRESHOLD, 1)
  const remainingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0)

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 40px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <p className="text-label" style={{ marginBottom: '12px' }}>Cart</p>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '-0.035em',
          color: '#d4d2cb', lineHeight: 1, marginBottom: '14px',
        }}>
          Keranjang Belanja
        </h1>
        <p style={{ color: '#a8a69f', fontSize: '12px', lineHeight: 1.8 }}>
          {items.length === 0
            ? 'Belum ada produk di keranjang.'
            : `${totalQty} item${totalQty !== 1 ? 's' : ''} dari ${items.length} produk.`}
        </p>
      </div>

      {items.length === 0 ? (
        <div style={{
          padding: '100px 24px', textAlign: 'center',
          border: '1px dotted rgba(212,210,203,0.2)', borderRadius: '20px',
          background: 'rgba(212,210,203,0.02)',
        }}>
          <ShoppingBag size={42} color="rgba(212,210,203,0.25)" style={{ margin: '0 auto 22px' }} />
          <h2 style={{
            fontSize: '16px', fontWeight: 700, color: '#d4d2cb',
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px',
          }}>
            Keranjang kamu kosong
          </h2>
          <p style={{
            fontSize: '12px', color: '#a8a69f', letterSpacing: '0.03em',
            lineHeight: 1.8, marginBottom: '28px', maxWidth: '380px', margin: '0 auto 28px',
          }}>
            Yuk cek katalog dan temukan archive piece yang masih layak diceritakan ulang.
          </p>
          <Link href="/shop" className="btn-pill btn-pill-filled">
            Browse Shop
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 360px',
          gap: '52px',
          alignItems: 'flex-start',
        }} className="cart-grid">
          {/* Items list */}
          <div>
            <div style={{
              borderTop: '1px dotted rgba(212,210,203,0.18)',
            }}>
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>

            <div style={{ marginTop: '32px' }}>
              <Link
                href="/shop"
                className="cart-continue"
                style={{
                  fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: '#a8a69f', textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                }}
              >
                ← Lanjut belanja
              </Link>
            </div>
          </div>

          {/* Summary card */}
          <aside style={{
            position: 'sticky', top: '88px',
            padding: '28px 28px 32px',
            border: '1px dotted rgba(212,210,203,0.3)',
            borderRadius: '20px',
            background: 'rgba(212,210,203,0.03)',
          }}>
            <p className="text-label" style={{ marginBottom: '20px' }}>Order Summary</p>

            {/* Free shipping progress */}
            <div style={{ marginBottom: '24px' }}>
              {remainingForFreeShipping > 0 ? (
                <p style={{ fontSize: '11px', color: '#a8a69f', lineHeight: 1.6, marginBottom: '10px' }}>
                  Kurang <span style={{ color: '#d4d2cb', fontWeight: 700 }}>
                    {formatRupiah(remainingForFreeShipping)}
                  </span> lagi untuk gratis ongkir.
                </p>
              ) : (
                <p style={{ fontSize: '11px', color: '#86efac', lineHeight: 1.6, marginBottom: '10px', letterSpacing: '0.05em' }}>
                  ✓ Kamu mendapatkan gratis ongkir.
                </p>
              )}
              <div style={{
                height: '4px', background: 'rgba(212,210,203,0.1)',
                borderRadius: '2px', overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${freeShippingProgress * 100}%`,
                  background: freeShippingProgress >= 1 ? '#86efac' : '#d4d2cb',
                  transition: 'width 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                }} />
              </div>
            </div>

            {/* Line items */}
            <div style={{
              display: 'flex', flexDirection: 'column', gap: '14px',
              paddingBottom: '20px',
              borderBottom: '1px dotted rgba(212,210,203,0.2)',
            }}>
              <SummaryRow label="Subtotal" value={formatRupiah(subtotal)} />
              <SummaryRow label="Item count" value={`${totalQty} pcs`} />
              <SummaryRow
                label="Pengiriman"
                value={remainingForFreeShipping > 0 ? 'Diatur admin' : 'GRATIS'}
                accent={remainingForFreeShipping === 0}
              />
            </div>

            {/* Total */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
              padding: '20px 0 24px',
            }}>
              <span style={{
                fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase',
                color: '#a8a69f',
              }}>
                Total
              </span>
              <span style={{
                fontSize: '22px', fontWeight: 700, color: '#d4d2cb',
                letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums',
              }}>
                {formatRupiah(subtotal)}
              </span>
            </div>

            {/* Checkout */}
            <Link
              href="/checkout"
              className="cart-checkout"
              style={{
                width: '100%',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                padding: '16px 24px',
                background: '#d4d2cb',
                color: '#1a1a1a',
                border: '1px solid #d4d2cb',
                borderRadius: '50px',
                fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              Checkout <ArrowRight size={14} />
            </Link>

            <p style={{
              fontSize: '10px', color: '#a8a69f', lineHeight: 1.7,
              marginTop: '16px', letterSpacing: '0.03em',
            }}>
              Pengiriman akan diatur admin setelah pembayaran dikonfirmasi.
            </p>
          </aside>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .cart-grid {
            grid-template-columns: 1fr !important;
          }
          .cart-grid aside {
            position: static !important;
          }
        }
        .cart-continue {
          transition: color 300ms ease,
                      transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .cart-continue:hover {
          color: #d4d2cb;
          transform: translateX(-4px);
        }
        .cart-checkout {
          transition: background 350ms cubic-bezier(0.22, 1, 0.36, 1),
                      transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .cart-checkout:hover {
          background: #fff;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  )
}

function SummaryRow({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{
        fontSize: '11px', color: '#a8a69f', letterSpacing: '0.05em',
      }}>
        {label}
      </span>
      <span style={{
        fontSize: '12px', color: accent ? '#86efac' : '#d4d2cb',
        fontWeight: accent ? 700 : 400,
        letterSpacing: '0.03em',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </span>
    </div>
  )
}
