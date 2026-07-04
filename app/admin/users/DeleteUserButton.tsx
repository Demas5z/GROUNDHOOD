'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { deleteUserAction } from '@/actions/admin/users'

export default function DeleteUserButton({
  id,
  name,
  isSelf,
}: {
  id: string
  name: string
  isSelf: boolean
}) {
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // The current admin can't delete their own account.
  if (isSelf) {
    return (
      <span style={{ fontSize: '10px', color: '#75736d', letterSpacing: '0.05em' }}>
        —
      </span>
    )
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteUserAction(id)
      if (result.error) {
        alert(result.error)
        setConfirming(false)
      } else {
        router.refresh()
      }
    })
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#a8a69f', padding: '4px', transition: 'color 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
        onMouseLeave={e => (e.currentTarget.style.color = '#a8a69f')}
        aria-label={`Nonaktifkan ${name}`}
      >
        <Trash2 size={13} />
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
      <button
        onClick={handleDelete}
        disabled={isPending}
        style={{
          padding: '4px 10px',
          background: 'rgba(248,113,113,0.15)',
          border: '1px dotted rgba(248,113,113,0.6)', borderRadius: '100px',
          fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase',
          color: '#f87171', cursor: 'pointer',
        }}
      >
        {isPending ? '...' : 'Nonaktifkan'}
      </button>
      <button
        onClick={() => setConfirming(false)}
        style={{
          padding: '4px 10px',
          background: 'none',
          border: '1px dotted rgba(212,210,203,0.3)', borderRadius: '100px',
          fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase',
          color: '#a8a69f', cursor: 'pointer',
        }}
      >
        Batal
      </button>
    </div>
  )
}
