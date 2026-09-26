"use client"
import { use, useEffect, useState } from 'react'
import ProductCard from '../../../components/ProductCard'
import { Product } from '../../../lib/types'

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const response = await fetch(`/api/products?category=${encodeURIComponent(slug)}`, { cache: 'no-store' })
        const payload = await response.json()

        if (active) {
          setProducts(Array.isArray(payload) ? payload : [])
        }
      } catch {
        if (active) setProducts([])
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [slug])

  if (loading) return <div className="container page"><p className="eyebrow">Category</p><h1 className="page-title">{slug}</h1><div className="empty-state"><h2>Loading category…</h2><p>Retrieving the latest products from NexCart.</p></div></div>
  if (!products.length) return <div className="container page"><p className="eyebrow">Category</p><h1 className="page-title">{slug}</h1><div className="empty-state"><h2>No products found</h2><p>This category does not have products yet. Try browsing another department.</p></div></div>
  return <div className="container page">
    <p className="eyebrow">Department</p><h1 className="page-title">{products[0].category}</h1><p className="page-subtitle">{products.length} products ready to browse</p>
    <div className="product-grid section">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
  </div>
}
