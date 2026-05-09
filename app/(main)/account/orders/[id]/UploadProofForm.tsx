'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ImagePlus, AlertCircle, CheckCircle, Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { uploadPaymentProofAction } from '@/actions/payment'

type Props = {
  orderId: string
  defaultProofImage?: string | null
  defaultNotes?: string | null
}

export default function UploadProofForm({ orderId, defaultProofImage, defaultNotes }: Props) {
  const [proofImage, setProofImage] = useState(defaultProofImage ?? '')
  const [notes, setNotes] = useState(defaultNotes ?? '')
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const isValidUrl = /^https?:\/\/.+/i.test(proofImage.trim())

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFeedback(null)
    startTransition(async () => {
      const result = await uploadPaymentProofAction({
        orderId,
        proofImage: proofImage.trim(),
        notes: notes.trim() || undefined,
      })
      if (result.error) setFeedback({ type: 'error', message: result.error })
      else if (result.success) setFeedback({ type: 'success', message: result.success })
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div>
        <Label htmlFor="proofImage" style={{ display: 'block', marginBottom: '10px' }}>
          URL Bukti Pembayaran
        </Label>
        <div style={{ position: 'relative' }}>
          <ImagePlus size={13} style={{
            position: 'absolute', left: '18px', top: '50%',
            transform: 'translateY(-50%)', color: '#a8a69f', pointerEvents: 'none',
          }} />
          <Input
            id="proofImage"
            type="url"
            placeholder="https://imgur.com/..."
            value={proofImage}
            onChange={(e) => setProofImage(e.target.value)}
            style={{ paddingLeft: '44px' }}
            required
          />
        </div>
        <p style={{
          fontSize: '10px', color: '#a8a69f', lineHeight: 1.7,
          marginTop: '8px', letterSpacing: '0.02em',
        }}>
          Upload screenshot bukti transfer / QRIS ke layanan seperti Imgur,
          ImgBB, atau Google Drive (publik), lalu paste URL gambarnya di sini.
        </p>
      </div>

      {/* Preview */}
      {isValidUrl && (
        <div style={{
          padding: '12px',
          border: '1px dotted rgba(212,210,203,0.25)',
          borderRadius: '14px',
          background: 'rgba(212,210,203,0.02)',
        }}>
          <p style={{
            fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase',
            color: '#a8a69f', marginBottom: '10px',
          }}>
            Preview
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={proofImage}
            alt="Preview bukti"
            style={{
              width: '100%', maxWidth: '280px',
              borderRadius: '8px', display: 'block',
              border: '1px dotted rgba(212,210,203,0.2)',
            }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none'
            }}
          />
        </div>
      )}

      <div>
        <Label htmlFor="notes" style={{ display: 'block', marginBottom: '10px' }}>
          Catatan <span style={{ color: '#a8a69f', fontSize: '9px' }}>(opsional)</span>
        </Label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Contoh: Transfer dari BCA atas nama Andi Pratama"
          style={{
            borderRadius: '20px',
            paddingTop: '14px',
            paddingBottom: '14px',
            resize: 'vertical',
            fontFamily: 'inherit',
            lineHeight: 1.6,
          }}
        />
      </div>

      <button
        type="submit"
        disabled={isPending || !proofImage.trim()}
        className="upload-submit"
      >
        <Send size={13} />
        {isPending ? 'Mengirim...' : (defaultProofImage ? 'Update Bukti' : 'Kirim Bukti Pembayaran')}
      </button>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 16px', borderRadius: '14px',
              border: `1px dotted ${feedback.type === 'success' ? 'rgba(134,239,172,0.5)' : 'rgba(248,113,113,0.5)'}`,
              color: feedback.type === 'success' ? '#86efac' : '#f87171',
              fontSize: '11px', letterSpacing: '0.03em',
            }}
          >
            {feedback.type === 'success' ? <CheckCircle size={13} /> : <AlertCircle size={13} />}
            {feedback.message}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .upload-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 28px;
          background: #d4d2cb;
          color: #1a1a1a;
          border: 1px solid #d4d2cb;
          border-radius: 50px;
          font-family: inherit;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 350ms cubic-bezier(0.22, 1, 0.36, 1),
                      transform 450ms cubic-bezier(0.22, 1, 0.36, 1),
                      opacity 300ms ease;
        }
        .upload-submit:hover:not(:disabled) {
          background: #fff;
          transform: translateY(-2px);
        }
        .upload-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </form>
  )
}
