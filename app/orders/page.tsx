import Link from 'next/link'

export default function OrdersPage() {
  return <div className="container page">
    <p className="eyebrow">Demo orders</p><h1 className="page-title">Returns & Orders</h1>
    <div className="empty-state section"><h2>Order history is not persistent</h2><p>NexCart uses a simulated checkout and does not save an account-based order history. Your order reference appears on the confirmation page after placing a demo order.</p><div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}><Link href="/cart" className="button">View cart</Link><Link href="/" className="button-secondary">Continue shopping</Link></div></div>
  </div>
}
