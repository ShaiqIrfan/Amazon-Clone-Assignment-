import Link from 'next/link'

export default function AccountPage() {
  return <div className="container page">
    <p className="eyebrow">Demo account</p><h1 className="page-title">Accounts & Lists</h1>
    <p className="page-subtitle">NexCart is a front-end shopping demo, so sign-in and saved account data are not enabled.</p>
    <div className="info-grid section">
      <section className="info-card"><h2>Account access</h2><p>Browse products, manage a local cart, and complete a simulated checkout without creating an account.</p><Link href="/" className="button">Keep shopping</Link></section>
      <section className="info-card"><h2>Your orders</h2><p>Demo order confirmations are shown immediately after checkout and are not stored as an account history.</p><Link href="/orders" className="button-secondary">View demo orders</Link></section>
    </div>
  </div>
}
