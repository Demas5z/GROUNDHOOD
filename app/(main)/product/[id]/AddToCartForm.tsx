'use client'

import { useState, useTransition } from 'react'
import { Minus, Plus, ShoppingBag, CheckCircle, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { addToCartAction } from '@/actions/cart'

type Props = {
  productId: string
  stock: number
}

export default function AddToCartForm({ productId, stock }: Props) {
  const [quantity, setQuantity] = useState(1)
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const soldOut = stock === 0
  const max = Math.max(1, stock)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (soldOut) return
    setFeedback(null)
    startTransition(async () => {
      const result = await addToCartAction({ productId, quantity })
      if (result.error) setFeedback({ type: 'error', message: result.error })
      else if (result.success) setFeedback({ type: 'success', message: result.success })
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Quantity selector */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{
          fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase',
          color: '#a8a69f', marginBottom: '12px',
        }}>
          Jumlah
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            border: '1px dotted rgba(212,210,203,0.4)',
            borderRadius: '50px', overflow: 'hidden',
          }}>
            <button
              type="button"
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={soldOut || quantity <= 1}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#d4d2cb', padding: '12px 16px',
                opacity: soldOut || quantity <= 1 ? 0.4 : 1,
              }}
              aria-label="Kurangi jumlah"
            >
              <Minus size={13} />
            </button>
            <span style={{
              minWidth: '36px', textAlign: 'center',
              fontSize: '13px', fontWeight: 700, color: '#d4d2cb',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(q => Math.min(max, q + 1))}
              disabled={soldOut || quantity >= max}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#d4d2cb', padding: '12px 16px',
                opacity: soldOut || quantity >= max ? 0.4 : 1,
              }}
              aria-label="Tambah jumlah"
            >
              <Plus size={13} />
            </button>
          </div>
          {!soldOut && (
            <p style={{ fontSize: '10px', color: '#a8a69f', letterSpacing: '0.05em' }}>
              {stock} tersedia
            </p>
          )}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={soldOut || isPending}
        style={{
          width: '100%',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          padding: '16px 32px',
          background: soldOut ? 'rgba(212,210,203,0.08)' : '#d4d2cb',
          color: soldOut ? '#a8a69f' : '#1a1a1a',
          border: `1px solid ${soldOut ? 'rgba(212,210,203,0.2)' : '#d4d2cb'}`,
          borderRadius: '50px',
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em',
          textTransform: 'uppercase',
          cursor: soldOut || isPending ? 'not-allowed' : 'pointer',
          opacity: isPending ? 0.6 : 1,
          transition: 'all 0.2s',
        }}
      >
        <ShoppingBag size={14} />
        {soldOut ? 'Sold Out' : isPending ? 'Menambahkan...' : 'Tambah ke Keranjang'}
      </button>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 16px', marginTop: '14px', borderRadius: '14px',
              border: `1px dotted ${feedback.type === 'success' ? 'rgba(134,239,172,0.5)' : 'rgba(248,113,113,0.5)'}`,
              color: feedback.type === 'success' ? '#86efac' : '#f87171',
              fontSize: '11px', letterSpacing: '0.05em',
            }}
          >
            {feedback.type === 'success' ? <CheckCircle size={13} /> : <AlertCircle size={13} />}
            {feedback.message}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}
