'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'
import { Package, Truck } from 'lucide-react'
import { formatRupiah } from '@/lib/order-status'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/shipping'
import type { ShippingQuote } from '@/lib/shipping'
import CheckoutForm from './CheckoutForm'

type SummaryItem = {
  id: string
  name: string
  image: string | null
  price: number
  quantity: number
}

type Props = {
  items: SummaryItem[]
  subtotal: number
  totalQty: number
  defaults: {
    shippingName: string
    shippingPhone: string
    provinceId: string
    city: string
    district: string
    postalCode: string
    addressDetail: string
  }
}

export default function CheckoutClient({ items, subtotal, totalQty, defaults }: Props) {
  const [quote, setQuote] = useState<ShippingQuote | null>(null)

  const onQuoteChange = useCallback((q: ShippingQuote | null) => setQuote(q), [])

  const freeByThreshold = subtotal >= FREE_SHIPPING_THRESHOLD
  const shippingValue = quote
    ? quote.free
      ? 'GRATIS'
      : formatRupiah(quote.cost)
    : freeByThreshold
      ? 'GRATIS'
      : 'Pilih alamat'
  const total = subtotal + (quote && !quote.free ? quote.cost : 0)

  return (
    <div className="checkout-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) 380px',
      gap: '52px',
      alignItems: 'flex-start',
    }}>
      {/* Form column */}
      <div>
        <CheckoutForm subtotal={subtotal} defaults={defaults} onQuoteChange={onQuoteChange} />
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
          {items.map((item) => (
            <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{
                position: 'relative',
                width: '52px', height: '64px',
                borderRadius: '8px', overflow: 'hidden',
                border: '1px dotted rgba(212,210,203,0.2)',
                background: 'rgba(212,210,203,0.04)',
                flexShrink: 0,
              }}>
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill sizes="52px" style={{ objectFit: 'cover' }} />
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
                  {item.name}
                </p>
                <p style={{ fontSize: '10px', color: '#a8a69f' }}>
                  {item.quantity} × {formatRupiah(item.price)}
                </p>
              </div>
              <p style={{
                fontSize: '11px', fontWeight: 700, color: '#d4d2cb',
                textAlign: 'right', whiteSpace: 'nowrap',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {formatRupiah(item.price * item.quantity)}
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
            value={shippingValue}
            accent={shippingValue === 'GRATIS'}
            muted={shippingValue === 'Pilih alamat'}
          />
          {quote && !quote.free && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '10px', color: '#a8a69f', letterSpacing: '0.03em',
            }}>
              <Truck size={11} />
              <span>± {quote.distanceKm} km dari toko · estimasi {quote.etd}</span>
            </div>
          )}
          {quote?.free && (
            <p style={{ fontSize: '10px', color: '#86efac', letterSpacing: '0.03em' }}>
              Gratis ongkir — belanja ≥ {formatRupiah(FREE_SHIPPING_THRESHOLD)}
            </p>
          )}
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
            {formatRupiah(total)}
          </span>
        </div>
      </aside>

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
      `}</style>
    </div>
  )
}

function Row({ label, value, accent, muted }: { label: string; value: string; accent?: boolean; muted?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '11px', color: '#a8a69f', letterSpacing: '0.05em' }}>
        {label}
      </span>
      <span style={{
        fontSize: '12px',
        color: accent ? '#86efac' : muted ? '#75736d' : '#d4d2cb',
        fontWeight: accent ? 700 : 400,
        letterSpacing: '0.03em',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </span>
    </div>
  )
}
