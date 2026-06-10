'use client'

import { Suspense, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { resetPasswordAction } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z
  .object({
    password: z
      .string()
      .min(8, 'Password minimal 8 karakter')
      .regex(/[A-Z]/, 'Harus mengandung huruf besar')
      .regex(/[0-9]/, 'Harus mengandung angka'),
    confirm: z.string(),
  })
  .refine(d => d.password === d.confirm, {
    message: 'Konfirmasi password tidak cocok',
    path: ['confirm'],
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

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  function onSubmit(values: FormValues) {
    if (!token) {
      setServerError('Token reset password tidak ditemukan. Silakan ulangi proses verifikasi.')
      return
    }
    setServerError(null)
    startTransition(async () => {
      const result = await resetPasswordAction({
        token,
        password: values.password,
      })
      if (result?.error) {
        setServerError(result.error)
        return
      }
      setSuccess(true)
      setTimeout(() => router.push('/login'), 2000)
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
          <Link href="/login" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            color: '#a8a69f', fontSize: '10px', letterSpacing: '0.15em',
            textTransform: 'uppercase', textDecoration: 'none', width: 'fit-content',
          }}>
            <ArrowLeft size={12} />
            Kembali ke Login
          </Link>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#86efac', marginBottom: '14px', textTransform: 'uppercase' }}>
              Langkah 2 / 2
            </p>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: '700',
              color: '#d4d2cb', lineHeight: 1.15, letterSpacing: '-0.025em',
              marginBottom: '18px', textTransform: 'uppercase',
            }}>
              Buat<br />Password<br />Baru.
            </h2>
            <p style={{ color: '#a8a69f', fontSize: '12px', lineHeight: 1.7, maxWidth: '380px' }}>
              Pastikan password Anda kuat dan mudah diingat. Minimal 8 karakter,
              mengandung huruf besar dan angka.
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
              <ShieldCheck size={18} color="#86efac" />
            </div>
            <h1 style={{
              fontSize: 'clamp(1.6rem, 2.8vw, 2rem)', fontWeight: '700',
              textTransform: 'uppercase', letterSpacing: '-0.025em',
              color: '#d4d2cb', marginBottom: '12px', lineHeight: 1.1,
            }}>
              Password Baru
            </h1>
            <p style={{ color: '#a8a69f', fontSize: '11px', lineHeight: 1.7, marginBottom: '32px' }}>
              Buat password baru untuk akun Anda. Setelah berhasil diubah,
              Anda dapat login menggunakan password yang baru.
            </p>
          </motion.div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '24px',
                border: '1px dotted rgba(134,239,172,0.5)', borderRadius: '14px',
                background: 'rgba(134,239,172,0.06)',
                display: 'flex', alignItems: 'flex-start', gap: '14px',
              }}
            >
              <CheckCircle2 size={20} color="#86efac" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p style={{
                  fontSize: '12px', color: '#86efac', fontWeight: '700',
                  letterSpacing: '0.05em', marginBottom: '6px',
                }}>
                  Password berhasil diubah!
                </p>
                <p style={{ fontSize: '11px', color: '#a8a69f', lineHeight: 1.6 }}>
                  Anda akan diarahkan ke halaman login...
                </p>
              </div>
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
                <Label htmlFor="password" style={{ display: 'block', marginBottom: '10px' }}>
                  Password Baru
                </Label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={13}
                    style={{
                      position: 'absolute', left: '18px', top: '50%',
                      transform: 'translateY(-50%)', color: '#a8a69f', pointerEvents: 'none',
                    }}
                  />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={errors.password ? 'border-red-500/60 focus:border-red-400' : ''}
                    style={{ paddingLeft: '44px', paddingRight: '48px' }}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '16px', top: '50%',
                      transform: 'translateY(-50%)', background: 'none',
                      border: 'none', cursor: 'pointer', color: '#a8a69f', padding: 0,
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
                {errors.password && (
                  <p style={{ color: '#f87171', fontSize: '10px', marginTop: '6px', letterSpacing: '0.05em' }}>
                    {errors.password.message}
                  </p>
                )}
              </motion.div>

              <motion.div custom={3} initial="hidden" animate="visible" variants={fadeInUp}>
                <Label htmlFor="confirm" style={{ display: 'block', marginBottom: '10px' }}>
                  Konfirmasi Password
                </Label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={13}
                    style={{
                      position: 'absolute', left: '18px', top: '50%',
                      transform: 'translateY(-50%)', color: '#a8a69f', pointerEvents: 'none',
                    }}
                  />
                  <Input
                    id="confirm"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={errors.confirm ? 'border-red-500/60 focus:border-red-400' : ''}
                    style={{ paddingLeft: '44px', paddingRight: '48px' }}
                    {...register('confirm')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={{
                      position: 'absolute', right: '16px', top: '50%',
                      transform: 'translateY(-50%)', background: 'none',
                      border: 'none', cursor: 'pointer', color: '#a8a69f', padding: 0,
                    }}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
                {errors.confirm && (
                  <p style={{ color: '#f87171', fontSize: '10px', marginTop: '6px', letterSpacing: '0.05em' }}>
                    {errors.confirm.message}
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
                  {isPending ? 'Menyimpan...' : 'Simpan Password Baru'}
                </Button>
              </motion.div>

              <motion.p
                custom={5} initial="hidden" animate="visible" variants={fadeInUp}
                style={{ textAlign: 'center', fontSize: '11px', color: '#a8a69f', letterSpacing: '0.03em' }}
              >
                <Link href="/login" style={{ color: '#d4d2cb', textDecoration: 'underline' }}>
                  Batalkan dan kembali ke Login
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

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}
