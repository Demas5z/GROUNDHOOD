import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Package, ShoppingCart, Users, Receipt, TrendingUp, AlertCircle } from 'lucide-react'
import { STATUS_COLOR, STATUS_LABEL, formatRupiah, type OrderStatus } from '@/lib/order-status'

export default async function AdminDashboard() {
  const [
    productCount,
    userCount,
    pendingPaymentCount,
    newOrderCount,
    revenueAgg,
    recentOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.user.count({ where: { role: 'user' } }),
    prisma.payment.count({ where: { status: 'pending' } }),
    prisma.order.count({ where: { status: { in: ['menunggu_pembayaran', 'menunggu_konfirmasi'] } } }),
    prisma.order.aggregate({
      where: { status: { in: ['diproses', 'dikirim', 'selesai'] } },
      _sum: { total: true },
    }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    }),
  ])

  const totalRevenue = revenueAgg._sum.total ?? 0

  const stats = [
    { icon: ShoppingCart, label: 'Pesanan Baru',         value: newOrderCount.toString(),       href: '/admin/orders' },
    { icon: Receipt,      label: 'Verifikasi Pending',   value: pendingPaymentCount.toString(), href: '/admin/payments', accent: pendingPaymentCount > 0 },
    { icon: Package,      label: 'Total Produk',         value: productCount.toString(),        href: '/admin/products' },
    { icon: Users,        label: 'Customer Terdaftar',   value: userCount.toString(),           href: '/admin/users' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#86efac', marginBottom: '8px' }}>
          Admin Overview
        </p>
        <h1 style={{
          fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: '700',
          textTransform: 'uppercase', letterSpacing: '-0.025em',
          color: '#d4d2cb', lineHeight: 1, marginBottom: '12px',
        }}>
          Dashboard
        </h1>
        <p style={{ color: '#a8a69f', fontSize: '12px', lineHeight: 1.7 }}>
          Ringkasan aktivitas toko GROUNDHOOD hari ini.
        </p>
      </div>

      {/* Pending payments alert */}
      {pendingPaymentCount > 0 && (
        <Link
          href="/admin/payments"
          style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            padding: '16px 20px', marginBottom: '32px',
            border: '1px dotted rgba(251,191,36,0.5)',
            background: 'rgba(251,191,36,0.06)',
            borderRadius: '4px', textDecoration: 'none',
          }}
        >
          <AlertCircle size={16} color="#fbbf24" />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: '#fbbf24', letterSpacing: '0.06em', marginBottom: '2px' }}>
              {pendingPaymentCount} BUKTI PEMBAYARAN MENUNGGU VERIFIKASI
            </p>
            <p style={{ fontSize: '10px', color: '#a8a69f', letterSpacing: '0.03em' }}>
              Klik untuk lihat dan verifikasi bukti transfer customer.
            </p>
          </div>
          <span style={{ color: '#fbbf24', fontSize: '11px', letterSpacing: '0.12em' }}>→</span>
        </Link>
      )}

      {/* Stats grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px', marginBottom: '40px',
      }}>
        {stats.map(({ icon: Icon, label, value, href, accent }) => (
          <Link key={label} href={href} style={{
            padding: '24px 22px', textDecoration: 'none',
            border: `1px dotted ${accent ? 'rgba(251,191,36,0.5)' : 'rgba(212,210,203,0.25)'}`,
            borderRadius: '4px',
            background: accent ? 'rgba(251,191,36,0.04)' : 'rgba(212,210,203,0.03)',
            transition: 'all 0.2s',
            display: 'block',
          }}>
            <Icon size={15} color={accent ? '#fbbf24' : '#a8a69f'} style={{ marginBottom: '14px' }} />
            <p style={{
              fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase',
              color: '#a8a69f', marginBottom: '8px',
            }}>
              {label}
            </p>
            <p style={{
              fontSize: '24px', fontWeight: '700', color: accent ? '#fbbf24' : '#d4d2cb',
              letterSpacing: '-0.02em',
            }}>
              {value}
            </p>
          </Link>
        ))}
      </div>

      {/* Revenue card */}
      <div style={{
        padding: '28px 24px', marginBottom: '40px',
        border: '1px dotted rgba(134,239,172,0.4)',
        background: 'rgba(134,239,172,0.04)',
        borderRadius: '4px',
        display: 'flex', alignItems: 'center', gap: '20px',
      }}>
        <TrendingUp size={20} color="#86efac" />
        <div style={{ flex: 1 }}>
          <p style={{
            fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase',
            color: '#a8a69f', marginBottom: '6px',
          }}>
            Total Pendapatan (Pesanan Diproses+)
          </p>
          <p style={{
            fontSize: '28px', fontWeight: '700', color: '#86efac',
            letterSpacing: '-0.02em',
          }}>
            {formatRupiah(totalRevenue)}
          </p>
        </div>
        <Link href="/admin/reports" style={{
          padding: '10px 20px',
          border: '1px dotted rgba(134,239,172,0.5)',
          borderRadius: '100px', fontSize: '10px',
          letterSpacing: '0.15em', textTransform: 'uppercase',
          color: '#86efac', textDecoration: 'none',
        }}>
          Lihat Laporan →
        </Link>
      </div>

      {/* Recent orders */}
      <div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '16px',
        }}>
          <p style={{
            fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#a8a69f',
          }}>
            Pesanan Terbaru
          </p>
          <Link href="/admin/orders" style={{
            fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase',
            color: '#a8a69f', textDecoration: 'none',
          }}>
            Lihat Semua →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div style={{
            padding: '40px 20px', textAlign: 'center',
            border: '1px dotted rgba(212,210,203,0.15)', borderRadius: '4px',
          }}>
            <p style={{ fontSize: '11px', color: '#a8a69f' }}>Belum ada pesanan.</p>
          </div>
        ) : (
          <div style={{ border: '1px dotted rgba(212,210,203,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
            {recentOrders.map((o, i) => (
              <Link key={o.id} href={`/admin/orders/${o.id}`} style={{
                display: 'grid', gridTemplateColumns: '160px 1fr 140px 140px',
                padding: '14px 24px', alignItems: 'center', gap: '16px',
                borderTop: i > 0 ? '1px dotted rgba(212,210,203,0.1)' : 'none',
                textDecoration: 'none', transition: 'background 0.2s',
              }}>
                <p style={{ fontSize: '10px', fontWeight: '700', color: '#d4d2cb', letterSpacing: '0.04em' }}>
                  {o.orderNumber}
                </p>
                <p style={{ fontSize: '11px', color: '#a8a69f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {o.user.name ?? o.user.email}
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
