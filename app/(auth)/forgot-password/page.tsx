'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, KeyRound, MailCheck } from 'lucide-react'
import { forgotPasswordAction } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  email: z.string().email('Format email tidak valid'),
})

type FormValues = z.infer<typeof schema>

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
}

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  function onSubmit(values: FormValues) {
    setServerError(null)
    startTransition(async () => {
      const result = await forgotPasswordAction(values)
      if (result?.error) {
        setServerError(result.error)
        return
      }
      setSuccessMsg(result?.success ?? 'Jika email terdaftar, link reset telah dikirim.')
    })
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '42% 58%', minHeight: '100vh' }}>
      {/* ─── Left: Brand Panel ─── */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="brand-panel"
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.28)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(160deg, rgba(26,26,26,0.7) 0%, transparent 60%, rgba(26,26,26,0.85) 100%)',
        }} />

        <div style={{ position: 'relative', height: '100%', padding: '40px 48px', display: 'flex', flexDirection: 'column' }}>
          <Link href="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            color: '#a8a69f', fontSize: '10px', letterSpacing: '0.15em',
            textTransform: 'uppercase', textDecoration: 'none', width: 'fit-content',
          }}>
            <ArrowLeft size={12} />
            Kembali ke Beranda
          </Link>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#86efac', marginBottom: '14px', textTransform: 'uppercase' }}>
              Pemulihan Akun
            </p>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: '700',
              color: '#d4d2cb', lineHeight: 1.15, letterSpacing: '-0.025em',
              marginBottom: '18px', textTransform: 'uppercase',
            }}>
              Lupa<br />Password?
            </h2>
            <p style={{ color: '#a8a69f', fontSize: '12px', lineHeight: 1.7, maxWidth: '380px' }}>
              Masukkan email yang terdaftar. Kami akan mengirim link aman
              ke email Anda untuk mengatur password baru.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ─── Right: Form ─── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px',
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <motion.div custom={1} initial="hidden" animate="visible" variants={fadeInUp}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'rgba(134,239,172,0.1)',
              border: '1px dotted rgba(134,239,172,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '20px',
            }}>
              <KeyRound size={18} color="#86efac" />
            </div>
            <h1 style={{
              fontSize: 'clamp(1.6rem, 2.8vw, 2rem)', fontWeight: '700',
              textTransform: 'uppercase', letterSpacing: '-0.025em',
              color: '#d4d2cb', marginBottom: '12px', lineHeight: 1.1,
            }}>
              Reset Password
            </h1>
            <p style={{ color: '#a8a69f', fontSize: '11px', lineHeight: 1.7, marginBottom: '32px' }}>
              Masukkan email yang terdaftar. Jika ditemukan, kami akan mengirim
              link reset password ke email tersebut.
            </p>
          </motion.div>

          {successMsg ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                padding: '32px 28px', textAlign: 'center',
                border: '1px dotted rgba(134,239,172,0.4)', borderRadius: '20px',
              }}
            >
              <MailCheck size={36} style={{ color: '#86efac', margin: '0 auto 16px' }} />
              <p style={{
                fontWeight: '700', fontSize: '12px', textTransform: 'uppercase',
                letterSpacing: '0.1em', color: '#d4d2cb', marginBottom: '10px',
              }}>
                Cek Email Kamu
              </p>
              <p style={{ color: '#a8a69f', fontSize: '11px', lineHeight: 1.7, marginBottom: '20px' }}>
                {successMsg} Buka inbox (cek juga folder spam) dan klik link untuk
                mengatur password baru. Link berlaku 1 jam.
              </p>
              <Link href="/login" className="text-label" style={{ textDecoration: 'underline', fontSize: '10px' }}>
                Kembali ke Login
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: '12px 16px',
                    border: '1px dotted rgba(248,113,113,0.5)', borderRadius: '14px',
                    color: '#f87171', fontSize: '11px', letterSpacing: '0.05em',
                  }}
                >
                  {serverError}
                </motion.div>
              )}

              <motion.div custom={2} initial="hidden" animate="visible" variants={fadeInUp}>
                <Label htmlFor="email" style={{ display: 'block', marginBottom: '10px' }}>
                  Email Address
                </Label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={13}
                    style={{
                      position: 'absolute', left: '18px', top: '50%',
                      transform: 'translateY(-50%)', color: '#a8a69f', pointerEvents: 'none',
                    }}
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className={errors.email ? 'border-red-500/60 focus:border-red-400' : ''}
                    style={{ paddingLeft: '44px' }}
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p style={{ color: '#f87171', fontSize: '10px', marginTop: '6px', letterSpacing: '0.05em' }}>
                    {errors.email.message}
                  </p>
                )}
              </motion.div>

              <motion.div custom={4} initial="hidden" animate="visible" variants={fadeInUp}>
                <Button
                  type="submit"
                  disabled={isPending}
                  variant="default"
                  size="lg"
                  className="w-full"
                  style={{ marginTop: '4px' }}
                >
                  {isPending ? 'Mengirim...' : 'Kirim Link Reset'}
                </Button>
              </motion.div>

              <motion.p
                custom={5} initial="hidden" animate="visible" variants={fadeInUp}
                style={{ textAlign: 'center', fontSize: '11px', color: '#a8a69f', letterSpacing: '0.03em' }}
              >
                Ingat password?{' '}
                <Link href="/login" style={{ color: '#d4d2cb', textDecoration: 'underline' }}>
                  Kembali ke Login
                </Link>
              </motion.p>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .brand-panel { display: none !important; }
          [style*="gridTemplateColumns"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
