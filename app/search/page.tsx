import { searchProducts } from '../../lib/products'
import ProductCard from '../../components/ProductCard'

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string }> }) {
  const resolvedSearchParams = await searchParams
  const q = resolvedSearchParams?.q || ''
  const results = q ? searchProducts(q) : []
  return <div className="container page">
    <p className="eyebrow">Search</p><h1 className="page-title">Search results</h1>
    <p className="page-subtitle">{q ? <>Results for <strong>“{q}”</strong> · {results.length} found</> : 'Enter a search term above to find products.'}</p>
    {!q ? <div className="empty-state"><h2>What are you looking for?</h2><p>Use the search bar to browse the catalog.</p></div>
      : results.length === 0 ? <div className="empty-state"><h2>No matches found</h2><p>Try a different keyword or browse one of our categories.</p></div>
      : <div className="product-grid section">{results.map((product) => <ProductCard key={product.id} product={product} />)}</div>}
  </div>
}
