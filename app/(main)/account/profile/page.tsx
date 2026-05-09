import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import ProfileForm from './ProfileForm'

export const metadata = { title: 'Profile — GROUNDHOOD' }

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, phone: true, address: true, createdAt: true },
  })

  if (!user) redirect('/api/auth/signout?callbackUrl=/login')

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
          Edit Profile
        </h1>
        <p style={{ color: '#a8a69f', fontSize: '12px', lineHeight: 1.8 }}>
          Perbarui informasi profil kamu.
        </p>
      </div>

      {/* Email (read-only) */}
      <div style={{
        padding: '16px 20px', marginBottom: '36px',
        border: '1px dotted rgba(212,210,203,0.2)',
        borderRadius: '4px', background: 'rgba(212,210,203,0.02)',
        maxWidth: '480px',
      }}>
        <p style={{
          fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase',
          color: '#a8a69f', marginBottom: '6px',
        }}>
          Email Address
        </p>
        <p style={{ fontSize: '12px', color: '#d4d2cb', letterSpacing: '0.02em' }}>
          {user.email}
        </p>
        <p style={{ fontSize: '9px', color: '#a8a69f', marginTop: '4px', letterSpacing: '0.03em' }}>
          Email tidak dapat diubah.
        </p>
      </div>

      <ProfileForm
        defaultValues={{
          name: user.name ?? '',
          phone: user.phone ?? '',
          address: user.address ?? '',
        }}
      />
    </div>
  )
}
