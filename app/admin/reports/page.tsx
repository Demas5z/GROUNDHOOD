import { prisma } from '@/lib/prisma'
import { TrendingUp, ShoppingBag, Package, BarChart3 } from 'lucide-react'
import { formatRupiah, STATUS_LABEL, STATUS_COLOR, type OrderStatus } from '@/lib/order-status'
import ExportControls from './ExportControls'

export default async function ReportsPage() {
  // Counted-as-revenue statuses (per workflow doc: pesanan diproses/dikirim/selesai = pembayaran sudah valid)
  const revenueStatuses = ['diproses', 'dikirim', 'selesai']

  const [
    allOrders,
    statusBreakdown,
    topProducts,
  ] = await Promise.all([
    prisma.order.findMany({
      where: { status: { in: revenueStatuses } },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.groupBy({
      by: ['status'],
      _count: { id: true },
      _sum: { total: true },
    }),
    prisma.orderItem.groupBy({
      by: ['productName'],
      where: { order: { status: { in: revenueStatuses } } },
      _sum: { quantity: true, price: true },
      _count: { id: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }),
  ])

  const totalRevenue = allOrders.reduce((s, o) => s + o.total, 0)
  const totalItems = allOrders.reduce((s, o) => s + o.items.reduce((ss, i) => ss + i.quantity, 0), 0)
  const avgOrderValue = allOrders.length > 0 ? Math.round(totalRevenue / allOrders.length) : 0

  // Monthly breakdown (last 6 months)
  const now = new Date()
  const months: { label: string; total: number; count: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const next = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
    const inMonth = allOrders.filter(o => o.createdAt >= d && o.createdAt < next)
    months.push({
      label: d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' }),
      total: inMonth.reduce((s, o) => s + o.total, 0),
      count: inMonth.length,
    })
  }
  const maxMonthly = Math.max(...months.map(m => m.total), 1)

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#86efac', marginBottom: '8px' }}>
          Admin
        </p>
        <h1 style={{
          fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: '700',
          textTransform: 'uppercase', letterSpacing: '-0.025em',
          color: '#d4d2cb', lineHeight: 1, marginBottom: '8px',
        }}>
          Laporan Transaksi
        </h1>
        <p style={{ color: '#a8a69f', fontSize: '11px', lineHeight: 1.7 }}>
          Ringkasan penjualan dari pesanan yang sudah diproses, dikirim, dan selesai.
        </p>
      </div>

      <ExportControls />

      {/* Summary cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px', marginBottom: '40px',
      }}>
        {[
          { icon: TrendingUp,  label: 'Total Pendapatan',   value: formatRupiah(totalRevenue) },
          { icon: ShoppingBag, label: 'Pesanan Sukses',     value: allOrders.length.toString() },
          { icon: Package,     label: 'Item Terjual',       value: totalItems.toString() },
          { icon: BarChart3,   label: 'Rata-rata Order',    value: formatRupiah(avgOrderValue) },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} style={{
            padding: '24px 22px',
            border: '1px dotted rgba(212,210,203,0.25)',
            borderRadius: '4px',
            background: 'rgba(212,210,203,0.03)',
          }}>
            <Icon size={15} color="#a8a69f" style={{ marginBottom: '14px' }} />
            <p style={{
              fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase',
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

      {/* Monthly chart */}
      <section style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a8a69f', marginBottom: '16px' }}>
          Pendapatan per Bulan (6 bulan terakhir)
        </p>
        <div style={{
          padding: '24px',
          border: '1px dotted rgba(212,210,203,0.2)',
          borderRadius: '4px',
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: `repeat(${months.length}, 1fr)`,
            gap: '14px', alignItems: 'end', height: '180px',
          }}>
            {months.map(m => {
              const heightPct = (m.total / maxMonthly) * 100
              return (
                <div key={m.label} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: '8px', justifyContent: 'flex-end', height: '100%',
                }}>
                  <p style={{ fontSize: '9px', color: '#86efac', fontWeight: '700' }}>
                    {m.total > 0 ? formatRupiah(m.total) : ''}
                  </p>
                  <div style={{
                    width: '100%',
                    height: `${Math.max(heightPct, 2)}%`,
                    background: m.total > 0 ? 'linear-gradient(to top, rgba(134,239,172,0.6), rgba(134,239,172,0.2))' : 'rgba(212,210,203,0.06)',
                    borderTop: m.total > 0 ? '1px solid #86efac' : '1px dotted rgba(212,210,203,0.2)',
                    borderRadius: '2px 2px 0 0',
                    transition: 'all 0.3s',
                  }} />
                  <p style={{
                    fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: '#a8a69f',
                  }}>
                    {m.label}
                  </p>
                  <p style={{ fontSize: '9px', color: '#a8a69f' }}>
                    {m.count} order
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Two-column: status breakdown + top products */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <section>
          <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a8a69f', marginBottom: '14px' }}>
            Distribusi Status Pesanan
          </p>
          <div style={{
            border: '1px dotted rgba(212,210,203,0.2)', borderRadius: '4px',
            overflow: 'hidden',
          }}>
            {statusBreakdown.length === 0 ? (
              <p style={{ padding: '24px', fontSize: '11px', color: '#a8a69f', textAlign: 'center' }}>
                Belum ada data.
              </p>
            ) : (
              statusBreakdown.map((s, i) => (
                <div key={s.status} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderTop: i > 0 ? '1px dotted rgba(212,210,203,0.1)' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: STATUS_COLOR[s.status as OrderStatus] ?? '#a8a69f',
                    }} />
                    <p style={{
                      fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase',
                      color: '#d4d2cb', fontWeight: '700',
                    }}>
                      {STATUS_LABEL[s.status as OrderStatus] ?? s.status}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '12px', fontWeight: '700', color: '#d4d2cb' }}>
                      {s._count.id}
                    </p>
                    <p style={{ fontSize: '9px', color: '#a8a69f' }}>
                      {formatRupiah(s._sum.total ?? 0)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a8a69f', marginBottom: '14px' }}>
            Top 5 Produk Terlaris
          </p>
          <div style={{
            border: '1px dotted rgba(212,210,203,0.2)', borderRadius: '4px',
            overflow: 'hidden',
          }}>
            {topProducts.length === 0 ? (
              <p style={{ padding: '24px', fontSize: '11px', color: '#a8a69f', textAlign: 'center' }}>
                Belum ada penjualan.
              </p>
            ) : (
              topProducts.map((p, i) => (
                <div key={p.productName} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderTop: i > 0 ? '1px dotted rgba(212,210,203,0.1)' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <span style={{
                      fontSize: '14px', fontWeight: '700',
                      color: i === 0 ? '#fbbf24' : i === 1 ? '#d4d2cb' : '#a8a69f',
                      width: '18px', textAlign: 'center',
                    }}>
                      {i + 1}
                    </span>
                    <p style={{
                      fontSize: '11px', color: '#d4d2cb', fontWeight: '700',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {p.productName}
                    </p>
                  </div>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#86efac', flexShrink: 0 }}>
                    {p._sum.quantity ?? 0} terjual
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
