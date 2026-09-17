"use client"
import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '../lib/cart'
import { useDemoAuth } from '../lib/auth'

const navigation = [
  ['All', '/'], ["Today's Deals", '/deals'], ['Gift Cards', '/gift-cards'], ['Coupons', '/coupons'],
  ['Fashion', '/category/Fashion'], ['Home', '/category/Home'], ['Electronics', '/category/Electronics'],
  ['Beauty', '/category/Beauty'], ['Grocery', '/category/Grocery'], ['Customer Service', '/help'],
]

export default function Header() {
  const { itemCount } = useCart()
  const { isSignedIn, isHydrated } = useDemoAuth()
  return <header className="site-header">
    <div className="container header-main">
      <Link href="/location" className="delivery" aria-label="Choose delivery location"><small>Deliver to</small><strong>Pakistan</strong></Link>
      <Link href="/" className="brand" aria-label="NexCart home"><img src="/images/nexcart-mark.svg" className="brand-mark" alt="NexCart shopping bag" /><span>NexCart</span></Link>
      <SearchForm />
      <nav className="header-actions" aria-label="Account and cart">
        <Link href="/account" className="header-action">{isHydrated && isSignedIn ? 'Hello, demo shopper' : 'Hello, sign in'}<strong>Accounts & Lists</strong></Link>
        <Link href="/orders" className="header-action">Returns<strong>& Orders</strong></Link>
        <Link href="/cart" className="cart-link" aria-label={'Cart, ' + itemCount + ' items'}>Cart <span className="cart-count">{itemCount}</span></Link>
      </nav>
    </div>
    <nav className="header-nav" aria-label="Shopping navigation"><div className="container nav-list">
      {navigation.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}
    </div></nav>
  </header>
}

function SearchForm() {
  const [q, setQ] = useState('')
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (q.trim()) window.location.href = '/search?q=' + encodeURIComponent(q.trim())
  }
  return <form onSubmit={onSubmit} className="search-form" role="search">
    <input value={q} onChange={(event) => setQ(event.target.value)} aria-label="Search products" className="search-input" placeholder="Search NexCart" />
    <button type="submit" className="search-button">Search</button>
  </form>
}
