import Link from 'next/link'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">Curated essentials</p>
        <h1>Everyday essentials. Elevated.</h1>
        <p>Thoughtful picks for quieter mornings, smarter desks, and easier evenings — built around the pieces you actually reach for.</p>
        <div className="hero-actions">
          <Link href="/category/Electronics" className="button">Shop essentials</Link>
          <Link href="/search?q=home" className="button-secondary">Browse by room</Link>
        </div>
        <div className="hero-metrics" aria-label="Quick shopping overview">
          <div>
            <strong>20+</strong>
            <span>purposeful categories</span>
          </div>
          <div>
            <strong>Daily</strong>
            <span>useful upgrades</span>
          </div>
          <div>
            <strong>Curated</strong>
            <span>for modern living</span>
          </div>
        </div>
      </div>

      <div className="hero-visual" aria-label="Featured products preview">
        <div className="showcase-glow" />
        <div className="hero-product-card product-card-top">
          <img src="/images/products/noise-isolating-earbuds.jpg" alt="Wireless earbuds" />
          <div>
            <span>Audio</span>
            <strong>Quiet luxury</strong>
          </div>
        </div>
        <div className="hero-product-card product-card-mid">
          <img src="/images/products/ergonomic-office-chair.jpg" alt="Ergonomic office chair" />
          <div>
            <span>Home office</span>
            <strong>Work, refined</strong>
          </div>
        </div>
        <div className="glass-stat-panel">
          <span className="glass-pill">Fresh drop</span>
          <strong>Smart living</strong>
          <p>Portable tech and home staples built for calm routines.</p>
        </div>
      </div>
    </section>
  )
}
