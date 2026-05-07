import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { products, categories } from '../data/products'

function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
      <div
        className="product-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ position: 'relative' }}
      >
        {product.badge && (
          <div style={{
            position: 'absolute', top: '16px', left: '16px', zIndex: 2,
            background: '#d4d2cb', color: '#1a1a1a',
            fontSize: '9px', fontWeight: '700', letterSpacing: '0.15em',
            padding: '4px 10px', borderRadius: '50px', textTransform: 'uppercase',
          }}>
            {product.badge}
          </div>
        )}
        <div style={{ overflow: 'hidden', borderRadius: '20px 20px 0 0', position: 'relative' }}>
          <img
            src={hovered ? product.hoverImage : product.image}
            alt={product.name}
            style={{ transition: 'opacity 0.3s ease' }}
          />
          {/* Quick add overlay */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '16px',
            background: 'linear-gradient(to top, rgba(26,26,26,0.9) 0%, transparent 100%)',
            transform: hovered ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.3s ease',
            display: 'flex', justifyContent: 'center',
          }}>
            <button className="btn-pill btn-pill-filled" style={{ fontSize: '10px', padding: '8px 20px' }}
              onClick={e => e.preventDefault()}>
              Quick Add
            </button>
          </div>
        </div>
        <div style={{ padding: '16px 20px 20px' }}>
          <p className="text-label" style={{ marginBottom: '4px' }}>{product.category}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#d4d2cb' }}>
              {product.name}
            </h3>
            <span style={{ fontSize: '12px', color: '#d4d2cb' }}>{product.price}</span>
          </div>
          <p style={{ fontSize: '10px', color: '#a8a69f', marginTop: '4px' }}>{product.color}</p>
        </div>
      </div>
    </Link>
  )
}

export default function Shop() {
  const [searchParams] = useSearchParams()
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [sortBy, setSortBy] = useState('FEATURED')
  const [filteredProducts, setFilteredProducts] = useState(products)

  useEffect(() => {
    let filtered = [...products]
    if (activeCategory !== 'ALL') {
      filtered = filtered.filter(p => p.category === activeCategory)
    }
    if (sortBy === 'PRICE LOW') filtered.sort((a, b) => parseInt(a.price.replace(/\D/g, '')) - parseInt(b.price.replace(/\D/g, '')))
    if (sortBy === 'PRICE HIGH') filtered.sort((a, b) => parseInt(b.price.replace(/\D/g, '')) - parseInt(a.price.replace(/\D/g, '')))
    setFilteredProducts(filtered)
  }, [activeCategory, sortBy])

  return (
    <main style={{ padding: '60px 40px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '48px' }}>
        <p className="text-label" style={{ marginBottom: '8px' }}>Explore</p>
        <h1 style={{ fontSize: 'clamp(2rem, 6vw, 5rem)', fontWeight: '700', letterSpacing: '-0.03em', textTransform: 'uppercase', color: '#d4d2cb', lineHeight: 1 }}>
          The Collection
        </h1>
      </div>

      {/* Filters row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '40px',
        flexWrap: 'wrap',
        gap: '20px',
        borderBottom: '1px dotted rgba(212,210,203,0.4)',
        paddingBottom: '24px',
      }}>
        {/* Category filters */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: activeCategory === cat ? '#d4d2cb' : 'transparent',
                color: activeCategory === cat ? '#1a1a1a' : '#a8a69f',
                border: '1px solid',
                borderColor: activeCategory === cat ? '#d4d2cb' : 'rgba(212,210,203,0.4)',
                borderRadius: '50px',
                padding: '7px 18px',
                fontSize: '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'Space Mono, monospace',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="text-label">Sort:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ borderRadius: '50px', padding: '7px 16px', width: 'auto', cursor: 'pointer' }}
          >
            <option>FEATURED</option>
            <option>PRICE LOW</option>
            <option>PRICE HIGH</option>
            <option>NEWEST</option>
          </select>
        </div>
      </div>

      {/* Product count */}
      <p className="text-label" style={{ marginBottom: '32px' }}>
        {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
      </p>

      {/* Product grid */}
      {filteredProducts.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '20px',
        }}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#a8a69f' }}>
          <p style={{ fontSize: '24px', marginBottom: '16px' }}>∅</p>
          <p className="text-label">No products found in this category</p>
        </div>
      )}
    </main>
  )
}
