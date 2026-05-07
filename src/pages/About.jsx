import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

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

export default function About() {
  return (
    <main>
      {/* Hero */}
      <section style={{
        position: 'relative',
        height: '70vh',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '0 40px 60px',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.3)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, #1a1a1a 0%, transparent 70%)',
        }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <FadeUp>
            <p className="text-label" style={{ marginBottom: '12px' }}>Who We Are</p>
            <h1 style={{
              fontSize: 'clamp(3rem, 10vw, 8rem)',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '-0.03em',
              lineHeight: 0.95,
              color: '#d4d2cb',
            }}>
              THE<br />RENAISSANCE
            </h1>
          </FadeUp>
        </div>
      </section>

      {/* Story section */}
      <section style={{ padding: '80px 40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <FadeUp>
            <div>
              <p className="text-label" style={{ marginBottom: '16px' }}>Our Origin</p>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '32px', color: '#d4d2cb' }}>
                Born From<br />The Underground
              </h2>
              <p style={{ color: '#a8a69f', lineHeight: '2', marginBottom: '24px' }}>
                CULTISH™ was born in 2018 from a need — a need for clothing that spoke without screaming.
                In a market oversaturated with noise, we chose silence. We chose intention.
              </p>
              <p style={{ color: '#a8a69f', lineHeight: '2', marginBottom: '24px' }}>
                We are a South African brand, forged in the creative underground of Johannesburg's
                vibrant culture. Every piece is a reflection of the collective — a community that
                moves with purpose and dresses with meaning.
              </p>
              <p style={{ color: '#a8a69f', lineHeight: '2' }}>
                CULTISH is not for everyone. It is built for those who look at a blank canvas and
                see possibility. Those who live between the margins and find beauty in the overlooked.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={200}>
            <div className="grid-cell" style={{ overflow: 'hidden', aspectRatio: '4/5' }}>
              <img
                src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&q=80"
                alt="Brand Story"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Values */}
      <section style={{
        borderTop: '1px dotted rgba(212,210,203,0.4)',
        borderBottom: '1px dotted rgba(212,210,203,0.4)',
        padding: '80px 40px',
        background: 'rgba(212,210,203,0.02)',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <p className="text-label" style={{ marginBottom: '8px' }}>What Drives Us</p>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#d4d2cb' }}>
                Our Values
              </h2>
            </div>
          </FadeUp>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {[
              {
                num: '01',
                title: 'Intentionality',
                desc: 'Every stitch, every silhouette, every colorway is deliberate. We don\'t create noise — we create signals.',
              },
              {
                num: '02',
                title: 'Quality',
                desc: 'We use premium heavyweight fabrics that age with character. Built to outlast trends.',
              },
              {
                num: '03',
                title: 'Community',
                desc: 'CULTISH is a collective. Our customers aren\'t just buyers — they\'re members of something bigger.',
              },
              {
                num: '04',
                title: 'Local Pride',
                desc: 'Designed and produced in South Africa. We carry our roots in every thread.',
              },
            ].map((val, i) => (
              <FadeUp key={i} delay={i * 100}>
                <div className="grid-cell" style={{ padding: '36px 32px' }}>
                  <p style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#a8a69f', marginBottom: '20px' }}>{val.num}</p>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', color: '#d4d2cb' }}>
                    {val.title}
                  </h3>
                  <p style={{ color: '#a8a69f', lineHeight: '1.8', fontSize: '12px' }}>{val.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Vision section */}
      <section style={{ padding: '80px 40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <FadeUp>
            <div className="grid-cell" style={{ overflow: 'hidden', aspectRatio: '4/5' }}>
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
                alt="Vision"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </FadeUp>

          <FadeUp delay={200}>
            <div>
              <p className="text-label" style={{ marginBottom: '16px' }}>Where We're Going</p>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '32px', color: '#d4d2cb' }}>
                The Vision
              </h2>
              <p style={{ color: '#a8a69f', lineHeight: '2', marginBottom: '24px' }}>
                We're building CULTISH into a global symbol of African creative excellence. A brand that proves
                the continent doesn't follow trends — it sets them.
              </p>
              <p style={{ color: '#a8a69f', lineHeight: '2', marginBottom: '40px' }}>
                From Johannesburg to Tokyo, from Cape Town to New York — CULTISH™ is a language
                understood by those who need no explanation.
              </p>
              <Link to="/shop" className="btn-pill">Shop The Collection</Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Team / Collective */}
      <section style={{
        borderTop: '1px dotted rgba(212,210,203,0.4)',
        padding: '80px 40px',
        maxWidth: '1400px',
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <FadeUp>
          <p className="text-label" style={{ marginBottom: '8px' }}>The People</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#d4d2cb', marginBottom: '16px' }}>
            The Collective
          </h2>
          <p style={{ color: '#a8a69f', maxWidth: '500px', margin: '0 auto 60px', lineHeight: '1.8' }}>
            CULTISH is a small, passionate team of creatives, makers, and dreamers.
            We work with local photographers, artists, and craftspeople.
          </p>
        </FadeUp>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {[
            { name: 'TEBOGO K.', role: 'Creative Director', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
            { name: 'NALEDI M.', role: 'Head of Design', img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80' },
            { name: 'SIPHO V.', role: 'Production Lead', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
            { name: 'AISHA T.', role: 'Brand Strategy', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
          ].map((member, i) => (
            <FadeUp key={i} delay={i * 100}>
              <div className="grid-cell" style={{ overflow: 'hidden' }}>
                <div style={{ overflow: 'hidden', aspectRatio: '1', borderRadius: '20px 20px 0 0' }}>
                  <img src={member.img} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '20px' }}>
                  <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>{member.name}</p>
                  <p className="text-label">{member.role}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </main>
  )
}
