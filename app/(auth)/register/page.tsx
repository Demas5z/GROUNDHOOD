'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { registerAction } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'At least 8 characters')
      .regex(/[A-Z]/, 'Include at least one uppercase letter')
      .regex(/[0-9]/, 'Include at least one number'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type RegisterValues = z.infer<typeof registerSchema>

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const passwordRules = [
  { label: 'Min. 8 characters', test: (v: string) => v.length >= 8 },
  { label: '1 uppercase letter', test: (v: string) => /[A-Z]/.test(v) },
  { label: '1 number', test: (v: string) => /[0-9]/.test(v) },
]

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  })

  const passwordValue = watch('password', '')

  function onSubmit(values: RegisterValues) {
    setServerError(null)
    startTransition(async () => {
      const result = await registerAction({
        name: values.name,
        email: values.email,
        password: values.password,
      })
      if (result?.error) {
        setServerError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => router.push('/login?registered=true'), 1800)
      }
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
          backgroundImage: 'url(https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&q=80)',
          backgroundSize: 'cover', backgroundPosition: 'center 30%',
          filter: 'brightness(0.25)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(160deg, rgba(26,26,26,0.75) 0%, transparent 55%, rgba(26,26,26,0.9) 100%)',
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
          <Link href="/" style={{
            fontSize: '17px', fontWeight: '700', letterSpacing: '0.15em',
            textTransform: 'uppercase', color: '#d4d2cb', textDecoration: 'none',
          }}>
            GROUNDHOOD
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <p className="text-label" style={{ marginBottom: '20px' }}>Join the Movement</p>
            <h2 style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.8rem)', fontWeight: '700',
              textTransform: 'uppercase', letterSpacing: '-0.025em',
              lineHeight: 0.95, color: '#d4d2cb', marginBottom: '28px',
            }}>
              Join the<br />Collective.
            </h2>
            <p style={{ color: '#a8a69f', lineHeight: '1.9', maxWidth: '260px', fontSize: '12px' }}>
              Bergabung dengan komunitas thrift terpercaya. Dapatkan akses eksklusif ke drop terbaru.
            </p>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {[
              'Produk terseleksi & terjamin',
              'Drop notifikasi eksklusif',
              'Komunitas thrift Indonesia',
            ].map((v) => (
              <div key={v} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '4px', height: '4px', borderRadius: '50%', background: '#d4d2cb', flexShrink: 0,
                }} />
                <span style={{ fontSize: '11px', color: '#a8a69f', letterSpacing: '0.05em' }}>{v}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ─── Right: Form Panel ─── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 40px', background: '#1a1a1a',
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: '420px', padding: '20px 0' }}>
          {/* Back link */}
          <motion.div custom={0} initial="hidden" animate="visible" variants={fadeInUp}>
            <Link href="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              color: '#a8a69f', textDecoration: 'none',
              fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase',
              marginBottom: '48px', transition: 'color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#d4d2cb')}
              onMouseLeave={e => (e.currentTarget.style.color = '#a8a69f')}
            >
              <ArrowLeft size={12} />
              Back to Sign In
            </Link>
          </motion.div>

          {/* Heading */}
          <motion.div custom={1} initial="hidden" animate="visible" variants={fadeInUp}>
            <p className="text-label" style={{ marginBottom: '10px' }}>Create Your Account</p>
            <h1 style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: '700',
              textTransform: 'uppercase', letterSpacing: '-0.025em',
              color: '#d4d2cb', marginBottom: '36px', lineHeight: 1.05,
            }}>
              Join the<br />Collective.
            </h1>
          </motion.div>

          {/* Success state */}
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                padding: '40px 32px', border: '1px dotted rgba(134,239,172,0.4)',
                borderRadius: '24px', textAlign: 'center',
              }}
            >
              <CheckCircle2 size={40} style={{ color: '#86efac', margin: '0 auto 16px' }} />
              <p style={{ fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#d4d2cb', marginBottom: '8px' }}>
                Account Created!
              </p>
              <p style={{ color: '#a8a69f', fontSize: '11px' }}>Redirecting to sign in...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Server error */}
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

              {/* Name */}
              <motion.div custom={2} initial="hidden" animate="visible" variants={fadeInUp}>
                <Label htmlFor="name" style={{ display: 'block', marginBottom: '10px' }}>Full Name</Label>
                <div style={{ position: 'relative' }}>
                  <User size={13} style={{
                    position: 'absolute', left: '18px', top: '50%',
                    transform: 'translateY(-50%)', color: '#a8a69f', pointerEvents: 'none',
                  }} />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    className={errors.name ? 'border-red-500/60' : ''}
                    style={{ paddingLeft: '44px' }}
                    {...register('name')}
                  />
                </div>
                {errors.name && (
                  <p style={{ color: '#f87171', fontSize: '10px', marginTop: '6px', letterSpacing: '0.05em' }}>
                    {errors.name.message}
                  </p>
                )}
              </motion.div>

              {/* Email */}
              <motion.div custom={3} initial="hidden" animate="visible" variants={fadeInUp}>
                <Label htmlFor="email" style={{ display: 'block', marginBottom: '10px' }}>Email Address</Label>
                <div style={{ position: 'relative' }}>
                  <Mail size={13} style={{
                    position: 'absolute', left: '18px', top: '50%',
                    transform: 'translateY(-50%)', color: '#a8a69f', pointerEvents: 'none',
                  }} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className={errors.email ? 'border-red-500/60' : ''}
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

              {/* Password */}
              <motion.div custom={4} initial="hidden" animate="visible" variants={fadeInUp}>
                <Label htmlFor="password" style={{ display: 'block', marginBottom: '10px' }}>Password</Label>
                <div style={{ position: 'relative' }}>
                  <Lock size={13} style={{
                    position: 'absolute', left: '18px', top: '50%',
                    transform: 'translateY(-50%)', color: '#a8a69f', pointerEvents: 'none',
                  }} />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={errors.password ? 'border-red-500/60' : ''}
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
                    aria-label="Toggle password"
                  >
                    {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
                {/* Password strength indicators */}
                {passwordValue.length > 0 && (
                  <div style={{ marginTop: '10px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {passwordRules.map((rule) => (
                      <span key={rule.label} style={{
                        fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase',
                        color: rule.test(passwordValue) ? '#86efac' : '#a8a69f',
                        transition: 'color 0.2s',
                      }}>
                        {rule.test(passwordValue) ? '✓' : '○'} {rule.label}
                      </span>
                    ))}
                  </div>
                )}
                {errors.password && (
                  <p style={{ color: '#f87171', fontSize: '10px', marginTop: '6px', letterSpacing: '0.05em' }}>
                    {errors.password.message}
                  </p>
                )}
              </motion.div>

              {/* Confirm Password */}
              <motion.div custom={5} initial="hidden" animate="visible" variants={fadeInUp}>
                <Label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '10px' }}>
                  Confirm Password
                </Label>
                <div style={{ position: 'relative' }}>
                  <Lock size={13} style={{
                    position: 'absolute', left: '18px', top: '50%',
                    transform: 'translateY(-50%)', color: '#a8a69f', pointerEvents: 'none',
                  }} />
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={errors.confirmPassword ? 'border-red-500/60' : ''}
                    style={{ paddingLeft: '44px', paddingRight: '48px' }}
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={{
                      position: 'absolute', right: '16px', top: '50%',
                      transform: 'translateY(-50%)', background: 'none',
                      border: 'none', cursor: 'pointer', color: '#a8a69f', padding: 0,
                      transition: 'color 0.2s',
                    }}
                    aria-label="Toggle confirm password"
                  >
                    {showConfirm ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p style={{ color: '#f87171', fontSize: '10px', marginTop: '6px', letterSpacing: '0.05em' }}>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </motion.div>

              {/* Submit */}
              <motion.div custom={6} initial="hidden" animate="visible" variants={fadeInUp}>
                <Button
                  type="submit"
                  disabled={isPending}
                  variant="default"
                  size="lg"
                  className="w-full"
                  style={{ marginTop: '6px' }}
                >
                  {isPending ? 'Creating Account...' : 'Create Account'}
                </Button>
              </motion.div>

              {/* Login link */}
              <motion.p
                custom={7} initial="hidden" animate="visible" variants={fadeInUp}
                style={{ textAlign: 'center', fontSize: '11px', color: '#a8a69f', letterSpacing: '0.03em' }}
              >
                Sudah punya akun?{' '}
                <Link href="/login" style={{ color: '#d4d2cb', textDecoration: 'underline' }}>
                  Sign in
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
