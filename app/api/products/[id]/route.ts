import { NextResponse } from 'next/server'
import { getSupabaseClient } from '../../../../lib/supabase'

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

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const supabase = getSupabaseClient()

  if (!supabase) {
    return NextResponse.json(
      {
        error: 'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
      },
      { status: 503 },
    )
  }

  const { data, error } = await supabase.from('products').select('*').eq('id', id).single()

  if (error) {
    if (error.code === 'PGRST116' || error.message.includes('No rows found')) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(normalizeProduct(data as ProductRow))
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
