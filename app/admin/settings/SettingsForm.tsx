'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Upload, CreditCard, Store } from 'lucide-react'
import { updateSettingsAction } from '@/actions/admin/settings'
import { uploadAssetFileAction } from '@/actions/admin/assets'

type SettingItem = {
  key: string
  group: 'store' | 'payment'
  label: string
  type: 'text' | 'textarea' | 'image'
  value: string
  help?: string
}

const GROUP_META: Record<string, { title: string; icon: typeof Store; desc: string }> = {
  store: { title: 'Info Toko', icon: Store, desc: 'Tampil di halaman About & Contact.' },
  payment: { title: 'Info Pembayaran', icon: CreditCard, desc: 'Dipakai di instruksi pembayaran pesanan.' },
}

export default function SettingsForm({ initial }: { initial: SettingItem[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(initial.map((s) => [s.key, s.value])),
  )
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const groups = ['store', 'payment'] as const

  function setValue(key: string, value: string) {
    setValues((v) => ({ ...v, [key]: value }))
  }

  async function handleUpload(key: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setSuccess(null)
    setUploadingKey(key)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await uploadAssetFileAction(fd)
      if (res.error) setError(res.error)
      else if (res.url) {
        setValue(key, res.url)
        setSuccess('Gambar terunggah. Jangan lupa simpan.')
      }
    } finally {
      setUploadingKey(null)
      if (fileRefs.current[key]) fileRefs.current[key]!.value = ''
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    startTransition(async () => {
      const res = await updateSettingsAction(values)
      if (res.error) setError(res.error)
      else {
        setSuccess(res.success ?? 'Tersimpan.')
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
    <form onSubmit={handleSubmit} style={{ maxWidth: '760px' }}>
      {groups.map((group) => {
        const items = initial.filter((s) => s.group === group)
        if (items.length === 0) return null
        const Meta = GROUP_META[group]
        const Icon = Meta.icon
        return (
          <section
            key={group}
            style={{
              padding: '24px', marginBottom: '24px',
              border: '1px dotted rgba(212,210,203,0.3)', borderRadius: '8px',
              background: 'rgba(212,210,203,0.02)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <Icon size={15} color="#d4d2cb" />
              <p style={{
                fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em',
                textTransform: 'uppercase', color: '#d4d2cb',
              }}>
                {Meta.title}
              </p>
            </div>
            <p style={{ fontSize: '10px', color: '#a8a69f', marginBottom: '20px' }}>{Meta.desc}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {items.map((s) => (
                <div key={s.key}>
                  <label style={labelStyle}>{s.label}</label>

                  {s.type === 'textarea' ? (
                    <textarea
                      value={values[s.key] ?? ''}
                      onChange={(e) => setValue(s.key, e.target.value)}
                      rows={2}
                      style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                    />
                  ) : s.type === 'image' ? (
                    <div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <input
                          type="text"
                          value={values[s.key] ?? ''}
                          onChange={(e) => setValue(s.key, e.target.value)}
                          placeholder="/uploads/assets/… atau /QRIS.jpeg"
                          style={{ ...inputStyle, flex: 1, minWidth: '220px' }}
                        />
                        <input
                          ref={(el) => { fileRefs.current[s.key] = el }}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          onChange={(e) => handleUpload(s.key, e)}
                          style={{ display: 'none' }}
                        />
                        <button
                          type="button"
                          onClick={() => fileRefs.current[s.key]?.click()}
                          disabled={uploadingKey === s.key}
                          style={{
                            padding: '0 18px', background: 'rgba(212,210,203,0.08)',
                            color: '#d4d2cb', border: '1px dotted rgba(212,210,203,0.4)',
                            borderRadius: '100px', fontSize: '10px', fontWeight: '700',
                            letterSpacing: '0.12em', textTransform: 'uppercase',
                            cursor: uploadingKey === s.key ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px',
                            opacity: uploadingKey === s.key ? 0.6 : 1,
                          }}
                        >
                          <Upload size={13} />
                          {uploadingKey === s.key ? 'Mengunggah...' : 'Upload'}
                        </button>
                      </div>
                      {values[s.key] && (
                        <div style={{
                          marginTop: '10px', width: '120px', height: '120px',
                          border: '1px dotted rgba(212,210,203,0.3)', borderRadius: '6px',
                          overflow: 'hidden', background: '#fff',
                        }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={values[s.key]} alt={s.label}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                      )}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={values[s.key] ?? ''}
                      onChange={(e) => setValue(s.key, e.target.value)}
                      style={inputStyle}
                    />
                  )}

                  {s.help && (
                    <p style={{ fontSize: '9px', color: '#7a7872', marginTop: '6px', lineHeight: 1.6, letterSpacing: '0.03em' }}>
                      {s.help}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )
      })}

      {error && (
        <div style={{
          padding: '10px 14px', marginBottom: '16px',
          border: '1px dotted rgba(248,113,113,0.5)', borderRadius: '4px',
          color: '#f87171', fontSize: '11px',
        }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{
          padding: '10px 14px', marginBottom: '16px',
          border: '1px dotted rgba(134,239,172,0.5)', borderRadius: '4px',
          color: '#86efac', fontSize: '11px',
        }}>
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        style={{
          padding: '0 24px', height: '40px', background: '#d4d2cb', color: '#1a1a1a',
          border: 'none', borderRadius: '100px',
          fontSize: '10px', fontWeight: '700',
          letterSpacing: '0.15em', textTransform: 'uppercase',
          cursor: isPending ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px',
          opacity: isPending ? 0.6 : 1,
        }}
      >
        <Save size={14} />
        {isPending ? 'Menyimpan...' : 'Simpan Pengaturan'}
      </button>
    </form>
  )
}
