import { Product } from './types'

const apiFetchOptions = {
  next: { revalidate: 60 },
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path, apiFetchOptions)

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new Error(payload.error || 'Failed to load data from the NexCart API.')
  }

  return (await response.json()) as T
}

export async function getAllProducts(): Promise<Product[]> {
  return fetchJson<Product[]>('/api/products')
}

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    return await fetchJson<Product>(`/api/products/${encodeURIComponent(id)}`)
  } catch {
    return undefined
  }
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  const uniqueIds = [...new Set(ids.filter(Boolean))]

  if (!uniqueIds.length) {
    return []
  }

  const products = await Promise.all(
    uniqueIds.map(async (id) => getProductById(id)),
  )

  return products.filter((product): product is Product => Boolean(product))
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = await getAllProducts()
  const normalizedCategory = category.trim().toLowerCase()

  return products.filter((product) => product.category.trim().toLowerCase() === normalizedCategory)
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = normalizeSearchText(query)
  if (!q) return []

  const queryWords = q.split(' ')
  const products = await getAllProducts()

  return products.filter((product) => {
    const searchableText = normalizeSearchText([product.title, product.description, product.category, ...(product.tags || [])].join(' '))
    return queryWords.every((word) => searchableText.includes(word))
  })
}

export async function getCategories(): Promise<string[]> {
  return fetchJson<string[]>('/api/categories')
}

function normalizeSearchText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const products = await getAllProducts()
  return products.filter((item) => item.id !== product.id && item.category === product.category).slice(0, limit)
}
