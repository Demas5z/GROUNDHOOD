'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, Loader2, MailCheck } from 'lucide-react'
import { verifyEmailAction, resendVerificationAction } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Status = 'loading' | 'success' | 'error'

function VerifyInner() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const ranRef = useRef(false)

  const [status, setStatus] = useState<Status>('loading')
  const [message, setMessage] = useState('Memverifikasi email kamu...')

  const [email, setEmail] = useState('')
  const [resendMsg, setResendMsg] = useState<string | null>(null)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    if (ranRef.current) return
    ranRef.current = true

    if (!token) {
      setStatus('error')
      setMessage('Link verifikasi tidak lengkap atau tidak valid.')
      return
    }
    verifyEmailAction(token).then(res => {
      if (res.error) {
        setStatus('error')
        setMessage(res.error)
      } else {
        setStatus('success')
        setMessage(res.success ?? 'Email berhasil diverifikasi!')
      }
    })
  }, [token])

  async function onResend(e: React.FormEvent) {
    e.preventDefault()
    setResendMsg(null)
    setResending(true)
    const res = await resendVerificationAction(email)
    setResending(false)
    setResendMsg(res.error ?? res.success ?? 'Selesai.')
  }

  const icon =
    status === 'loading' ? <Loader2 size={44} className="animate-spin" style={{ color: '#a8a69f' }} /> :
    status === 'success' ? <CheckCircle2 size={44} style={{ color: '#86efac' }} /> :
    <AlertCircle size={44} style={{ color: '#f87171' }} />

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%', maxWidth: '440px', textAlign: 'center',
          padding: '40px 32px',
          border: '1px dotted rgba(212,210,203,0.3)', borderRadius: '24px',
          background: 'rgba(212,210,203,0.03)',
        }}
      >
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>{icon}</div>

        <p style={{
          fontWeight: '700', fontSize: '13px', textTransform: 'uppercase',
          letterSpacing: '0.1em', color: '#d4d2cb', marginBottom: '10px',
        }}>
          {status === 'loading' ? 'Verifikasi' : status === 'success' ? 'Berhasil' : 'Gagal'}
        </p>
        <p style={{ color: '#a8a69f', fontSize: '12px', lineHeight: 1.7, marginBottom: '28px' }}>
          {message}
        </p>

        {status === 'success' && (
          <Link href="/login">
            <Button variant="default" size="lg" className="w-full">Lanjut ke Login</Button>
          </Link>
        )}

        {status === 'error' && (
          <form onSubmit={onResend} style={{ textAlign: 'left' }}>
            <p style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: '11px', color: '#a8a69f', marginBottom: '12px',
            }}>
              <MailCheck size={13} /> Kirim ulang link verifikasi
            </p>
            <Label htmlFor="email" style={{ display: 'block', marginBottom: '8px' }}>Email</Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ marginBottom: '12px' }}
            />
            <Button type="submit" disabled={resending} variant="default" size="lg" className="w-full">
              {resending ? 'Mengirim...' : 'Kirim Ulang Link'}
            </Button>
            {resendMsg && (
              <p style={{ color: '#a8a69f', fontSize: '11px', marginTop: '12px', textAlign: 'center' }}>
                {resendMsg}
              </p>
            )}
            <p style={{ textAlign: 'center', marginTop: '16px' }}>
              <Link href="/login" className="text-label" style={{ textDecoration: 'underline', fontSize: '10px' }}>
                Kembali ke Login
              </Link>
            </p>
          </form>
        )}
      </motion.div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyInner />
    </Suspense>
  )
}
