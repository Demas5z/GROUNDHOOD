'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Phone, MapPin, FileText,
  Building2, QrCode, AlertCircle, ArrowRight, Check,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createOrderAction } from '@/actions/checkout'
import { PAYMENT_METHODS, type PaymentMethod } from '@/lib/payment-config'

const schema = z.object({
  shippingName: z.string().min(2, 'Nama penerima minimal 2 karakter'),
  shippingPhone: z
    .string()
    .min(8, 'Nomor HP minimal 8 digit')
    .regex(/^[+0-9 ()-]+$/, 'Format nomor HP tidak valid'),
  shippingAddress: z.string().min(10, 'Alamat lengkap minimal 10 karakter'),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

type Props = {
  defaults: {
    shippingName: string
    shippingPhone: string
    shippingAddress: string
  }
}

export default function CheckoutForm({ defaults }: Props) {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transfer')
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      shippingName: defaults.shippingName,
      shippingPhone: defaults.shippingPhone,
      shippingAddress: defaults.shippingAddress,
      notes: '',
    },
  })

  function onSubmit(values: FormValues) {
    setServerError(null)
    startTransition(async () => {
      const result = await createOrderAction({ ...values, paymentMethod })
      if (result.error) {
        setServerError(result.error)
        return
      }
      if (result.orderId) {
        router.push(`/account/orders/${result.orderId}`)
      }
    })
  }

  const fields = [
    { id: 'shippingName',    icon: User,     label: 'Nama Penerima',  type: 'text', placeholder: 'John Doe',                 key: 'shippingName' as const },
    { id: 'shippingPhone',   icon: Phone,    label: 'Nomor HP',       type: 'tel',  placeholder: '+62 812 3456 7890',        key: 'shippingPhone' as const },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Shipping section */}
      <section>
        <p className="text-label" style={{ marginBottom: '16px' }}>1. Alamat Pengiriman</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {fields.map(({ id, icon: Icon, label, placeholder, type, key }) => (
            <div key={id}>
              <Label htmlFor={id} style={{ display: 'block', marginBottom: '10px' }}>
                {label}
              </Label>
              <div style={{ position: 'relative' }}>
                <Icon size={13} style={{
                  position: 'absolute', left: '18px', top: '50%',
                  transform: 'translateY(-50%)', color: '#a8a69f', pointerEvents: 'none',
                }} />
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

          {/* Address textarea */}
          <div>
            <Label htmlFor="shippingAddress" style={{ display: 'block', marginBottom: '10px' }}>
              Alamat Lengkap
            </Label>
            <div style={{ position: 'relative' }}>
              <MapPin size={13} style={{
                position: 'absolute', left: '18px', top: '18px',
                color: '#a8a69f', pointerEvents: 'none',
              }} />
              <textarea
                id="shippingAddress"
                placeholder="Jl. Sudirman No. 1, RT 01/RW 02, Kel. Gondangdia, Kec. Menteng, Jakarta Pusat 10350"
                rows={3}
                {...register('shippingAddress')}
                style={{
                  paddingLeft: '44px',
                  paddingTop: '14px',
                  borderRadius: '24px',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  lineHeight: 1.6,
                }}
                className={errors.shippingAddress ? 'border-red-500/60' : ''}
              />
            </div>
            {errors.shippingAddress && (
              <p style={{ color: '#f87171', fontSize: '10px', marginTop: '6px' }}>
                {errors.shippingAddress.message}
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes" style={{ display: 'block', marginBottom: '10px' }}>
              Catatan untuk Admin <span style={{ color: '#a8a69f', fontSize: '9px' }}>(opsional)</span>
            </Label>
            <div style={{ position: 'relative' }}>
              <FileText size={13} style={{
                position: 'absolute', left: '18px', top: '50%',
                transform: 'translateY(-50%)', color: '#a8a69f', pointerEvents: 'none',
              }} />
              <Input
                id="notes"
                type="text"
                placeholder="Mis. tolong dikemas extra rapih"
                style={{ paddingLeft: '44px' }}
                {...register('notes')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Payment method */}
      <section>
        <p className="text-label" style={{ marginBottom: '16px' }}>2. Metode Pembayaran</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {PAYMENT_METHODS.map(({ value, label, description }) => {
            const active = paymentMethod === value
            const Icon = value === 'transfer' ? Building2 : QrCode
            return (
              <button
                key={value}
                type="button"
                onClick={() => setPaymentMethod(value)}
                className={`payment-option${active ? ' active' : ''}`}
                aria-pressed={active}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Icon size={22} strokeWidth={1.5} />
                  <span className="payment-check" aria-hidden="true">
                    {active ? <Check size={13} strokeWidth={2.4} /> : null}
                  </span>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{
                    fontSize: '12px', fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: active ? '#d4d2cb' : '#d4d2cb',
                    marginBottom: '4px',
                  }}>
                    {label}
                  </p>
                  <p style={{
                    fontSize: '10px', color: '#a8a69f',
                    lineHeight: 1.6, letterSpacing: '0.02em',
                  }}>
                    {description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Server error */}
      <AnimatePresence>
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '14px 18px', borderRadius: '14px',
              border: '1px dotted rgba(248,113,113,0.5)',
              color: '#f87171', fontSize: '11px', letterSpacing: '0.03em',
            }}
          >
            <AlertCircle size={13} />
            {serverError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="checkout-submit"
      >
        {isPending ? 'Memproses pesanan...' : (
          <>
            Konfirmasi Pesanan
            <ArrowRight size={14} />
          </>
        )}
      </button>

      <p style={{
        fontSize: '10px', color: '#a8a69f', lineHeight: 1.7,
        letterSpacing: '0.03em', textAlign: 'center',
      }}>
        Dengan klik tombol di atas, kamu menyetujui untuk membuat pesanan dan akan diarahkan ke instruksi pembayaran.
      </p>

      <style>{`
        .payment-option {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 18px;
          padding: 22px 22px;
          min-height: 132px;
          background: rgba(212,210,203,0.02);
          border: 1px dotted rgba(212,210,203,0.3);
          border-radius: 18px;
          color: #d4d2cb;
          cursor: pointer;
          font-family: inherit;
          text-align: left;
          transition: background 350ms cubic-bezier(0.22, 1, 0.36, 1),
                      border-color 350ms cubic-bezier(0.22, 1, 0.36, 1),
                      transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .payment-option:hover {
          background: rgba(212,210,203,0.06);
          border-color: rgba(212,210,203,0.55);
          transform: translateY(-2px);
        }
        .payment-option.active {
          background: rgba(212,210,203,0.08);
          border-style: solid;
          border-color: #d4d2cb;
        }
        .payment-check {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 1px dotted rgba(212,210,203,0.4);
          color: #1a1a1a;
          background: transparent;
          transition: background 300ms ease, border-color 300ms ease;
        }
        .payment-option.active .payment-check {
          background: #d4d2cb;
          border-color: #d4d2cb;
          border-style: solid;
        }
        .checkout-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 18px 28px;
          background: #d4d2cb;
          color: #1a1a1a;
          border: 1px solid #d4d2cb;
          border-radius: 50px;
          font-family: inherit;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 350ms cubic-bezier(0.22, 1, 0.36, 1),
                      transform 450ms cubic-bezier(0.22, 1, 0.36, 1),
                      opacity 300ms ease;
        }
        .checkout-submit:hover:not(:disabled) {
          background: #fff;
          transform: translateY(-2px);
        }
        .checkout-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </form>
  )
}
