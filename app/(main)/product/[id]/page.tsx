import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Package, ChevronRight, ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatRupiah } from '@/lib/order-status'
import AddToCartForm from './AddToCartForm'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id },
    select: { name: true, description: true },
  })
  if (!product) return { title: 'Produk Tidak Ditemukan' }
  return {
    title: product.name,
    description: product.description ?? `${product.name} — GROUNDHOOD thrift store.`,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  })
  if (!product) notFound()

  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    orderBy: { createdAt: 'desc' },
    take: 4,
    include: { category: true },
  })

  const stockBadge =
    product.stock === 0
      ? { color: '#f87171', label: 'Sold Out' }
      : product.stock < 3
        ? { color: '#fbbf24', label: `Tersisa ${product.stock}` }
        : { color: '#86efac', label: `${product.stock} tersedia` }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 40px 80px' }}>
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        style={{
          display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap',
          marginBottom: '36px',
          fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase',
          color: '#a8a69f',
        }}
      >
        <Link href="/" style={{ color: '#a8a69f', textDecoration: 'none' }}>Home</Link>
        <ChevronRight size={11} />
        <Link href="/shop" style={{ color: '#a8a69f', textDecoration: 'none' }}>Shop</Link>
        <ChevronRight size={11} />
        <Link
          href={`/shop?cat=${product.category.slug}`}
          style={{ color: '#a8a69f', textDecoration: 'none' }}
        >
          {product.category.name}
        </Link>
        <ChevronRight size={11} />
        <span style={{ color: '#d4d2cb' }}>{product.name}</span>
      </nav>

      {/* Main content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '52px',
        alignItems: 'flex-start',
      }}>
        {/* Image */}
        <div style={{
          position: 'relative',
          aspectRatio: '3/4',
          borderRadius: '24px',
          overflow: 'hidden',
          border: '1px dotted rgba(212,210,203,0.25)',
          background: 'rgba(212,210,203,0.04)',
        }}>
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
              priority
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Package size={48} color="rgba(212,210,203,0.25)" />
            </div>
          )}
        </div>

        {/* Info column */}
        <div>
          <p style={{
            fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#a8a69f', marginBottom: '14px',
          }}>
            {product.category.name}
          </p>

          <h1 style={{
            fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '-0.025em',
            color: '#d4d2cb', lineHeight: 1.05, marginBottom: '20px',
          }}>
            {product.name}
          </h1>

          <p style={{
            fontSize: '24px', fontWeight: 700, color: '#d4d2cb',
            letterSpacing: '-0.01em', marginBottom: '16px',
          }}>
            {formatRupiah(product.price)}
          </p>

          {/* Stock badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 14px', marginBottom: '32px',
            border: `1px dotted ${stockBadge.color}80`,
            borderRadius: '50px',
            fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase',
            color: stockBadge.color,
          }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: stockBadge.color,
            }} />
            {stockBadge.label}
          </div>

          {/* Description */}
          {product.description && (
            <div style={{
              padding: '20px 0',
              borderTop: '1px dotted rgba(212,210,203,0.2)',
              borderBottom: '1px dotted rgba(212,210,203,0.2)',
              marginBottom: '32px',
            }}>
              <p style={{
                fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase',
                color: '#a8a69f', marginBottom: '12px',
              }}>
                Deskripsi
              </p>
              <p style={{
                color: '#d4d2cb', fontSize: '12px', lineHeight: 1.9,
                letterSpacing: '0.02em', whiteSpace: 'pre-wrap',
              }}>
                {product.description}
              </p>
            </div>
          )}

          {/* Add to cart */}
          <AddToCartForm productId={product.id} stock={product.stock} />

          {/* Sub-info */}
          <div style={{
            marginTop: '32px', padding: '16px 20px',
            border: '1px dotted rgba(212,210,203,0.18)', borderRadius: '14px',
            background: 'rgba(212,210,203,0.02)',
          }}>
            <p style={{ fontSize: '10px', color: '#a8a69f', lineHeight: 1.8, letterSpacing: '0.03em' }}>
              · Item secondhand — kondisi mungkin tidak sempurna<br />
              · Pembayaran via transfer bank manual<br />
              · Pengiriman setelah konfirmasi pembayaran
            </p>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section style={{ marginTop: '100px', borderTop: '1px dotted rgba(212,210,203,0.25)', paddingTop: '60px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            marginBottom: '32px', flexWrap: 'wrap', gap: '12px',
          }}>
            <div>
              <p className="text-label" style={{ marginBottom: '10px' }}>You May Also Like</p>
              <h2 style={{
                fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '-0.025em', color: '#d4d2cb',
                lineHeight: 1,
              }}>
                Dari kategori {product.category.name}
              </h2>
            </div>
            <Link
              href={`/shop?cat=${product.category.slug}`}
              style={{
                fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase',
                color: '#a8a69f', textDecoration: 'none',
              }}
            >
              Lihat semua →
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '20px',
          }}>
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.id}`}
                className="product-card"
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <div style={{
                  position: 'relative', aspectRatio: '3/4',
                  overflow: 'hidden', borderRadius: '20px 20px 0 0',
                  background: 'rgba(212,210,203,0.04)',
                }}>
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Package size={28} color="rgba(212,210,203,0.25)" />
                    </div>
                  )}
                </div>
                <div style={{ padding: '14px 18px 18px' }}>
                  <p className="text-label" style={{ marginBottom: '4px' }}>{p.category.name}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{
                      fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em',
                      textTransform: 'uppercase', color: '#d4d2cb',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {p.name}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#d4d2cb', whiteSpace: 'nowrap' }}>
                      {formatRupiah(p.price)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Back to shop */}
      <div style={{ marginTop: '60px' }}>
        <Link
          href="/shop"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase',
            color: '#a8a69f', textDecoration: 'none',
          }}
        >
          <ArrowLeft size={13} />
          Kembali ke katalog
        </Link>
      </div>
    </div>
  )
}
