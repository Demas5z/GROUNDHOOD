import Link from 'next/link'
import { Sparkles, Recycle, HandCoins, Heart } from 'lucide-react'

export const metadata = {
  title: 'About',
  description: 'Cerita di balik GROUNDHOOD — thrift store dengan kurasi tangan dan jiwa archive piece.',
}

export default function AboutPage() {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 40px 100px' }}>
      <p className="text-label" style={{ marginBottom: '12px' }}>About</p>
      <h1 style={{
        fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '-0.04em',
        color: '#d4d2cb', lineHeight: 0.95, marginBottom: '24px',
        maxWidth: '780px',
      }}>
        Pakaian Bekas,<br />
        <span style={{ color: '#a8a69f' }}>Cerita Baru.</span>
      </h1>

      <p style={{
        color: '#a8a69f', fontSize: '13px', lineHeight: 2,
        maxWidth: '620px', letterSpacing: '0.02em', marginBottom: '60px',
      }}>
        GROUNDHOOD lahir dari ide sederhana: pakaian punya cerita, dan sebagian besar
        di antaranya masih layak untuk diceritakan ulang. Kami menelusuri pasar loak
        terbaik di Indonesia, mengkurasi item dengan tangan, mencuci & memeriksa
        kondisinya, lalu menyajikannya untuk kamu yang percaya bahwa style tidak harus
        selalu baru — yang penting, jujur dan punya jiwa.
      </p>

      {/* Pillars */}
      <section style={{
        padding: '40px 0',
        borderTop: '1px dotted rgba(212,210,203,0.25)',
        borderBottom: '1px dotted rgba(212,210,203,0.25)',
        marginBottom: '60px',
      }}>
        <p className="text-label" style={{ marginBottom: '32px' }}>What we stand for</p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '32px',
        }}>
          {[
            { icon: Sparkles, label: 'Kurasi Tangan', desc: 'Setiap item disaring oleh tim kami. Tidak ada yang lolos tanpa cek kualitas.' },
            { icon: Recycle, label: 'Sustainable', desc: 'Memberi kehidupan kedua untuk pakaian yang masih layak pakai.' },
            { icon: HandCoins, label: 'Harga Jujur', desc: 'Markup wajar, tanpa tipu-tipu. Premium piece tetap terjangkau.' },
            { icon: Heart, label: 'Komunitas', desc: 'Kami bukan sekadar toko — kami komunitas pemburu archive yang autentik.' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label}>
              <Icon size={20} color="#d4d2cb" style={{ marginBottom: '14px' }} />
              <p style={{
                fontSize: '12px', fontWeight: 700, color: '#d4d2cb',
                letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px',
              }}>
                {label}
              </p>
              <p style={{ fontSize: '11px', color: '#a8a69f', lineHeight: 1.8 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Vision */}
      <section style={{ marginBottom: '60px' }}>
        <p className="text-label" style={{ marginBottom: '14px' }}>Vision</p>
        <h2 style={{
          fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '-0.025em',
          color: '#d4d2cb', lineHeight: 1.1, marginBottom: '20px',
          maxWidth: '720px',
        }}>
          Buy less. Wear longer. Choose pieces that already tell a story.
        </h2>
        <p style={{
          color: '#a8a69f', fontSize: '12px', lineHeight: 1.9,
          maxWidth: '560px', letterSpacing: '0.02em',
        }}>
          Industri fashion menghasilkan jutaan ton limbah tekstil setiap tahun.
          Setiap item thrift yang kamu beli adalah satu langkah ke arah lemari yang
          lebih sustainable. Kami percaya gaya terbaik bukan yang paling baru — tapi
          yang paling jujur.
        </p>
      </section>

      {/* CTA */}
      <section style={{
        padding: 'clamp(36px, 6vw, 60px) clamp(24px, 6vw, 52px)',
        border: '1px dotted rgba(212,210,203,0.3)',
        borderRadius: '24px',
        background: 'rgba(212,210,203,0.03)',
        textAlign: 'center',
      }}>
        <p className="text-label" style={{ marginBottom: '12px' }}>Mulai berburu</p>
        <h3 style={{
          fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '-0.02em',
          color: '#d4d2cb', lineHeight: 1.15, marginBottom: '24px',
        }}>
          Drop terbaru selalu menanti.
        </h3>
        <Link href="/shop" className="btn-pill btn-pill-filled">
          Browse Shop
        </Link>
      </section>
    </div>
  )
}
