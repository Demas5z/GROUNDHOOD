import Link from 'next/link'
import FadeUp from '@/components/FadeUp'

export const metadata = {
  title: 'About',
  description: 'Kenali GROUNDHOOD — thrift store yang lahir dari keyakinan bahwa pakaian berkualitas tidak harus baru.',
}

export default function AboutPage() {
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

      {/* Story */}
      <section style={{ padding: '80px 40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <FadeUp>
            <div>
              <p className="text-label" style={{ marginBottom: '16px' }}>Our Origin</p>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '32px', color: '#d4d2cb' }}>
                Born From<br />The Underground
              </h2>
              <p style={{ color: '#a8a69f', lineHeight: '2', marginBottom: '24px' }}>
                GROUNDHOOD lahir dari keyakinan bahwa pakaian berkualitas tidak harus baru. Kami hadir
                sebagai thrift store yang mengkurasi produk secondhand terbaik — yang memiliki cerita,
                karakter, dan nilai yang tak ternilai.
              </p>
              <p style={{ color: '#a8a69f', lineHeight: '2', marginBottom: '24px' }}>
                Setiap produk yang masuk ke GROUNDHOOD melalui seleksi ketat. Kami percaya bahwa
                pakaian preloved yang tepat bisa mengekspresikan dirimu lebih baik daripada yang baru sekalipun.
              </p>
              <p style={{ color: '#a8a69f', lineHeight: '2' }}>
                GROUNDHOOD bukan sekadar toko — ini adalah ruang bagi mereka yang menghargai
                keunikan, keberlanjutan, dan gaya yang autentik.
              </p>
            </div>
          </FadeUp>
          <FadeUp delay={200}>
            <div className="grid-cell" style={{ overflow: 'hidden', aspectRatio: '4/5' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
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
              { num: '01', title: 'Selektivitas', desc: 'Setiap produk melewati seleksi ketat. Kami hanya menjual yang benar-benar layak — kondisi baik, bersih, dan bernilai.' },
              { num: '02', title: 'Kualitas', desc: 'Thrift bukan berarti murahan. Kami memastikan setiap barang yang kami jual memiliki kualitas yang bisa kamu banggakan.' },
              { num: '03', title: 'Komunitas', desc: 'GROUNDHOOD adalah komunitas. Pelanggan kami bukan sekadar pembeli — mereka adalah bagian dari gerakan thrift yang lebih besar.' },
              { num: '04', title: 'Keberlanjutan', desc: 'Memilih thrift berarti memilih lingkungan yang lebih baik. Setiap pembelian di GROUNDHOOD adalah langkah kecil yang bermakna.' },
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

      {/* Vision */}
      <section style={{ padding: '80px 40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <FadeUp>
            <div className="grid-cell" style={{ overflow: 'hidden', aspectRatio: '4/5' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
                alt="Vision"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </FadeUp>
          <FadeUp delay={200}>
            <div>
              <p className="text-label" style={{ marginBottom: '16px' }}>Where We&apos;re Going</p>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '32px', color: '#d4d2cb' }}>
                The Vision
              </h2>
              <p style={{ color: '#a8a69f', lineHeight: '2', marginBottom: '24px' }}>
                Kami membangun GROUNDHOOD sebagai thrift store terpercaya yang menghadirkan pengalaman
                belanja secondhand yang menyenangkan, aman, dan memuaskan.
              </p>
              <p style={{ color: '#a8a69f', lineHeight: '2', marginBottom: '40px' }}>
                Dari satu produk thrift ke produk berikutnya — GROUNDHOOD adalah tempat di mana
                setiap pakaian menemukan pemilik barunya.
              </p>
              <Link href="/shop" className="btn-pill">Shop The Collection</Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Team */}
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
            GROUNDHOOD dijalankan oleh tim kecil yang bersemangat. Kami percaya pada
            kekuatan produk secondhand dan berkomitmen untuk memberikan pengalaman terbaik.
          </p>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {[
            { name: 'ARYA P.', role: 'Founder & Kurator', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
            { name: 'SARI N.', role: 'Product Manager', img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80' },
            { name: 'DITO M.', role: 'Logistik & Operasional', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
            { name: 'LARAS K.', role: 'Customer Relations', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
          ].map((member, i) => (
            <FadeUp key={i} delay={i * 100}>
              <div className="grid-cell" style={{ overflow: 'hidden' }}>
                <div style={{ overflow: 'hidden', aspectRatio: '1', borderRadius: '20px 20px 0 0' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
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
