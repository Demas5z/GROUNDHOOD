import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { getAllSettings } from '@/lib/settings'
import SettingsForm from './SettingsForm'

export const metadata = { title: 'Pengaturan Toko' }

export default async function AdminSettingsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'admin') redirect('/login')

  const settings = await getAllSettings()

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
          Pengaturan Toko
        </h1>
        <p style={{ color: '#a8a69f', fontSize: '11px', lineHeight: 1.7, maxWidth: '620px' }}>
          Info pembayaran (rekening bank &amp; QRIS) dan info toko (alamat, kontak) disimpan di
          database MySQL (tabel <code style={{ color: '#d4d2cb' }}>site_setting</code>) dan dipakai
          di halaman About, Contact, serta instruksi pembayaran — tanpa mengubah kode.
        </p>
      </div>

      <SettingsForm initial={settings} />
    </div>
  )
}
