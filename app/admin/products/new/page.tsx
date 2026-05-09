import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import ProductForm from '../ProductForm'

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
  if (categories.length === 0) {
    redirect('/admin/categories')
  }

  return (
    <div>
      <Link href="/admin/products" style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase',
        color: '#a8a69f', textDecoration: 'none', marginBottom: '24px',
      }}>
        <ArrowLeft size={12} /> Kembali
      </Link>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: '700',
          textTransform: 'uppercase', letterSpacing: '-0.025em',
          color: '#d4d2cb', lineHeight: 1, marginBottom: '8px',
        }}>
          Tambah Produk Baru
        </h1>
        <p style={{ color: '#a8a69f', fontSize: '11px', lineHeight: 1.7 }}>
          Isi detail produk dan simpan untuk menambahkannya ke katalog.
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  )
}
