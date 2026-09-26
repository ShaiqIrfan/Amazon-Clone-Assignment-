import Link from 'next/link'
import Logo from './Logo'

const columns = [
  { title: 'Explore', links: [['Home', '/'], ['Deals', '/deals'], ['Gift cards', '/gift-cards'], ['Coupons', '/coupons']] },
  { title: 'Shop by category', links: [['Electronics', '/category/Electronics'], ['Home', '/category/Home'], ['Fashion', '/category/Fashion'], ['Beauty', '/category/Beauty']] },
  { title: 'Helpful links', links: [['Account', '/account'], ['Orders', '/orders'], ['Location', '/location'], ['Help center', '/help']] },
  { title: 'Need support?', links: [['Returns', '/orders'], ['Customer support', '/help'], ['Search', '/search?q='], ['Contact', '/help?topic=contact']] },
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-back">
        <Link href="/">Back to shopping</Link>
      </div>

      <div className="container footer-columns">
        {columns.map((column) => (
          <section key={column.title}>
            <h2>{column.title}</h2>
            {column.links.map(([label, href]) => (
              <Link key={label} href={href}>{label}</Link>
            ))}
          </section>
        ))}
      </div>

      <div className="footer-region">
        <Logo footer />
        <span>English</span>
        <span>Pakistan — PKR</span>
      </div>

      <div className="footer-services">
        <Link href="/category/Home">Home essentials</Link>
        <Link href="/category/Electronics">Tech picks</Link>
        <Link href="/deals">Deals</Link>
        <Link href="/help">Support</Link>
      </div>

      <div className="footer-legal">
        <div>
          <Link href="/help?topic=conditions">Terms</Link>
          <Link href="/help?topic=privacy">Privacy</Link>
          <Link href="/help?topic=accessibility">Accessibility</Link>
        </div>
        <p>© 2026 NexCart. All rights reserved.</p>
      </div>
    </footer>
  )
}
