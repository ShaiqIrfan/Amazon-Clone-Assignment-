"use client"
import { useState } from 'react'

export default function QuantitySelector({ value = 1, onChange }: { value?: number; onChange: (n: number) => void }) {
  const [qty, setQty] = useState<number>(value)
  return (
    <div className="quantity-control">
      <button type="button" aria-label="Decrease quantity" onClick={() => { const n = Math.max(1, qty - 1); setQty(n); onChange(n) }}>−</button>
      <input type="number" min="1" aria-label="Quantity" value={qty} onChange={(e) => { const n = Math.max(1, Number(e.target.value) || 1); setQty(n); onChange(n) }} />
      <button type="button" aria-label="Increase quantity" onClick={() => { const n = qty + 1; setQty(n); onChange(n) }}>+</button>
    </div>
  )
}
