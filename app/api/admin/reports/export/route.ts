import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { STATUS_LABEL, type OrderStatus } from '@/lib/order-status'

export const dynamic = 'force-dynamic'

const REVENUE_STATUSES = ['diproses', 'dikirim', 'selesai']

function parseDate(v: string | null): Date | undefined {
  if (!v) return undefined
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? undefined : d
}

function formatDateID(d: Date) {
  return d.toLocaleString('id-ID', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(req.url)
  const from = parseDate(url.searchParams.get('from'))
  const toRaw = parseDate(url.searchParams.get('to'))
  // Make "to" inclusive of the entire selected day
  const to = toRaw ? new Date(toRaw.getTime() + 24 * 60 * 60 * 1000 - 1) : undefined
  const scope = url.searchParams.get('scope') === 'all' ? 'all' : 'revenue'

  const dateFilter = from || to ? {
    createdAt: {
      ...(from ? { gte: from } : {}),
      ...(to ? { lte: to } : {}),
    },
  } : {}

  const baseWhere = scope === 'all'
    ? dateFilter
    : { ...dateFilter, status: { in: REVENUE_STATUSES } }

  const [orders, statusGroup] = await Promise.all([
    prisma.order.findMany({
      where: baseWhere,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        items: true,
        payment: true,
      },
    }),
    prisma.order.groupBy({
      by: ['status'],
      where: dateFilter,
      _count: { id: true },
      _sum: { total: true },
    }),
  ])

  // Aggregate top products from in-scope orders (revenue-only by default)
  const productAgg = new Map<string, { qty: number; revenue: number; orderCount: number }>()
  for (const o of orders) {
    if (scope !== 'all' && !REVENUE_STATUSES.includes(o.status)) continue
    const seenInOrder = new Set<string>()
    for (const it of o.items) {
      const cur = productAgg.get(it.productName) ?? { qty: 0, revenue: 0, orderCount: 0 }
      cur.qty += it.quantity
      cur.revenue += it.quantity * it.price
      if (!seenInOrder.has(it.productName)) {
        cur.orderCount += 1
        seenInOrder.add(it.productName)
      }
      productAgg.set(it.productName, cur)
    }
  }
  const topProducts = Array.from(productAgg.entries())
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 20)

  // ===== Sheet 1: Ringkasan =====
  const totalRevenue = orders
    .filter(o => REVENUE_STATUSES.includes(o.status))
    .reduce((s, o) => s + o.total, 0)
  const totalItems = orders
    .filter(o => REVENUE_STATUSES.includes(o.status))
    .reduce((s, o) => s + o.items.reduce((ss, it) => ss + it.quantity, 0), 0)
  const successOrders = orders.filter(o => REVENUE_STATUSES.includes(o.status)).length
  const avgOrder = successOrders > 0 ? Math.round(totalRevenue / successOrders) : 0

  const periodLabel = from || to
    ? `${from ? from.toLocaleDateString('id-ID') : '—'} s/d ${toRaw ? toRaw.toLocaleDateString('id-ID') : '—'}`
    : 'Seluruh Periode'

  const summaryRows: (string | number)[][] = [
    ['LAPORAN TRANSAKSI GROUNDHOOD'],
    ['Periode', periodLabel],
    ['Cakupan', scope === 'all' ? 'Semua pesanan' : 'Pesanan diproses/dikirim/selesai'],
    ['Dicetak', formatDateID(new Date())],
    [],
    ['METRIK', 'NILAI'],
    ['Total Pendapatan (Rp)', totalRevenue],
    ['Pesanan Sukses', successOrders],
    ['Total Pesanan dalam Laporan', orders.length],
    ['Item Terjual', totalItems],
    ['Rata-rata Order (Rp)', avgOrder],
  ]
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryRows)
  summarySheet['!cols'] = [{ wch: 36 }, { wch: 28 }]
  // Merge title row across two columns
  summarySheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }]

  // ===== Sheet 2: Distribusi Status =====
  const statusRows: (string | number)[][] = [
    ['Status', 'Jumlah Pesanan', 'Total (Rp)'],
    ...statusGroup.map(s => [
      STATUS_LABEL[s.status as OrderStatus] ?? s.status,
      s._count.id,
      s._sum.total ?? 0,
    ]),
  ]
  const statusSheet = XLSX.utils.aoa_to_sheet(statusRows)
  statusSheet['!cols'] = [{ wch: 24 }, { wch: 18 }, { wch: 18 }]

  // ===== Sheet 3: Pesanan =====
  const orderRows: (string | number)[][] = [
    [
      'No', 'Order Number', 'Tanggal', 'Customer', 'Email', 'No HP',
      'Status', 'Total (Rp)', 'Jumlah Item', 'Metode Bayar', 'Status Bayar',
      'Alamat Pengiriman', 'Catatan',
    ],
    ...orders.map((o, i) => [
      i + 1,
      o.orderNumber,
      formatDateID(o.createdAt),
      o.user.name ?? '',
      o.user.email,
      o.user.phone ?? '',
      STATUS_LABEL[o.status as OrderStatus] ?? o.status,
      o.total,
      o.items.reduce((s, it) => s + it.quantity, 0),
      o.payment?.method ?? '',
      o.payment?.status ?? '',
      o.shippingAddress ?? '',
      o.notes ?? '',
    ]),
  ]
  const orderSheet = XLSX.utils.aoa_to_sheet(orderRows)
  orderSheet['!cols'] = [
    { wch: 5 }, { wch: 18 }, { wch: 18 }, { wch: 22 }, { wch: 26 }, { wch: 16 },
    { wch: 18 }, { wch: 14 }, { wch: 8 }, { wch: 12 }, { wch: 12 }, { wch: 40 }, { wch: 24 },
  ]

  // ===== Sheet 4: Detail Item =====
  const itemRows: (string | number)[][] = [
    ['Order Number', 'Tanggal', 'Status Pesanan', 'Produk', 'Qty', 'Harga (Rp)', 'Subtotal (Rp)'],
    ...orders.flatMap(o =>
      o.items.map(it => [
        o.orderNumber,
        formatDateID(o.createdAt),
        STATUS_LABEL[o.status as OrderStatus] ?? o.status,
        it.productName,
        it.quantity,
        it.price,
        it.quantity * it.price,
      ]),
    ),
  ]
  const itemSheet = XLSX.utils.aoa_to_sheet(itemRows)
  itemSheet['!cols'] = [
    { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 32 },
    { wch: 8 }, { wch: 14 }, { wch: 16 },
  ]

  // ===== Sheet 5: Top Produk =====
  const topRows: (string | number)[][] = [
    ['Peringkat', 'Produk', 'Total Terjual', 'Frekuensi Order', 'Pendapatan (Rp)'],
    ...topProducts.map((p, i) => [
      i + 1, p.name, p.qty, p.orderCount, p.revenue,
    ]),
  ]
  const topSheet = XLSX.utils.aoa_to_sheet(topRows)
  topSheet['!cols'] = [{ wch: 10 }, { wch: 32 }, { wch: 14 }, { wch: 16 }, { wch: 22 }]

  // ===== Sheet 6: Pendapatan Harian =====
  const dailyMap = new Map<string, { total: number; count: number }>()
  for (const o of orders) {
    if (!REVENUE_STATUSES.includes(o.status)) continue
    const key = o.createdAt.toISOString().slice(0, 10)
    const cur = dailyMap.get(key) ?? { total: 0, count: 0 }
    cur.total += o.total
    cur.count += 1
    dailyMap.set(key, cur)
  }
  const dailyRows: (string | number)[][] = [
    ['Tanggal', 'Jumlah Order', 'Pendapatan (Rp)'],
    ...Array.from(dailyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, v]) => [date, v.count, v.total]),
  ]
  const dailySheet = XLSX.utils.aoa_to_sheet(dailyRows)
  dailySheet['!cols'] = [{ wch: 14 }, { wch: 14 }, { wch: 18 }]

  // Build workbook
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Ringkasan')
  XLSX.utils.book_append_sheet(wb, statusSheet, 'Distribusi Status')
  XLSX.utils.book_append_sheet(wb, orderSheet, 'Pesanan')
  XLSX.utils.book_append_sheet(wb, itemSheet, 'Detail Item')
  XLSX.utils.book_append_sheet(wb, topSheet, 'Top Produk')
  XLSX.utils.book_append_sheet(wb, dailySheet, 'Pendapatan Harian')

  const buffer: Buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

  const stamp = new Date().toISOString().slice(0, 10)
  const filename = `Laporan_GROUNDHOOD_${stamp}.xlsx`

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
