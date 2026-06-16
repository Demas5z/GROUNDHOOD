import { prisma } from '@/lib/prisma'
import AssetManager from './AssetManager'

export default async function AssetsPage() {
  const assets = await prisma.assetWeb.findMany({
    orderBy: { key: 'asc' },
  })

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#86efac', marginBottom: '8px' }}>
          Admin
        </p>
        <h1 style={{
          fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: '700',
          textTransform: 'uppercase', letterSpacing: '-0.025em',
          color: '#d4d2cb', lineHeight: 1, marginBottom: '8px',
        }}>
          Kelola Aset Web
        </h1>
        <p style={{ color: '#a8a69f', fontSize: '11px', lineHeight: 1.7, maxWidth: '560px' }}>
          {assets.length} aset. Aset (gambar/video background) dipanggil halaman lewat <code style={{ color: '#d4d2cb' }}>key</code>-nya,
          mis. <code style={{ color: '#d4d2cb' }}>hero-bg</code> untuk beranda dan <code style={{ color: '#d4d2cb' }}>login-bg</code> untuk halaman login.
          Ganti file/URL di sini tanpa mengubah kode.
        </p>
      </div>

      <AssetManager
        initial={assets.map(a => ({
          id: a.id,
          key: a.key,
          name: a.name,
          type: a.type,
          url: a.url,
          mimeType: a.mimeType,
          alt: a.alt,
          isActive: a.isActive,
        }))}
      />
    </div>
  )
}
