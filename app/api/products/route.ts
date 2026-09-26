import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '../../../lib/supabase'

type ProductRow = {
  id: string
  name: string
  description?: string | null
  price: number | string
  original_price?: number | string | null
  image?: string | null
  category?: string | null
  rating?: number | string | null
  review_count?: number | string | null
  badge?: string | null
  stock?: number | string | null
}

export async function GET(request: NextRequest) {
  const supabase = getSupabaseClient()

  if (!supabase) {
    return NextResponse.json(
      {
        error: 'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
      },
      { status: 503 },
    )
  }

  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')?.trim()
  const search = searchParams.get('search')?.trim()

  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const products = (data ?? []).map(normalizeProduct)
  const filtered = products.filter((product) => {
    if (category && product.category.toLowerCase() !== category.toLowerCase()) {
      return false
    }

    if (!search) {
      return true
    }

    const query = normalizeSearchText(search)
    const searchableText = normalizeSearchText([
      product.title,
      product.description,
      product.category,
      ...(product.tags ?? []),
    ].join(' '))

    return query.split(' ').every((term) => searchableText.includes(term))
  })

  return NextResponse.json(filtered)
}

function normalizeProduct(row: ProductRow) {
  return {
    id: row.id,
    title: row.name,
    price: Number(row.price ?? 0),
    originalPrice: row.original_price != null ? Number(row.original_price) : undefined,
    rating: row.rating != null ? Number(row.rating) : undefined,
    reviewCount: row.review_count != null ? Number(row.review_count) : undefined,
    category: row.category ?? 'Uncategorized',
    description: row.description ?? '',
    images: row.image ? [row.image] : [],
    tags: row.badge ? [row.badge] : [],
    stock: Number(row.stock ?? 0),
  }
}

function normalizeSearchText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}
