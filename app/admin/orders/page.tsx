import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ShoppingCart } from 'lucide-react'
import {
  STATUS_LABEL, STATUS_COLOR, ORDER_STATUSES, formatRupiah, type OrderStatus,
} from '@/lib/order-status'

type SearchParams = Promise<{ status?: string }>

export default async function OrdersPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const filterStatus = params?.status

  const where = filterStatus && ORDER_STATUSES.includes(filterStatus as OrderStatus)
    ? { status: filterStatus }
    : {}

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { items: true } },
    },
  })

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
          Kelola Pesanan
        </h1>
        <p style={{ color: '#a8a69f', fontSize: '11px', lineHeight: 1.7 }}>
          {orders.length} pesanan {filterStatus ? `dengan status ${STATUS_LABEL[filterStatus as OrderStatus] ?? filterStatus}` : 'total'}.
        </p>
      </div>

      {/* Status filter chips */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
        <Link href="/admin/orders" style={{
          padding: '7px 14px',
          borderRadius: '100px',
          border: `1px dotted ${!filterStatus ? '#d4d2cb' : 'rgba(212,210,203,0.25)'}`,
          background: !filterStatus ? 'rgba(212,210,203,0.08)' : 'transparent',
          color: !filterStatus ? '#d4d2cb' : '#a8a69f',
          fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase',
          textDecoration: 'none',
        }}>
          Semua
        </Link>
        {ORDER_STATUSES.map(s => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            style={{
              padding: '7px 14px',
              borderRadius: '100px',
              border: `1px dotted ${filterStatus === s ? STATUS_COLOR[s] : 'rgba(212,210,203,0.25)'}`,
              background: filterStatus === s ? `${STATUS_COLOR[s]}1a` : 'transparent',
              color: filterStatus === s ? STATUS_COLOR[s] : '#a8a69f',
              fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            {STATUS_LABEL[s]}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <div style={{
          padding: '60px 24px', textAlign: 'center',
          border: '1px dotted rgba(212,210,203,0.15)', borderRadius: '4px',
        }}>
          <ShoppingCart size={32} color="rgba(212,210,203,0.2)" style={{ margin: '0 auto 14px' }} />
          <p style={{ fontSize: '11px', color: '#a8a69f' }}>Belum ada pesanan dengan filter ini.</p>
        </div>
      ) : (
        <div style={{ border: '1px dotted rgba(212,210,203,0.2)', borderRadius: '4px', overflow: 'auto' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '160px 1fr 80px 130px 160px 100px',
            padding: '12px 20px',
            borderBottom: '1px dotted rgba(212,210,203,0.2)',
            background: 'rgba(212,210,203,0.03)',
            gap: '12px', minWidth: '900px',
          }}>
            {['Order #', 'Customer', 'Items', 'Total', 'Status', 'Tanggal'].map((h, i) => (
              <p key={i} style={{
                fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase',
                color: '#a8a69f',
              }}>
                {h}
              </p>
            ))}
          </div>

          {orders.map((o, i) => (
            <Link key={o.id} href={`/admin/orders/${o.id}`} style={{
              display: 'grid', gridTemplateColumns: '160px 1fr 80px 130px 160px 100px',
              padding: '14px 20px', alignItems: 'center', gap: '12px',
              borderTop: i > 0 ? '1px dotted rgba(212,210,203,0.1)' : 'none',
              textDecoration: 'none', minWidth: '900px',
            }}>
              <p style={{
                fontSize: '10px', fontWeight: '700', color: '#d4d2cb',
                letterSpacing: '0.04em', fontFamily: 'monospace',
              }}>
                {o.orderNumber}
              </p>
              <div style={{ minWidth: 0 }}>
                <p style={{
                  fontSize: '11px', color: '#d4d2cb', fontWeight: '700',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {o.user.name ?? '—'}
                </p>
                <p style={{
                  fontSize: '9px', color: '#a8a69f',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {o.user.email}
                </p>
              </div>
              <p style={{ fontSize: '10px', color: '#a8a69f' }}>
                {o._count.items} item
              </p>
              <p style={{ fontSize: '11px', fontWeight: '700', color: '#d4d2cb' }}>
                {formatRupiah(o.total)}
              </p>
              <span style={{
                fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase',
                color: STATUS_COLOR[o.status as OrderStatus] ?? '#a8a69f',
              }}>
                {STATUS_LABEL[o.status as OrderStatus] ?? o.status}
              </span>
              <p style={{ fontSize: '10px', color: '#a8a69f' }}>
                {new Date(o.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
