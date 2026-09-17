import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import products from '../data/products.json'

export default function Home() {
  const featured = products.slice(0, 8)
  return <div className="container page">
    <Hero />
    <section className="section">
      <div className="section-heading"><div><p className="eyebrow">Curated for today</p><h2>Featured for you</h2></div><a className="text-link" href="/category/Electronics">Shop more</a></div>
      <div className="product-grid">{featured.map((product) => <ProductCard key={product.id} product={product} />)}</div>
    </section>
  </div>
}
