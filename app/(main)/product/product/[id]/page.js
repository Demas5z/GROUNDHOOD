import { notFound } from 'next/navigation'
import { products } from '@/data/products'
import ProductDetailClient from './ProductDetailClient'

export async function generateStaticParams() {
  return products.map(p => ({ id: String(p.id) }))
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const product = products.find(p => p.id === parseInt(id))
  if (!product) return { title: 'Product Not Found' }
  return {
    title: product.name,
    description: `${product.description} — ${product.color}. ${product.price}`,
    openGraph: {
      title: `${product.name} | GROUNDHOOD`,
      description: product.description,
      images: [{ url: product.image, width: 600, height: 800, alt: product.name }],
    },
  }
}

export default async function ProductPage({ params }) {
  const { id } = await params
  const product = products.find(p => p.id === parseInt(id))
  if (!product) notFound()
  return <ProductDetailClient product={product} />
}
