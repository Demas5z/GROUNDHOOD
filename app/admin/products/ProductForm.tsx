'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { createProductAction, updateProductAction } from '@/actions/admin/products'

type Category = { id: string; name: string }

type Props = {
  categories: Category[]
  initial?: {
    id: string
    name: string
    price: number
    stock: number
    description: string | null
    image: string | null
    categoryId: string
  }
}

export default function ProductForm({ categories, initial }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    price: initial?.price?.toString() ?? '',
    stock: initial?.stock?.toString() ?? '0',
    description: initial?.description ?? '',
    image: initial?.image ?? '',
    categoryId: initial?.categoryId ?? (categories[0]?.id ?? ''),
  })

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFeedback(null)
    const data = {
      name: form.name.trim(),
      price: parseInt(form.price, 10) || 0,
      stock: parseInt(form.stock, 10) || 0,
      description: form.description,
      image: form.image,
      categoryId: form.categoryId,
    }

    startTransition(async () => {
      if (initial) {
        const result = await updateProductAction(initial.id, data)
        if (result.error) setFeedback({ type: 'error', message: result.error })
        else {
          setFeedback({ type: 'success', message: result.success ?? 'Tersimpan.' })
          router.refresh()
        }
      } else {
        const result = await createProductAction(data)
        if (result?.error) setFeedback({ type: 'error', message: result.error })
      }
    })
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase',
    color: '#a8a69f', marginBottom: '8px', display: 'block',
  }
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 16px',
    background: 'rgba(212,210,203,0.04)',
    border: '1px dotted rgba(212,210,203,0.3)',
    borderRadius: '4px', color: '#d4d2cb',
    fontSize: '12px', fontFamily: 'inherit', outline: 'none',
    transition: 'border-color 0.2s',
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: '640px' }}>
      <div style={{ display: 'grid', gap: '20px', marginBottom: '24px' }}>
        <div>
          <label style={labelStyle}>Nama Produk *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            style={inputStyle}
            placeholder="Vintage Denim Jacket"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Harga (Rupiah) *</label>
            <input
              type="number"
              required
              min="0"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              style={inputStyle}
              placeholder="250000"
            />
          </div>
          <div>
            <label style={labelStyle}>Stok *</label>
            <input
              type="number"
              required
              min="0"
              value={form.stock}
              onChange={e => setForm({ ...form, stock: e.target.value })}
              style={inputStyle}
              placeholder="3"
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Kategori *</label>
          <select
            required
            value={form.categoryId}
            onChange={e => setForm({ ...form, categoryId: e.target.value })}
            style={inputStyle}
          >
            {categories.map(c => (
              <option key={c.id} value={c.id} style={{ background: '#1a1a1a' }}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>URL Gambar</label>
          <input
            type="url"
            value={form.image}
            onChange={e => setForm({ ...form, image: e.target.value })}
            style={inputStyle}
            placeholder="https://images.unsplash.com/..."
          />
          {form.image && (
            <img src={form.image} alt="" style={{
              marginTop: '12px', width: '120px', height: '120px',
              objectFit: 'cover', border: '1px dotted rgba(212,210,203,0.3)',
              borderRadius: '4px',
            }} />
          )}
        </div>

        <div>
          <label style={labelStyle}>Deskripsi</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            style={{ ...inputStyle, resize: 'vertical' }}
            placeholder="Deskripsi produk..."
          />
        </div>
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 16px', marginBottom: '20px', borderRadius: '4px',
              border: `1px dotted ${feedback.type === 'success' ? 'rgba(134,239,172,0.5)' : 'rgba(248,113,113,0.5)'}`,
              color: feedback.type === 'success' ? '#86efac' : '#f87171',
              fontSize: '11px',
            }}
          >
            {feedback.type === 'success' ? <CheckCircle size={13} /> : <AlertCircle size={13} />}
            {feedback.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          type="submit"
          disabled={isPending}
          style={{
            padding: '12px 28px',
            background: '#d4d2cb', color: '#1a1a1a',
            border: 'none', borderRadius: '100px',
            fontSize: '11px', fontWeight: '700',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            cursor: isPending ? 'not-allowed' : 'pointer',
            opacity: isPending ? 0.6 : 1,
          }}
        >
          {isPending ? 'Menyimpan...' : initial ? 'Update Produk' : 'Tambah Produk'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          style={{
            padding: '12px 28px',
            background: 'transparent', color: '#a8a69f',
            border: '1px dotted rgba(212,210,203,0.3)', borderRadius: '100px',
            fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Batal
        </button>
      </div>
    </form>
  )
}
