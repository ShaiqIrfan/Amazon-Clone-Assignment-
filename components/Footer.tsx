import Link from 'next/link'

const columns = [
  { title: 'Get to know NexCart', links: [['About NexCart', '/help?topic=about'], ['Careers', '/help?topic=careers'], ['Our Blog', '/help?topic=blog'], ['Our Story', '/help?topic=story'], ['Sustainability', '/help?topic=sustainability'], ['Technology', '/help?topic=technology']] },
  { title: 'Make money with NexCart', links: [['Sell on NexCart', '/help?topic=sell'], ['Sell to Businesses', '/help?topic=business-selling'], ['Become a Partner', '/help?topic=partner'], ['Affiliate Program', '/help?topic=affiliate'], ['Advertise Products', '/help?topic=advertising']] },
  { title: 'NexCart business', links: [['NexCart Business', '/help?topic=business'], ['Business Shopping', '/help?topic=business-shopping'], ['Bulk Orders', '/help?topic=bulk'], ['Business Support', '/help?topic=business-support']] },
  { title: 'Let us help you', links: [['Your Account', '/account'], ['Your Orders', '/orders'], ['Shipping & Delivery', '/help?topic=shipping'], ['Returns & Replacements', '/orders'], ['Help Center', '/help'], ['Contact Us', '/help?topic=contact']] },
  { title: 'Customer services', links: [['Gift Cards', '/gift-cards'], ["Today's Deals", '/deals'], ['Coupons', '/coupons'], ['Fashion', '/category/Fashion'], ['Electronics', '/category/Electronics'], ['Home', '/category/Home']] },
]

export default function Footer() {
  return <footer className="site-footer">
    <div className="footer-back"><Link href="/">Back to shopping</Link></div>
    <div className="container footer-columns">{columns.map((column) => <section key={column.title}><h2>{column.title}</h2>{column.links.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}</section>)}</div>
    <div className="footer-region"><Link href="/" className="footer-brand"><img src="/images/nexcart-mark.svg" alt="" />NexCart</Link><span>English</span><span>Pakistan — PKR</span></div>
    <div className="footer-services"><Link href="/help?topic=marketplace">NexCart Marketplace</Link><Link href="/help?topic=business">NexCart Business</Link><Link href="/deals">NexCart Deals</Link><Link href="/help?topic=delivery">NexCart Delivery</Link><Link href="/help?topic=seller">NexCart Seller</Link><Link href="/help">NexCart Support</Link></div>
    <div className="footer-legal"><div><Link href="/help?topic=conditions">Conditions of Use</Link><Link href="/help?topic=privacy">Privacy Notice</Link><Link href="/help?topic=cookies">Cookie Preferences</Link><Link href="/help?topic=accessibility">Accessibility</Link><Link href="/help?topic=privacy-choices">Your Privacy Choices</Link></div><p>© 2026 NexCart. All rights reserved.</p></div>
  </footer>
}
