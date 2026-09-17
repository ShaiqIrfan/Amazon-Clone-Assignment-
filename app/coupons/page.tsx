import Link from 'next/link'

const coupons = [
  ['10% off selected electronics', 'Demo coupon · Browse qualifying electronics.', '/category/Electronics'],
  ['Style week: 15% off fashion', 'Demo coupon · Explore clothing and accessories.', '/category/Fashion'],
  ['Free standard delivery over ₨ 10,000', 'Demo offer · Shipping remains simulated at checkout.', '/cart'],
  ['Home refresh: save on home finds', 'Demo coupon · Shop the Home department.', '/category/Home'],
]

export default function CouponsPage() {
  return <div className="container page">
    <p className="eyebrow">Demo promotions</p><h1 className="page-title">Coupons</h1><p className="page-subtitle">These display-only offers demonstrate the NexCart promotions experience; they cannot be redeemed.</p>
    <div className="coupon-grid section">{coupons.map(([title, note, href]) => <article key={title} className="coupon-card"><span className="coupon-label">DEMO COUPON</span><h2>{title}</h2><p>{note}</p><Link href={href} className="button-secondary">Browse eligible items</Link></article>)}</div>
  </div>
}
