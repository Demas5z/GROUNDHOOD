import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { products } from '../data/products'

export default function ProductDetail() {
  const { id } = useParams()
  const product = products.find(p => p.id === parseInt(id))
  const [selectedSize, setSelectedSize] = useState(null)
  const [added, setAdded] = useState(false)
  const [activeImg, setActiveImg] = useState(0)

  if (!product) {
    return (
      <div style={{ padding: '80px 40px', textAlign: 'center' }}>
        <p style={{ color: '#a8a69f' }}>Product not found.</p>
        <Link to="/shop" className="btn-pill" style={{ marginTop: '24px', display: 'inline-block' }}>Back to Shop</Link>
      </div>
    )
  }

  const images = [product.image, product.hoverImage]
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3)

  const handleAddToCart = () => {
    if (!selectedSize) return
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <main style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '48px' }}>
        <Link to="/" className="text-label" style={{ textDecoration: 'none', color: '#a8a69f' }}>Home</Link>
        <span style={{ color: '#a8a69f' }}>/</span>
        <Link to="/shop" className="text-label" style={{ textDecoration: 'none', color: '#a8a69f' }}>Shop</Link>
        <span style={{ color: '#a8a69f' }}>/</span>
        <span className="text-label" style={{ color: '#d4d2cb' }}>{product.name}</span>
      </div>

      {/* Product layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', marginBottom: '80px' }}>
        {/* Images */}
        <div>
          <div className="grid-cell" style={{ overflow: 'hidden', marginBottom: '12px', aspectRatio: '3/4' }}>
            <img
              src={images[activeImg]}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                style={{
                  border: `1px dotted ${activeImg === i ? '#d4d2cb' : 'rgba(212,210,203,0.4)'}`,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  width: '80px',
                  height: '100px',
                  cursor: 'pointer',
                  background: 'transparent',
                  padding: 0,
                  flexShrink: 0,
                }}
              >
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div style={{ paddingTop: '8px' }}>
          {product.badge && (
            <span style={{
              display: 'inline-block', background: '#d4d2cb', color: '#1a1a1a',
              fontSize: '9px', fontWeight: '700', letterSpacing: '0.15em',
              padding: '4px 12px', borderRadius: '50px', textTransform: 'uppercase', marginBottom: '16px',
            }}>{product.badge}</span>
          )}

          <p className="text-label" style={{ marginBottom: '8px' }}>{product.category}</p>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#d4d2cb', marginBottom: '8px' }}>
            {product.name}
          </h1>
          <p style={{ fontSize: '11px', color: '#a8a69f', marginBottom: '4px' }}>{product.color}</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
            <span style={{ fontSize: '24px', fontWeight: '700', color: '#d4d2cb' }}>{product.price}</span>
            <span style={{ color: '#a8a69f', fontSize: '14px' }}>{product.priceUSD}</span>
          </div>

          {/* Stars */}
          <div style={{ display: 'flex', gap: '3px', marginBottom: '32px', alignItems: 'center' }}>
            {Array(5).fill(0).map((_, i) => (
              <span key={i} style={{ color: '#d4d2cb', fontSize: '12px' }}>★</span>
            ))}
            <span style={{ color: '#a8a69f', fontSize: '11px', marginLeft: '8px' }}>(24 reviews)</span>
          </div>

          {/* Description */}
          <p style={{ color: '#a8a69f', lineHeight: '1.9', marginBottom: '36px', fontSize: '12px' }}>
            {product.description}
          </p>

          {/* Size selector */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <p className="text-label">Select Size</p>
              <a href="#" className="text-label" style={{ textDecoration: 'underline', cursor: 'pointer' }}>Size Guide</a>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    border: `1px solid ${selectedSize === size ? '#d4d2cb' : 'rgba(212,210,203,0.4)'}`,
                    borderRadius: '50px',
                    padding: '8px 18px',
                    background: selectedSize === size ? '#d4d2cb' : 'transparent',
                    color: selectedSize === size ? '#1a1a1a' : '#a8a69f',
                    fontSize: '11px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: 'Space Mono, monospace',
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to cart */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              className="btn-pill btn-pill-filled"
              onClick={handleAddToCart}
              style={{
                flex: 1, padding: '14px 24px', fontSize: '12px',
                opacity: selectedSize ? 1 : 0.5,
                cursor: selectedSize ? 'pointer' : 'not-allowed',
              }}
            >
              {added ? '✓ Added to Cart' : 'Add to Cart'}
            </button>
            <button className="btn-pill" style={{ padding: '14px 20px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>

          {!selectedSize && (
            <p style={{ color: '#a8a69f', fontSize: '10px', marginTop: '12px', letterSpacing: '0.1em' }}>
              Please select a size to continue
            </p>
          )}

          {/* Features */}
          <div style={{
            marginTop: '40px',
            borderTop: '1px dotted rgba(212,210,203,0.3)',
            paddingTop: '32px',
            display: 'flex', flexDirection: 'column', gap: '12px',
          }}>
            {[
              'Free shipping on orders over R800',
              'Easy 14-day returns',
              'Ethically made in South Africa',
              'Premium heavyweight fabric',
            ].map((feature, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#d4d2cb', fontSize: '12px' }}>✓</span>
                <span style={{ color: '#a8a69f', fontSize: '11px', letterSpacing: '0.05em' }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section style={{ borderTop: '1px dotted rgba(212,210,203,0.4)', paddingTop: '64px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 2rem)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '-0.01em', color: '#d4d2cb' }}>
              You May Also Like
            </h2>
            <Link to="/shop" className="btn-pill" style={{ fontSize: '10px' }}>View All</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            {related.map(p => (
              <Link key={p.id} to={`/product/${p.id}`} style={{ textDecoration: 'none' }}>
                <div className="product-card">
                  <div style={{ overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
                    <img src={p.image} alt={p.name} />
                  </div>
                  <div style={{ padding: '16px 20px 20px' }}>
                    <p className="text-label" style={{ marginBottom: '4px' }}>{p.category}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#d4d2cb' }}>{p.name}</span>
                      <span style={{ fontSize: '12px', color: '#d4d2cb' }}>{p.price}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <style>{`
        @media (max-width: 768px) {
          .product-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}
