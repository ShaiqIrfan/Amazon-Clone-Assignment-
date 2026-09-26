"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '../../lib/cart'
import { useDemoAuth } from '../../lib/auth'
import { getProductsByIds } from '../../lib/products'
import { Product } from '../../lib/types'

const formatPrice = (value: number) => '$' + value.toFixed(2)

export default function CheckoutPage() {
  const router = useRouter()
  const { items, isHydrated: isCartHydrated, clear } = useCart()
  const { isSignedIn, isHydrated } = useDemoAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postal, setPostal] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('United States')
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [paymentMethod, setPaymentMethod] = useState('demo-card')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [lineItems, setLineItems] = useState<Array<{ id: string; product: Product; qty: number }>>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isHydrated && !isSignedIn) router.replace('/account?next=/checkout')
  }, [isHydrated, isSignedIn, router])

  useEffect(() => {
    if (!isCartHydrated) return

    const ids = Object.keys(items)

    if (!ids.length) {
      setLineItems([])
      return
    }

    let active = true

    getProductsByIds(ids)
      .then((products) => {
        if (!active) return

        const productMap = new Map(products.map((product) => [product.id, product]))
        const nextItems = ids
          .map((id) => ({ id, qty: items[id].quantity, product: productMap.get(id) }))
          .filter((item): item is { id: string; qty: number; product: Product } => Boolean(item.product))

        setLineItems(nextItems)
      })
      .catch(() => {
        if (active) setLineItems([])
      })

    return () => {
      active = false
    }
  }, [isCartHydrated, items])

  const subtotal = lineItems.reduce((total, item) => total + item.product.price * item.qty, 0)
  const shipping = shippingMethod === 'express' ? 12 : (subtotal >= 100 || subtotal === 0 ? 0 : 5)
  const total = subtotal + shipping

  async function placeOrder() {
    if (!isSignedIn) return router.replace('/account?next=/checkout')

    const next: Record<string, string> = {}
    if (!name.trim()) next.name = 'Enter your full name.'
    if (!email.trim()) next.email = 'Enter your email address.'
    if (!address.trim()) next.address = 'Enter your address.'
    if (!city.trim()) next.city = 'Enter your city.'
    if (!postal.trim()) next.postal = 'Enter your postal code.'
    if (!phone.trim()) next.phone = 'Enter your phone number.'
    if (!country.trim()) next.country = 'Enter your country.'
    if (!lineItems.length) next.cart = 'Your cart is empty. Add an item before checking out.'
    setErrors(next)

    if (Object.keys(next).length) return

    setSubmitting(true)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name,
            email,
            phone,
            address,
            city,
            country,
          },
          items: lineItems.map((item) => ({ product_id: item.id, quantity: item.qty })),
          shipping,
        }),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        setErrors({ form: payload.error || 'Your order could not be placed. Please try again.' })
        return
      }

      sessionStorage.setItem(
        'lastDemoOrder',
        JSON.stringify({
          ref: payload.reference,
          items: lineItems.map((item) => ({ title: item.product.title, qty: item.qty, total: item.product.price * item.qty })),
          shipping,
          total: Number(payload.total_amount || total),
        }),
      )

      clear()
      router.push('/checkout/confirmation?ref=' + payload.reference)
    } catch (error) {
      setErrors({ form: 'Something went wrong while creating your order. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (!isHydrated || !isSignedIn) return <div className="container page"><div className="empty-state"><h2>Sign-in required</h2><p>Redirecting to the NexCart demo sign-in page…</p></div></div>
  if (!isCartHydrated) return <div className="container page"><p className="eyebrow">Secure demo checkout</p><h1 className="page-title">Checkout</h1><p className="page-subtitle">Loading your saved cart…</p></div>

  return <div className="container page">
    <p className="eyebrow">Secure demo checkout</p><h1 className="page-title">Checkout</h1><p className="page-subtitle">Complete your delivery details to place a real order through the NexCart API.</p>
    <div className="cart-layout"><main className="checkout-form">
      <section className="checkout-section"><h2>Delivery information</h2><div className="form-grid">
        <Field label="Full name" value={name} onChange={setName} error={errors.name} />
        <Field label="Email address" value={email} onChange={setEmail} error={errors.email} />
        <Field label="Phone number" value={phone} onChange={setPhone} error={errors.phone} />
        <Field label="Address" value={address} onChange={setAddress} error={errors.address} full />
        <Field label="City" value={city} onChange={setCity} error={errors.city} />
        <Field label="Postal code" value={postal} onChange={setPostal} error={errors.postal} />
        <Field label="Country" value={country} onChange={setCountry} error={errors.country} />
      </div></section>
      <section className="checkout-section"><h2>Shipping method</h2><div className="choice-list"><Choice name="shipping" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} label={'Standard delivery (' + (subtotal >= 100 ? 'Free' : '$5.00') + ')'} /><Choice name="shipping" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} label="Express delivery ($12.00)" /></div></section>
      <section className="checkout-section"><h2>Payment method</h2><div className="choice-list"><Choice name="payment" checked={paymentMethod === 'demo-card'} onChange={() => setPaymentMethod('demo-card')} label="Demo card payment" /><Choice name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} label="Cash on delivery (demo)" /></div><p className="demo-note">Demo checkout only — no card or payment details are collected.</p></section>
      {errors.cart && <p className="checkout-error" role="alert">{errors.cart}</p>}
      {errors.form && <p className="checkout-error" role="alert">{errors.form}</p>}
      <button type="button" onClick={placeOrder} className="button" style={{ marginTop: '25px' }} disabled={submitting}>{submitting ? 'Processing…' : 'Place your order'}</button>
    </main>
    <aside className="summary-card"><h2>Order summary</h2><div style={{ marginTop: '14px' }}>{lineItems.map((item) => <div key={item.product.id} className="summary-row"><span>{item.product.title} × {item.qty}</span><span>{formatPrice(item.product.price * item.qty)}</span></div>)}<div className="summary-row"><span>Items subtotal</span><span>{formatPrice(subtotal)}</span></div><div className="summary-row"><span>Delivery</span><span>{shipping ? formatPrice(shipping) : 'Free'}</span></div><div className="summary-total"><span>Total</span><span>{formatPrice(total)}</span></div></div></aside>
    </div>
  </div>
}
function Field({ label, value, onChange, error, full = false }: { label: string; value: string; onChange: (value: string) => void; error?: string; full?: boolean }) { return <label className={'form-field' + (full ? ' full' : '')}>{label}<input value={value} onChange={(event) => onChange(event.target.value)} />{error && <span className="field-error" role="alert">{error}</span>}</label> }
function Choice({ name, checked, onChange, label }: { name: string; checked: boolean; onChange: () => void; label: string }) { return <label className="choice"><input type="radio" name={name} checked={checked} onChange={onChange} />{label}</label> }
