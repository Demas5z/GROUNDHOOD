'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { deleteProductAction } from '@/actions/admin/products'

export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteProductAction(id)
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
        aria-label={`Hapus ${name}`}
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
        {isPending ? '...' : 'Hapus'}
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
