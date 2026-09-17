"use client"
import Link from 'next/link'
import { useCart } from '../../lib/cart'
import { getProductById } from '../../lib/products'
import { useDemoAuth } from '../../lib/auth'

const formatPrice = (value: number) => '$' + value.toFixed(2)

export default function CartPage() {
  const { items, itemCount, isHydrated: isCartHydrated, setQty, remove } = useCart()
  const { isSignedIn, isHydrated } = useDemoAuth()
  const lineItems = Object.keys(items).map((id) => ({ id, product: getProductById(id), qty: items[id].quantity })).filter((item) => item.product)
  const subtotal = lineItems.reduce((total, item) => total + item.product!.price * item.qty, 0)
  const shipping = subtotal >= 100 || subtotal === 0 ? 0 : 5
  const total = subtotal + shipping
  if (!isCartHydrated) return <div className="container page"><p className="eyebrow">Your bag</p><h1 className="page-title">Shopping Cart</h1><p className="page-subtitle">Loading your saved cart…</p></div>
  return <div className="container page">
    <p className="eyebrow">Your bag</p><h1 className="page-title">Shopping Cart</h1><p className="page-subtitle">{itemCount} item{itemCount === 1 ? '' : 's'} in your cart</p>
    {!lineItems.length ? <div className="empty-state"><h2>Your cart is empty</h2><p>Discover useful everyday finds across the NexCart catalog.</p><Link href="/" className="button">Continue shopping</Link></div>
      : <div className="cart-layout">
        <section className="cart-items" aria-label="Cart items">{lineItems.map(({ id, product, qty }) => <article key={id} className="cart-line">
          <img src={product!.images[0]} alt={product!.title} className="cart-image" />
          <div className="cart-product"><Link href={'/product/' + id}>{product!.title}</Link><p className="page-subtitle">{product!.description.slice(0, 100)}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '14px' }}><div className="quantity-control" aria-label={'Quantity for ' + product!.title}><button type="button" aria-label="Decrease quantity" onClick={() => setQty(id, qty - 1)}>−</button><span style={{ width: '42px', textAlign: 'center' }}>{qty}</span><button type="button" aria-label="Increase quantity" onClick={() => setQty(id, qty + 1)}>+</button></div><button type="button" className="button-link" onClick={() => remove(id)}>Remove</button></div>
          </div>
          <div className="cart-price"><div className="font-medium">{formatPrice(product!.price)}</div><div className="page-subtitle">Item subtotal: {formatPrice(product!.price * qty)}</div></div>
        </article>)}</section>
        <aside className="summary-card"><h2>Order summary</h2><div style={{ marginTop: '14px' }}><div className="summary-row"><span>Items subtotal</span><span>{formatPrice(subtotal)}</span></div><div className="summary-row"><span>Estimated delivery</span><span>{shipping ? formatPrice(shipping) : 'Free'}</span></div><div className="summary-total"><span>Total</span><span>{formatPrice(total)}</span></div></div>{isHydrated && !isSignedIn && <p className="demo-note">Sign in with a demo account to continue to checkout.</p>}<Link href={isHydrated && isSignedIn ? "/checkout" : "/account?next=/checkout"} className="button">{isHydrated && isSignedIn ? 'Proceed to checkout' : 'Sign in to checkout'}</Link></aside>
      </div>}
  </div>
}
