'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, AlertTriangle } from 'lucide-react'
import { deleteAccountAction } from '@/actions/user'

export default function DeleteAccountButton() {
  const [confirmed, setConfirmed] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteAccountAction()
      if (!result.error) router.push('/')
    })
  }

  if (!confirmed) {
    return (
      <button
        onClick={() => setConfirmed(true)}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '12px 24px', background: 'none',
          border: '1px dotted rgba(248,113,113,0.4)',
          borderRadius: '100px', cursor: 'pointer',
          fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase',
          color: '#f87171', transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(248,113,113,0.08)'
          e.currentTarget.style.borderColor = 'rgba(248,113,113,0.7)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'none'
          e.currentTarget.style.borderColor = 'rgba(248,113,113,0.4)'
        }}
      >
        <Trash2 size={13} />
        Delete Account
      </button>
    )
  }

  return (
    <div style={{
      padding: '20px 24px',
      border: '1px dotted rgba(248,113,113,0.4)',
      borderRadius: '4px',
      background: 'rgba(248,113,113,0.04)',
      maxWidth: '480px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <AlertTriangle size={14} color="#f87171" />
        <p style={{
          fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase',
          color: '#f87171',
        }}>
          Confirm Deletion
        </p>
      </div>
      <p style={{ fontSize: '11px', color: '#a8a69f', lineHeight: 1.7, marginBottom: '20px' }}>
        Aksi ini permanen dan tidak dapat dibatalkan. Semua data kamu termasuk riwayat pesanan akan dihapus.
      </p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={handleDelete}
          disabled={isPending}
          style={{
            padding: '10px 20px', background: 'rgba(248,113,113,0.15)',
            border: '1px dotted rgba(248,113,113,0.6)', borderRadius: '100px',
            fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase',
            color: '#f87171', cursor: isPending ? 'not-allowed' : 'pointer',
            opacity: isPending ? 0.6 : 1, transition: 'all 0.2s',
          }}
        >
          {isPending ? 'Deleting...' : 'Yes, Delete'}
        </button>
        <button
          onClick={() => setConfirmed(false)}
          style={{
            padding: '10px 20px', background: 'none',
            border: '1px dotted rgba(212,210,203,0.3)', borderRadius: '100px',
            fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase',
            color: '#a8a69f', cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#d4d2cb')}
          onMouseLeave={e => (e.currentTarget.style.color = '#a8a69f')}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
