"use client"
import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react'

type CartItem = { id: string; quantity: number }

type Cart = Record<string, CartItem>

type CartContextValue = {
  items: Cart
  itemCount: number
  add: (id: string, qty?: number) => void
  remove: (id: string) => void
  setQty: (id: string, qty: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Cart>({})
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart')
      if (raw) setItems(JSON.parse(raw))
    } catch (e) {
      setItems({})
    } finally {
      setHasLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (!hasLoaded) return
    try {
      localStorage.setItem('cart', JSON.stringify(items))
    } catch (e) {}
  }, [hasLoaded, items])

  const add = (id: string, qty = 1) => {
    setItems((prev) => ({ ...prev, [id]: { id, quantity: (prev[id]?.quantity || 0) + qty } }))
  }
  const remove = (id: string) => setItems((prev) => { const c = { ...prev }; delete c[id]; return c })
  const setQty = (id: string, qty: number) => setItems((prev) => ({ ...prev, [id]: { id, quantity: Math.max(1, qty) } }))
  const clear = () => setItems({})
  const itemCount = useMemo(() => Object.values(items).reduce((total, item) => total + item.quantity, 0), [items])

  return <CartContext.Provider value={{ items, itemCount, add, remove, setQty, clear }}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
