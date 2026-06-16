'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Receipt,
  Users,
  BarChart3,
  Image as ImageIcon,
  LogOut,
  ExternalLink,
} from 'lucide-react'
import { logoutAction } from '@/actions/auth'

type AdminUser = {
  name: string | null
  email: string
}

const navItems = [
  { href: '/admin',           label: 'Dashboard',          icon: LayoutDashboard, exact: true },
  { href: '/admin/products',  label: 'Kelola Produk',      icon: Package },
  { href: '/admin/categories',label: 'Kelola Kategori',    icon: Tags },
  { href: '/admin/orders',    label: 'Kelola Pesanan',     icon: ShoppingCart },
  { href: '/admin/payments',  label: 'Verifikasi Bayar',   icon: Receipt },
  { href: '/admin/users',     label: 'Kelola User',        icon: Users },
  { href: '/admin/reports',   label: 'Laporan Transaksi',  icon: BarChart3 },
  { href: '/admin/assets',    label: 'Kelola Aset Web',    icon: ImageIcon },
]

export default function AdminSidebar({ user }: { user: AdminUser }) {
  const pathname = usePathname()

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase()

  return (
    <aside style={{
      width: '260px',
      flexShrink: 0,
      borderRight: '1px dotted rgba(212,210,203,0.3)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: '#1a1a1a',
      position: 'sticky',
      top: 0,
      maxHeight: '100vh',
      overflowY: 'auto',
    }}>
      {/* Brand header */}
      <div style={{
        padding: '24px 28px 20px',
        borderBottom: '1px dotted rgba(212,210,203,0.3)',
      }}>
        <Link href="/admin" style={{
          fontSize: '17px', fontWeight: '700', letterSpacing: '0.15em',
          textTransform: 'uppercase', color: '#d4d2cb', textDecoration: 'none',
          display: 'block', marginBottom: '4px',
        }}>
          GROUNDHOOD
        </Link>
        <p style={{
          fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: '#86efac',
        }}>
          Admin Panel
        </p>
      </div>

      {/* User card */}
      <div style={{
        padding: '20px 28px',
        borderBottom: '1px dotted rgba(212,210,203,0.3)',
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: 'rgba(212,210,203,0.08)',
          border: '1px dotted rgba(212,210,203,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', fontWeight: '700', color: '#d4d2cb',
          flexShrink: 0,
        }}>
          {initials}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{
            fontWeight: '700', fontSize: '11px', letterSpacing: '0.06em',
            textTransform: 'uppercase', color: '#d4d2cb', marginBottom: '2px',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {user.name ?? 'Admin'}
          </p>
          <p style={{
            fontSize: '9px', color: '#a8a69f', letterSpacing: '0.03em',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {user.email}
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0' }}>
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '11px 28px',
                fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase',
                color: active ? '#d4d2cb' : '#a8a69f',
                textDecoration: 'none',
                background: active ? 'rgba(212,210,203,0.06)' : 'transparent',
                borderLeft: active ? '2px solid #86efac' : '2px solid transparent',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#d4d2cb' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#a8a69f' }}
            >
              <Icon size={13} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer actions */}
      <div style={{
        padding: '12px 28px 24px',
        borderTop: '1px dotted rgba(212,210,203,0.3)',
        display: 'flex', flexDirection: 'column', gap: '14px',
      }}>
        <Link href="/" style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase',
          color: '#a8a69f', textDecoration: 'none', transition: 'color 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.color = '#d4d2cb')}
          onMouseLeave={e => (e.currentTarget.style.color = '#a8a69f')}
        >
          <ExternalLink size={12} />
          View Store
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase',
              color: '#a8a69f', padding: 0, transition: 'color 0.2s', width: '100%',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
            onMouseLeave={e => (e.currentTarget.style.color = '#a8a69f')}
          >
            <LogOut size={12} />
            Logout
          </button>
        </form>
      </div>
    </aside>
  )
}
