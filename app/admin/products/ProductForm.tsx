'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Upload, X } from 'lucide-react'
import { createProductAction, updateProductAction } from '@/actions/admin/products'
import { uploadProductImageAction } from '@/actions/admin/upload'
import { formatThousands, parseThousands } from '@/lib/order-status'

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
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
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

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFeedback(null)
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await uploadProductImageAction(fd)
    setUploading(false)
    if (res.error) {
      setFeedback({ type: 'error', message: res.error })
    } else if (res.url) {
      setForm(f => ({ ...f, image: res.url! }))
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
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
              type="text"
              inputMode="numeric"
              required
              value={formatThousands(form.price)}
              onChange={e => setForm({ ...form, price: parseThousands(e.target.value) })}
              style={inputStyle}
              placeholder="250.000"
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
          <label style={labelStyle}>Gambar Produk</label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={onFileChange}
            style={{ display: 'none' }}
          />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            {form.image ? (
              <div style={{ position: 'relative' }}>
                <img src={form.image} alt="" style={{
                  width: '120px', height: '120px',
                  objectFit: 'cover', border: '1px dotted rgba(212,210,203,0.3)',
                  borderRadius: '4px',
                }} />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, image: '' })}
                  title="Hapus gambar"
                  style={{
                    position: 'absolute', top: '-8px', right: '-8px',
                    width: '24px', height: '24px', borderRadius: '50%',
                    background: '#1a1a1a', border: '1px dotted rgba(248,113,113,0.6)',
                    color: '#f87171', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', padding: 0,
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{
                  width: '120px', height: '120px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', gap: '8px',
                  background: 'rgba(212,210,203,0.04)',
                  border: '1px dotted rgba(212,210,203,0.3)', borderRadius: '4px',
                  color: '#a8a69f', cursor: uploading ? 'wait' : 'pointer',
                  fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase',
                }}
              >
                <Upload size={18} />
                {uploading ? 'Mengunggah...' : 'Pilih File'}
              </button>
            )}

            <div style={{ flex: 1 }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{
                  padding: '9px 18px', background: 'transparent', color: '#d4d2cb',
                  border: '1px dotted rgba(212,210,203,0.3)', borderRadius: '100px',
                  fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase',
                  cursor: uploading ? 'wait' : 'pointer', marginBottom: '10px',
                }}
              >
                {form.image ? 'Ganti Gambar' : 'Upload dari Komputer'}
              </button>
              <p style={{ fontSize: '10px', color: '#75736d', lineHeight: 1.6, margin: '0 0 12px' }}>
                JPG, PNG, WEBP, atau GIF — maksimal 5MB.
              </p>
              <input
                type="text"
                value={form.image}
                onChange={e => setForm({ ...form, image: e.target.value })}
                style={{ ...inputStyle, padding: '8px 12px', fontSize: '11px' }}
                placeholder="atau tempel URL gambar di sini"
              />
            </div>
          </div>
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
