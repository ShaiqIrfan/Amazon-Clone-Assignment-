"use client"
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '../../components/ProductCard'
import { Product } from '../../lib/types'

export default function SearchPage() {
  return <Suspense fallback={<div className="container page"><p className="eyebrow">Search</p><h1 className="page-title">Search results</h1><div className="empty-state"><h2>Loading search…</h2><p>Fetching live results from NexCart.</p></div></div>}><SearchContents /></Suspense>
}

function SearchContents() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ''
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(Boolean(q))

  useEffect(() => {
    const nextQuery = searchParams.get('q') || ''

    if (!nextQuery) {
      setResults([])
      setLoading(false)
      return
    }

    let active = true
    setLoading(true)

    fetch(`/api/products?search=${encodeURIComponent(nextQuery)}`, { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Search failed')
        }

        const payload = await response.json()
        if (active) setResults(Array.isArray(payload) ? payload : [])
      })
      .catch(() => {
        if (active) setResults([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [searchParams])

  return <div className="container page">
    <p className="eyebrow">Search</p><h1 className="page-title">Search results</h1>
    <p className="page-subtitle">{q ? <>Results for <strong>“{q}”</strong> · {results.length} found</> : 'Enter a search term above to find products.'}</p>
    {!q ? <div className="empty-state"><h2>What are you looking for?</h2><p>Use the search bar to browse the catalog.</p></div>
      : loading ? <div className="empty-state"><h2>Searching…</h2><p>Checking the current NexCart catalog.</p></div>
      : results.length === 0 ? <div className="empty-state"><h2>No matches found</h2><p>Try a different keyword or browse one of our categories.</p></div>
      : <div className="product-grid section">{results.map((product) => <ProductCard key={product.id} product={product} />)}</div>}
  </div>
}
