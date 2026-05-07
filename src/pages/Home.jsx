import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { products, testimonials } from '../data/products'

// Intersection observer hook for fade-in animations
function useFadeUp() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}

function FadeUp({ children, delay = 0, style = {} }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add('visible'), delay)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])
  return <div ref={ref} className="fade-up" style={style}>{children}</div>
}

function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
      <div className="product-card" style={{ position: 'relative' }}>
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
        <div style={{ overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
          <img src={product.image} alt={product.name} />
        </div>
        <div style={{ padding: '16px 20px 20px' }}>
          <p className="text-label" style={{ marginBottom: '4px' }}>{product.category}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#d4d2cb' }}>
              {product.name}
            </h3>
            <span style={{ fontSize: '13px', color: '#d4d2cb', letterSpacing: '0.05em' }}>{product.price}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function Home() {
  const marqueeItems = ['NEW DROP', '·', 'SHOP NOW', '·', 'FREE SHIPPING OVER R800', '·', 'SOUTH AFRICA', '·', 'CULTISH™', '·', 'SS25 COLLECTION', '·']
  const marqueeText = [...marqueeItems, ...marqueeItems].join('  ')

  return (
    <main>
      {/* HERO SECTION */}
      <section style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden',
        padding: '0 40px 60px',
      }}>
        {/* Background image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          filter: 'brightness(0.35)',
        }} />

        {/* Overlay gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, #1a1a1a 0%, rgba(26,26,26,0.4) 50%, transparent 100%)',
        }} />

        {/* Hero content */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <FadeUp delay={0}>
            <p className="text-label" style={{ marginBottom: '16px' }}>SS25 COLLECTION</p>
          </FadeUp>
          <FadeUp delay={150}>
            <h1 style={{
              fontSize: 'clamp(3.5rem, 12vw, 10rem)',
              fontWeight: '700',
              lineHeight: '0.92',
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              color: '#d4d2cb',
              marginBottom: '32px',
            }}>
              BORN<br />FROM<br />THE DARK™
            </h1>
          </FadeUp>
          <FadeUp delay={300}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/shop" className="btn-pill btn-pill-filled">Shop Collection</Link>
              <Link to="/about" className="btn-pill">Our Story</Link>
            </div>
          </FadeUp>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '40px', right: '40px', zIndex: 2,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        }}>
          <span style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a8a69f', writingMode: 'vertical-rl' }}>Scroll</span>
          <div style={{ width: '1px', height: '40px', background: 'rgba(212,210,203,0.4)' }} />
        </div>
      </section>

      {/* MARQUEE STRIP */}
      <div style={{
        borderTop: '1px dotted rgba(212,210,203,0.4)',
        borderBottom: '1px dotted rgba(212,210,203,0.4)',
        padding: '14px 0',
        overflow: 'hidden',
      }}>
        <div className="marquee-wrap">
          <div className="marquee-inner" style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a8a69f' }}>
            {Array(4).fill(marqueeItems.join('  &nbsp;&nbsp; ')).map((t, i) => (
              <span key={i} style={{ marginRight: '60px' }}>
                {marqueeItems.map((item, j) => (
                  <span key={j} style={{ marginRight: '24px', color: item === '·' ? '#4a4843' : '#a8a69f' }}>{item}</span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      <section style={{ padding: '80px 40px', maxWidth: '1400px', margin: '0 auto' }}>
        <FadeUp>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p className="text-label" style={{ marginBottom: '8px' }}>Curated Selection</p>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: '700', letterSpacing: '-0.02em', textTransform: 'uppercase', color: '#d4d2cb' }}>
                Featured Pieces
              </h2>
            </div>
            <Link to="/shop" className="btn-pill">View All</Link>
          </div>
        </FadeUp>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '20px',
        }}>
          {products.slice(0, 4).map((product, i) => (
            <FadeUp key={product.id} delay={i * 100}>
              <ProductCard product={product} />
            </FadeUp>
          ))}
        </div>
      </section>

      {/* BRAND STATEMENT - Full width */}
      <section style={{
        borderTop: '1px dotted rgba(212,210,203,0.4)',
        borderBottom: '1px dotted rgba(212,210,203,0.4)',
        padding: '100px 40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.15)',
        }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <FadeUp>
            <p className="text-label" style={{ marginBottom: '24px' }}>Our Philosophy</p>
          </FadeUp>
          <FadeUp delay={100}>
            <h2 style={{
              fontSize: 'clamp(2rem, 6vw, 5.5rem)',
              fontWeight: '700',
              lineHeight: '1.05',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: '#d4d2cb',
              maxWidth: '900px',
              margin: '0 auto 32px',
            }}>
              "Not for everyone.<br />Built for those who know."
            </h2>
          </FadeUp>
          <FadeUp delay={200}>
            <p style={{ color: '#a8a69f', maxWidth: '480px', margin: '0 auto 40px', lineHeight: '1.8' }}>
              Cultish is more than clothing — it's a signal. A quiet declaration of belonging to something
              that can't be bought, only understood.
            </p>
            <Link to="/about" className="btn-pill">Our Story</Link>
          </FadeUp>
        </div>
      </section>

      {/* SPLIT FEATURE - 2 Column */}
      <section style={{ padding: '80px 40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <FadeUp style={{ gridColumn: 'span 1' }}>
            <div className="grid-cell" style={{ position: 'relative', overflow: 'hidden', minHeight: '520px' }}>
              <img
                src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80"
                alt="New Arrivals"
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, filter: 'brightness(0.7)' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(26,26,26,0.9) 0%, transparent 60%)',
              }} />
              <div style={{ position: 'absolute', bottom: '36px', left: '36px', right: '36px' }}>
                <p className="text-label" style={{ marginBottom: '8px' }}>Just Dropped</p>
                <h3 style={{ fontSize: '2rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '-0.01em' }}>New Arrivals</h3>
                <Link to="/shop?cat=new" className="btn-pill">Shop New</Link>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={150} style={{ gridColumn: 'span 1' }}>
            <div className="grid-cell" style={{ position: 'relative', overflow: 'hidden', minHeight: '520px' }}>
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80"
                alt="Best Sellers"
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, filter: 'brightness(0.7)' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(26,26,26,0.9) 0%, transparent 60%)',
              }} />
              <div style={{ position: 'absolute', bottom: '36px', left: '36px', right: '36px' }}>
                <p className="text-label" style={{ marginBottom: '8px' }}>Community Favourites</p>
                <h3 style={{ fontSize: '2rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '-0.01em' }}>Best Sellers</h3>
                <Link to="/shop" className="btn-pill">Shop All</Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* MORE PRODUCTS */}
      <section style={{ padding: '0 40px 80px', maxWidth: '1400px', margin: '0 auto' }}>
        <FadeUp>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p className="text-label" style={{ marginBottom: '8px' }}>Latest Drops</p>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: '700', letterSpacing: '-0.02em', textTransform: 'uppercase', color: '#d4d2cb' }}>
                More to Explore
              </h2>
            </div>
            <Link to="/shop" className="btn-pill">View All</Link>
          </div>
        </FadeUp>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '20px',
        }}>
          {products.slice(4, 8).map((product, i) => (
            <FadeUp key={product.id} delay={i * 100}>
              <ProductCard product={product} />
            </FadeUp>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{
        borderTop: '1px dotted rgba(212,210,203,0.4)',
        padding: '80px 40px',
        background: 'rgba(212,210,203,0.03)',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <p className="text-label" style={{ marginBottom: '8px' }}>What They Say</p>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: '700', letterSpacing: '-0.02em', textTransform: 'uppercase', color: '#d4d2cb' }}>
                The Collective Speaks
              </h2>
            </div>
          </FadeUp>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
          }}>
            {testimonials.map((t, i) => (
              <FadeUp key={i} delay={i * 100}>
                <div className="grid-cell" style={{ padding: '32px' }}>
                  {/* Stars */}
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
                    {Array(5).fill(0).map((_, j) => (
                      <span key={j} style={{ color: '#d4d2cb', fontSize: '14px' }}>★</span>
                    ))}
                  </div>
                  <p style={{ color: '#a8a69f', lineHeight: '1.8', marginBottom: '24px', fontStyle: 'italic' }}>
                    "{t.text}"
                  </p>
                  <div style={{ borderTop: '1px dotted rgba(212,210,203,0.3)', paddingTop: '16px' }}>
                    <p style={{ fontWeight: '700', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t.name}</p>
                    <p className="text-label">{t.location}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND STATS */}
      <section style={{
        borderTop: '1px dotted rgba(212,210,203,0.4)',
        padding: '80px 40px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1px',
          border: '1px dotted rgba(212,210,203,0.4)',
          borderRadius: '30px',
          overflow: 'hidden',
        }}>
          {[
            { num: '2018', label: 'Year Founded' },
            { num: '10K+', label: 'Happy Customers' },
            { num: '50+', label: 'Unique Pieces' },
            { num: '100%', label: 'South African Made' },
          ].map((stat, i) => (
            <FadeUp key={i} delay={i * 80}>
              <div style={{
                padding: '48px 32px',
                textAlign: 'center',
                borderRight: i < 3 ? '1px dotted rgba(212,210,203,0.4)' : 'none',
              }}>
                <p style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: '700', letterSpacing: '-0.03em', color: '#d4d2cb', marginBottom: '8px' }}>
                  {stat.num}
                </p>
                <p className="text-label">{stat.label}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{
        padding: '80px 40px',
        borderTop: '1px dotted rgba(212,210,203,0.4)',
        textAlign: 'center',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        <FadeUp>
          <p className="text-label" style={{ marginBottom: '16px' }}>Ready to Join?</p>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 7vw, 6rem)',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '-0.03em',
            color: '#d4d2cb',
            marginBottom: '40px',
            lineHeight: '1',
          }}>
            Dress Different.<br />Think Different.
          </h2>
          <Link to="/shop" className="btn-pill btn-pill-filled" style={{ fontSize: '12px', padding: '14px 40px' }}>
            Explore the Collection
          </Link>
        </FadeUp>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .grid-2-col { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </main>
  )
}
