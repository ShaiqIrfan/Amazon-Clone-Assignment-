import products from '../data/products.json'
import { Product } from './types'

export function getAllProducts(): Product[] {
  return products as Product[]
}

export function getProductById(id: string): Product | undefined {
  return getAllProducts().find((p) => p.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  return getAllProducts().filter((p) => p.category.toLowerCase() === category.toLowerCase())
}

export function searchProducts(query: string): Product[] {
  const q = normalizeSearchText(query)
  if (!q) return []
  const queryWords = q.split(' ')
  return getAllProducts().filter((p) => {
    const searchableText = normalizeSearchText([p.title, p.description, p.category, ...(p.tags || [])].join(' '))
    return queryWords.every((word) => searchableText.includes(word))
  })
}

function normalizeSearchText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return getAllProducts().filter((p) => p.id !== product.id && p.category === product.category).slice(0, limit)
}
