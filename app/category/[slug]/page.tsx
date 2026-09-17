import { getProductsByCategory } from '../../../lib/products'
import ProductCard from '../../../components/ProductCard'

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const products = getProductsByCategory(slug)
  if (!products.length) return <div className="container page"><p className="eyebrow">Category</p><h1 className="page-title">{slug}</h1><div className="empty-state"><h2>No products found</h2><p>This category does not have products yet. Try browsing another department.</p></div></div>
  return <div className="container page">
    <p className="eyebrow">Department</p><h1 className="page-title">{products[0].category}</h1><p className="page-subtitle">{products.length} products ready to browse</p>
    <div className="product-grid section">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
  </div>
}
