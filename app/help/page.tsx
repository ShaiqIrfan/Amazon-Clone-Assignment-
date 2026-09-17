import Link from 'next/link'

export default function HelpPage() {
  return <div className="container page"><p className="eyebrow">NexCart support</p><h1 className="page-title">How can we help?</h1><p className="page-subtitle">This is a storefront demo, so account support, delivery tracking, payments, and contact operations are not live.</p><div className="info-grid section"><section className="info-card"><h2>Shopping help</h2><p>Browse products, add items to a locally saved cart, and complete a simulated checkout.</p><Link href="/" className="button">Browse catalog</Link></section><section className="info-card"><h2>Orders and returns</h2><p>Demo orders receive an on-screen reference number but are not stored as a persistent history.</p><Link href="/orders" className="button-secondary">View demo orders</Link></section></div></div>
}
