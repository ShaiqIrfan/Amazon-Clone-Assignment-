import Link from 'next/link'

export default function Hero() {
  return <section className="hero">
    <div className="hero-copy">
      <p className="eyebrow">Everyday value, simply delivered</p>
      <h1>Find useful things for every kind of day.</h1>
      <p>Browse reliable essentials across home, tech, style, books and more — with a fast, easy demo checkout.</p>
      <Link href="/category/Electronics" className="button">Shop featured deals</Link>
    </div>
    <div className="hero-art" aria-hidden="true"><span>SHOP</span></div>
  </section>
}
