"use client"
import Link from 'next/link'
import { useState } from 'react'
import Logo from './Logo'
import { useCart } from '../lib/cart'
import { useDemoAuth } from '../lib/auth'

const navigation = [
  ['All', '/'], ["Today's Deals", '/deals'], ['Gift Cards', '/gift-cards'], ['Coupons', '/coupons'],
  ['Fashion', '/category/Fashion'], ['Home', '/category/Home'], ['Electronics', '/category/Electronics'],
  ['Beauty', '/category/Beauty'], ['Customer Service', '/help'],
]

export default function Header() {
  const { itemCount } = useCart()
  const { isSignedIn, isHydrated } = useDemoAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="container header-main">
        <button
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <Logo />

        <SearchForm />

        <nav className="header-actions" aria-label="Account and cart">
          <Link href="/account" className="header-action">
            <span>{isHydrated && isSignedIn ? 'Hello, shopper' : 'Hello, sign in'}</span>
            <strong>Account</strong>
          </Link>
          <Link href="/orders" className="header-action">
            <span>Returns</span>
            <strong>& Orders</strong>
          </Link>
          <Link href="/cart" className="cart-link" aria-label={'Cart, ' + itemCount + ' items'}>
            <span>Cart</span>
            <span className="cart-count">{itemCount}</span>
          </Link>
        </nav>
      </div>

      <nav className="header-nav" aria-label="Shopping navigation">
        <div className="container nav-list">
          {navigation.map(([label, href]) => (
            <Link key={label} href={href}>{label}</Link>
          ))}
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-nav-panel" role="dialog" aria-modal="true">
          <div className="mobile-nav-head">
            <span>Explore NexCart</span>
            <button type="button" className="close-menu" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
              ×
            </button>
          </div>
          <div className="mobile-nav-links">
            {navigation.map(([label, href]) => (
              <Link key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

function SearchForm() {
  const [q, setQ] = useState('')

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (q.trim()) window.location.href = '/search?q=' + encodeURIComponent(q.trim())
  }

  return (
    <form onSubmit={onSubmit} className="search-form" role="search">
      <input
        value={q}
        onChange={(event) => setQ(event.target.value)}
        aria-label="Search products"
        className="search-input"
        placeholder="Search NexCart"
      />
      <button type="submit" className="search-button">Search</button>
    </form>
  )
}
