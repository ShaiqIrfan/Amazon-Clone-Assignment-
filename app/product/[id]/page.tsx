"use client"
import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { getProductById, getRelatedProducts } from '../../../lib/products'
import QuantitySelector from '../../../components/QuantitySelector'
import { Product } from '../../../lib/types'
import ProductCard from '../../../components/ProductCard'
import { useCart } from '../../../lib/cart'

type Props = { params: Promise<{ id: string }> }

export default function ProductPage({ params }: Props) {
  const { id } = use(params)
  const { add } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    let active = true

    async function loadProduct() {
      setLoading(true)
      const selectedProduct = await getProductById(id)

      if (!active) return

      if (!selectedProduct) {
        setProduct(null)
        setRelated([])
        setLoading(false)
        return
      }

      setProduct(selectedProduct)
      const relatedProducts = await getRelatedProducts(selectedProduct, 4)

      if (active) {
        setRelated(relatedProducts)
        setLoading(false)
      }
    }

    loadProduct()
    return () => {
      active = false
    }
  }, [id])

  if (loading) {
    return <div className="container page"><p className="eyebrow">Catalog</p><h1 className="page-title">Loading product…</h1><div className="empty-state"><p>Fetching the latest product details from NexCart.</p></div></div>
  }

  if (!product) return <div className="container page"><p className="eyebrow">Catalog</p><h1 className="page-title">Product not found</h1><div className="empty-state"><p>We could not find that product. Browse our departments to keep shopping.</p><Link href="/" className="button">Continue shopping</Link></div></div>

  function addToCart() {
    if (!product) return
    add(product.id, qty)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1200)
  }
  return <div className="container page">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href={'/category/' + product.category}>{product.category}</Link><span>/</span><span>{product.title}</span></nav>
    <div className="product-layout">
      <article className="product-info">
        <div className="product-visual"><img src={product.images[0]} alt={product.title} /></div>
        <div>
          {product.tags?.[0] && <span className="product-badge">{product.tags[0]}</span>}
          <h1 className="product-detail-title">{product.title}</h1>
          <div className="rating"><span className="stars" aria-hidden="true">★★★★★</span><span>{product.rating}</span><span>({product.reviewCount} reviews)</span></div>
          <div className="price-row"><span className="price">${product.price.toFixed(2)}</span>{product.originalPrice && <span className="original-price">${product.originalPrice.toFixed(2)}</span>}</div>
          <p className="detail-description">{product.description}</p>
        </div>
      </article>
      <aside className="purchase-box">
        <p className="eyebrow">Ready to buy?</p><span className="price">${product.price.toFixed(2)}</span>
        <span className="quantity-label">Quantity</span><QuantitySelector value={qty} onChange={setQty} />
        <button type="button" onClick={addToCart} className="button">Add to Cart</button>
        {added && <p className="added-note" role="status">Added to your cart.</p>}
      </aside>
    </div>
    {related.length > 0 && <section className="section"><div className="section-heading"><h2>Related products</h2><Link className="text-link" href={'/category/' + product.category}>More in {product.category}</Link></div><div className="product-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>}
  </div>
}
