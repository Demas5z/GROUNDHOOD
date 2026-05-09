import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'

export const metadata = { title: 'Admin Panel — GROUNDHOOD' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'admin') redirect('/account')

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#1a1a1a',
      color: '#d4d2cb',
    }}>
      <AdminSidebar
        user={{
          name: session.user.name ?? null,
          email: session.user.email!,
        }}
      />
      <main style={{ flex: 1, padding: '40px 48px', overflowX: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
