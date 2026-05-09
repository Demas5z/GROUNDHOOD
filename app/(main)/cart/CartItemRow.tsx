'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, Package, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { updateCartItemAction, removeCartItemAction } from '@/actions/cart'
import { formatRupiah } from '@/lib/order-status'

type Props = {
  item: {
    id: string
    quantity: number
    product: {
      id: string
      name: string
      price: number
      stock: number
      image: string | null
      category: { name: string }
    }
  }
}

export default function CartItemRow({ item }: Props) {
  const [quantity, setQuantity] = useState(item.quantity)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const subtotal = item.product.price * quantity

  function handleChangeQty(next: number) {
    if (next < 1 || next > item.product.stock) return
    const previous = quantity
    setQuantity(next)
    setError(null)
    startTransition(async () => {
      const result = await updateCartItemAction({ itemId: item.id, quantity: next })
      if (result.error) {
        setQuantity(previous)
        setError(result.error)
      }
    })
  }

  function handleRemove() {
    setError(null)
    startTransition(async () => {
      const result = await removeCartItemAction(item.id)
      if (result.error) setError(result.error)
    })
  }

  return (
    <div
      className="cart-row"
      style={{
        display: 'grid',
        gridTemplateColumns: '88px 1fr auto',
        gap: '20px',
        padding: '20px 0',
        borderBottom: '1px dotted rgba(212,210,203,0.18)',
        alignItems: 'center',
        opacity: isPending ? 0.7 : 1,
        transition: 'opacity 0.2s',
      }}
    >
      {/* Image */}
      <Link
        href={`/product/${item.product.id}`}
        style={{
          position: 'relative',
          display: 'block',
          width: '88px',
          height: '110px',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px dotted rgba(212,210,203,0.2)',
          background: 'rgba(212,210,203,0.04)',
          flexShrink: 0,
        }}
      >
        {item.product.image ? (
          <Image
            src={item.product.image}
            alt={item.product.name}
            fill
            sizes="88px"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Package size={20} color="rgba(212,210,203,0.25)" />
          </div>
        )}
      </Link>

      {/* Info + qty stepper */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0 }}>
        <p className="text-label">{item.product.category.name}</p>
        <Link
          href={`/product/${item.product.id}`}
          className="cart-row-title"
          style={{
            fontSize: '13px', fontWeight: 700,
            letterSpacing: '0.05em', textTransform: 'uppercase',
            color: '#d4d2cb', textDecoration: 'none',
            overflow: 'hidden', textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {item.product.name}
        </Link>
        <p style={{ fontSize: '11px', color: '#a8a69f', letterSpacing: '0.03em' }}>
          {formatRupiah(item.product.price)} / item
        </p>

        {/* Qty stepper */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px' }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            border: '1px dotted rgba(212,210,203,0.4)',
            borderRadius: '50px', overflow: 'hidden',
          }}>
            <button
              type="button"
              onClick={() => handleChangeQty(quantity - 1)}
              disabled={isPending || quantity <= 1}
              className="cart-stepper-btn"
              aria-label="Kurangi jumlah"
            >
              <Minus size={12} />
            </button>
            <span style={{
              minWidth: '32px', textAlign: 'center',
              fontSize: '12px', fontWeight: 700, color: '#d4d2cb',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => handleChangeQty(quantity + 1)}
              disabled={isPending || quantity >= item.product.stock}
              className="cart-stepper-btn"
              aria-label="Tambah jumlah"
            >
              <Plus size={12} />
            </button>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            disabled={isPending}
            className="cart-remove-btn"
            aria-label="Hapus item"
          >
            <Trash2 size={13} />
            <span>Hapus</span>
          </button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                fontSize: '10px', color: '#f87171', letterSpacing: '0.05em',
                marginTop: '4px',
              }}
            >
              <AlertCircle size={11} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subtotal */}
      <div style={{ textAlign: 'right', minWidth: '110px' }}>
        <p style={{
          fontSize: '9px', color: '#a8a69f', letterSpacing: '0.18em',
          textTransform: 'uppercase', marginBottom: '4px',
        }}>
          Subtotal
        </p>
        <p style={{
          fontSize: '14px', fontWeight: 700, color: '#d4d2cb',
          letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums',
        }}>
          {formatRupiah(subtotal)}
        </p>
      </div>

      <style>{`
        .cart-row-title {
          transition: color 300ms ease;
        }
        .cart-row-title:hover {
          color: #fff;
        }
        .cart-stepper-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #d4d2cb;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          transition: background 350ms cubic-bezier(0.22, 1, 0.36, 1),
                      color 300ms ease;
        }
        .cart-stepper-btn:hover:not(:disabled) {
          background: rgba(212,210,203,0.08);
          color: #fff;
        }
        .cart-stepper-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .cart-remove-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #a8a69f;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 0;
          font-family: inherit;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          transition: color 300ms ease,
                      transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .cart-remove-btn:hover:not(:disabled) {
          color: #f87171;
          transform: translateX(2px);
        }
        .cart-remove-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        @media (max-width: 640px) {
          .cart-row {
            grid-template-columns: 72px 1fr !important;
          }
          .cart-row > div:last-child {
            grid-column: 1 / -1;
            text-align: left !important;
            padding-top: 8px;
            border-top: 1px dotted rgba(212,210,203,0.1);
          }
        }
      `}</style>
    </div>
  )
}
