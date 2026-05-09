import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Plus, Edit3, Package } from 'lucide-react'
import { formatRupiah } from '@/lib/order-status'
import DeleteProductButton from './DeleteProductButton'

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  })

  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        marginBottom: '32px', flexWrap: 'wrap', gap: '16px',
      }}>
        <div>
          <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#86efac', marginBottom: '8px' }}>
            Admin
          </p>
          <h1 style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: '700',
            textTransform: 'uppercase', letterSpacing: '-0.025em',
            color: '#d4d2cb', lineHeight: 1, marginBottom: '8px',
          }}>
            Kelola Produk
          </h1>
          <p style={{ color: '#a8a69f', fontSize: '11px', lineHeight: 1.7 }}>
            {products.length} produk terdaftar.
          </p>
        </div>
        <Link href="/admin/products/new" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '11px 22px', background: '#d4d2cb', color: '#1a1a1a',
          borderRadius: '100px', fontSize: '10px', fontWeight: '700',
          letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none',
        }}>
          <Plus size={13} />
          Tambah Produk
        </Link>
      </div>

      {products.length === 0 ? (
        <div style={{
          padding: '60px 24px', textAlign: 'center',
          border: '1px dotted rgba(212,210,203,0.15)', borderRadius: '4px',
        }}>
          <Package size={32} color="rgba(212,210,203,0.2)" style={{ margin: '0 auto 14px' }} />
          <p style={{ fontSize: '11px', color: '#a8a69f' }}>
            Belum ada produk. Klik <strong style={{ color: '#d4d2cb' }}>Tambah Produk</strong> untuk mulai.
          </p>
        </div>
      ) : (
        <div style={{ border: '1px dotted rgba(212,210,203,0.2)', borderRadius: '4px', overflow: 'auto' }}>
          {/* Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '60px 1.4fr 1fr 100px 90px 110px',
            padding: '12px 20px',
            borderBottom: '1px dotted rgba(212,210,203,0.2)',
            background: 'rgba(212,210,203,0.03)',
            gap: '12px',
            minWidth: '760px',
          }}>
            {['', 'Produk', 'Kategori', 'Harga', 'Stok', 'Aksi'].map((h, i) => (
              <p key={i} style={{
                fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase',
                color: '#a8a69f',
              }}>
                {h}
              </p>
            ))}
          </div>

          {products.map((p, i) => (
            <div key={p.id} style={{
              display: 'grid',
              gridTemplateColumns: '60px 1.4fr 1fr 100px 90px 110px',
              padding: '14px 20px', alignItems: 'center', gap: '12px',
              borderTop: i > 0 ? '1px dotted rgba(212,210,203,0.1)' : 'none',
              minWidth: '760px',
            }}>
              {p.image ? (
                <img src={p.image} alt={p.name} style={{
                  width: '40px', height: '40px', objectFit: 'cover',
                  borderRadius: '4px', border: '1px dotted rgba(212,210,203,0.2)',
                }} />
              ) : (
                <div style={{
                  width: '40px', height: '40px', background: 'rgba(212,210,203,0.05)',
                  border: '1px dotted rgba(212,210,203,0.2)', borderRadius: '4px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Package size={14} color="#a8a69f" />
                </div>
              )}
              <p style={{
                fontSize: '11px', fontWeight: '700', color: '#d4d2cb',
                letterSpacing: '0.02em',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {p.name}
              </p>
              <p style={{ fontSize: '10px', color: '#a8a69f', letterSpacing: '0.05em' }}>
                {p.category.name}
              </p>
              <p style={{ fontSize: '11px', fontWeight: '700', color: '#d4d2cb' }}>
                {formatRupiah(p.price)}
              </p>
              <p style={{
                fontSize: '11px', fontWeight: '700',
                color: p.stock === 0 ? '#f87171' : p.stock < 3 ? '#fbbf24' : '#86efac',
              }}>
                {p.stock}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link href={`/admin/products/${p.id}/edit`} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#a8a69f', padding: '4px', transition: 'color 0.2s',
                  textDecoration: 'none',
                }}>
                  <Edit3 size={13} />
                </Link>
                <DeleteProductButton id={p.id} name={p.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
