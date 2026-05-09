'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { products, categories } from '@/data/products'

export default function ShopClient() {
  const searchParams = useSearchParams()
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [sortBy, setSortBy] = useState('FEATURED')
  const [filteredProducts, setFilteredProducts] = useState(products)

  useEffect(() => {
    const cat = searchParams.get('cat')
    if (cat === 'new') {
      setActiveCategory('ALL')
    }
  }, [searchParams])

  useEffect(() => {
    let filtered = [...products]
    if (activeCategory !== 'ALL') {
      filtered = filtered.filter(p => p.category === activeCategory)
    }
    if (sortBy === 'PRICE LOW') filtered.sort((a, b) => parseInt(a.price.replace(/\D/g, '')) - parseInt(b.price.replace(/\D/g, '')))
    if (sortBy === 'PRICE HIGH') filtered.sort((a, b) => parseInt(b.price.replace(/\D/g, '')) - parseInt(a.price.replace(/\D/g, '')))
    setFilteredProducts(filtered)
  }, [activeCategory, sortBy])

  return (
    <main style={{ padding: '60px 40px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '48px' }}>
        <p className="text-label" style={{ marginBottom: '8px' }}>Explore</p>
        <h1 style={{ fontSize: 'clamp(2rem, 6vw, 5rem)', fontWeight: '700', letterSpacing: '-0.03em', textTransform: 'uppercase', color: '#d4d2cb', lineHeight: 1 }}>
          The Collection
        </h1>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '40px',
        flexWrap: 'wrap',
        gap: '20px',
        borderBottom: '1px dotted rgba(212,210,203,0.4)',
        paddingBottom: '24px',
      }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: activeCategory === cat ? '#d4d2cb' : 'transparent',
                color: activeCategory === cat ? '#1a1a1a' : '#a8a69f',
                border: '1px solid',
                borderColor: activeCategory === cat ? '#d4d2cb' : 'rgba(212,210,203,0.4)',
                borderRadius: '50px',
                padding: '7px 18px',
                fontSize: '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'var(--font-space-mono), monospace',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="text-label">Sort:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ borderRadius: '50px', padding: '7px 16px', width: 'auto', cursor: 'pointer' }}
          >
            <option>FEATURED</option>
            <option>PRICE LOW</option>
            <option>PRICE HIGH</option>
            <option>NEWEST</option>
          </select>
        </div>
      </div>

      <p className="text-label" style={{ marginBottom: '32px' }}>
        {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
      </p>

      {filteredProducts.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#a8a69f' }}>
          <p style={{ fontSize: '24px', marginBottom: '16px' }}>∅</p>
          <p className="text-label">No products found in this category</p>
        </div>
      )}
    </main>
  )
}
