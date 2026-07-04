'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { loginAction } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import BrandLogo from '@/components/BrandLogo'
import type { WebAsset } from '@/lib/assets'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginValues = z.infer<typeof loginSchema>

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function LoginForm({ bg }: { bg: WebAsset }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams.get('registered')
  const callbackUrl = searchParams.get('callbackUrl') ?? undefined

  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  })

  function onSubmit(values: LoginValues) {
    setServerError(null)
    startTransition(async () => {
      // Server pre-check: friendly "email not verified" message + role-based redirect.
      const pre = await loginAction({ ...values, callbackUrl })
      if (pre?.error) {
        setServerError(pre.error)
        return
      }

      // Sign in client-side so the SessionProvider cache updates immediately —
      // the navbar reflects the logged-in state without a manual refresh.
      const res = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      })
      if (!res || res.error) {
        setServerError('Invalid email or password')
        return
      }

      router.push(pre.redirectTo ?? '/')
      router.refresh()
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
        {/* Background sourced from the asset_web table (key: login-bg) */}
        {bg.type === 'video' ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.28)',
            }}
          >
            <source src={bg.url} type={bg.mimeType ?? 'video/mp4'} />
          </video>
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${bg.url})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            filter: 'brightness(0.28)',
          }} />
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(160deg, rgba(26,26,26,0.7) 0%, transparent 60%, rgba(26,26,26,0.85) 100%)',
        }} />
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: '1px',
          background: 'repeating-linear-gradient(to bottom, rgba(212,210,203,0.3) 0, rgba(212,210,203,0.3) 4px, transparent 4px, transparent 10px)',
        }} />

        <div style={{
          position: 'relative', zIndex: 2, height: '100%',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', padding: '48px 44px',
        }}>
          <Link href="/" aria-label="GROUNDHOOD — Beranda" style={{ display: 'inline-flex' }}>
            <BrandLogo priority height={20} />
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <p className="text-label" style={{ marginBottom: '20px' }}>
              PREMIUM THRIFT ARCHIVE
            </p>
            <h2 style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.8rem)', fontWeight: '700',
              textTransform: 'uppercase', letterSpacing: '-0.025em',
              lineHeight: 0.95, color: '#d4d2cb', marginBottom: '28px',
            }}>
              UNLOCKED<br />THE VAULT
            </h2>
            <p style={{ color: '#a8a69f', lineHeight: '1.9', maxWidth: '260px', fontSize: '12px' }}>
              Masuk untuk akses koleksi thrift pilihan. Setiap item unik, setiap drop terbatas.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ display: 'flex', gap: '32px' }}
          >
            {[['10+', 'Produk Unik'], ['100+', 'Pelanggan'], ['2025', 'Est.']].map(([num, label]) => (
              <div key={label}>
                <p style={{ fontSize: '20px', fontWeight: '700', color: '#d4d2cb', letterSpacing: '-0.02em' }}>{num}</p>
                <p className="text-label">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ─── Right: Form Panel ─── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 40px', background: '#1a1a1a',
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <motion.div custom={0} initial="hidden" animate="visible" variants={fadeInUp}>
            <Link href="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              color: '#a8a69f', textDecoration: 'none',
              fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase',
              marginBottom: '52px', transition: 'color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#d4d2cb')}
              onMouseLeave={e => (e.currentTarget.style.color = '#a8a69f')}
            >
              <ArrowLeft size={12} />
              Back to Store
            </Link>
          </motion.div>

          <motion.div custom={1} initial="hidden" animate="visible" variants={fadeInUp}>
            <p className="text-label" style={{ marginBottom: '10px' }}>Login to Your Account</p>
            <h1 style={{
              fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: '700',
              textTransform: 'uppercase', letterSpacing: '-0.025em',
              color: '#d4d2cb', marginBottom: '40px', lineHeight: 1.05,
            }}>
              Welcome<br />Back.
            </h1>
          </motion.div>

          {registered && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '12px 16px', marginBottom: '20px',
                border: '1px dotted rgba(134,239,172,0.5)', borderRadius: '14px',
                color: '#86efac', fontSize: '11px', letterSpacing: '0.05em',
              }}
            >
              Account created! Please login.
            </motion.div>
          )}

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

            <motion.div custom={3} initial="hidden" animate="visible" variants={fadeInUp}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-label" style={{ textDecoration: 'underline', cursor: 'pointer', fontSize: '9px' }}>
                  Forgot password?
                </Link>
              </div>
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
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#d4d2cb')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#a8a69f')}
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

            <motion.div custom={4} initial="hidden" animate="visible" variants={fadeInUp}>
              <Button
                type="submit"
                disabled={isPending}
                variant="default"
                size="lg"
                className="w-full"
                style={{ marginTop: '4px' }}
              >
                {isPending ? 'Logging In...' : 'Login'}
              </Button>
            </motion.div>

            <motion.div
              custom={5} initial="hidden" animate="visible" variants={fadeInUp}
              style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
            >
              <div style={{ flex: 1, height: '1px', background: 'rgba(212,210,203,0.15)' }} />
              <span className="text-label" style={{ fontSize: '9px' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(212,210,203,0.15)' }} />
            </motion.div>

            <motion.p
              custom={6} initial="hidden" animate="visible" variants={fadeInUp}
              style={{ textAlign: 'center', fontSize: '11px', color: '#a8a69f', letterSpacing: '0.03em' }}
            >
              Belum punya akun?{' '}
              <Link href="/register" style={{ color: '#d4d2cb', textDecoration: 'underline' }}>
                Daftar sekarang
              </Link>
            </motion.p>
          </form>
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
