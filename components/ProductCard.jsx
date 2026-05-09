'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link href={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hovered ? product.hoverImage : product.image}
            alt={product.name}
            style={{ transition: 'opacity 0.3s ease' }}
          />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '16px',
            background: 'linear-gradient(to top, rgba(26,26,26,0.9) 0%, transparent 100%)',
            transform: hovered ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.3s ease',
            display: 'flex', justifyContent: 'center',
          }}>
            <button
              className="btn-pill btn-pill-filled"
              style={{ fontSize: '10px', padding: '8px 20px' }}
              onClick={e => e.preventDefault()}
            >
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
