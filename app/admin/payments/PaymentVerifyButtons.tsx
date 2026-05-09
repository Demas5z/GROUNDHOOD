'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X } from 'lucide-react'
import { verifyPaymentAction } from '@/actions/admin/payments'

export default function PaymentVerifyButtons({ paymentId }: { paymentId: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [rejecting, setRejecting] = useState(false)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleApprove() {
    setError(null)
    startTransition(async () => {
      const result = await verifyPaymentAction(paymentId, 'approve')
      if (result.error) setError(result.error)
      else router.refresh()
    })
  }

  function handleReject() {
    setError(null)
    startTransition(async () => {
      const result = await verifyPaymentAction(paymentId, 'reject', notes.trim() || undefined)
      if (result.error) setError(result.error)
      else router.refresh()
    })
  }

  if (rejecting) {
    return (
      <div style={{
        padding: '16px', marginTop: '12px',
        border: '1px dotted rgba(248,113,113,0.4)',
        background: 'rgba(248,113,113,0.04)',
        borderRadius: '4px',
      }}>
        <p style={{
          fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase',
          color: '#f87171', marginBottom: '10px',
        }}>
          Catatan Penolakan
        </p>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={3}
          placeholder="Misal: Bukti transfer tidak jelas / nominal tidak sesuai..."
          style={{
            width: '100%', padding: '10px 14px',
            background: 'rgba(212,210,203,0.04)',
            border: '1px dotted rgba(212,210,203,0.3)',
            borderRadius: '4px', color: '#d4d2cb',
            fontSize: '11px', fontFamily: 'inherit',
            outline: 'none', resize: 'vertical', marginBottom: '12px',
          }}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleReject}
            disabled={isPending}
            style={{
              flex: 1, padding: '10px',
              background: 'rgba(248,113,113,0.15)',
              border: '1px dotted rgba(248,113,113,0.6)', borderRadius: '100px',
              fontSize: '10px', fontWeight: '700', letterSpacing: '0.12em',
              textTransform: 'uppercase', color: '#f87171',
              cursor: isPending ? 'not-allowed' : 'pointer',
            }}
          >
            {isPending ? '...' : 'Tolak Pembayaran'}
          </button>
          <button
            onClick={() => setRejecting(false)}
            style={{
              padding: '10px 18px',
              background: 'none',
              border: '1px dotted rgba(212,210,203,0.3)', borderRadius: '100px',
              fontSize: '10px', letterSpacing: '0.12em',
              textTransform: 'uppercase', color: '#a8a69f',
              cursor: 'pointer',
            }}
          >
            Batal
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {error && (
        <div style={{
          padding: '8px 12px', marginBottom: '10px',
          border: '1px dotted rgba(248,113,113,0.5)', borderRadius: '4px',
          color: '#f87171', fontSize: '10px',
        }}>
          {error}
        </div>
      )}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={handleApprove}
          disabled={isPending}
          style={{
            flex: 1, padding: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            background: 'rgba(134,239,172,0.15)',
            border: '1px dotted rgba(134,239,172,0.6)', borderRadius: '100px',
            fontSize: '10px', fontWeight: '700', letterSpacing: '0.12em',
            textTransform: 'uppercase', color: '#86efac',
            cursor: isPending ? 'not-allowed' : 'pointer',
            opacity: isPending ? 0.6 : 1,
          }}
        >
          <Check size={12} />
          {isPending ? '...' : 'Konfirmasi Valid'}
        </button>
        <button
          onClick={() => setRejecting(true)}
          disabled={isPending}
          style={{
            padding: '10px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            background: 'none',
            border: '1px dotted rgba(248,113,113,0.5)', borderRadius: '100px',
            fontSize: '10px', fontWeight: '700', letterSpacing: '0.12em',
            textTransform: 'uppercase', color: '#f87171',
            cursor: isPending ? 'not-allowed' : 'pointer',
          }}
        >
          <X size={12} />
          Tolak
        </button>
      </div>
    </div>
  )
}
