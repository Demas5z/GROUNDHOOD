import Link from 'next/link'
import Image from 'next/image'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, MapPin, Phone, User, Building2, QrCode, Receipt as ReceiptIcon, CheckCircle2, AlertCircle } from 'lucide-react'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import {
  STATUS_LABEL, STATUS_COLOR, PAYMENT_STATUS_LABEL, PAYMENT_STATUS_COLOR,
  formatRupiah, type OrderStatus,
} from '@/lib/order-status'
import { PAYMENT_METHOD_LABEL } from '@/lib/payment-config'
import { getPaymentSettings, type PaymentSettings } from '@/lib/settings'
import UploadProofForm from './UploadProofForm'

type Props = { params: Promise<{ id: string }> }

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params

  const session = await auth()
  if (!session?.user?.id) redirect(`/login?callbackUrl=/account/orders/${id}`)

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: { select: { id: true, image: true } } } },
      payment: true,
    },
  })
  if (!order) notFound()
  if (order.userId !== session.user.id) notFound()

  const payment = await getPaymentSettings()

  const status = order.status as OrderStatus
  const statusColor = STATUS_COLOR[status] ?? '#a8a69f'
  const paymentMethod = order.payment?.method ?? 'transfer'
  const showPaymentInstructions = order.status === 'menunggu_pembayaran' || order.status === 'menunggu_konfirmasi'
  const canUploadProof = order.status === 'menunggu_pembayaran' || order.status === 'menunggu_konfirmasi'

  // Stepper indices for status progression
  const trackingStatuses: OrderStatus[] = [
    'menunggu_pembayaran',
    'menunggu_konfirmasi',
    'diproses',
    'dikirim',
    'selesai',
  ]
  const cancelled = order.status === 'dibatalkan'
  const currentIdx = cancelled ? -1 : trackingStatuses.indexOf(status)
  // Admin rejected the uploaded proof. The reject action clears `proofImage`
  // (the file is deleted from disk), so the rejection notice can't live inside
  // the proof-preview block — surface it on its own here, with the reason.
  const paymentRejected = order.payment?.status === 'tidak_valid'

  return (
    <div>
      <Link
        href="/account/orders"
        className="order-back"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase',
          color: '#a8a69f', textDecoration: 'none',
          marginBottom: '24px',
        }}
      >
        <ArrowLeft size={13} />
        Kembali ke Riwayat Pesanan
      </Link>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '20px', marginBottom: '32px',
      }}>
        <div>
          <p className="text-label" style={{ marginBottom: '10px' }}>Pesanan</p>
          <h1 style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '-0.025em',
            color: '#d4d2cb', lineHeight: 1, marginBottom: '8px',
            fontFamily: 'monospace',
          }}>
            {order.orderNumber}
          </h1>
          <p style={{ color: '#a8a69f', fontSize: '11px' }}>
            {new Date(order.createdAt).toLocaleString('id-ID', {
              day: 'numeric', month: 'long', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>
        <span style={{
          padding: '8px 16px', borderRadius: '100px',
          border: `1px dotted ${statusColor}`,
          background: `${statusColor}1a`, color: statusColor,
          fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase',
          fontWeight: 700,
        }}>
          {STATUS_LABEL[status] ?? status}
        </span>
      </div>

      {/* Status tracker */}
      {!cancelled && (
        <section style={{ marginBottom: '36px' }}>
          <div className="status-track" style={{
            display: 'grid', gridTemplateColumns: `repeat(${trackingStatuses.length}, 1fr)`,
            gap: '8px', position: 'relative',
          }}>
            {trackingStatuses.map((s, i) => {
              const reached = i <= currentIdx
              const active = i === currentIdx
              return (
                <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '12px', height: '12px', borderRadius: '50%',
                    background: reached ? statusColor : 'rgba(212,210,203,0.15)',
                    border: active ? `2px solid ${statusColor}` : 'none',
                    boxShadow: active ? `0 0 0 4px ${statusColor}33` : 'none',
                    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                  }} />
                  <p style={{
                    fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: reached ? '#d4d2cb' : '#666',
                    textAlign: 'center', lineHeight: 1.3,
                  }}>
                    {STATUS_LABEL[s]}
                  </p>
                </div>
              )
            })}
            {/* Track line */}
            <div style={{
              position: 'absolute', top: '5px', left: '6%', right: '6%',
              height: '1px', background: 'rgba(212,210,203,0.15)', zIndex: -1,
            }} />
            <div style={{
              position: 'absolute', top: '5px', left: '6%',
              width: currentIdx >= 0 ? `${(currentIdx / (trackingStatuses.length - 1)) * 88}%` : '0%',
              height: '1px', background: statusColor,
              transition: 'width 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
              zIndex: -1,
            }} />
          </div>
        </section>
      )}

      {/* Payment rejected notice — shown whenever the admin marked the proof
          invalid, regardless of whether a proof file still exists. */}
      {paymentRejected && (
        <section style={{
          marginBottom: '32px',
          padding: '20px 24px',
          border: '1px dotted rgba(248,113,113,0.5)',
          borderRadius: '20px',
          background: 'rgba(248,113,113,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <AlertCircle size={16} color="#f87171" />
            <p style={{
              fontSize: '12px', fontWeight: 700, color: '#f87171',
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              Bukti Pembayaran Ditolak
            </p>
          </div>
          <p style={{
            fontSize: '11px', color: '#d4d2cb', lineHeight: 1.8,
            marginBottom: order.payment?.notes ? '14px' : 0,
          }}>
            Admin menolak bukti pembayaran yang kamu unggah. Silakan periksa alasannya
            lalu unggah ulang bukti yang sesuai melalui form di samping.
          </p>
          {order.payment?.notes && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(248,113,113,0.08)',
              border: '1px dotted rgba(248,113,113,0.3)',
              borderRadius: '12px',
            }}>
              <p style={{
                fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase',
                color: '#f87171', marginBottom: '6px',
              }}>
                Alasan Penolakan
              </p>
              <p style={{ fontSize: '11px', color: '#d4d2cb', lineHeight: 1.8 }}>
                {order.payment.notes}
              </p>
            </div>
          )}
        </section>
      )}

      <div className="order-grid" style={{
        display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px',
        gap: '40px', alignItems: 'flex-start',
      }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Items */}
          <section>
            <p className="text-label" style={{ marginBottom: '14px' }}>
              Items ({order.items.length})
            </p>
            <div style={{
              border: '1px dotted rgba(212,210,203,0.2)',
              borderRadius: '14px', overflow: 'hidden',
            }}>
              {order.items.map((item, i) => (
                <Link
                  key={item.id}
                  href={`/product/${item.productId}`}
                  className="order-item"
                  style={{
                    display: 'grid', gridTemplateColumns: '64px 1fr auto',
                    gap: '14px', padding: '16px 18px', alignItems: 'center',
                    borderTop: i > 0 ? '1px dotted rgba(212,210,203,0.1)' : 'none',
                    textDecoration: 'none',
                  }}
                >
                  <div style={{
                    position: 'relative', width: '64px', height: '78px',
                    borderRadius: '8px', overflow: 'hidden',
                    border: '1px dotted rgba(212,210,203,0.2)',
                    background: 'rgba(212,210,203,0.04)',
                  }}>
                    {item.product.image ? (
                      <Image
                        src={item.product.image}
                        alt={item.productName}
                        fill
                        sizes="64px"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : null}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{
                      fontSize: '12px', fontWeight: 700, color: '#d4d2cb',
                      letterSpacing: '0.04em', textTransform: 'uppercase',
                      marginBottom: '4px',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {item.productName}
                    </p>
                    <p style={{ fontSize: '10px', color: '#a8a69f' }}>
                      {item.quantity} × {formatRupiah(item.price)}
                    </p>
                  </div>
                  <p style={{
                    fontSize: '12px', fontWeight: 700, color: '#d4d2cb',
                    fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
                  }}>
                    {formatRupiah(item.price * item.quantity)}
                  </p>
                </Link>
              ))}

              {/* Totals breakdown */}
              <div style={{
                padding: '18px',
                borderTop: '1px dotted rgba(212,210,203,0.3)',
                background: 'rgba(212,210,203,0.04)',
                display: 'flex', flexDirection: 'column', gap: '10px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#a8a69f', letterSpacing: '0.05em' }}>Subtotal</span>
                  <span style={{ fontSize: '12px', color: '#d4d2cb', fontVariantNumeric: 'tabular-nums' }}>
                    {formatRupiah(order.subtotal)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#a8a69f', letterSpacing: '0.05em' }}>
                    Pengiriman{order.shippingDistanceKm ? ` (± ${order.shippingDistanceKm} km)` : ''}
                  </span>
                  <span style={{
                    fontSize: '12px',
                    color: order.shippingCost === 0 ? '#86efac' : '#d4d2cb',
                    fontWeight: order.shippingCost === 0 ? 700 : 400,
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {order.shippingCost === 0 ? 'GRATIS' : formatRupiah(order.shippingCost)}
                  </span>
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  paddingTop: '10px', borderTop: '1px dotted rgba(212,210,203,0.2)',
                }}>
                  <p style={{
                    fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: '#a8a69f',
                  }}>
                    Total
                  </p>
                  <p style={{
                    fontSize: '20px', fontWeight: 700, color: '#d4d2cb',
                    letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums',
                  }}>
                    {formatRupiah(order.total)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Payment instructions */}
          {showPaymentInstructions && (
            <section>
              <p className="text-label" style={{ marginBottom: '14px' }}>
                Instruksi Pembayaran ({PAYMENT_METHOD_LABEL[paymentMethod] ?? paymentMethod})
              </p>

              <div style={{
                padding: '24px',
                border: '1px dotted rgba(212,210,203,0.3)',
                borderRadius: '20px',
                background: 'rgba(212,210,203,0.03)',
              }}>
                {paymentMethod === 'transfer' ? (
                  <BankTransferInfo total={order.total} bank={payment} />
                ) : (
                  <QrisInfo total={order.total} qris={payment} />
                )}

                <div style={{
                  marginTop: '20px', paddingTop: '20px',
                  borderTop: '1px dotted rgba(212,210,203,0.2)',
                  fontSize: '11px', color: '#a8a69f', lineHeight: 1.8,
                }}>
                  <p style={{ marginBottom: '8px' }}>
                    <strong style={{ color: '#d4d2cb' }}>Setelah membayar:</strong>
                  </p>
                  <ol style={{ paddingLeft: '20px' }}>
                    <li>Screenshot bukti transfer / pembayaran QRIS</li>
                    <li>Upload screenshot ke layanan gambar (Imgur, ImgBB, dll.)</li>
                    <li>Paste link gambar di form di sebelah kanan dan submit</li>
                    <li>Admin akan memverifikasi maksimal 1×24 jam</li>
                  </ol>
                </div>
              </div>
            </section>
          )}

          {/* Existing proof preview if uploaded */}
          {order.payment?.proofImage && (
            <section>
              <p className="text-label" style={{ marginBottom: '14px' }}>
                Bukti Pembayaran Terkirim
              </p>
              <div style={{
                padding: '20px',
                border: '1px dotted rgba(212,210,203,0.25)',
                borderRadius: '14px',
                background: 'rgba(212,210,203,0.02)',
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: '14px', flexWrap: 'wrap', gap: '12px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ReceiptIcon size={14} color="#a8a69f" />
                    <p style={{
                      fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase',
                      color: '#d4d2cb',
                    }}>
                      {PAYMENT_METHOD_LABEL[paymentMethod]}
                    </p>
                  </div>
                  <span style={{
                    padding: '4px 12px', borderRadius: '100px',
                    border: `1px dotted ${PAYMENT_STATUS_COLOR[order.payment.status]}`,
                    color: PAYMENT_STATUS_COLOR[order.payment.status],
                    fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase',
                  }}>
                    {PAYMENT_STATUS_LABEL[order.payment.status]}
                  </span>
                </div>
                <a href={order.payment.proofImage} target="_blank" rel="noopener noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={order.payment.proofImage}
                    alt="Bukti pembayaran"
                    style={{
                      width: '100%', maxWidth: '420px',
                      borderRadius: '8px', display: 'block',
                      border: '1px dotted rgba(212,210,203,0.2)',
                    }}
                  />
                </a>
                {order.payment.notes && (
                  <p style={{
                    fontSize: '10px', color: '#a8a69f', lineHeight: 1.7,
                    marginTop: '14px', padding: '10px 14px',
                    background: 'rgba(212,210,203,0.04)', borderRadius: '8px',
                  }}>
                    {order.payment.notes}
                  </p>
                )}
                {order.payment.status === 'tidak_valid' && (
                  <p style={{
                    fontSize: '11px', color: '#f87171',
                    marginTop: '14px', letterSpacing: '0.03em', lineHeight: 1.7,
                  }}>
                    Pembayaran ditolak admin. Silakan upload ulang bukti yang sesuai.
                  </p>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Right column */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Upload form */}
          {canUploadProof && (
            <section style={{
              padding: '24px',
              border: order.payment?.proofImage ? '1px dotted rgba(212,210,203,0.25)' : '1px solid rgba(212,210,203,0.5)',
              borderRadius: '20px',
              background: 'rgba(212,210,203,0.04)',
            }}>
              <p className="text-label" style={{ marginBottom: '6px' }}>
                {order.payment?.proofImage ? 'Update Bukti' : 'Upload Bukti Bayar'}
              </p>
              <p style={{
                fontSize: '11px', color: '#a8a69f', lineHeight: 1.7,
                marginBottom: '18px', letterSpacing: '0.02em',
              }}>
                Setelah membayar, kirim link screenshot bukti transfernya di sini.
              </p>
              <UploadProofForm
                orderId={order.id}
                defaultProofImage={order.payment?.proofImage}
                // After a rejection `notes` holds the admin's reason, not the
                // customer's note — don't pre-fill it back into the form.
                defaultNotes={paymentRejected ? null : order.payment?.notes}
              />
            </section>
          )}

          {/* Confirmed banner */}
          {order.status === 'diproses' && (
            <section style={{
              padding: '20px',
              border: '1px dotted rgba(167,139,250,0.5)',
              borderRadius: '20px',
              background: 'rgba(167,139,250,0.06)',
            }}>
              <CheckCircle2 size={18} color="#a78bfa" style={{ marginBottom: '10px' }} />
              <p style={{
                fontSize: '12px', fontWeight: 700, color: '#a78bfa',
                letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px',
              }}>
                Pembayaran terkonfirmasi
              </p>
              <p style={{ fontSize: '11px', color: '#a8a69f', lineHeight: 1.7 }}>
                Pesanan kamu sedang disiapkan untuk pengiriman.
              </p>
            </section>
          )}

          {/* Shipping info */}
          <section style={{
            padding: '20px 22px',
            border: '1px dotted rgba(212,210,203,0.2)',
            borderRadius: '20px',
          }}>
            <p className="text-label" style={{ marginBottom: '14px' }}>
              Alamat Pengiriman
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <User size={12} color="#a8a69f" style={{ marginTop: '3px', flexShrink: 0 }} />
                <p style={{ fontSize: '11px', color: '#d4d2cb', fontWeight: 700 }}>
                  {order.shippingName ?? '—'}
                </p>
              </div>
              {order.shippingPhone && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <Phone size={12} color="#a8a69f" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <p style={{ fontSize: '11px', color: '#d4d2cb' }}>{order.shippingPhone}</p>
                </div>
              )}
              {order.shippingAddress && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <MapPin size={12} color="#a8a69f" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <p style={{ fontSize: '11px', color: '#d4d2cb', lineHeight: 1.7 }}>
                    {order.shippingAddress}
                  </p>
                </div>
              )}
            </div>
            {order.notes && (
              <div style={{
                marginTop: '14px', paddingTop: '14px',
                borderTop: '1px dotted rgba(212,210,203,0.15)',
              }}>
                <p style={{
                  fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: '#a8a69f', marginBottom: '6px',
                }}>
                  Catatan
                </p>
                <p style={{ fontSize: '11px', color: '#d4d2cb', lineHeight: 1.7 }}>
                  {order.notes}
                </p>
              </div>
            )}
          </section>
        </aside>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .order-grid {
            grid-template-columns: 1fr !important;
          }
          .status-track p {
            font-size: 7px !important;
          }
        }
        .order-back {
          transition: color 300ms ease,
                      transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .order-back:hover {
          color: #d4d2cb;
          transform: translateX(-4px);
        }
        .order-item {
          transition: background 300ms ease;
        }
        .order-item:hover {
          background: rgba(212,210,203,0.04);
        }
      `}</style>
    </div>
  )
}

function BankTransferInfo({ total, bank }: { total: number; bank: PaymentSettings }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{
          width: '44px', height: '44px',
          borderRadius: '12px',
          background: 'rgba(212,210,203,0.06)',
          border: '1px dotted rgba(212,210,203,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Building2 size={20} color="#d4d2cb" />
        </div>
        <div>
          <p style={{
            fontSize: '13px', fontWeight: 700, color: '#d4d2cb',
            letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>
            {bank.bankName}
          </p>
          {bank.branch && (
            <p style={{ fontSize: '10px', color: '#a8a69f' }}>{bank.branch}</p>
          )}
        </div>
      </div>

      <CopyRow label="Nomor Rekening" value={bank.accountNumber} mono />
      <CopyRow label="Atas Nama" value={bank.accountName} />
      <CopyRow label="Jumlah Transfer" value={formatRupiah(total)} highlight mono />
    </div>
  )
}

function QrisInfo({ total, qris }: { total: number; qris: PaymentSettings }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{
          width: '44px', height: '44px',
          borderRadius: '12px',
          background: 'rgba(212,210,203,0.06)',
          border: '1px dotted rgba(212,210,203,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <QrCode size={20} color="#d4d2cb" />
        </div>
        <div>
          <p style={{
            fontSize: '13px', fontWeight: 700, color: '#d4d2cb',
            letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>
            QRIS — {qris.qrisMerchantName}
          </p>
          <p style={{ fontSize: '10px', color: '#a8a69f' }}>
            Scan dengan aplikasi e-wallet / mobile banking
          </p>
        </div>
      </div>

      <div style={{
        display: 'flex', justifyContent: 'center',
        padding: '20px',
        background: '#fff',
        borderRadius: '14px',
        marginBottom: '20px',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qris.qrisImageUrl}
          alt={`QR code ${qris.qrisMerchantName}`}
          width={260}
          height={260}
          style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
        />
      </div>

      <CopyRow label="Jumlah Bayar" value={formatRupiah(total)} highlight mono />

      <p style={{
        fontSize: '10px', color: '#a8a69f',
        marginTop: '14px', lineHeight: 1.7,
      }}>
        QRIS ini didukung oleh seluruh aplikasi pembayaran (GoPay, OVO, DANA, ShopeePay, M-Banking).
        Pastikan nominal yang kamu transfer sama persis dengan total pesanan.
      </p>
    </div>
  )
}

function CopyRow({
  label,
  value,
  mono,
  highlight,
}: {
  label: string
  value: string
  mono?: boolean
  highlight?: boolean
}) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px dotted rgba(212,210,203,0.12)',
      gap: '14px', flexWrap: 'wrap',
    }}>
      <span style={{
        fontSize: '10px', color: '#a8a69f',
        letterSpacing: '0.12em', textTransform: 'uppercase',
      }}>
        {label}
      </span>
      <span style={{
        fontSize: highlight ? '15px' : '13px',
        fontWeight: 700,
        color: highlight ? '#86efac' : '#d4d2cb',
        fontFamily: mono ? 'monospace' : 'inherit',
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '0.02em',
      }}>
        {value}
      </span>
    </div>
  )
}
