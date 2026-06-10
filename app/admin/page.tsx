import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import {
  Package, ShoppingCart, Users, Receipt, TrendingUp, AlertCircle,
  PackageX, Activity, Download, Tags, FileSpreadsheet,
} from 'lucide-react'
import { STATUS_COLOR, STATUS_LABEL, formatRupiah, type OrderStatus } from '@/lib/order-status'

const LOW_STOCK_THRESHOLD = 3

export default async function AdminDashboard() {
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOf7d = new Date(startOfToday)
  startOf7d.setDate(startOf7d.getDate() - 6)

  const [
    productCount,
    userCount,
    pendingPaymentCount,
    newOrderCount,
    revenueAgg,
    todayOrderCount,
    todayRevenueAgg,
    last7dOrders,
    lowStockProducts,
    outOfStockCount,
    statusBreakdown,
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
    prisma.order.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.order.aggregate({
      where: {
        createdAt: { gte: startOfToday },
        status: { in: ['diproses', 'dikirim', 'selesai'] },
      },
      _sum: { total: true },
    }),
    prisma.order.findMany({
      where: {
        createdAt: { gte: startOf7d },
        status: { in: ['diproses', 'dikirim', 'selesai'] },
      },
      select: { createdAt: true, total: true },
    }),
    prisma.product.findMany({
      where: { stock: { gt: 0, lte: LOW_STOCK_THRESHOLD } },
      orderBy: { stock: 'asc' },
      take: 5,
      select: { id: true, name: true, stock: true, slug: true },
    }),
    prisma.product.count({ where: { stock: 0 } }),
    prisma.order.groupBy({
      by: ['status'],
      _count: { id: true },
    }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    }),
  ])

  const totalRevenue = revenueAgg._sum.total ?? 0
  const todayRevenue = todayRevenueAgg._sum.total ?? 0

  // Build 7-day sparkline buckets
  const dayBuckets: { label: string; date: Date; total: number; count: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(startOfToday)
    d.setDate(d.getDate() - i)
    dayBuckets.push({
      label: d.toLocaleDateString('id-ID', { weekday: 'short' }),
      date: d,
      total: 0,
      count: 0,
    })
  }
  for (const o of last7dOrders) {
    const d = new Date(o.createdAt.getFullYear(), o.createdAt.getMonth(), o.createdAt.getDate())
    const b = dayBuckets.find(b => b.date.getTime() === d.getTime())
    if (b) {
      b.total += o.total
      b.count += 1
    }
  }
  const maxDay = Math.max(...dayBuckets.map(b => b.total), 1)
  const last7dRevenue = dayBuckets.reduce((s, b) => s + b.total, 0)

  const stats = [
    { icon: ShoppingCart, label: 'Pesanan Baru',         value: newOrderCount.toString(),       href: '/admin/orders' },
    { icon: Receipt,      label: 'Verifikasi Pending',   value: pendingPaymentCount.toString(), href: '/admin/payments', accent: pendingPaymentCount > 0 },
    { icon: Package,      label: 'Total Produk',         value: productCount.toString(),        href: '/admin/products' },
    { icon: Users,        label: 'Customer Terdaftar',   value: userCount.toString(),           href: '/admin/users' },
  ]

  const todayStats = [
    { label: 'Pesanan Hari Ini',   value: todayOrderCount.toString() },
    { label: 'Pendapatan Hari Ini', value: formatRupiah(todayRevenue) },
    { label: 'Pendapatan 7 Hari',   value: formatRupiah(last7dRevenue) },
  ]

  const statusCountMap = new Map(statusBreakdown.map(s => [s.status, s._count.id]))

  return (
    <div>
      <div style={{
        marginBottom: '40px', display: 'flex', alignItems: 'flex-end',
        justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap',
      }}>
        <div>
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
        <a
          href="/api/admin/reports/export"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: '12px 22px',
            border: '1px dotted rgba(134,239,172,0.5)',
            background: 'rgba(134,239,172,0.06)',
            borderRadius: '100px',
            fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase',
            color: '#86efac', textDecoration: 'none',
          }}
        >
          <FileSpreadsheet size={13} />
          Download Laporan Excel
        </a>
      </div>

      {/* Pending payments alert */}
      {pendingPaymentCount > 0 && (
        <Link
          href="/admin/payments"
          style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            padding: '16px 20px', marginBottom: '16px',
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

      {/* Out of stock alert */}
      {outOfStockCount > 0 && (
        <Link
          href="/admin/products"
          style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            padding: '16px 20px', marginBottom: '16px',
            border: '1px dotted rgba(248,113,113,0.5)',
            background: 'rgba(248,113,113,0.06)',
            borderRadius: '4px', textDecoration: 'none',
          }}
        >
          <PackageX size={16} color="#f87171" />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: '#f87171', letterSpacing: '0.06em', marginBottom: '2px' }}>
              {outOfStockCount} PRODUK HABIS STOK
            </p>
            <p style={{ fontSize: '10px', color: '#a8a69f', letterSpacing: '0.03em' }}>
              Klik untuk segera restok produk yang sudah habis.
            </p>
          </div>
          <span style={{ color: '#f87171', fontSize: '11px', letterSpacing: '0.12em' }}>→</span>
        </Link>
      )}

      <div style={{ marginBottom: '32px' }} />

      {/* Stats grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px', marginBottom: '20px',
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

      {/* Today's quick stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px', marginBottom: '32px',
      }}>
        {todayStats.map(s => (
          <div key={s.label} style={{
            padding: '18px 20px',
            border: '1px dotted rgba(212,210,203,0.2)',
            borderRadius: '4px',
            background: 'rgba(212,210,203,0.02)',
          }}>
            <p style={{
              fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase',
              color: '#a8a69f', marginBottom: '6px',
            }}>
              {s.label}
            </p>
            <p style={{ fontSize: '18px', fontWeight: '700', color: '#d4d2cb' }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Revenue card */}
      <div style={{
        padding: '28px 24px', marginBottom: '32px',
        border: '1px dotted rgba(134,239,172,0.4)',
        background: 'rgba(134,239,172,0.04)',
        borderRadius: '4px',
        display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap',
      }}>
        <TrendingUp size={20} color="#86efac" />
        <div style={{ flex: 1, minWidth: '200px' }}>
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

      {/* 7-day trend + Status breakdown */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px', marginBottom: '32px',
      }}>
        {/* 7-day sparkline */}
        <section>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '14px',
          }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a8a69f' }}>
              Pendapatan 7 Hari Terakhir
            </p>
            <Activity size={13} color="#a8a69f" />
          </div>
          <div style={{
            padding: '20px',
            border: '1px dotted rgba(212,210,203,0.2)',
            borderRadius: '4px',
          }}>
            <div style={{
              display: 'grid', gridTemplateColumns: `repeat(${dayBuckets.length}, 1fr)`,
              gap: '10px', alignItems: 'end', height: '110px',
            }}>
              {dayBuckets.map((b, i) => {
                const heightPct = (b.total / maxDay) * 100
                return (
                  <div key={i} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: '6px', justifyContent: 'flex-end', height: '100%',
                  }}>
                    <div style={{
                      width: '100%',
                      height: `${Math.max(heightPct, 3)}%`,
                      background: b.total > 0
                        ? 'linear-gradient(to top, rgba(134,239,172,0.55), rgba(134,239,172,0.2))'
                        : 'rgba(212,210,203,0.06)',
                      borderTop: b.total > 0 ? '1px solid #86efac' : '1px dotted rgba(212,210,203,0.2)',
                      borderRadius: '2px 2px 0 0',
                      transition: 'all 0.3s',
                    }} />
                    <p style={{
                      fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: '#a8a69f',
                    }}>
                      {b.label}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Status breakdown */}
        <section>
          <p style={{
            fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#a8a69f', marginBottom: '14px',
          }}>
            Distribusi Status Pesanan
          </p>
          <div style={{
            border: '1px dotted rgba(212,210,203,0.2)', borderRadius: '4px',
            overflow: 'hidden',
          }}>
            {(['menunggu_pembayaran', 'menunggu_konfirmasi', 'diproses', 'dikirim', 'selesai', 'dibatalkan'] as OrderStatus[]).map((s, i) => {
              const count = statusCountMap.get(s) ?? 0
              return (
                <Link
                  key={s}
                  href={`/admin/orders?status=${s}`}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '11px 16px',
                    borderTop: i > 0 ? '1px dotted rgba(212,210,203,0.1)' : 'none',
                    textDecoration: 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: STATUS_COLOR[s],
                    }} />
                    <p style={{
                      fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase',
                      color: '#d4d2cb', fontWeight: '700',
                    }}>
                      {STATUS_LABEL[s]}
                    </p>
                  </div>
                  <p style={{ fontSize: '12px', fontWeight: '700', color: count > 0 ? STATUS_COLOR[s] : '#a8a69f' }}>
                    {count}
                  </p>
                </Link>
              )
            })}
          </div>
        </section>
      </div>

      {/* Low stock + Quick actions */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px', marginBottom: '32px',
      }}>
        {/* Low stock */}
        <section>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '14px',
          }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a8a69f' }}>
              Stok Menipis (≤ {LOW_STOCK_THRESHOLD})
            </p>
            <Link href="/admin/products" style={{
              fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase',
              color: '#a8a69f', textDecoration: 'none',
            }}>
              Kelola →
            </Link>
          </div>
          {lowStockProducts.length === 0 ? (
            <div style={{
              padding: '24px', textAlign: 'center',
              border: '1px dotted rgba(212,210,203,0.15)', borderRadius: '4px',
            }}>
              <p style={{ fontSize: '11px', color: '#a8a69f' }}>
                Semua produk stok aman.
              </p>
            </div>
          ) : (
            <div style={{
              border: '1px dotted rgba(212,210,203,0.2)', borderRadius: '4px',
              overflow: 'hidden',
            }}>
              {lowStockProducts.map((p, i) => (
                <Link
                  key={p.id}
                  href={`/admin/products/${p.id}`}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 16px', gap: '10px',
                    borderTop: i > 0 ? '1px dotted rgba(212,210,203,0.1)' : 'none',
                    textDecoration: 'none',
                  }}
                >
                  <p style={{
                    fontSize: '11px', color: '#d4d2cb', fontWeight: '700',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {p.name}
                  </p>
                  <span style={{
                    fontSize: '10px', fontWeight: '700',
                    color: p.stock <= 1 ? '#f87171' : '#fbbf24',
                    padding: '3px 10px', borderRadius: '100px',
                    border: `1px dotted ${p.stock <= 1 ? 'rgba(248,113,113,0.5)' : 'rgba(251,191,36,0.5)'}`,
                  }}>
                    {p.stock} tersisa
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Quick actions */}
        <section>
          <p style={{
            fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#a8a69f', marginBottom: '14px',
          }}>
            Aksi Cepat
          </p>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px',
          }}>
            {([
              { href: '/admin/products/new',       icon: Package,  label: 'Tambah Produk',    external: false },
              { href: '/admin/categories',          icon: Tags,     label: 'Kelola Kategori',  external: false },
              { href: '/admin/payments',            icon: Receipt,  label: 'Verifikasi Bayar', external: false },
              { href: '/api/admin/reports/export',  icon: Download, label: 'Export Excel',     external: true  },
            ] as const).map(({ href, icon: Icon, label, external }) => {
              const cardStyle = {
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '16px 18px',
                border: '1px dotted rgba(212,210,203,0.25)',
                background: 'rgba(212,210,203,0.03)',
                borderRadius: '4px', textDecoration: 'none',
                transition: 'all 0.2s',
              } as const
              const inner = (
                <>
                  <Icon size={14} color="#86efac" />
                  <p style={{
                    fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: '#d4d2cb', fontWeight: '700',
                  }}>
                    {label}
                  </p>
                </>
              )
              return external ? (
                <a key={label} href={href} style={cardStyle}>{inner}</a>
              ) : (
                <Link key={label} href={href} style={cardStyle}>{inner}</Link>
              )
            })}
          </div>
        </section>
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
