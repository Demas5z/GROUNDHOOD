'use client'

import { useState } from 'react'
import { FileSpreadsheet, Download } from 'lucide-react'

export default function ExportControls() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [scope, setScope] = useState<'revenue' | 'all'>('revenue')
  const [busy, setBusy] = useState(false)

  function buildUrl() {
    const params = new URLSearchParams()
    if (from) params.set('from', from)
    if (to) params.set('to', to)
    params.set('scope', scope)
    return `/api/admin/reports/export?${params.toString()}`
  }

  async function handleDownload() {
    setBusy(true)
    try {
      const res = await fetch(buildUrl())
      if (!res.ok) {
        alert('Gagal mengunduh laporan.')
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const stamp = new Date().toISOString().slice(0, 10)
      a.download = `Laporan_GROUNDHOOD_${stamp}.xlsx`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } finally {
      setBusy(false)
    }
  }

  const inputStyle = {
    background: 'rgba(212,210,203,0.04)',
    border: '1px dotted rgba(212,210,203,0.3)',
    borderRadius: '4px',
    padding: '8px 12px',
    fontSize: '11px',
    color: '#d4d2cb',
    fontFamily: 'inherit',
    colorScheme: 'dark' as const,
  }
  const labelStyle = {
    fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase' as const,
    color: '#a8a69f', marginBottom: '6px', display: 'block',
  }

  return (
    <section style={{
      padding: '20px 22px',
      border: '1px dotted rgba(134,239,172,0.35)',
      background: 'rgba(134,239,172,0.04)',
      borderRadius: '4px',
      marginBottom: '32px',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        marginBottom: '16px',
      }}>
        <FileSpreadsheet size={14} color="#86efac" />
        <p style={{
          fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase',
          color: '#86efac', fontWeight: 700,
        }}>
          Export Laporan Excel
        </p>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '14px', marginBottom: '16px',
      }}>
        <div>
          <label style={labelStyle}>Dari Tanggal</label>
          <input
            type="date"
            value={from}
            onChange={e => setFrom(e.target.value)}
            style={{ ...inputStyle, width: '100%' }}
          />
        </div>
        <div>
          <label style={labelStyle}>Sampai Tanggal</label>
          <input
            type="date"
            value={to}
            onChange={e => setTo(e.target.value)}
            style={{ ...inputStyle, width: '100%' }}
          />
        </div>
        <div>
          <label style={labelStyle}>Cakupan</label>
          <select
            value={scope}
            onChange={e => setScope(e.target.value as 'revenue' | 'all')}
            style={{ ...inputStyle, width: '100%' }}
          >
            <option value="revenue">Pesanan Sukses Saja</option>
            <option value="all">Semua Pesanan</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={handleDownload}
          disabled={busy}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: '11px 22px',
            border: '1px dotted rgba(134,239,172,0.6)',
            background: 'rgba(134,239,172,0.1)',
            borderRadius: '100px',
            fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase',
            color: '#86efac', fontWeight: 700,
            cursor: busy ? 'wait' : 'pointer',
            opacity: busy ? 0.6 : 1,
          }}
        >
          <Download size={13} />
          {busy ? 'Menyiapkan...' : 'Download Excel'}
        </button>
        <p style={{ fontSize: '10px', color: '#a8a69f', letterSpacing: '0.04em' }}>
          Kosongkan tanggal untuk seluruh periode.
        </p>
      </div>
    </section>
  )
}
