import Link from 'next/link'
import { ArrowLeft, User, MapPin, Phone, Receipt as ReceiptIcon } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import {
  STATUS_LABEL, STATUS_COLOR, PAYMENT_STATUS_LABEL, PAYMENT_STATUS_COLOR,
  formatRupiah, type OrderStatus,
} from '@/lib/order-status'
import { PAYMENT_METHOD_LABEL } from '@/lib/payment-config'
import StatusUpdater from './StatusUpdater'

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: { include: { product: { select: { image: true, slug: true } } } },
      payment: true,
    },
  })
  if (!order) notFound()

  return (
    <div>
      <Link href="/admin/orders" style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase',
        color: '#a8a69f', textDecoration: 'none', marginBottom: '20px',
      }}>
        <ArrowLeft size={12} /> Kembali ke daftar
      </Link>

      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '20px', marginBottom: '32px',
      }}>
        <div>
          <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#86efac', marginBottom: '8px' }}>
            Detail Pesanan
          </p>
          <h1 style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: '700',
            textTransform: 'uppercase', letterSpacing: '-0.025em',
            color: '#d4d2cb', lineHeight: 1, marginBottom: '8px',
            fontFamily: 'monospace',
          }}>
            {order.orderNumber}
          </h1>
          <p style={{ color: '#a8a69f', fontSize: '11px' }}>
            Dibuat {new Date(order.createdAt).toLocaleString('id-ID', {
              day: 'numeric', month: 'long', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>
        <span style={{
          padding: '6px 14px', borderRadius: '100px',
          border: `1px dotted ${STATUS_COLOR[order.status as OrderStatus]}`,
          background: `${STATUS_COLOR[order.status as OrderStatus]}1a`,
          color: STATUS_COLOR[order.status as OrderStatus],
          fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase',
          fontWeight: '700',
        }}>
          {STATUS_LABEL[order.status as OrderStatus]}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '32px', alignItems: 'start' }}>
        {/* Left: items + payment */}
        <div>
          {/* Items */}
          <section style={{ marginBottom: '32px' }}>
            <p style={{
              fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#a8a69f', marginBottom: '14px',
            }}>
              Items ({order.items.length})
            </p>
            <div style={{ border: '1px dotted rgba(212,210,203,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
              {order.items.map((item, i) => (
                <div key={item.id} style={{
                  display: 'grid', gridTemplateColumns: '60px 1fr auto auto',
                  gap: '14px', padding: '14px 18px', alignItems: 'center',
                  borderTop: i > 0 ? '1px dotted rgba(212,210,203,0.1)' : 'none',
                }}>
                  {item.product.image ? (
                    <img src={item.product.image} alt="" style={{
                      width: '48px', height: '48px', objectFit: 'cover',
                      borderRadius: '4px',
                    }} />
                  ) : (
                    <div style={{
                      width: '48px', height: '48px', background: 'rgba(212,210,203,0.05)',
                      borderRadius: '4px',
                    }} />
                  )}
                  <div>
                    <p style={{
                      fontSize: '11px', fontWeight: '700', color: '#d4d2cb',
                      marginBottom: '4px', letterSpacing: '0.02em',
                    }}>
                      {item.productName}
                    </p>
                    <p style={{ fontSize: '10px', color: '#a8a69f' }}>
                      {formatRupiah(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <p style={{
                    fontSize: '11px', fontWeight: '700', color: '#d4d2cb',
                    textAlign: 'right',
                  }}>
                    {formatRupiah(item.price * item.quantity)}
                  </p>
                </div>
              ))}
              {/* Totals breakdown */}
              <div style={{
                padding: '14px 18px',
                borderTop: '1px dotted rgba(212,210,203,0.3)',
                background: 'rgba(212,210,203,0.04)',
                display: 'flex', flexDirection: 'column', gap: '8px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: '#a8a69f', letterSpacing: '0.05em' }}>Subtotal</span>
                  <span style={{ fontSize: '11px', color: '#d4d2cb' }}>{formatRupiah(order.subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: '#a8a69f', letterSpacing: '0.05em' }}>
                    Ongkir{order.shippingDistanceKm ? ` (± ${order.shippingDistanceKm} km)` : ''}
                  </span>
                  <span style={{ fontSize: '11px', color: '#d4d2cb' }}>
                    {order.shippingCost === 0 ? 'GRATIS' : formatRupiah(order.shippingCost)}
                  </span>
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  paddingTop: '8px', borderTop: '1px dotted rgba(212,210,203,0.2)',
                }}>
                  <p style={{
                    fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase',
                    color: '#a8a69f',
                  }}>
                    Total
                  </p>
                  <p style={{
                    fontSize: '16px', fontWeight: '700', color: '#86efac',
                    letterSpacing: '-0.02em',
                  }}>
                    {formatRupiah(order.total)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Payment */}
          <section style={{ marginBottom: '32px' }}>
            <p style={{
              fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#a8a69f', marginBottom: '14px',
            }}>
              Pembayaran
            </p>
            {!order.payment ? (
              <div style={{
                padding: '20px', border: '1px dotted rgba(212,210,203,0.2)', borderRadius: '4px',
                fontSize: '11px', color: '#a8a69f',
              }}>
                Belum ada pembayaran (customer belum upload bukti).
              </div>
            ) : (
              <div style={{
                padding: '18px', border: '1px dotted rgba(212,210,203,0.2)', borderRadius: '4px',
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: '14px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ReceiptIcon size={14} color="#a8a69f" />
                    <p style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#d4d2cb' }}>
                      {PAYMENT_METHOD_LABEL[order.payment.method] ?? order.payment.method}
                    </p>
                  </div>
                  <span style={{
                    padding: '4px 12px', borderRadius: '100px',
                    border: `1px dotted ${PAYMENT_STATUS_COLOR[order.payment.status]}`,
                    color: PAYMENT_STATUS_COLOR[order.payment.status],
                    fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase',
                  }}>
                    {PAYMENT_STATUS_LABEL[order.payment.status]}
                  </span>
                </div>
                {order.payment.proofImage && (
                  <a href={order.payment.proofImage} target="_blank" rel="noopener noreferrer">
                    <img src={order.payment.proofImage} alt="Bukti transfer" style={{
                      width: '100%', maxWidth: '320px', borderRadius: '4px',
                      border: '1px dotted rgba(212,210,203,0.3)', marginBottom: '12px',
                    }} />
                  </a>
                )}
                {order.payment.notes && (
                  <p style={{ fontSize: '10px', color: '#a8a69f', lineHeight: 1.6 }}>
                    {order.payment.notes}
                  </p>
                )}
                {order.payment.status === 'pending' && (
                  <Link href="/admin/payments" style={{
                    display: 'inline-block', marginTop: '14px',
                    padding: '8px 16px', background: 'rgba(251,191,36,0.15)',
                    border: '1px dotted rgba(251,191,36,0.5)', borderRadius: '100px',
                    fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: '#fbbf24', textDecoration: 'none',
                  }}>
                    Verifikasi Pembayaran →
                  </Link>
                )}
              </div>
            )}
          </section>
        </div>

        {/* Right: customer + status updater */}
        <div>
          <section style={{
            padding: '20px', marginBottom: '20px',
            border: '1px dotted rgba(212,210,203,0.2)', borderRadius: '4px',
          }}>
            <p style={{
              fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#a8a69f', marginBottom: '14px',
            }}>
              Customer
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <User size={12} color="#a8a69f" style={{ marginTop: '3px' }} />
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: '11px', color: '#d4d2cb', fontWeight: '700', marginBottom: '2px' }}>
                    {order.user.name ?? '—'}
                  </p>
                  <p style={{ fontSize: '10px', color: '#a8a69f', wordBreak: 'break-all' }}>
                    {order.user.email}
                  </p>
                </div>
              </div>
              {order.shippingPhone && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <Phone size={12} color="#a8a69f" style={{ marginTop: '3px' }} />
                  <p style={{ fontSize: '11px', color: '#d4d2cb' }}>{order.shippingPhone}</p>
                </div>
              )}
              {order.shippingAddress && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <MapPin size={12} color="#a8a69f" style={{ marginTop: '3px' }} />
                  <p style={{ fontSize: '11px', color: '#d4d2cb', lineHeight: 1.6 }}>
                    {order.shippingAddress}
                  </p>
                </div>
              )}
            </div>
          </section>

          <section style={{
            padding: '20px',
            border: '1px dotted rgba(212,210,203,0.2)', borderRadius: '4px',
          }}>
            <StatusUpdater orderId={order.id} currentStatus={order.status as OrderStatus} />
          </section>
        </div>
      </div>
    </div>
  )
}
