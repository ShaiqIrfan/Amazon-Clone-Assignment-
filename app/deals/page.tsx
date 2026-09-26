"use client"
import { useEffect, useState } from 'react'
import ProductCard from '../../components/ProductCard'
import { Product } from '../../lib/types'

export default function DealsPage() {
  const [deals, setDeals] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const response = await fetch('/api/products', { cache: 'no-store' })
        const payload = await response.json()

        if (active) {
          setDeals(Array.isArray(payload) ? payload.filter((product) => Boolean(product.originalPrice)) : [])
        }
      } catch {
        if (active) setDeals([])
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  return <div className="container page">
    <p className="eyebrow">Limited-time demo offers</p><h1 className="page-title">Today's Deals</h1>
    <p className="page-subtitle">Straightforward savings based on the catalog's listed original prices.</p>
    {loading ? <div className="empty-state"><h2>Loading deals…</h2><p>Pulling the latest savings from NexCart.</p></div>
      : !deals.length ? <div className="empty-state"><h2>Deals are temporarily unavailable</h2><p>The current catalog pricing is loading from the NexCart API.</p></div>
      : <div className="product-grid section">{deals.map((product) => {
        const saving = Math.round((1 - product.price / product.originalPrice!) * 100)
        return <div className="deal-item" key={product.id}><span className="deal-save">Save {saving}%</span><ProductCard product={product} /></div>
      })}</div>}
  </div>
}
