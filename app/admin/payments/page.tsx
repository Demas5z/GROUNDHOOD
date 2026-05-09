import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Receipt, ExternalLink } from 'lucide-react'
import { formatRupiah, PAYMENT_STATUS_LABEL, PAYMENT_STATUS_COLOR } from '@/lib/order-status'
import { PAYMENT_METHOD_LABEL } from '@/lib/payment-config'
import PaymentVerifyButtons from './PaymentVerifyButtons'
import type { Prisma } from '@prisma/client'

type SearchParams = Promise<{ status?: string }>

export default async function PaymentsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const filterStatus = params?.status ?? 'pending'

  // Only show payments that already have a proof image — entries without proof
  // are still being prepared by the customer and aren't actionable yet.
  const where: Prisma.PaymentWhereInput = { proofImage: { not: null } }
  if (filterStatus !== 'all') where.status = filterStatus

  const payments = await prisma.payment.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      order: {
        include: { user: { select: { name: true, email: true } } },
      },
    },
  })

  const filterChips = [
    { value: 'pending',     label: 'Pending' },
    { value: 'valid',       label: 'Valid' },
    { value: 'tidak_valid', label: 'Tidak Valid' },
    { value: 'all',         label: 'Semua' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#86efac', marginBottom: '8px' }}>
          Admin
        </p>
        <h1 style={{
          fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: '700',
          textTransform: 'uppercase', letterSpacing: '-0.025em',
          color: '#d4d2cb', lineHeight: 1, marginBottom: '8px',
        }}>
          Verifikasi Pembayaran
        </h1>
        <p style={{ color: '#a8a69f', fontSize: '11px', lineHeight: 1.7 }}>
          Periksa bukti transfer customer, konfirmasi valid atau tolak.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
        {filterChips.map(c => {
          const active = filterStatus === c.value
          const color = c.value === 'all' ? '#d4d2cb' : PAYMENT_STATUS_COLOR[c.value] ?? '#d4d2cb'
          return (
            <Link key={c.value} href={`/admin/payments?status=${c.value}`} style={{
              padding: '7px 14px', borderRadius: '100px',
              border: `1px dotted ${active ? color : 'rgba(212,210,203,0.25)'}`,
              background: active ? `${color}1a` : 'transparent',
              color: active ? color : '#a8a69f',
              fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase',
              textDecoration: 'none',
            }}>
              {c.label}
            </Link>
          )
        })}
      </div>

      {payments.length === 0 ? (
        <div style={{
          padding: '60px 24px', textAlign: 'center',
          border: '1px dotted rgba(212,210,203,0.15)', borderRadius: '4px',
        }}>
          <Receipt size={32} color="rgba(212,210,203,0.2)" style={{ margin: '0 auto 14px' }} />
          <p style={{ fontSize: '11px', color: '#a8a69f' }}>
            Tidak ada pembayaran dengan filter ini.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))' }}>
          {payments.map(p => (
            <div key={p.id} style={{
              padding: '20px',
              border: '1px dotted rgba(212,210,203,0.25)', borderRadius: '4px',
              background: 'rgba(212,210,203,0.02)',
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                gap: '12px', marginBottom: '14px',
              }}>
                <div style={{ minWidth: 0 }}>
                  <Link href={`/admin/orders/${p.order.id}`} style={{
                    fontSize: '11px', fontWeight: '700', color: '#d4d2cb',
                    letterSpacing: '0.04em', fontFamily: 'monospace',
                    textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px',
                  }}>
                    {p.order.orderNumber}
                    <ExternalLink size={10} />
                  </Link>
                  <p style={{
                    fontSize: '10px', color: '#a8a69f', marginTop: '4px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {p.order.user.name ?? p.order.user.email}
                  </p>
                </div>
                <span style={{
                  padding: '4px 10px', borderRadius: '100px',
                  border: `1px dotted ${PAYMENT_STATUS_COLOR[p.status]}`,
                  color: PAYMENT_STATUS_COLOR[p.status],
                  fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase',
                  flexShrink: 0,
                }}>
                  {PAYMENT_STATUS_LABEL[p.status]}
                </span>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: '10px', marginBottom: '14px', flexWrap: 'wrap',
              }}>
                <p style={{
                  fontSize: '16px', fontWeight: '700', color: '#86efac',
                  letterSpacing: '-0.02em',
                }}>
                  {formatRupiah(p.order.total)}
                </p>
                <span style={{
                  padding: '4px 10px', borderRadius: '100px',
                  border: '1px dotted rgba(212,210,203,0.3)',
                  color: '#a8a69f',
                  fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase',
                }}>
                  {PAYMENT_METHOD_LABEL[p.method] ?? p.method}
                </span>
              </div>

              {p.proofImage ? (
                <a href={p.proofImage} target="_blank" rel="noopener noreferrer">
                  <img src={p.proofImage} alt="Bukti transfer" style={{
                    width: '100%', height: '180px', objectFit: 'cover',
                    border: '1px dotted rgba(212,210,203,0.3)', borderRadius: '4px',
                    marginBottom: '12px',
                  }} />
                </a>
              ) : (
                <div style={{
                  height: '120px', background: 'rgba(212,210,203,0.03)',
                  border: '1px dotted rgba(212,210,203,0.2)', borderRadius: '4px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', color: '#a8a69f', marginBottom: '12px',
                }}>
                  Belum ada bukti
                </div>
              )}

              {p.notes && (
                <p style={{
                  fontSize: '10px', color: '#a8a69f', lineHeight: 1.6,
                  marginBottom: '12px', padding: '8px 12px',
                  background: 'rgba(212,210,203,0.04)', borderRadius: '4px',
                }}>
                  {p.notes}
                </p>
              )}

              <p style={{ fontSize: '9px', color: '#a8a69f', marginBottom: '14px' }}>
                Diupload: {new Date(p.createdAt).toLocaleString('id-ID', {
                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                })}
              </p>

              {p.status === 'pending' && (
                <PaymentVerifyButtons paymentId={p.id} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
