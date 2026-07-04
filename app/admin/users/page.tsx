import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { Shield } from 'lucide-react'
import { formatRupiah } from '@/lib/order-status'
import DeleteUserButton from './DeleteUserButton'

export default async function UsersPage() {
  const session = await auth()
  const currentUserId = session?.user?.id

  const users = await prisma.user.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { orders: true } },
      orders: {
        where: { status: { in: ['diproses', 'dikirim', 'selesai'] } },
        select: { total: true },
      },
    },
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
          Kelola User
        </h1>
        <p style={{ color: '#a8a69f', fontSize: '11px', lineHeight: 1.7 }}>
          {users.length} user terdaftar (read-only).
        </p>
      </div>

      <div style={{ border: '1px dotted rgba(212,210,203,0.2)', borderRadius: '4px', overflow: 'auto' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 90px 80px 130px 130px 90px',
          padding: '12px 20px',
          borderBottom: '1px dotted rgba(212,210,203,0.2)',
          background: 'rgba(212,210,203,0.03)',
          gap: '14px', minWidth: '980px',
        }}>
          {['Nama', 'Email', 'Role', 'Pesanan', 'Total Spent', 'Bergabung', 'Aksi'].map((h, i) => (
            <p key={i} style={{
              fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase',
              color: '#a8a69f',
            }}>
              {h}
            </p>
          ))}
        </div>

        {users.length === 0 && (
          <div style={{ padding: '48px 20px', textAlign: 'center', minWidth: '980px' }}>
            <p style={{ fontSize: '11px', color: '#a8a69f', letterSpacing: '0.05em' }}>
              Belum ada data pelanggan.
            </p>
          </div>
        )}

        {users.map((u, i) => {
          const totalSpent = u.orders.reduce((s, o) => s + o.total, 0)
          const isAdmin = u.role === 'admin'
          return (
            <div key={u.id} style={{
              display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 90px 80px 130px 130px 90px',
              padding: '14px 20px', alignItems: 'center', gap: '14px',
              borderTop: i > 0 ? '1px dotted rgba(212,210,203,0.1)' : 'none',
              minWidth: '980px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'rgba(212,210,203,0.08)',
                  border: '1px dotted rgba(212,210,203,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', fontWeight: '700', color: '#d4d2cb',
                  flexShrink: 0,
                }}>
                  {(u.name?.[0] ?? u.email[0]).toUpperCase()}
                </div>
                <p style={{
                  fontSize: '11px', fontWeight: '700', color: '#d4d2cb',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {u.name ?? '—'}
                </p>
              </div>
              <p style={{
                fontSize: '10px', color: '#a8a69f',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {u.email}
              </p>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                padding: '3px 10px', borderRadius: '100px',
                border: `1px dotted ${isAdmin ? 'rgba(134,239,172,0.5)' : 'rgba(212,210,203,0.25)'}`,
                color: isAdmin ? '#86efac' : '#a8a69f',
                fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase',
                width: 'fit-content',
              }}>
                {isAdmin && <Shield size={10} />}
                {u.role}
              </span>
              <p style={{ fontSize: '11px', fontWeight: '700', color: '#d4d2cb' }}>
                {u._count.orders}
              </p>
              <p style={{ fontSize: '11px', color: '#d4d2cb' }}>
                {formatRupiah(totalSpent)}
              </p>
              <p style={{ fontSize: '10px', color: '#a8a69f' }}>
                {new Date(u.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })}
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <DeleteUserButton
                  id={u.id}
                  name={u.name ?? u.email}
                  isSelf={u.id === currentUserId}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
