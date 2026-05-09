import Link from 'next/link'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Package, ChevronRight } from 'lucide-react'
import {
  STATUS_LABEL, STATUS_COLOR, formatRupiah, type OrderStatus,
} from '@/lib/order-status'

export const metadata = { title: 'Orders — GROUNDHOOD' }

export default async function OrdersPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { items: true } } },
  })

  return (
    <div>
      <div style={{ marginBottom: '48px' }}>
        <p style={{
          fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: '#a8a69f', marginBottom: '10px',
        }}>
          Account
        </p>
        <h1 style={{
          fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: '700',
          textTransform: 'uppercase', letterSpacing: '-0.025em',
          color: '#d4d2cb', lineHeight: 1, marginBottom: '12px',
        }}>
          Riwayat Pesanan
        </h1>
        <p style={{ color: '#a8a69f', fontSize: '12px', lineHeight: 1.8 }}>
          {orders.length > 0
            ? `${orders.length} total pesanan ditemukan.`
            : 'Belum ada pesanan yang tercatat.'}
        </p>
      </div>

      {orders.length === 0 ? (
        <div style={{
          padding: '80px 24px', textAlign: 'center',
          border: '1px dotted rgba(212,210,203,0.15)', borderRadius: '4px',
        }}>
          <Package size={40} color="rgba(212,210,203,0.15)" style={{ margin: '0 auto 20px' }} />
          <p style={{
            fontSize: '12px', fontWeight: '700', textTransform: 'uppercase',
            letterSpacing: '0.1em', color: '#d4d2cb', marginBottom: '10px',
          }}>
            Belum Ada Pesanan
          </p>
          <p style={{ fontSize: '11px', color: '#a8a69f', letterSpacing: '0.03em', marginBottom: '28px' }}>
            Temukan koleksi thrift pilihan kami dan mulai belanja sekarang.
          </p>
          <a href="/shop" style={{
            display: 'inline-block', padding: '12px 28px',
            border: '1px dotted rgba(212,210,203,0.4)',
            borderRadius: '100px', fontSize: '10px', letterSpacing: '0.15em',
            textTransform: 'uppercase', color: '#d4d2cb', textDecoration: 'none',
            transition: 'all 0.2s',
          }}>
            Browse Shop
          </a>
        </div>
      ) : (
        <div style={{ border: '1px dotted rgba(212,210,203,0.2)', borderRadius: '4px', overflow: 'auto' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1.4fr 140px 130px 160px 28px',
            padding: '12px 24px',
            borderBottom: '1px dotted rgba(212,210,203,0.2)',
            background: 'rgba(212,210,203,0.03)',
            gap: '12px', minWidth: '720px',
          }}>
            {['Order #', 'Tanggal', 'Total', 'Status', ''].map((h, i) => (
              <p key={i} style={{
                fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase',
                color: '#a8a69f',
              }}>
                {h}
              </p>
            ))}
          </div>

          {orders.map((order, i) => {
            const statusColor = STATUS_COLOR[order.status as OrderStatus] ?? '#a8a69f'
            return (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="order-list-row"
                style={{
                  display: 'grid', gridTemplateColumns: '1.4fr 140px 130px 160px 28px',
                  padding: '20px 24px', alignItems: 'center', gap: '12px',
                  borderTop: i > 0 ? '1px dotted rgba(212,210,203,0.1)' : 'none',
                  minWidth: '720px',
                  textDecoration: 'none',
                }}
              >
                <div>
                  <p style={{
                    fontSize: '11px', fontWeight: '700', color: '#d4d2cb',
                    letterSpacing: '0.05em', marginBottom: '4px',
                    fontFamily: 'monospace',
                  }}>
                    {order.orderNumber}
                  </p>
                  <p style={{ fontSize: '10px', color: '#a8a69f' }}>
                    {order._count.items} item
                  </p>
                </div>
                <p style={{ fontSize: '11px', color: '#a8a69f', letterSpacing: '0.02em' }}>
                  {new Date(order.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </p>
                <p style={{
                  fontSize: '12px', fontWeight: '700', color: '#d4d2cb',
                  letterSpacing: '-0.01em',
                }}>
                  {formatRupiah(order.total)}
                </p>
                <span style={{
                  fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: statusColor,
                }}>
                  {STATUS_LABEL[order.status as OrderStatus] ?? order.status}
                </span>
                <ChevronRight size={14} color="#a8a69f" className="order-list-chevron" />
              </Link>
            )
          })}
        </div>
      )}

      <style>{`
        .order-list-row {
          transition: background 300ms ease;
        }
        .order-list-row:hover {
          background: rgba(212,210,203,0.04);
        }
        .order-list-chevron {
          transition: transform 450ms cubic-bezier(0.22, 1, 0.36, 1), color 300ms ease;
        }
        .order-list-row:hover .order-list-chevron {
          transform: translateX(4px);
          color: #d4d2cb;
        }
      `}</style>
    </div>
  )
}
