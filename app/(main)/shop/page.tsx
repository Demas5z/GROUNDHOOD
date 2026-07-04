import Link from 'next/link'
import Image from 'next/image'
import { Package, Search } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatRupiah } from '@/lib/order-status'
import type { Prisma } from '@prisma/client'

export const metadata = { title: 'Shop' }

type SearchParams = { cat?: string; q?: string }

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { cat, q } = await searchParams
  const search = q?.trim() ?? ''

  // "new" and "sale" are virtual filters from the nav menu, not real categories.
  const isNew = cat === 'new'
  const isSale = cat === 'sale'
  const isSpecial = isNew || isSale

  // Resolve a real category only when the slug isn't a virtual filter.
  const activeCategory = cat && !isSpecial
    ? await prisma.category.findUnique({ where: { slug: cat } })
    : null

  const where: Prisma.ProductWhereInput = {}
  if (activeCategory) where.categoryId = activeCategory.id
  if (search) where.name = { contains: search }
  if (isNew) {
    // NEW IN — products added within the last 7 days.
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    where.createdAt = { gte: sevenDaysAgo }
  }

  const [rawProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  // SALE — current price below the original launch price. A two-column comparison
  // can't be expressed in a Prisma `where`, so filter in memory.
  const products = isSale
    ? rawProducts.filter((p) => p.originalPrice != null && p.price < p.originalPrice)
    : rawProducts

  const heading = isNew
    ? 'New In'
    : isSale
      ? 'Sale'
      : activeCategory
        ? activeCategory.name
        : 'Semua Produk'

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '60px 40px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <p className="text-label" style={{ marginBottom: '12px' }}>Catalog</p>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '-0.035em', color: '#d4d2cb',
          lineHeight: 1, marginBottom: '14px',
        }}>
          {heading}
        </h1>
        <p style={{ color: '#a8a69f', fontSize: '12px', lineHeight: 1.8 }}>
          {products.length} item{products.length !== 1 ? 's' : ''}
          {search && <> · pencarian: <span style={{ color: '#d4d2cb' }}>"{search}"</span></>}
        </p>
      </div>

      {/* Search + Filter bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '20px',
        marginBottom: '40px',
        paddingBottom: '32px',
        borderBottom: '1px dotted rgba(212,210,203,0.25)',
      }}>
        {/* Search */}
        <form
          action="/shop"
          method="GET"
          style={{ position: 'relative', maxWidth: '480px' }}
        >
          {cat && <input type="hidden" name="cat" value={cat} />}
          <Search
            size={13}
            style={{
              position: 'absolute', left: '20px', top: '50%',
              transform: 'translateY(-50%)', color: '#a8a69f', pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            name="q"
            defaultValue={search}
            placeholder="Cari produk..."
            style={{ paddingLeft: '46px' }}
          />
        </form>

        {/* Category chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <CategoryChip
            href={search ? `/shop?q=${encodeURIComponent(search)}` : '/shop'}
            active={!activeCategory && !isSpecial}
          >
            All
          </CategoryChip>
          {categories.map((c) => (
            <CategoryChip
              key={c.id}
              href={
                search
                  ? `/shop?cat=${c.slug}&q=${encodeURIComponent(search)}`
                  : `/shop?cat=${c.slug}`
              }
              active={activeCategory?.id === c.id}
            >
              {c.name}
            </CategoryChip>
          ))}
        </div>
      </div>

      {/* Product grid */}
      {products.length === 0 ? (
        <div style={{
          padding: '100px 24px', textAlign: 'center',
          border: '1px dotted rgba(212,210,203,0.2)', borderRadius: '20px',
        }}>
          <Package size={36} color="rgba(212,210,203,0.25)" style={{ margin: '0 auto 18px' }} />
          <p style={{ fontSize: '12px', color: '#a8a69f', letterSpacing: '0.05em', marginBottom: '6px' }}>
            {search ? (
              <>Produk dengan kata kunci "<span style={{ color: '#d4d2cb' }}>{search}</span>" tidak ditemukan.</>
            ) : activeCategory || isSpecial
              ? 'Tidak ada produk yang cocok dengan filter ini.'
              : 'Belum ada produk tersedia.'}
          </p>
          {(search || activeCategory || isSpecial) && (
            <Link
              href="/shop"
              style={{
                fontSize: '10px', color: '#d4d2cb', letterSpacing: '0.15em',
                textTransform: 'uppercase', textDecoration: 'underline',
              }}
            >
              Reset filter
            </Link>
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '24px',
        }}>
          {products.map((p) => (
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
                    <Package size={32} color="rgba(212,210,203,0.25)" />
                  </div>
                )}
                {p.stock === 0 && (
                  <div style={{
                    position: 'absolute', top: '14px', left: '14px',
                    background: '#1a1a1a', color: '#f87171',
                    fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em',
                    padding: '5px 12px', borderRadius: '50px', textTransform: 'uppercase',
                    border: '1px dotted rgba(248,113,113,0.5)',
                  }}>
                    Sold Out
                  </div>
                )}
                {p.stock > 0 && p.stock < 3 && (
                  <div style={{
                    position: 'absolute', top: '14px', left: '14px',
                    background: '#1a1a1a', color: '#fbbf24',
                    fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em',
                    padding: '5px 12px', borderRadius: '50px', textTransform: 'uppercase',
                    border: '1px dotted rgba(251,191,36,0.5)',
                  }}>
                    Tersisa {p.stock}
                  </div>
                )}
              </div>
              <div style={{ padding: '16px 20px 20px' }}>
                <p className="text-label" style={{ marginBottom: '6px' }}>
                  {p.category.name}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{
                    fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em',
                    textTransform: 'uppercase', color: '#d4d2cb',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {p.name}
                  </h3>
                  {p.originalPrice != null && p.price < p.originalPrice ? (
                    <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.3 }}>
                      <span style={{ fontSize: '9px', color: '#75736d', textDecoration: 'line-through', whiteSpace: 'nowrap' }}>
                        {formatRupiah(p.originalPrice)}
                      </span>
                      <span style={{ fontSize: '12px', color: '#86efac', whiteSpace: 'nowrap' }}>
                        {formatRupiah(p.price)}
                      </span>
                    </span>
                  ) : (
                    <span style={{ fontSize: '12px', color: '#d4d2cb', whiteSpace: 'nowrap' }}>
                      {formatRupiah(p.price)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function CategoryChip({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      style={{
        padding: '8px 18px',
        borderRadius: '50px',
        border: `1px ${active ? 'solid' : 'dotted'} ${active ? '#d4d2cb' : 'rgba(212,210,203,0.35)'}`,
        background: active ? '#d4d2cb' : 'transparent',
        color: active ? '#1a1a1a' : '#a8a69f',
        fontSize: '10px',
        fontWeight: active ? 700 : 400,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        transition: 'all 0.2s',
      }}
    >
      {children}
    </Link>
  )
}
