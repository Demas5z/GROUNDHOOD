'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Menu, X, Plus, Minus } from 'lucide-react'
import { logoutAction } from '@/actions/auth'

const menuItems = [
  { label: 'New In', href: '/shop' },
  { label: 'Restocks', href: '/shop' },
  { label: 'Sale', href: '/shop', highlight: true },
  {
    label: 'Clothing',
    submenu: [
      { label: 'Tops', href: '/shop?cat=tops' },
      { label: 'Bottoms', href: '/shop?cat=bottoms' },
      { label: 'Outerwear', href: '/shop?cat=outerwear' },
    ],
  },
  {
    label: 'Accessories',
    submenu: [
      { label: 'All Accessories', href: '/shop?cat=accessories' },
      { label: 'Hats', href: '/shop?cat=accessories' },
      { label: 'Eyewear', href: '/shop?cat=accessories' },
    ],
  },
  { label: 'Bags', href: '/shop?cat=accessories' },
  { label: 'Sneakers', href: '/shop?cat=footwear' },
]

const socials = [
  { label: 'Facebook', href: '#' },
  { label: 'Instagram', href: '#' },
  { label: 'TikTok', href: '#' },
  { label: 'X', href: '#' },
]

export default function Navbar({ cartCount = 0 }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState(null)
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const isAuthed = status === 'authenticated'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setOpenSubmenu(null)
  }, [pathname])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <div style={{
        background: '#d4d2cb',
        color: '#1a1a1a',
        textAlign: 'center',
        padding: '8px 16px',
        fontSize: '10px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
      }}>
        Gratis ongkir untuk pembelian di atas Rp300.000 · GROUNDHOOD Thrift Store
      </div>

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
          gap: '20px',
        }}>
          {/* LEFT — Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="nav-hamburger"
            >
              <span className="nav-hamburger-icon">
                <Menu size={20} strokeWidth={1.5} />
              </span>
              <span className="nav-hamburger-label">Menu</span>
            </button>
          </div>

          {/* CENTER — Logo */}
          <Link href="/" className="nav-logo">
            GROUNDHOOD
          </Link>

          {/* RIGHT — About / Contact / Auth / Cart */}
          <div style={{
            display: 'flex', gap: '20px', alignItems: 'center', flex: 1, justifyContent: 'flex-end',
          }}>
            <div className="desktop-nav" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <Link href="/about" className="nav-link">About</Link>
              <Link href="/contact" className="nav-link">Contact</Link>

              {isAuthed ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Link
                    href={session?.user?.role === 'admin' ? '/admin' : '/account'}
                    className="nav-account"
                    aria-label="Account"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    {session?.user?.name?.split(' ')[0] ?? 'Account'}
                  </Link>
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      title="Sign out"
                      aria-label="Sign out"
                      className="nav-signout"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                    </button>
                  </form>
                </div>
              ) : (
                <>
                  <Link href="/login" className="nav-link">Sign In</Link>
                  <Link href="/register" className="nav-register">Register</Link>
                </>
              )}
            </div>

            <Link href="/cart" className="nav-cart" aria-label={`Cart (${cartCount} items)`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-6px', right: '-6px',
                  background: '#d4d2cb', color: '#1a1a1a',
                  borderRadius: '50%',
                  minWidth: '16px', height: '16px',
                  padding: '0 4px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '9px', fontWeight: '700',
                  fontVariantNumeric: 'tabular-nums',
                }}>{cartCount}</span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── MENU OVERLAY ─────────────────────────────────────────── */}
      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="menu-overlay"
        >
          {/* Overlay header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 32px',
            borderBottom: '1px dotted rgba(212,210,203,0.3)',
          }}>
            <span style={{
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#d4d2cb',
            }}>
              Menu
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="menu-close"
            >
              <X size={22} strokeWidth={1.5} />
            </button>
          </div>

          {/* Menu list */}
          <div style={{
            padding: '32px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {menuItems.map((item) => {
                const isOpen = openSubmenu === item.label
                const hasSubmenu = !!item.submenu

                return (
                  <li
                    key={item.label}
                    style={{ borderBottom: '1px dotted rgba(212,210,203,0.12)' }}
                  >
                    {hasSubmenu ? (
                      <>
                        <button
                          onClick={() => setOpenSubmenu(isOpen ? null : item.label)}
                          aria-expanded={isOpen}
                          className={`menu-item${item.highlight ? ' menu-item-highlight' : ''}`}
                        >
                          <span className="menu-item-text">
                            <span className="menu-item-arrow">→</span>
                            <span>{item.label}</span>
                          </span>
                          <span className="menu-item-toggle">
                            {isOpen ? <Minus size={18} strokeWidth={1.5} /> : <Plus size={18} strokeWidth={1.5} />}
                          </span>
                        </button>
                        <div className={`menu-submenu${isOpen ? ' open' : ''}`}>
                          <ul style={{
                            listStyle: 'none',
                            padding: '0 0 18px 16px',
                            margin: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '14px',
                          }}>
                            {item.submenu.map((sub) => (
                              <li key={sub.label}>
                                <Link
                                  href={sub.href}
                                  onClick={() => setMenuOpen(false)}
                                  className="menu-submenu-link"
                                >
                                  <span className="menu-submenu-arrow">→</span>
                                  <span>{sub.label}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className={`menu-item${item.highlight ? ' menu-item-highlight' : ''}`}
                      >
                        <span className="menu-item-text">
                          <span className="menu-item-arrow">→</span>
                          <span>{item.label}</span>
                        </span>
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>

            {/* Secondary links — appear inside overlay (always shown) */}
            <ul style={{
              listStyle: 'none', padding: '24px 0 0', margin: 0,
              display: 'flex', flexDirection: 'column', gap: '14px',
            }}>
              {[['/about', 'About'], ['/contact', 'Contact']].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} onClick={() => setMenuOpen(false)} className="menu-secondary">
                    {label}
                  </Link>
                </li>
              ))}
              {!isAuthed && (
                <>
                  <li>
                    <Link href="/login" onClick={() => setMenuOpen(false)} className="menu-secondary">
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" onClick={() => setMenuOpen(false)} className="menu-secondary">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Social pills */}
          <div style={{
            padding: '24px 32px 32px',
            borderTop: '1px dotted rgba(212,210,203,0.3)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
          }}>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      )}

      <style>{`
        /* ─── PREMIUM HOVER SYSTEM ─────────────────────────────
           Easing: cubic-bezier(0.22, 1, 0.36, 1)  (ease-out-quint)
           Durations:
             - color: 300ms (fast feedback)
             - transform / spacing: 450ms (smooth, luxurious)
             - underline / arrow reveal: 400ms
        */

        /* Hamburger button */
        .nav-hamburger {
          background: none;
          border: none;
          cursor: pointer;
          color: #d4d2cb;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 4px;
          font-family: inherit;
          transition: color 300ms ease;
        }
        .nav-hamburger-icon {
          display: flex;
          transition: transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .nav-hamburger-label {
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          position: relative;
          transition: letter-spacing 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .nav-hamburger-label::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -3px;
          height: 1px;
          background: currentColor;
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 400ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .nav-hamburger:hover {
          color: #fff;
        }
        .nav-hamburger:hover .nav-hamburger-icon {
          transform: translateX(-2px);
        }
        .nav-hamburger:hover .nav-hamburger-label {
          letter-spacing: 0.24em;
        }
        .nav-hamburger:hover .nav-hamburger-label::after {
          transform: scaleX(1);
        }

        /* Logo */
        .nav-logo {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #d4d2cb;
          text-decoration: none;
          flex: 0 0 auto;
          text-align: center;
          transition: letter-spacing 500ms cubic-bezier(0.22, 1, 0.36, 1),
                      color 300ms ease;
        }
        .nav-logo:hover {
          color: #fff;
          letter-spacing: 0.2em;
        }

        /* Generic nav text link (About, Contact, Sign In) */
        .nav-link {
          position: relative;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #a8a69f;
          text-decoration: none;
          padding: 4px 0;
          transition: color 300ms ease;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -2px;
          height: 1px;
          background: #d4d2cb;
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 400ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .nav-link:hover {
          color: #d4d2cb;
        }
        .nav-link:hover::after {
          transform: scaleX(1);
        }

        /* Account pill */
        .nav-account {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 16px;
          border: 1px dotted rgba(212,210,203,0.4);
          border-radius: 100px;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #d4d2cb;
          text-decoration: none;
          background: transparent;
          transition: background 350ms cubic-bezier(0.22, 1, 0.36, 1),
                      border-color 350ms cubic-bezier(0.22, 1, 0.36, 1),
                      color 300ms ease,
                      transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .nav-account:hover {
          background: rgba(212,210,203,0.08);
          border-color: rgba(212,210,203,0.75);
          color: #fff;
          transform: translateY(-1px);
        }

        /* Sign-out icon button */
        .nav-signout {
          background: none;
          border: 1px dotted rgba(212,210,203,0.25);
          border-radius: 100px;
          padding: 7px 9px;
          cursor: pointer;
          color: #a8a69f;
          display: flex;
          align-items: center;
          transition: color 300ms ease,
                      border-color 350ms cubic-bezier(0.22, 1, 0.36, 1),
                      transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .nav-signout:hover {
          color: #f87171;
          border-color: rgba(248,113,113,0.55);
          transform: translateY(-1px);
        }

        /* Register CTA pill */
        .nav-register {
          padding: 7px 16px;
          background: #d4d2cb;
          color: #1a1a1a;
          border: 1px solid #d4d2cb;
          border-radius: 100px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background 350ms cubic-bezier(0.22, 1, 0.36, 1),
                      border-color 350ms cubic-bezier(0.22, 1, 0.36, 1),
                      color 300ms ease,
                      transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .nav-register:hover {
          background: #fff;
          border-color: #fff;
          transform: translateY(-1px);
        }

        /* Cart icon */
        .nav-cart {
          background: none;
          border: none;
          cursor: pointer;
          color: #a8a69f;
          position: relative;
          display: flex;
          align-items: center;
          padding: 4px;
          transition: color 300ms ease,
                      transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .nav-cart:hover {
          color: #d4d2cb;
          transform: translateY(-2px);
        }

        /* ─── MENU OVERLAY ─────────────────────────────────── */

        .menu-overlay {
          position: fixed;
          inset: 0;
          background: #1a1a1a;
          z-index: 200;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          animation: menuFade 280ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes menuFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* Close (X) button */
        .menu-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #d4d2cb;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 300ms ease,
                      transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .menu-close:hover {
          color: #fff;
          transform: rotate(90deg);
        }

        /* Big menu items (NEW IN, RESTOCKS, etc.) */
        .menu-item {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 0;
          background: none;
          border: none;
          cursor: pointer;
          color: #d4d2cb;
          font-family: inherit;
          font-size: clamp(20px, 3vw, 28px);
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          text-align: left;
          text-decoration: none;
          transition: color 350ms ease,
                      letter-spacing 500ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .menu-item-text {
          display: inline-flex;
          align-items: center;
          gap: 0;
          transition: transform 500ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .menu-item-arrow {
          display: inline-flex;
          align-items: center;
          width: 0;
          opacity: 0;
          margin-right: 0;
          transform: translateX(-12px);
          overflow: hidden;
          font-size: 0.7em;
          color: inherit;
          transition: width 500ms cubic-bezier(0.22, 1, 0.36, 1),
                      margin-right 500ms cubic-bezier(0.22, 1, 0.36, 1),
                      opacity 350ms ease,
                      transform 500ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .menu-item:hover {
          color: #fff;
          letter-spacing: 0.06em;
        }
        .menu-item:hover .menu-item-arrow {
          width: 0.9em;
          margin-right: 0.4em;
          opacity: 1;
          transform: translateX(0);
        }
        .menu-item-toggle {
          display: inline-flex;
          color: #a8a69f;
          transition: color 300ms ease,
                      transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .menu-item:hover .menu-item-toggle {
          color: #d4d2cb;
          transform: rotate(90deg);
        }

        /* SALE — red highlight (overrides hover color) */
        .menu-item-highlight {
          color: #f87171;
        }
        .menu-item-highlight:hover {
          color: #fca5a5;
        }
        .menu-item-highlight:hover .menu-item-toggle {
          color: #fca5a5;
        }

        /* Submenu container — animated reveal */
        .menu-submenu {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: max-height 450ms cubic-bezier(0.22, 1, 0.36, 1),
                      opacity 300ms ease;
        }
        .menu-submenu.open {
          max-height: 320px;
          opacity: 1;
        }

        /* Submenu links */
        .menu-submenu-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #a8a69f;
          text-decoration: none;
          transition: color 300ms ease,
                      transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .menu-submenu-arrow {
          display: inline-block;
          transition: transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .menu-submenu-link:hover {
          color: #d4d2cb;
          transform: translateX(6px);
        }
        .menu-submenu-link:hover .menu-submenu-arrow {
          transform: translateX(2px);
        }

        /* Secondary links (About, Contact, etc. in overlay) */
        .menu-secondary {
          position: relative;
          display: inline-block;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #a8a69f;
          text-decoration: none;
          padding: 2px 0;
          transition: color 300ms ease,
                      transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .menu-secondary::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -2px;
          height: 1px;
          background: #d4d2cb;
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 400ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .menu-secondary:hover {
          color: #d4d2cb;
          transform: translateX(4px);
        }
        .menu-secondary:hover::after {
          transform: scaleX(1);
        }

        /* Social pills */
        .social-pill {
          padding: 10px 22px;
          border: 1px solid rgba(212,210,203,0.5);
          border-radius: 50px;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #d4d2cb;
          text-decoration: none;
          background: transparent;
          transition: background 400ms cubic-bezier(0.22, 1, 0.36, 1),
                      border-color 400ms cubic-bezier(0.22, 1, 0.36, 1),
                      color 300ms ease,
                      transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .social-pill:hover {
          background: #d4d2cb;
          border-color: #d4d2cb;
          color: #1a1a1a;
          transform: translateY(-2px);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .nav-hamburger-label { display: none !important; }
        }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .nav-hamburger,
          .nav-hamburger-icon,
          .nav-hamburger-label,
          .nav-logo,
          .nav-link,
          .nav-link::after,
          .nav-account,
          .nav-signout,
          .nav-register,
          .nav-cart,
          .menu-close,
          .menu-item,
          .menu-item-text,
          .menu-item-arrow,
          .menu-item-toggle,
          .menu-submenu,
          .menu-submenu-link,
          .menu-secondary,
          .menu-secondary::after,
          .social-pill {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  )
}
