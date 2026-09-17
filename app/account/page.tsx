"use client"
import { Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDemoAuth } from '../../lib/auth'

export default function AccountPage() {
  return <Suspense fallback={<div className="container page">Loading demo account…</div>}><AccountContents /></Suspense>
}

function AccountContents() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isSignedIn, isHydrated, signIn, signOut } = useDemoAuth()
  const next = searchParams.get('next') === '/checkout' ? '/checkout' : '/'

  if (!isHydrated) return <div className="container page">Loading demo account…</div>
  if (isSignedIn) return <div className="container page">
    <p className="eyebrow">Demo account</p><h1 className="page-title">Accounts & Lists</h1>
    <p className="page-subtitle">You are signed in to the NexCart demo on this browser. No personal account or credentials are used.</p>
    <div className="info-grid section">
      <section className="info-card"><h2>Ready for checkout</h2><p>Your cart and demo checkout are available now.</p><Link href={next} className="button">{next === '/checkout' ? 'Continue to checkout' : 'Browse catalog'}</Link></section>
      <section className="info-card"><h2>Demo session</h2><p>Signing out removes this browser-only demo sign-in state. It does not affect your cart.</p><button type="button" className="button-secondary" onClick={() => { signOut(); router.replace('/') }}>Sign out</button></section>
    </div>
  </div>

  return <div className="container page">
    <p className="eyebrow">Demo account</p><h1 className="page-title">Sign in to continue</h1>
    <p className="page-subtitle">Checkout requires a demo sign-in. This does not collect a password or create a real account.</p>
    <div className="info-grid section">
      <section className="info-card"><h2>Demo sign-in</h2><p>Use this browser-only sign-in to unlock the simulated checkout flow.</p><button type="button" className="button" onClick={() => { signIn(); router.push(next) }}>Sign in to NexCart demo</button></section>
      <section className="info-card"><h2>Keep browsing</h2><p>You can search, shop, and manage your cart without signing in.</p><Link href="/" className="button-secondary">Continue shopping</Link></section>
    </div>
  </div>
}
