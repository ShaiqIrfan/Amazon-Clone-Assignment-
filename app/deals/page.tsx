import ProductCard from '../../components/ProductCard'
import { getAllProducts } from '../../lib/products'

export default function DealsPage() {
  const deals = getAllProducts().filter((product) => product.originalPrice)
  return <div className="container page">
    <p className="eyebrow">Limited-time demo offers</p><h1 className="page-title">Today's Deals</h1>
    <p className="page-subtitle">Straightforward savings based on the catalog's listed original prices.</p>
    <div className="product-grid section">{deals.map((product) => {
      const saving = Math.round((1 - product.price / product.originalPrice!) * 100)
      return <div className="deal-item" key={product.id}><span className="deal-save">Save {saving}%</span><ProductCard product={product} /></div>
    })}</div>
  </div>
}
