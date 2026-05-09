'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit3, Trash2, Check, X } from 'lucide-react'
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from '@/actions/admin/categories'

type Category = {
  id: string
  name: string
  slug: string
  productCount: number
}

export default function CategoryManager({ initial }: { initial: Category[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [newName, setNewName] = useState('')
  const [editing, setEditing] = useState<{ id: string; name: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  function refresh() {
    router.refresh()
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setError(null)
    startTransition(async () => {
      const result = await createCategoryAction({ name: newName.trim() })
      if (result.error) setError(result.error)
      else {
        setNewName('')
        refresh()
      }
    })
  }

  function handleUpdate() {
    if (!editing) return
    setError(null)
    startTransition(async () => {
      const result = await updateCategoryAction(editing.id, { name: editing.name.trim() })
      if (result.error) setError(result.error)
      else {
        setEditing(null)
        refresh()
      }
    })
  }

  function handleDelete(id: string) {
    setError(null)
    startTransition(async () => {
      const result = await deleteCategoryAction(id)
      if (result.error) setError(result.error)
      else refresh()
    })
  }

  const inputStyle: React.CSSProperties = {
    flex: 1, padding: '11px 16px',
    background: 'rgba(212,210,203,0.04)',
    border: '1px dotted rgba(212,210,203,0.3)',
    borderRadius: '4px', color: '#d4d2cb',
    fontSize: '12px', fontFamily: 'inherit', outline: 'none',
  }

  return (
    <div style={{ maxWidth: '640px' }}>
      {/* Add new */}
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <input
          type="text"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="Nama kategori baru..."
          style={inputStyle}
        />
        <button
          type="submit"
          disabled={isPending || !newName.trim()}
          style={{
            padding: '0 22px', background: '#d4d2cb', color: '#1a1a1a',
            border: 'none', borderRadius: '100px',
            fontSize: '10px', fontWeight: '700',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            cursor: isPending ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            opacity: isPending || !newName.trim() ? 0.6 : 1,
          }}
        >
          <Plus size={13} />
          Tambah
        </button>
      </form>

      {error && (
        <div style={{
          padding: '10px 14px', marginBottom: '20px',
          border: '1px dotted rgba(248,113,113,0.5)', borderRadius: '4px',
          color: '#f87171', fontSize: '11px',
        }}>
          {error}
        </div>
      )}

      {/* List */}
      <div style={{ border: '1px dotted rgba(212,210,203,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
        {initial.length === 0 ? (
          <p style={{ padding: '40px 20px', textAlign: 'center', fontSize: '11px', color: '#a8a69f' }}>
            Belum ada kategori.
          </p>
        ) : (
          initial.map((c, i) => (
            <div key={c.id} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '14px 18px',
              borderTop: i > 0 ? '1px dotted rgba(212,210,203,0.1)' : 'none',
            }}>
              {editing?.id === c.id ? (
                <>
                  <input
                    type="text"
                    value={editing.name}
                    onChange={e => setEditing({ ...editing, name: e.target.value })}
                    style={{ ...inputStyle, padding: '8px 12px' }}
                    autoFocus
                  />
                  <button
                    onClick={handleUpdate}
                    disabled={isPending}
                    style={{
                      background: 'rgba(134,239,172,0.15)', border: '1px dotted rgba(134,239,172,0.4)',
                      borderRadius: '4px', padding: '6px 8px', cursor: 'pointer',
                      color: '#86efac',
                    }}
                  >
                    <Check size={13} />
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    style={{
                      background: 'none', border: '1px dotted rgba(212,210,203,0.3)',
                      borderRadius: '4px', padding: '6px 8px', cursor: 'pointer',
                      color: '#a8a69f',
                    }}
                  >
                    <X size={13} />
                  </button>
                </>
              ) : (
                <>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: '12px', fontWeight: '700', color: '#d4d2cb',
                      letterSpacing: '0.04em', marginBottom: '2px',
                    }}>
                      {c.name}
                    </p>
                    <p style={{ fontSize: '9px', color: '#a8a69f', letterSpacing: '0.05em' }}>
                      {c.slug} · {c.productCount} produk
                    </p>
                  </div>
                  <button
                    onClick={() => setEditing({ id: c.id, name: c.name })}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#a8a69f', padding: '4px',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#d4d2cb')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#a8a69f')}
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    disabled={c.productCount > 0}
                    title={c.productCount > 0 ? 'Tidak bisa dihapus, masih ada produk' : 'Hapus'}
                    style={{
                      background: 'none', border: 'none',
                      cursor: c.productCount > 0 ? 'not-allowed' : 'pointer',
                      color: c.productCount > 0 ? 'rgba(168,166,159,0.4)' : '#a8a69f',
                      padding: '4px',
                    }}
                    onMouseEnter={e => { if (c.productCount === 0) e.currentTarget.style.color = '#f87171' }}
                    onMouseLeave={e => { if (c.productCount === 0) e.currentTarget.style.color = '#a8a69f' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
