"use client"
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
type DemoOrder = { ref: string; items: { title: string; qty: number; total: number }[]; shipping: number; total: number }
export default function ConfirmationPage() { return <Suspense fallback={<div className="container page">Loading order confirmation…</div>}><ConfirmationContents /></Suspense> }
function ConfirmationContents() {
  const ref = useSearchParams().get('ref') || 'N/A'; const [order, setOrder] = useState<DemoOrder | null>(null)
  useEffect(() => { try { const saved = sessionStorage.getItem('lastDemoOrder'); if (saved) setOrder(JSON.parse(saved)) } catch {} }, [])
  return <div className="container page"><div className="confirmation-card"><div className="success-icon">✓</div><p className="eyebrow">Order confirmed</p><h1 className="page-title">Thank you for your order</h1><p className="page-subtitle">Your demo order reference</p><div className="reference">{ref}</div><p className="demo-note">This was a simulated order for demo purposes only.</p>
    {order && order.ref === ref && <div className="confirmation-summary"><h2>Order summary</h2>{order.items.map((item) => <div key={item.title}><span>{item.title} × {item.qty}</span><span>{'$' + item.total.toFixed(2)}</span></div>)}<div><span>Delivery</span><span>{order.shipping ? '$' + order.shipping.toFixed(2) : 'Free'}</span></div><div style={{ fontWeight: 700 }}><span>Total</span><span>{'$' + order.total.toFixed(2)}</span></div></div>}
    <Link href="/" className="button">Continue shopping</Link>
  </div></div>
}
