'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, User, Package, Settings, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

type SidebarUser = {
  id: string
  name: string | null
  email: string
  image: string | null
  createdAt: string
}

const navItems = [
  { href: '/account', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/account/profile', label: 'Profile', icon: User },
  { href: '/account/orders', label: 'Orders', icon: Package },
  { href: '/account/settings', label: 'Settings', icon: Settings },
]

export default function AccountSidebar({ user }: { user: SidebarUser }) {
  const pathname = usePathname()

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase()

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  return (
    <aside style={{
      width: '260px',
      flexShrink: 0,
      borderRight: '1px dotted rgba(212,210,203,0.3)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 'calc(100vh - 97px)',
    }}>
      {/* User card */}
      <div style={{
        padding: '32px 28px',
        borderBottom: '1px dotted rgba(212,210,203,0.3)',
      }}>
        {/* Avatar */}
        <div style={{
          width: '52px', height: '52px', borderRadius: '50%',
          background: 'rgba(212,210,203,0.08)',
          border: '1px dotted rgba(212,210,203,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px', fontWeight: '700', color: '#d4d2cb',
          letterSpacing: '0.05em', marginBottom: '16px',
        }}>
          {initials}
        </div>
        <p style={{
          fontWeight: '700', fontSize: '12px', letterSpacing: '0.08em',
          textTransform: 'uppercase', color: '#d4d2cb', marginBottom: '4px',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {user.name ?? 'Member'}
        </p>
        <p style={{
          fontSize: '10px', color: '#a8a69f', letterSpacing: '0.05em',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {user.email}
        </p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 0' }}>
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 28px',
                fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase',
                color: active ? '#d4d2cb' : '#a8a69f',
                textDecoration: 'none',
                background: active ? 'rgba(212,210,203,0.06)' : 'transparent',
                borderLeft: active ? '2px solid #d4d2cb' : '2px solid transparent',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                if (!active) e.currentTarget.style.color = '#d4d2cb'
              }}
              onMouseLeave={e => {
                if (!active) e.currentTarget.style.color = '#a8a69f'
              }}
            >
              <Icon size={14} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div style={{ padding: '16px 28px 32px', borderTop: '1px dotted rgba(212,210,203,0.3)' }}>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/' })}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase',
            color: '#a8a69f', padding: 0, transition: 'color 0.2s', width: '100%',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
          onMouseLeave={e => (e.currentTarget.style.color = '#a8a69f')}
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </aside>
  )
}
