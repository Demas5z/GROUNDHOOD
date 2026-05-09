import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Package, Clock, ShoppingBag, User } from 'lucide-react'
import { STATUS_LABEL, STATUS_COLOR, formatRupiah, type OrderStatus } from '@/lib/order-status'

export const metadata = { title: 'Dashboard — GROUNDHOOD' }

export default async function AccountPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) {
    // Stale session (e.g. after DB reset) — let middleware/JWT callback clear it.
    redirect('/api/auth/signout?callbackUrl=/login')
  }
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  const memberSince = new Date(user.createdAt).toLocaleDateString('id-ID', {
    year: 'numeric', month: 'long',
  })

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0)
  const pendingOrders = orders.filter(o =>
    o.status === 'menunggu_pembayaran' || o.status === 'menunggu_konfirmasi'
  ).length

  const stats = [
    { icon: Package, label: 'Total Pesanan', value: orders.length.toString() },
    { icon: ShoppingBag, label: 'Total Belanja', value: formatRupiah(totalSpent) },
    { icon: Clock, label: 'Pending', value: pendingOrders.toString() },
    { icon: User, label: 'Member Sejak', value: memberSince },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '48px' }}>
        <p style={{
          fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: '#a8a69f', marginBottom: '10px',
        }}>
          Overview
        </p>
        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '700',
          textTransform: 'uppercase', letterSpacing: '-0.025em',
          color: '#d4d2cb', lineHeight: 1, marginBottom: '12px',
        }}>
          Welcome Back{user.name ? `,\n${user.name.split(' ')[0]}.` : '.'}
        </h1>
        <p style={{ color: '#a8a69f', fontSize: '12px', lineHeight: 1.8 }}>
          Kelola akun, lacak pesanan, dan perbarui profil kamu di sini.
        </p>
      </div>

      {/* Stats grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px', marginBottom: '52px',
      }}>
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} style={{
            padding: '28px 24px',
            border: '1px dotted rgba(212,210,203,0.25)',
            borderRadius: '4px',
            background: 'rgba(212,210,203,0.03)',
          }}>
            <Icon size={16} color="#a8a69f" style={{ marginBottom: '16px' }} />
            <p style={{
              fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase',
              color: '#a8a69f', marginBottom: '8px',
            }}>
              {label}
            </p>
            <p style={{
              fontSize: '20px', fontWeight: '700', color: '#d4d2cb',
              letterSpacing: '-0.02em',
            }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '20px',
        }}>
          <p style={{
            fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#a8a69f',
          }}>
            Recent Orders
          </p>
          <a
            href="/account/orders"
            className="text-[#a8a69f] hover:text-[#d4d2cb] transition-colors"
            style={{
              fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            View All →
          </a>
        </div>

        {orders.length === 0 ? (
          <div style={{
            padding: '52px 24px', textAlign: 'center',
            border: '1px dotted rgba(212,210,203,0.15)',
            borderRadius: '4px',
          }}>
            <Package size={32} color="rgba(212,210,203,0.2)" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: '11px', color: '#a8a69f', letterSpacing: '0.05em' }}>
              Belum ada pesanan. Mulai belanja sekarang.
            </p>
            <a href="/shop" style={{
              display: 'inline-block', marginTop: '20px',
              fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase',
              color: '#d4d2cb', textDecoration: 'underline',
            }}>
              Browse Shop
            </a>
          </div>
        ) : (
          <div style={{ border: '1px dotted rgba(212,210,203,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
            {orders.map((order, i) => {
              const statusColor = STATUS_COLOR[order.status as OrderStatus] ?? '#a8a69f'
              return (
                <div key={order.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 24px',
                  borderTop: i > 0 ? '1px dotted rgba(212,210,203,0.15)' : 'none',
                }}>
                  <div>
                    <p style={{
                      fontSize: '11px', fontWeight: '700', color: '#d4d2cb',
                      letterSpacing: '0.05em', marginBottom: '4px',
                      fontFamily: 'monospace',
                    }}>
                      {order.orderNumber}
                    </p>
                    <p style={{ fontSize: '10px', color: '#a8a69f', letterSpacing: '0.03em' }}>
                      {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{
                      fontSize: '11px', fontWeight: '700', color: '#d4d2cb',
                      marginBottom: '4px',
                    }}>
                      {formatRupiah(order.total)}
                    </p>
                    <span style={{
                      fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: statusColor,
                    }}>
                      {STATUS_LABEL[order.status as OrderStatus] ?? order.status}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
