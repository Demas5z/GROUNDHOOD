import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductForm from '../../ProductForm'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!product) notFound()

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
          Edit Produk
        </h1>
        <p style={{ color: '#a8a69f', fontSize: '11px', lineHeight: 1.7 }}>
          {product.name}
        </p>
      </div>

      <ProductForm
        categories={categories}
        initial={{
          id: product.id,
          name: product.name,
          price: product.price,
          stock: product.stock,
          description: product.description,
          image: product.image,
          categoryId: product.categoryId,
        }}
      />
    </div>
  )
}
