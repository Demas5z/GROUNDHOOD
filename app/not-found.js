import Link from 'next/link'

export default function NotFound() {
  return (
    <main style={{ padding: '120px 40px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <p className="text-label" style={{ marginBottom: '16px' }}>404 — Page Not Found</p>
      <h1 style={{
        fontSize: 'clamp(3rem, 8vw, 6rem)',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '-0.03em',
        color: '#d4d2cb',
        lineHeight: 1,
        marginBottom: '24px',
      }}>
        Lost?
      </h1>
      <p style={{ color: '#a8a69f', lineHeight: '1.8', marginBottom: '48px' }}>
        Halaman yang kamu cari tidak ditemukan. Mungkin sudah terjual habis — seperti item thrift terbaik.
      </p>
      <Link href="/shop" className="btn-pill btn-pill-filled">Back to Shop</Link>
    </main>
  )
}
