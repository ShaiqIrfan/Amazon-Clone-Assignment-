"use client"
import Link from 'next/link'
import { useState } from 'react'
import { Product } from '../lib/types'
import { useCart } from '../lib/cart'

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()
  const [adding, setAdding] = useState(false)
  const badge = product.tags?.[0]
  function addToCart() {
    add(product.id, 1)
    setAdding(true)
    window.setTimeout(() => setAdding(false), 900)
  }
  return <article className="product-card">
    <Link href={'/product/' + product.id} aria-label={'View ' + product.title}>
      <div className="product-image-wrap"><img src={product.images[0]} alt={product.title} className="product-image" /></div>
      {badge && <span className="product-badge">{badge}</span>}
      <h3 className="product-title">{product.title}</h3>
    </Link>
    <div className="rating"><span className="stars" aria-label={'Rated ' + (product.rating ?? 4.5) + ' out of 5'}>★★★★★</span><span>{product.rating ?? 4.5}</span><span>({product.reviewCount ?? 0})</span></div>
    <div className="price-row"><span className="price">${product.price.toFixed(2)}</span>{product.originalPrice && <span className="original-price">${product.originalPrice.toFixed(2)}</span>}</div>
    <div className="card-footer"><Link href={'/product/' + product.id} className="text-link">View details</Link><button type="button" className="button add-button" onClick={addToCart} aria-label={'Add ' + product.title + ' to cart'}>{adding ? 'Added' : 'Add to cart'}</button></div>
  </article>
}
