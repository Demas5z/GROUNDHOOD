'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { updateOrderStatusAction } from '@/actions/admin/orders'
import {
  ORDER_STATUSES, STATUS_LABEL, STATUS_COLOR, type OrderStatus,
} from '@/lib/order-status'

export default function StatusUpdater({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: OrderStatus
}) {
  const router = useRouter()
  const [selected, setSelected] = useState<OrderStatus>(currentStatus)
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (selected === currentStatus) return
    setFeedback(null)
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, selected)
      if (result.error) setFeedback({ type: 'error', message: result.error })
      else {
        setFeedback({ type: 'success', message: result.success ?? 'Tersimpan.' })
        router.refresh()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <p style={{
        fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase',
        color: '#a8a69f', marginBottom: '12px',
      }}>
        Ubah Status
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
        {ORDER_STATUSES.map(s => (
          <label
            key={s}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 14px',
              border: `1px dotted ${selected === s ? STATUS_COLOR[s] : 'rgba(212,210,203,0.2)'}`,
              borderRadius: '4px',
              background: selected === s ? `${STATUS_COLOR[s]}14` : 'transparent',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            <input
              type="radio"
              name="status"
              value={s}
              checked={selected === s}
              onChange={() => setSelected(s)}
              style={{ accentColor: STATUS_COLOR[s] }}
            />
            <span style={{
              fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase',
              color: selected === s ? STATUS_COLOR[s] : '#a8a69f',
              fontWeight: '700',
            }}>
              {STATUS_LABEL[s]}
            </span>
          </label>
        ))}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 14px', marginBottom: '16px', borderRadius: '4px',
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

      <button
        type="submit"
        disabled={isPending || selected === currentStatus}
        style={{
          width: '100%', padding: '12px',
          background: selected === currentStatus ? 'rgba(212,210,203,0.1)' : '#d4d2cb',
          color: selected === currentStatus ? '#a8a69f' : '#1a1a1a',
          border: 'none', borderRadius: '100px',
          fontSize: '10px', fontWeight: '700',
          letterSpacing: '0.15em', textTransform: 'uppercase',
          cursor: selected === currentStatus || isPending ? 'not-allowed' : 'pointer',
        }}
      >
        {isPending ? 'Menyimpan...' : 'Simpan Status'}
      </button>
    </form>
  )
}
