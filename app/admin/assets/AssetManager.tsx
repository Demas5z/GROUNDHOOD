'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit3, Trash2, Upload, X, Save } from 'lucide-react'
import {
  createAssetAction,
  updateAssetAction,
  deleteAssetAction,
  uploadAssetFileAction,
} from '@/actions/admin/assets'

type Asset = {
  id: string
  key: string
  name: string
  type: string
  url: string
  mimeType: string | null
  alt: string | null
  isActive: boolean
}

type FormState = {
  key: string
  name: string
  type: 'image' | 'video'
  url: string
  mimeType: string
  alt: string
  isActive: boolean
}

const EMPTY: FormState = {
  key: '', name: '', type: 'image', url: '', mimeType: '', alt: '', isActive: true,
}

export default function AssetManager({ initial }: { initial: Asset[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function resetForm() {
    setForm(EMPTY)
    setEditingId(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  function startEdit(a: Asset) {
    setError(null)
    setSuccess(null)
    setEditingId(a.id)
    setForm({
      key: a.key,
      name: a.name,
      type: a.type === 'video' ? 'video' : 'image',
      url: a.url,
      mimeType: a.mimeType ?? '',
      alt: a.alt ?? '',
      isActive: a.isActive,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setSuccess(null)
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await uploadAssetFileAction(fd)
      if (res.error) {
        setError(res.error)
      } else if (res.url) {
        setForm(f => ({
          ...f,
          url: res.url!,
          mimeType: res.mimeType ?? f.mimeType,
          type: res.mimeType?.startsWith('video/') ? 'video' : 'image',
        }))
        setSuccess('File terunggah. Jangan lupa simpan.')
      }
    } finally {
      setUploading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    const payload = {
      key: form.key.trim(),
      name: form.name.trim(),
      type: form.type,
      url: form.url.trim(),
      mimeType: form.mimeType.trim() || null,
      alt: form.alt.trim() || null,
      isActive: form.isActive,
    }
    startTransition(async () => {
      const res = editingId
        ? await updateAssetAction(editingId, payload)
        : await createAssetAction(payload)
      if (res.error) setError(res.error)
      else {
        setSuccess(res.success ?? 'Tersimpan.')
        resetForm()
        router.refresh()
      }
    })
  }

  function handleDelete(a: Asset) {
    if (!confirm(`Hapus aset "${a.key}"? File yang diunggah lewat panel juga akan dihapus.`)) return
    setError(null)
    setSuccess(null)
    startTransition(async () => {
      const res = await deleteAssetAction(a.id)
      if (res.error) setError(res.error)
      else {
        setSuccess(res.success ?? 'Aset dihapus.')
        if (editingId === a.id) resetForm()
        router.refresh()
      }
    })
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px',
    background: 'rgba(212,210,203,0.04)',
    border: '1px dotted rgba(212,210,203,0.3)',
    borderRadius: '4px', color: '#d4d2cb',
    fontSize: '12px', fontFamily: 'inherit', outline: 'none',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '9px', letterSpacing: '0.15em',
    textTransform: 'uppercase', color: '#a8a69f', marginBottom: '6px',
  }

  return (
    <div style={{ maxWidth: '960px' }}>
      {/* ─── Form ─── */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '24px', marginBottom: '28px',
          border: '1px dotted rgba(212,210,203,0.3)', borderRadius: '8px',
          background: 'rgba(212,210,203,0.02)',
        }}
      >
        <p style={{
          fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em',
          textTransform: 'uppercase', color: '#d4d2cb', marginBottom: '20px',
        }}>
          {editingId ? `Edit aset: ${form.key}` : 'Tambah aset baru'}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Key (unik)</label>
            <input
              type="text"
              value={form.key}
              onChange={e => setForm({ ...form, key: e.target.value })}
              placeholder="mis. hero-bg"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Nama</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="mis. Login page background"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Tipe</label>
            <select
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value as 'image' | 'video' })}
              style={inputStyle}
            >
              <option value="image">image</option>
              <option value="video">video</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>URL / Path</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={form.url}
              onChange={e => setForm({ ...form, url: e.target.value })}
              placeholder="/uploads/assets/… atau https://…"
              style={{ ...inputStyle, flex: 1, minWidth: '220px' }}
            />
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
              onChange={handleUpload}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              style={{
                padding: '0 18px', background: 'rgba(212,210,203,0.08)',
                color: '#d4d2cb', border: '1px dotted rgba(212,210,203,0.4)',
                borderRadius: '100px', fontSize: '10px', fontWeight: '700',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                cursor: uploading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
                opacity: uploading ? 0.6 : 1,
              }}
            >
              <Upload size={13} />
              {uploading ? 'Mengunggah...' : 'Upload'}
            </button>
          </div>
          <p style={{ fontSize: '9px', color: '#a8a69f', marginTop: '6px', letterSpacing: '0.04em' }}>
            Upload gambar/video (maks 45MB) lalu URL terisi otomatis, atau ketik path/URL manual.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>MIME type (opsional)</label>
            <input
              type="text"
              value={form.mimeType}
              onChange={e => setForm({ ...form, mimeType: e.target.value })}
              placeholder="mis. video/mp4"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Alt / deskripsi (opsional)</label>
            <input
              type="text"
              value={form.alt}
              onChange={e => setForm({ ...form, alt: e.target.value })}
              placeholder="teks alternatif"
              style={inputStyle}
            />
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px' }}>
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={e => setForm({ ...form, isActive: e.target.checked })}
          />
          <span style={{ fontSize: '11px', color: '#d4d2cb', letterSpacing: '0.04em' }}>
            Aktif (dipakai oleh website)
          </span>
        </label>

        {/* Live preview */}
        {form.url && (
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Preview</label>
            <AssetPreview type={form.type} url={form.url} alt={form.alt} />
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="submit"
            disabled={isPending}
            style={{
              padding: '0 22px', height: '38px', background: '#d4d2cb', color: '#1a1a1a',
              border: 'none', borderRadius: '100px',
              fontSize: '10px', fontWeight: '700',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              cursor: isPending ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              opacity: isPending ? 0.6 : 1,
            }}
          >
            {editingId ? <Save size={13} /> : <Plus size={13} />}
            {editingId ? 'Simpan Perubahan' : 'Tambah Aset'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              style={{
                padding: '0 18px', height: '38px', background: 'none', color: '#a8a69f',
                border: '1px dotted rgba(212,210,203,0.3)', borderRadius: '100px',
                fontSize: '10px', fontWeight: '700',
                letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              <X size={13} />
              Batal
            </button>
          )}
        </div>
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
      {success && (
        <div style={{
          padding: '10px 14px', marginBottom: '20px',
          border: '1px dotted rgba(134,239,172,0.5)', borderRadius: '4px',
          color: '#86efac', fontSize: '11px',
        }}>
          {success}
        </div>
      )}

      {/* ─── List ─── */}
      {initial.length === 0 ? (
        <p style={{ padding: '40px 20px', textAlign: 'center', fontSize: '11px', color: '#a8a69f' }}>
          Belum ada aset.
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {initial.map(a => (
            <div
              key={a.id}
              style={{
                border: '1px dotted rgba(212,210,203,0.25)', borderRadius: '8px',
                overflow: 'hidden', background: 'rgba(212,210,203,0.02)',
                opacity: a.isActive ? 1 : 0.55,
              }}
            >
              <AssetPreview type={a.type} url={a.url} alt={a.alt} />
              <div style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <p style={{ fontSize: '12px', fontWeight: '700', color: '#d4d2cb', letterSpacing: '0.04em' }}>
                    {a.key}
                  </p>
                  <span style={{
                    fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase',
                    padding: '2px 7px', borderRadius: '100px',
                    border: '1px dotted rgba(212,210,203,0.3)', color: '#a8a69f',
                  }}>
                    {a.type}
                  </span>
                  {!a.isActive && (
                    <span style={{
                      fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase',
                      padding: '2px 7px', borderRadius: '100px',
                      border: '1px dotted rgba(248,113,113,0.4)', color: '#f87171',
                    }}>
                      nonaktif
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '10px', color: '#a8a69f', marginBottom: '4px' }}>{a.name}</p>
                <p style={{
                  fontSize: '9px', color: '#7a7872', wordBreak: 'break-all', marginBottom: '12px',
                }}>
                  {a.url}
                </p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => startEdit(a)}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      padding: '7px', background: 'rgba(212,210,203,0.06)',
                      border: '1px dotted rgba(212,210,203,0.3)', borderRadius: '4px',
                      color: '#a8a69f', cursor: 'pointer', fontSize: '9px',
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                    }}
                  >
                    <Edit3 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(a)}
                    disabled={isPending}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '7px 10px', background: 'none',
                      border: '1px dotted rgba(248,113,113,0.4)', borderRadius: '4px',
                      color: '#f87171', cursor: isPending ? 'not-allowed' : 'pointer',
                    }}
                    title="Hapus aset"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AssetPreview({ type, url, alt }: { type: string; url: string; alt: string | null }) {
  return (
    <div style={{
      width: '100%', aspectRatio: '16 / 9', background: '#111',
      display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    }}>
      {type === 'video' ? (
        <video
          src={url}
          muted
          loop
          autoPlay
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={alt ?? ''}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
    </div>
  )
}
