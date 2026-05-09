'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Phone, MapPin, CheckCircle, AlertCircle } from 'lucide-react'
import { updateProfileAction } from '@/actions/user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  address: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

type Props = {
  defaultValues: FormValues
}

export default function ProfileForm({ defaultValues }: Props) {
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  function onSubmit(values: FormValues) {
    setFeedback(null)
    startTransition(async () => {
      const result = await updateProfileAction(values)
      if (result.error) setFeedback({ type: 'error', message: result.error })
      else setFeedback({ type: 'success', message: result.success ?? 'Profile updated.' })
    })
  }

  const fields = [
    { id: 'name', label: 'Full Name', icon: User, placeholder: 'John Doe', type: 'text', key: 'name' as const },
    { id: 'phone', label: 'Phone Number', icon: Phone, placeholder: '+62 812 3456 7890', type: 'tel', key: 'phone' as const },
    { id: 'address', label: 'Address', icon: MapPin, placeholder: 'Jl. Sudirman No. 1, Jakarta', type: 'text', key: 'address' as const },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '480px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
        {fields.map(({ id, label, icon: Icon, placeholder, type, key }) => (
          <div key={id}>
            <Label htmlFor={id} style={{ display: 'block', marginBottom: '10px' }}>
              {label}
            </Label>
            <div style={{ position: 'relative' }}>
              <Icon
                size={13}
                style={{
                  position: 'absolute', left: '18px', top: '50%',
                  transform: 'translateY(-50%)', color: '#a8a69f', pointerEvents: 'none',
                }}
              />
              <Input
                id={id}
                type={type}
                placeholder={placeholder}
                style={{ paddingLeft: '44px' }}
                className={errors[key] ? 'border-red-500/60' : ''}
                {...register(key)}
              />
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

      <Button
        type="submit"
        disabled={isPending || !isDirty}
        variant="default"
        size="lg"
      >
        {isPending ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  )
}
