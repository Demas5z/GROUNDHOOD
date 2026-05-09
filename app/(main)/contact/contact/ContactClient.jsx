'use client'

import { useState } from 'react'
import FAQItem from '@/components/FAQItem'

const faqs = [
  { q: 'Berapa lama pengiriman?', a: 'Pengiriman dilakukan secara manual oleh admin setelah pembayaran dikonfirmasi. Estimasi pengiriman 2-5 hari kerja tergantung lokasi.' },
  { q: 'Bagaimana cara melakukan pembayaran?', a: 'Kami menggunakan sistem transfer bank manual. Setelah checkout, kamu akan mendapat info rekening dan batas waktu pembayaran. Upload bukti transfer untuk konfirmasi.' },
  { q: 'Apakah produk bisa dikembalikan?', a: 'Pengembalian diterima dalam 3 hari setelah barang diterima, jika kondisi tidak sesuai deskripsi. Hubungi kami terlebih dahulu sebelum mengirim balik.' },
  { q: 'Bagaimana kondisi produk yang dijual?', a: 'Semua produk adalah barang secondhand yang telah melalui seleksi ketat. Kondisi setiap produk tertera di deskripsi — mulai dari grade A hingga C.' },
  { q: 'Apakah stok produk bisa habis?', a: 'Ya, setiap produk thrift adalah item unik dengan stok terbatas. Segera checkout jika kamu tertarik agar tidak kehabisan.' },
  { q: 'Bagaimana cara mengetahui produk baru?', a: 'Daftarkan emailmu untuk mendapatkan notifikasi setiap ada produk baru yang masuk ke GROUNDHOOD.' },
]

export default function ContactClient() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <main style={{ padding: '60px 40px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '64px' }}>
        <p className="text-label" style={{ marginBottom: '8px' }}>Get In Touch</p>
        <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 7rem)', fontWeight: '700', letterSpacing: '-0.03em', textTransform: 'uppercase', color: '#d4d2cb', lineHeight: 0.95 }}>
          Contact<br />Us
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px' }}>
        <div>
          <p className="text-label" style={{ marginBottom: '32px' }}>Send a Message</p>
          {sent ? (
            <div className="grid-cell" style={{ padding: '48px', textAlign: 'center' }}>
              <p style={{ fontSize: '32px', marginBottom: '16px' }}>✓</p>
              <h3 style={{ fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', color: '#d4d2cb' }}>Message Sent</h3>
              <p style={{ color: '#a8a69f', lineHeight: '1.8' }}>Thank you for reaching out. We&apos;ll get back to you within 1-2 business days.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <input type="text" placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <input type="text" placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
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

        <div>
          <p className="text-label" style={{ marginBottom: '32px' }}>Find Us</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '48px' }}>
            {[
              { label: 'Email', value: 'hello@groundhood.id' },
              { label: 'Instagram', value: '@groundhood.id' },
              { label: 'Lokasi', value: 'Indonesia' },
              { label: 'Jam Operasional', value: 'Sen–Sab, 09:00–17:00 WIB' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted rgba(212,210,203,0.3)', paddingBottom: '16px' }}>
                <span className="text-label">{item.label}</span>
                <span style={{ fontSize: '12px', color: '#d4d2cb' }}>{item.value}</span>
              </div>
            ))}
          </div>
          <p className="text-label" style={{ marginBottom: '20px' }}>Follow Us</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            {['Instagram', 'TikTok', 'Twitter', 'Facebook'].map(platform => (
              <a key={platform} href="#" className="btn-pill" style={{ padding: '8px 16px', fontSize: '10px' }}>{platform}</a>
            ))}
          </div>
        </div>
      </div>

      <section style={{ marginTop: '80px', borderTop: '1px dotted rgba(212,210,203,0.4)', paddingTop: '64px' }}>
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
