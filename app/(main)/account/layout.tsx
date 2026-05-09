import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import AccountSidebar from '@/components/AccountSidebar'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const user = {
    id: session.user.id!,
    name: session.user.name ?? null,
    email: session.user.email!,
    image: session.user.image ?? null,
    createdAt: '',
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: 'calc(100vh - 97px)',
      background: '#1a1a1a',
    }}>
      <AccountSidebar user={user} />
      <main style={{ flex: 1, padding: '48px 52px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
