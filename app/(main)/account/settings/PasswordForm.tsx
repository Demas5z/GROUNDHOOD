'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import { changePasswordAction } from '@/actions/user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'At least 8 characters')
      .regex(/[A-Z]/, 'Include at least one uppercase letter')
      .regex(/[0-9]/, 'Include at least one number'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

export default function PasswordForm() {
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [show, setShow] = useState({ current: false, new: false, confirm: false })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  function onSubmit(values: FormValues) {
    setFeedback(null)
    startTransition(async () => {
      const result = await changePasswordAction(values)
      if (result.error) {
        setFeedback({ type: 'error', message: result.error })
      } else {
        setFeedback({ type: 'success', message: result.success ?? 'Password changed.' })
        reset()
      }
    })
  }

  const fields = [
    { id: 'currentPassword', label: 'Current Password', key: 'currentPassword' as const, showKey: 'current' as const },
    { id: 'newPassword', label: 'New Password', key: 'newPassword' as const, showKey: 'new' as const },
    { id: 'confirmPassword', label: 'Confirm New Password', key: 'confirmPassword' as const, showKey: 'confirm' as const },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '480px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
        {fields.map(({ id, label, key, showKey }) => (
          <div key={id}>
            <Label htmlFor={id} style={{ display: 'block', marginBottom: '10px' }}>
              {label}
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
                id={id}
                type={show[showKey] ? 'text' : 'password'}
                placeholder="••••••••"
                style={{ paddingLeft: '44px', paddingRight: '48px' }}
                className={errors[key] ? 'border-red-500/60' : ''}
                {...register(key)}
              />
              <button
                type="button"
                onClick={() => setShow(s => ({ ...s, [showKey]: !s[showKey] }))}
                style={{
                  position: 'absolute', right: '16px', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', cursor: 'pointer', color: '#a8a69f', padding: 0,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#d4d2cb')}
                onMouseLeave={e => (e.currentTarget.style.color = '#a8a69f')}
                aria-label={show[showKey] ? 'Hide' : 'Show'}
              >
                {show[showKey] ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
            {errors[key] && (
              <p style={{ color: '#f87171', fontSize: '10px', marginTop: '6px', letterSpacing: '0.05em' }}>
                {errors[key]?.message}
              </p>
            )}
          </div>
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
              padding: '12px 16px', marginBottom: '20px', borderRadius: '14px',
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

      <Button type="submit" disabled={isPending} variant="default" size="lg">
        {isPending ? 'Updating...' : 'Update Password'}
      </Button>
    </form>
  )
}
