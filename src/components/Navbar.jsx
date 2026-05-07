import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartCount] = useState(0)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  return (
    <>
      {/* Announcement bar */}
      <div style={{
        background: '#d4d2cb',
        color: '#1a1a1a',
        textAlign: 'center',
        padding: '8px 16px',
        fontSize: '10px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
      }}>
        Free shipping on orders over R800 · South Africa &amp; Beyond
      </div>

      {/* Main Nav */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: scrolled ? 'rgba(26,26,26,0.95)' : '#1a1a1a',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: '1px dotted rgba(212,210,203,0.3)',
        transition: 'all 0.3s ease',
        padding: '0 40px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          {/* Left Nav */}
          <div style={{ display: 'flex', gap: '32px', flex: 1 }} className="desktop-nav">
            <Link to="/shop">Shop</Link>
            <Link to="/shop?cat=new">New Arrivals</Link>
            <Link to="/shop?cat=sale">Sale</Link>
          </div>

          {/* Logo */}
          <Link to="/" style={{
            fontSize: '20px',
            fontWeight: '700',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#d4d2cb',
            textDecoration: 'none',
            flex: '0 0 auto',
            textAlign: 'center',
          }}>
            CULTISH™
          </Link>

          {/* Right Nav */}
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }} className="desktop-nav">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            {/* Search icon */}
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a8a69f', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#d4d2cb'}
              onMouseLeave={e => e.target.style.color = '#a8a69f'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
            {/* Cart icon */}
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a8a69f', position: 'relative', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#d4d2cb'}
              onMouseLeave={e => e.currentTarget.style.color = '#a8a69f'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-6px', right: '-6px',
                  background: '#d4d2cb', color: '#1a1a1a',
                  borderRadius: '50%', width: '16px', height: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '9px', fontWeight: '700',
                }}>{cartCount}</span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn" style={{
              display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: '#d4d2cb',
            }}>
              {menuOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            borderTop: '1px dotted rgba(212,210,203,0.3)',
            padding: '24px 0 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}>
            {[['/', 'Home'], ['/shop', 'Shop'], ['/shop?cat=new', 'New Arrivals'], ['/about', 'About'], ['/contact', 'Contact']].map(([path, label]) => (
              <Link key={path} to={path} style={{
                fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase',
                color: '#d4d2cb', textDecoration: 'none', padding: '4px 0',
              }}>{label}</Link>
            ))}
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}
