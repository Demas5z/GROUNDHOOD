import { useState } from 'react'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  const faqs = [
    {
      q: 'How long does shipping take?',
      a: 'Standard shipping within South Africa takes 3-5 business days. International orders take 7-14 business days depending on destination.',
    },
    {
      q: 'What is your return policy?',
      a: 'We accept returns within 14 days of delivery for unworn, unwashed items with tags still attached. Sale items are final sale.',
    },
    {
      q: 'Do you ship internationally?',
      a: 'Yes! We ship worldwide. International shipping rates are calculated at checkout based on your location.',
    },
    {
      q: 'How do I find my size?',
      a: 'All our pieces are oversized by design. We recommend sizing down if you prefer a more fitted look. See our size guide for measurements.',
    },
    {
      q: 'Are your products ethically made?',
      a: 'Absolutely. All CULTISH™ pieces are produced locally in South Africa using ethical manufacturing practices and sustainable materials where possible.',
    },
    {
      q: 'When do new collections drop?',
      a: 'Subscribe to our newsletter to be the first to know about new drops, restocks, and exclusive releases.',
    },
  ]

  return (
    <main style={{ padding: '60px 40px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '64px' }}>
        <p className="text-label" style={{ marginBottom: '8px' }}>Get In Touch</p>
        <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 7rem)', fontWeight: '700', letterSpacing: '-0.03em', textTransform: 'uppercase', color: '#d4d2cb', lineHeight: 0.95 }}>
          Contact<br />Us
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px' }}>
        {/* Contact Form */}
        <div>
          <p className="text-label" style={{ marginBottom: '32px' }}>Send a Message</p>

          {sent ? (
            <div className="grid-cell" style={{ padding: '48px', textAlign: 'center' }}>
              <p style={{ fontSize: '32px', marginBottom: '16px' }}>✓</p>
              <h3 style={{ fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', color: '#d4d2cb' }}>Message Sent</h3>
              <p style={{ color: '#a8a69f', lineHeight: '1.8' }}>Thank you for reaching out. We'll get back to you within 1-2 business days.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <input
                type="text"
                placeholder="Subject"
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
              />
              <textarea
                placeholder="Your Message"
                rows={6}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                required
                style={{ borderRadius: '20px', resize: 'vertical' }}
              />
              <button type="submit" className="btn-pill btn-pill-filled" style={{ alignSelf: 'flex-start', padding: '12px 36px' }}>
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-label" style={{ marginBottom: '32px' }}>Find Us</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '48px' }}>
            {[
              { label: 'Email', value: 'hello@cultish.com' },
              { label: 'Instagram', value: '@cultishofficial' },
              { label: 'Location', value: 'Johannesburg, South Africa' },
              { label: 'Hours', value: 'Mon–Fri, 9:00–17:00 SAST' },
            ].map(item => (
              <div key={item.label} style={{
                display: 'flex', justifyContent: 'space-between',
                borderBottom: '1px dotted rgba(212,210,203,0.3)', paddingBottom: '16px',
              }}>
                <span className="text-label">{item.label}</span>
                <span style={{ fontSize: '12px', color: '#d4d2cb' }}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Social links */}
          <p className="text-label" style={{ marginBottom: '20px' }}>Follow Us</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            {['Instagram', 'TikTok', 'Twitter', 'Facebook'].map(platform => (
              <a key={platform} href="#" className="btn-pill" style={{ padding: '8px 16px', fontSize: '10px' }}>
                {platform}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <section style={{
        marginTop: '80px',
        borderTop: '1px dotted rgba(212,210,203,0.4)',
        paddingTop: '64px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p className="text-label" style={{ marginBottom: '8px' }}>Common Questions</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#d4d2cb' }}>
            FAQ
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1px' }}>
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} />
          ))}
        </div>
      </section>
    </main>
  )
}

function FAQItem({ faq }) {
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
        <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'Space Mono, monospace' }}>
          {faq.q}
        </span>
        <span style={{ fontSize: '18px', color: '#a8a69f', transition: 'transform 0.3s', transform: open ? 'rotate(45deg)' : 'rotate(0)', flexShrink: 0 }}>
          +
        </span>
      </button>
      {open && (
        <div style={{ padding: '0 28px 24px', borderTop: '1px dotted rgba(212,210,203,0.3)' }}>
          <p style={{ color: '#a8a69f', lineHeight: '1.8', fontSize: '12px', paddingTop: '20px' }}>{faq.a}</p>
        </div>
      )}
    </div>
  )
}
