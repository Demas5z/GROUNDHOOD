'use client'

import { useState } from 'react'

export default function FAQItem({ faq }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{
      border: '1px dotted rgba(212,210,203,0.3)',
      borderRadius: '16px',
      overflow: 'hidden',
      margin: '6px',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '24px 28px', background: 'transparent', border: 'none', cursor: 'pointer',
          color: '#d4d2cb', textAlign: 'left', gap: '16px',
        }}
      >
        <span style={{
          fontSize: '12px', fontWeight: '700', letterSpacing: '0.05em',
          textTransform: 'uppercase', fontFamily: 'var(--font-space-mono), monospace',
        }}>
          {faq.q}
        </span>
        <span style={{
          fontSize: '18px', color: '#a8a69f',
          transition: 'transform 0.3s',
          transform: open ? 'rotate(45deg)' : 'rotate(0)',
          flexShrink: 0,
        }}>
          +
        </span>
      </button>
      {open && (
        <div style={{ padding: '0 28px 24px', borderTop: '1px dotted rgba(212,210,203,0.3)' }}>
          <p style={{ color: '#a8a69f', lineHeight: '1.8', fontSize: '12px', paddingTop: '20px' }}>
            {faq.a}
          </p>
        </div>
      )}
    </div>
  )
}
