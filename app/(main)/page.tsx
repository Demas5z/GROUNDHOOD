import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Package, Truck, ShieldCheck, Sparkles } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getAsset } from '@/lib/assets'
import { formatRupiah } from '@/lib/order-status'

export const metadata = { title: 'GROUNDHOOD | Thrift Store' }

export default async function HomePage() {
  const [featured, categories, heroBg] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { category: true },
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } },
    }),
    getAsset('hero-bg'),
  ])

  return (
    <div>
      {/* ─── HERO ─────────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px dotted rgba(212,210,203,0.25)',
      }}>
        {/* Background sourced from the asset_web table (key: hero-bg) */}
        {heroBg.type === 'video' ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', zIndex: 0,
            }}
          >
            <source src={heroBg.url} type={heroBg.mimeType ?? 'video/mp4'} />
          </video>
        ) : (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0, zIndex: 0,
              backgroundImage: `url(${heroBg.url})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
            }}
          />
        )}

        {/* Overlay gelap agar teks tetap terbaca di atas video */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(90deg, rgba(26,26,26,0.88) 0%, rgba(26,26,26,0.6) 55%, rgba(26,26,26,0.35) 100%)',
        }} />

        <div style={{
          position: 'relative', zIndex: 2,
          maxWidth: '1400px', margin: '0 auto',
          padding: '80px 40px 100px',
          display: 'grid', gridTemplateColumns: '1fr', gap: '40px',
        }}>
          <p style={{
            fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase',
            color: '#a8a69f',
          }}>
            Drop 01 / Preloved Picks · 2026
          </p>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 7vw, 6rem)',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            textTransform: 'uppercase',
            color: '#d4d2cb',
            lineHeight: 0.95,
          }}>
            ARCHIVE FASHION<br />
            <span style={{ color: '#a8a69f' }}>FOR THE NEXT GENERATION</span>
          </h1>
          <p style={{
            color: '#a8a69f',
            fontSize: '13px',
            lineHeight: 1.9,
            maxWidth: '520px',
            letterSpacing: '0.02em',
          }}>
            From vintage gems to everyday streetwear, every piece is picked for its quality, character, and story. Not just secondhand, but made to be worn again.
          </p>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '8px' }}>
            <Link href="/shop" className="btn-pill btn-pill-filled">
              Belanja Sekarang
            </Link>
            <Link href="/about" className="btn-pill">
              Cerita Kami
            </Link>
          </div>
        </div>
      </section>

      {/* ─── VALUE STRIP ────────────────────────────────── */}
      <section style={{
        padding: '32px 40px',
        maxWidth: '1400px',
        margin: '0 auto',
        borderBottom: '1px dotted rgba(212,210,203,0.25)',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px',
        }}>
          {[
            { icon: Sparkles, label: 'Hand-picked', desc: 'Dikurasi langsung oleh tim GROUNDHOOD' },
            { icon: ShieldCheck, label: 'Quality Checked', desc: 'Setiap item dicek & dibersihkan' },
            { icon: Truck, label: 'Gratis Ongkir', desc: 'Untuk pembelian di atas Rp300.000' },
            { icon: Package, label: 'Manual Verify', desc: 'Pembayaran transfer dengan konfirmasi cepat' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'flex-start', gap: '14px',
              padding: '16px',
            }}>
              <Icon size={18} color="#d4d2cb" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p style={{
                  fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: '#d4d2cb', marginBottom: '4px',
                }}>
                  {label}
                </p>
                <p style={{ fontSize: '11px', color: '#a8a69f', lineHeight: 1.6 }}>
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CATEGORIES ─────────────────────────────────── */}
      <section style={{
        padding: '80px 40px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          marginBottom: '40px', flexWrap: 'wrap', gap: '12px',
        }}>
          <div>
            <p className="text-label" style={{ marginBottom: '10px' }}>Categories</p>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '-0.03em', color: '#d4d2cb',
              lineHeight: 1,
            }}>
              Telusuri Per Kategori
            </h2>
          </div>
          <Link href="/shop" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase',
            color: '#a8a69f', textDecoration: 'none',
          }}>
            View all <ArrowRight size={13} />
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '14px',
        }}>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?cat=${cat.slug}`}
              style={{
                display: 'block',
                padding: '36px 24px',
                border: '1px dotted rgba(212,210,203,0.3)',
                borderRadius: '20px',
                textDecoration: 'none',
                background: 'rgba(212,210,203,0.02)',
              }}
            >
              <p style={{
                fontSize: '14px', fontWeight: 700, color: '#d4d2cb',
                letterSpacing: '0.05em', textTransform: 'uppercase',
                marginBottom: '6px',
              }}>
                {cat.name}
              </p>
              <p style={{ fontSize: '10px', color: '#a8a69f', letterSpacing: '0.1em' }}>
                {cat._count.products} item{cat._count.products !== 1 ? 's' : ''}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─────────────────────────── */}
      <section style={{
        padding: '40px 40px 80px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          marginBottom: '40px', flexWrap: 'wrap', gap: '12px',
        }}>
          <div>
            <p className="text-label" style={{ marginBottom: '10px' }}>Latest Drop</p>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '-0.03em', color: '#d4d2cb',
              lineHeight: 1,
            }}>
              Produk Terbaru
            </h2>
          </div>
          <Link href="/shop" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase',
            color: '#a8a69f', textDecoration: 'none',
          }}>
            Lihat semua <ArrowRight size={13} />
          </Link>
        </div>

        {featured.length === 0 ? (
          <div style={{
            padding: '80px 24px', textAlign: 'center',
            border: '1px dotted rgba(212,210,203,0.2)', borderRadius: '20px',
          }}>
            <Package size={36} color="rgba(212,210,203,0.25)" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: '12px', color: '#a8a69f', letterSpacing: '0.05em' }}>
              Belum ada produk. Cek kembali nanti.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '24px',
          }}>
            {featured.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.id}`}
                className="product-card"
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <div style={{
                  position: 'relative', aspectRatio: '3/4',
                  overflow: 'hidden', borderRadius: '20px 20px 0 0',
                  background: 'rgba(212,210,203,0.04)',
                }}>
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Package size={32} color="rgba(212,210,203,0.25)" />
                    </div>
                  )}
                  {p.stock === 0 && (
                    <div style={{
                      position: 'absolute', top: '14px', left: '14px',
                      background: '#1a1a1a', color: '#f87171',
                      fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em',
                      padding: '5px 12px', borderRadius: '50px', textTransform: 'uppercase',
                      border: '1px dotted rgba(248,113,113,0.5)',
                    }}>
                      Sold Out
                    </div>
                  )}
                </div>
                <div style={{ padding: '16px 20px 20px' }}>
                  <p className="text-label" style={{ marginBottom: '6px' }}>
                    {p.category.name}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{
                      fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em',
                      textTransform: 'uppercase', color: '#d4d2cb',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {p.name}
                    </h3>
                    <span style={{ fontSize: '12px', color: '#d4d2cb', whiteSpace: 'nowrap' }}>
                      {formatRupiah(p.price)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ─── EDITORIAL CTA ─────────────────────────────── */}
      <section style={{
        padding: '0 40px 100px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        <div style={{
          padding: 'clamp(40px, 8vw, 80px) clamp(24px, 6vw, 60px)',
          border: '1px dotted rgba(212,210,203,0.4)',
          borderRadius: '30px',
          background: 'rgba(212,210,203,0.03)',
          textAlign: 'center',
        }}>
          <p className="text-label" style={{ marginBottom: '14px' }}>Manifesto</p>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '-0.025em', color: '#d4d2cb',
            lineHeight: 1.15, marginBottom: '20px', maxWidth: '780px',
            marginInline: 'auto',
          }}>
            Pakaian punya cerita. Kami carikan yang masih layak diceritakan ulang.
          </h2>
          <p style={{
            color: '#a8a69f', fontSize: '12px', lineHeight: 1.9,
            maxWidth: '560px', margin: '0 auto 32px', letterSpacing: '0.02em',
          }}>
            Setiap drop berarti satu lemari yang lebih sustainable. Gabung dengan ribuan
            pembeli yang memilih jalan thrift.
          </p>
          <Link href="/shop" className="btn-pill btn-pill-filled">
            Mulai Belanja
          </Link>
        </div>
      </section>
    </div>
  )
}
