'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Phone, MapPin, FileText, Map, Building, Hash, Mailbox,
  Building2, QrCode, AlertCircle, ArrowRight, Check,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createOrderAction } from '@/actions/checkout'
import { PAYMENT_METHODS, type PaymentMethod } from '@/lib/payment-config'
import { PROVINCES, CITIES } from '@/lib/regions'
import { quoteShipping, type ShippingQuote } from '@/lib/shipping'

const schema = z.object({
  shippingName: z.string().min(2, 'Nama penerima minimal 2 karakter'),
  shippingPhone: z
    .string()
    .min(8, 'Nomor HP minimal 8 digit')
    .regex(/^[+0-9 ()-]+$/, 'Format nomor HP tidak valid'),
  provinceId: z.string().min(1, 'Provinsi wajib dipilih'),
  city: z.string().min(2, 'Kabupaten/Kota wajib dipilih'),
  district: z.string().min(2, 'Kecamatan wajib diisi'),
  postalCode: z.string().regex(/^\d{5}$/, 'Kode pos harus 5 digit angka'),
  addressDetail: z.string().min(10, 'Alamat lengkap minimal 10 karakter'),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

type Props = {
  subtotal: number
  defaults: {
    shippingName: string
    shippingPhone: string
    provinceId: string
    city: string
    district: string
    postalCode: string
    addressDetail: string
  }
  /** Reports the live ongkir quote to the parent so the summary can update. */
  onQuoteChange: (quote: ShippingQuote | null) => void
}

export default function CheckoutForm({ subtotal, defaults, onQuoteChange }: Props) {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transfer')
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const {
    register, handleSubmit, watch, setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      shippingName: defaults.shippingName,
      shippingPhone: defaults.shippingPhone,
      provinceId: defaults.provinceId,
      city: defaults.city,
      district: defaults.district,
      postalCode: defaults.postalCode,
      addressDetail: defaults.addressDetail,
      notes: '',
    },
  })

  const provinceId = watch('provinceId')
  const city = watch('city')

  const cityOptions = useMemo(
    () => (provinceId ? CITIES[provinceId] ?? [] : []),
    [provinceId],
  )

  // Recompute the live ongkir quote whenever the destination or subtotal changes.
  useEffect(() => {
    if (!provinceId || !city) {
      onQuoteChange(null)
      return
    }
    onQuoteChange(quoteShipping({ provinceId, cityName: city, subtotal }))
  }, [provinceId, city, subtotal, onQuoteChange])

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Shipping section */}
      <section>
        <p className="text-label" style={{ marginBottom: '16px' }}>1. Alamat Pengiriman</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Recipient name */}
          <Field
            id="shippingName" label="Nama Penerima" icon={User} error={errors.shippingName?.message}
          >
            <Input id="shippingName" type="text" placeholder="John Doe"
              style={{ paddingLeft: '44px' }}
              className={errors.shippingName ? 'border-red-500/60' : ''}
              {...register('shippingName')} />
          </Field>

          {/* Phone */}
          <Field
            id="shippingPhone" label="Nomor HP" icon={Phone} error={errors.shippingPhone?.message}
          >
            <Input id="shippingPhone" type="tel" placeholder="+62 812 3456 7890"
              style={{ paddingLeft: '44px' }}
              className={errors.shippingPhone ? 'border-red-500/60' : ''}
              {...register('shippingPhone')} />
          </Field>

          {/* Province + City (cascading) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="checkout-region">
            <Field id="provinceId" label="Provinsi" icon={Map} error={errors.provinceId?.message}>
              <select
                id="provinceId"
                className={`checkout-select${errors.provinceId ? ' border-red-500/60' : ''}`}
                {...register('provinceId', {
                  onChange: () => setValue('city', ''),
                })}
              >
                <option value="">Pilih provinsi…</option>
                {PROVINCES.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </Field>

            <Field id="city" label="Kabupaten / Kota" icon={Building} error={errors.city?.message}>
              <select
                id="city"
                disabled={!provinceId}
                className={`checkout-select${errors.city ? ' border-red-500/60' : ''}`}
                {...register('city')}
              >
                <option value="">
                  {provinceId ? 'Pilih kab/kota…' : 'Pilih provinsi dulu'}
                </option>
                {cityOptions.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* District + Postal code */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="checkout-region">
            <Field id="district" label="Kecamatan" icon={Hash} error={errors.district?.message}>
              <Input id="district" type="text" placeholder="Mis. Kebon Jeruk"
                style={{ paddingLeft: '44px' }}
                className={errors.district ? 'border-red-500/60' : ''}
                {...register('district')} />
            </Field>

            <Field id="postalCode" label="Kode Pos" icon={Mailbox} error={errors.postalCode?.message}>
              <Input id="postalCode" type="text" inputMode="numeric" maxLength={5} placeholder="11470"
                style={{ paddingLeft: '44px' }}
                className={errors.postalCode ? 'border-red-500/60' : ''}
                {...register('postalCode')} />
            </Field>
          </div>

          {/* Address detail */}
          <div>
            <Label htmlFor="addressDetail" style={{ display: 'block', marginBottom: '10px' }}>
              Alamat Lengkap
            </Label>
            <div style={{ position: 'relative' }}>
              <MapPin size={13} style={{
                position: 'absolute', left: '18px', top: '18px',
                color: '#a8a69f', pointerEvents: 'none',
              }} />
              <textarea
                id="addressDetail"
                placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, patokan…"
                rows={3}
                {...register('addressDetail')}
                style={{
                  paddingLeft: '44px', paddingTop: '14px',
                  borderRadius: '24px', resize: 'vertical',
                  fontFamily: 'inherit', lineHeight: 1.6,
                }}
                className={errors.addressDetail ? 'border-red-500/60' : ''}
              />
            </div>
            {errors.addressDetail && (
              <p style={{ color: '#f87171', fontSize: '10px', marginTop: '6px' }}>
                {errors.addressDetail.message}
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes" style={{ display: 'block', marginBottom: '10px' }}>
              Catatan Tambahan <span style={{ color: '#a8a69f', fontSize: '9px' }}>(opsional)</span>
            </Label>
            <div style={{ position: 'relative' }}>
              <FileText size={13} style={{
                position: 'absolute', left: '18px', top: '50%',
                transform: 'translateY(-50%)', color: '#a8a69f', pointerEvents: 'none',
              }} />
              <Input id="notes" type="text" placeholder="Mis. tolong dikemas extra rapih"
                style={{ paddingLeft: '44px' }} {...register('notes')} />
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
                    color: '#d4d2cb', marginBottom: '4px',
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
      <button type="submit" disabled={isPending} className="checkout-submit">
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
        .checkout-select {
          width: 100%;
          height: 48px;
          padding-left: 44px;
          padding-right: 16px;
          background: rgba(212,210,203,0.02);
          border: 1px solid rgba(212,210,203,0.25);
          border-radius: 50px;
          color: #d4d2cb;
          font-family: inherit;
          font-size: 13px;
          letter-spacing: 0.02em;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a8a69f' stroke-width='2'><polyline points='6 9 12 15 18 9'/></svg>");
          background-repeat: no-repeat;
          background-position: right 18px center;
          transition: border-color 300ms ease, background-color 300ms ease;
        }
        .checkout-select:focus {
          outline: none;
          border-color: rgba(212,210,203,0.6);
        }
        .checkout-select:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .checkout-select option {
          background: #1a1a1a;
          color: #d4d2cb;
        }
        @media (max-width: 520px) {
          .checkout-region { grid-template-columns: 1fr !important; }
        }
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

/** Labeled field wrapper with a leading icon. */
function Field({
  id, label, icon: Icon, error, children,
}: {
  id: string
  label: string
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <Label htmlFor={id} style={{ display: 'block', marginBottom: '10px' }}>
        {label}
      </Label>
      <div style={{ position: 'relative' }}>
        <Icon size={13} style={{
          position: 'absolute', left: '18px', top: '50%',
          transform: 'translateY(-50%)', color: '#a8a69f', pointerEvents: 'none',
        }} />
        {children}
      </div>
      {error && (
        <p style={{ color: '#f87171', fontSize: '10px', marginTop: '6px', letterSpacing: '0.05em' }}>
          {error}
        </p>
      )}
    </div>
  )
}
