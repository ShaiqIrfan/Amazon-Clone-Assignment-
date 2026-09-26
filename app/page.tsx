"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import { Product } from '../lib/types'

const categoryHighlights = [
  { name: 'Electronics', href: '/category/Electronics', blurb: 'Smart tools and daily-tech essentials', tone: 'tone-1' },
  { name: 'Home', href: '/category/Home', blurb: 'Thoughtful pieces for the everyday home', tone: 'tone-2' },
  { name: 'Fashion', href: '/category/Fashion', blurb: 'Comfort-first essentials for moving through the week', tone: 'tone-3' },
  { name: 'Beauty', href: '/category/Beauty', blurb: 'Simple routines and personal care staples', tone: 'tone-4' },
]

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const response = await fetch('/api/products', { cache: 'no-store' })
        const products = await response.json()

        if (active) {
          setFeatured(Array.isArray(products) ? products : [])
        }
      } catch {
        if (active) setFeatured([])
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="container page home-page">
      <Hero />

      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow eyebrow-soft">Shop by essentials</p>
            <h2>Designed for everyday life</h2>
          </div>
          <Link href="/search?q=" className="text-link">Browse all</Link>
        </div>

        <div className="category-grid">
          {categoryHighlights.map((category) => (
            <Link key={category.name} href={category.href} className={`category-card ${category.tone}`}>
              <span className="category-kicker">Collection</span>
              <h3>{category.name}</h3>
              <p>{category.blurb}</p>
              <span className="card-link">Explore</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section curated-section">
        <div className="section-header">
          <div>
            <p className="eyebrow eyebrow-soft">Fresh picks</p>
            <h2>Curated for easy living</h2>
          </div>
        </div>

        <div className="curated-grid">
          <article className="curated-panel panel-large">
            <div>
              <p className="panel-label">Wellness</p>
              <h3>Home routines, upgraded</h3>
              <p>Quiet essentials for a calmer, more organised day.</p>
            </div>
            <Link href="/category/Home" className="button-secondary">Browse home</Link>
          </article>

          <article className="curated-panel panel-compact">
            <p className="panel-label">Work essentials</p>
            <h3>Desk setup</h3>
            <Link href="/category/Electronics" className="text-link">View tech picks</Link>
          </article>

          <article className="curated-panel panel-compact accent-panel">
            <p className="panel-label">Style notes</p>
            <h3>Comfort-driven pieces</h3>
            <Link href="/category/Fashion" className="text-link">See fashion essentials</Link>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow eyebrow-soft">Featured now</p>
            <h2>Popular picks for your routine</h2>
          </div>
          <Link href="/category/Electronics" className="text-link">Shop more</Link>
        </div>

        {loading ? (
          <div className="empty-state"><h2>Loading products…</h2><p>Fetching the latest catalog from NexCart.</p></div>
        ) : featured.length ? (
          <div className="product-grid">{featured.slice(0, 8).map((product) => <ProductCard key={product.id} product={product} />)}</div>
        ) : (
          <div className="empty-state"><h2>Products are temporarily unavailable</h2><p>The catalog is loading from the NexCart API.</p></div>
        )}
      </section>

      <section className="section">
        <div className="mini-banner">
          <div>
            <p className="eyebrow eyebrow-soft">NexCart essentials</p>
            <h2>Simple shopping, thoughtful products.</h2>
          </div>
          <div className="mini-banner-actions">
            <Link href="/search?q=essentials" className="button">Explore essentials</Link>
            <Link href="/deals" className="button-secondary">View deals</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
