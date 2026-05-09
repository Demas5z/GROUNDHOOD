import Link from 'next/link'
import { Mail, MapPin, Instagram, Clock, MessageSquare } from 'lucide-react'

export const metadata = {
  title: 'Contact',
  description: 'Hubungi tim GROUNDHOOD untuk pertanyaan, kerja sama, atau bantuan pesanan.',
}

const channels = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@groundhood.com',
    href: 'mailto:hello@groundhood.com',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: '@groundhood.id',
    href: '#',
  },
  {
    icon: MapPin,
    label: 'Studio',
    value: 'Jl. Cikajang No. 1, Jakarta Selatan',
    href: '#',
  },
  {
    icon: Clock,
    label: 'Jam Operasional',
    value: 'Senin – Jumat, 10.00 – 18.00 WIB',
    href: null,
  },
]

const faqs = [
  {
    q: 'Bagaimana proses pengiriman?',
    a: 'Setelah pembayaran terkonfirmasi, kami menyiapkan dan mengirim pesanan dalam 1–2 hari kerja. Pengiriman diatur manual oleh tim admin via JNE / J&T regular.',
  },
  {
    q: 'Apakah bisa retur produk?',
    a: 'Karena setiap item adalah produk thrift dan unik, retur hanya bisa dilakukan jika ada kerusakan signifikan yang tidak dijelaskan di deskripsi. Hubungi kami dalam 24 jam setelah barang diterima.',
  },
  {
    q: 'Metode pembayaran apa saja?',
    a: 'Kami menerima transfer manual ke rekening Bank Mandiri dan QRIS. Setelah membayar, customer wajib upload bukti transfer / pembayaran QRIS untuk diverifikasi admin.',
  },
  {
    q: 'Berapa lama verifikasi pembayaran?',
    a: 'Maksimal 1×24 jam pada hari kerja. Jika lebih dari itu, silakan hubungi kami via email atau Instagram.',
  },
]

export default function ContactPage() {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 40px 100px' }}>
      <p className="text-label" style={{ marginBottom: '12px' }}>Get in touch</p>
      <h1 style={{
        fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '-0.04em',
        color: '#d4d2cb', lineHeight: 0.95, marginBottom: '24px',
      }}>
        Say Hello.
      </h1>
      <p style={{
        color: '#a8a69f', fontSize: '13px', lineHeight: 2,
        maxWidth: '560px', letterSpacing: '0.02em', marginBottom: '60px',
      }}>
        Punya pertanyaan, ide kerja sama, atau butuh bantuan dengan pesanan? Tim kami
        siap membantu lewat channel di bawah ini.
      </p>

      {/* Channels grid */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '14px',
        marginBottom: '60px',
      }}>
        {channels.map(({ icon: Icon, label, value, href }) => {
          const Wrapper = ({ children }: { children: React.ReactNode }) =>
            href ? (
              <a href={href} className="contact-card" style={{ textDecoration: 'none' }}>{children}</a>
            ) : (
              <div className="contact-card">{children}</div>
            )

          return (
            <Wrapper key={label}>
              <Icon size={18} color="#d4d2cb" style={{ marginBottom: '14px' }} />
              <p className="text-label" style={{ marginBottom: '6px' }}>{label}</p>
              <p style={{
                fontSize: '12px', color: '#d4d2cb',
                letterSpacing: '0.04em',
                wordBreak: 'break-word',
              }}>
                {value}
              </p>
            </Wrapper>
          )
        })}
      </section>

      {/* FAQ */}
      <section style={{
        paddingTop: '40px',
        borderTop: '1px dotted rgba(212,210,203,0.25)',
        marginBottom: '60px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <MessageSquare size={14} color="#a8a69f" />
          <p className="text-label">FAQ</p>
        </div>
        <h2 style={{
          fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '-0.025em',
          color: '#d4d2cb', lineHeight: 1.05, marginBottom: '32px',
        }}>
          Pertanyaan yang sering ditanyakan.
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {faqs.map(({ q, a }, i) => (
            <div key={i} style={{
              padding: '22px 0',
              borderTop: i === 0 ? '1px dotted rgba(212,210,203,0.18)' : 'none',
              borderBottom: '1px dotted rgba(212,210,203,0.18)',
            }}>
              <p style={{
                fontSize: '13px', fontWeight: 700, color: '#d4d2cb',
                letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '10px',
              }}>
                {q}
              </p>
              <p style={{
                fontSize: '12px', color: '#a8a69f', lineHeight: 1.9,
                letterSpacing: '0.02em',
              }}>
                {a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: 'clamp(32px, 5vw, 48px)',
        border: '1px dotted rgba(212,210,203,0.3)',
        borderRadius: '24px',
        background: 'rgba(212,210,203,0.03)',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: '12px', color: '#a8a69f', lineHeight: 1.9,
          marginBottom: '20px', maxWidth: '480px', margin: '0 auto 20px',
        }}>
          Tidak menemukan jawaban? Tulis email ke kami — biasanya kami balas dalam
          1×24 jam.
        </p>
        <a href="mailto:hello@groundhood.com" className="btn-pill btn-pill-filled">
          Email Kami
        </a>
      </section>

      <style>{`
        .contact-card {
          display: block;
          padding: 24px;
          border: 1px dotted rgba(212,210,203,0.3);
          border-radius: 18px;
          background: rgba(212,210,203,0.02);
          transition: background 350ms cubic-bezier(0.22, 1, 0.36, 1),
                      border-color 350ms cubic-bezier(0.22, 1, 0.36, 1),
                      transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        a.contact-card:hover {
          background: rgba(212,210,203,0.06);
          border-color: rgba(212,210,203,0.55);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  )
}
