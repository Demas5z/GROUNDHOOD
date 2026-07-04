'use client'

import Link from 'next/link'
import BrandLogo from '@/components/BrandLogo'

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px dotted rgba(212,210,203,0.4)', marginTop: '80px' }}>
      <div style={{
        borderBottom: '1px dotted rgba(212,210,203,0.4)',
        padding: '60px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '32px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        <div>
          <p className="text-label" style={{ marginBottom: '8px' }}>Stay in the loop</p>
          <h3 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.01em', textTransform: 'uppercase', color: '#d4d2cb' }}>
            Daftar & Dapatkan Info Drop Terbaru
          </h3>
        </div>
        <div style={{ display: 'flex', gap: '12px', flex: '0 1 480px' }}>
          <input type="email" placeholder="Your email address" style={{ borderRadius: '50px', flex: 1 }} />
          <button className="btn-pill btn-pill-filled" style={{ whiteSpace: 'nowrap' }}>Subscribe</button>
        </div>
      </div>

      <div style={{
        padding: '60px 40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '40px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        <div style={{ gridColumn: 'span 2' }}>
          <Link href="/" className="footer-logo" aria-label="GROUNDHOOD — Beranda">
            <BrandLogo height="clamp(24px, 5vw, 32px)" />
          </Link>
          <p style={{ color: '#a8a69f', fontSize: '12px', lineHeight: '1.8', maxWidth: '260px' }}>
            Thrift store produk secondhand pilihan. Temukan pakaian unik berkualitas dengan harga terjangkau.
          </p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
            <a href="#" className="footer-social" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="#" className="footer-social" aria-label="TikTok">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.75a8.16 8.16 0 0 0 4.77 1.52V6.79a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
            <a href="#" className="footer-social" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-label" style={{ marginBottom: '20px' }}>Shop</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['New Arrivals', 'T-Shirts', 'Hoodies', 'Bottoms', 'Accessories', 'Sale'].map(item => (
              <li key={item}>
                <Link href="/shop" className="footer-link">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-label" style={{ marginBottom: '20px' }}>Info</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[['About', '/about'], ['Brand Vision', '/about'], ['Contact', '/contact'], ['FAQ', '/contact'], ['Shipping & Returns', '/contact']].map(([label, path]) => (
              <li key={label}>
                <Link href={path} className="footer-link">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{
        borderTop: '1px dotted rgba(212,210,203,0.3)',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        <p style={{ fontSize: '10px', color: '#a8a69f', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          © {new Date().getFullYear()} GROUNDHOOD. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: '24px' }}>
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
            <a key={item} href="#" className="footer-legal">
              {item}
            </a>
          ))}
        </div>
      </div>

      <style>{`
        /* ─── PREMIUM FOOTER HOVER ─────────────────────────────
           Same easing system as the navbar:
           cubic-bezier(0.22, 1, 0.36, 1) — ease-out-quint
        */

        /* Logo wordmark */
        .footer-logo {
          display: inline-block;
          margin-bottom: 16px;
          opacity: 0.92;
          transition: opacity 300ms ease;
        }
        .footer-logo:hover {
          opacity: 1;
        }

        /* Column links (Shop / Info) */
        .footer-link {
          position: relative;
          display: inline-block;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #a8a69f;
          text-decoration: none;
          padding: 2px 0;
          transition: color 300ms ease,
                      transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .footer-link::after {
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
        .footer-link:hover {
          color: #d4d2cb;
          transform: translateX(4px);
        }
        .footer-link:hover::after {
          transform: scaleX(1);
        }

        /* Social icons */
        .footer-social {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #a8a69f;
          transition: color 300ms ease,
                      transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .footer-social:hover {
          color: #d4d2cb;
          transform: translateY(-3px);
        }

        /* Bottom legal links */
        .footer-legal {
          position: relative;
          display: inline-block;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #a8a69f;
          text-decoration: none;
          padding: 2px 0;
          transition: color 300ms ease;
        }
        .footer-legal::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          height: 1px;
          background: #d4d2cb;
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 400ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .footer-legal:hover {
          color: #d4d2cb;
        }
        .footer-legal:hover::after {
          transform: scaleX(1);
        }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .footer-logo,
          .footer-link,
          .footer-link::after,
          .footer-social,
          .footer-legal,
          .footer-legal::after {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </footer>
  )
}
