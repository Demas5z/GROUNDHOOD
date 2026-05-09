import PasswordForm from './PasswordForm'
import DeleteAccountButton from './DeleteAccountButton'

export const metadata = { title: 'Settings — GROUNDHOOD' }

export default function SettingsPage() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '48px' }}>
        <p style={{
          fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: '#a8a69f', marginBottom: '10px',
        }}>
          Account
        </p>
        <h1 style={{
          fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: '700',
          textTransform: 'uppercase', letterSpacing: '-0.025em',
          color: '#d4d2cb', lineHeight: 1, marginBottom: '12px',
        }}>
          Settings
        </h1>
        <p style={{ color: '#a8a69f', fontSize: '12px', lineHeight: 1.8 }}>
          Kelola keamanan dan preferensi akun kamu.
        </p>
      </div>

      {/* Change Password */}
      <section style={{ marginBottom: '64px' }}>
        <div style={{
          paddingBottom: '20px', marginBottom: '32px',
          borderBottom: '1px dotted rgba(212,210,203,0.2)',
        }}>
          <h2 style={{
            fontSize: '11px', fontWeight: '700', letterSpacing: '0.12em',
            textTransform: 'uppercase', color: '#d4d2cb', marginBottom: '6px',
          }}>
            Change Password
          </h2>
          <p style={{ fontSize: '11px', color: '#a8a69f', lineHeight: 1.7 }}>
            Gunakan password yang kuat dan unik untuk menjaga keamanan akun.
          </p>
        </div>
        <PasswordForm />
      </section>

      {/* Danger Zone */}
      <section>
        <div style={{
          paddingBottom: '20px', marginBottom: '32px',
          borderBottom: '1px dotted rgba(248,113,113,0.2)',
        }}>
          <h2 style={{
            fontSize: '11px', fontWeight: '700', letterSpacing: '0.12em',
            textTransform: 'uppercase', color: '#f87171', marginBottom: '6px',
          }}>
            Danger Zone
          </h2>
          <p style={{ fontSize: '11px', color: '#a8a69f', lineHeight: 1.7 }}>
            Tindakan di bawah bersifat permanen dan tidak dapat dikembalikan.
          </p>
        </div>
        <DeleteAccountButton />
      </section>
    </div>
  )
}
