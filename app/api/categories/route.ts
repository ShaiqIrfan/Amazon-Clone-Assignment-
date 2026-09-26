import { NextResponse } from 'next/server'
import { getSupabaseClient } from '../../../lib/supabase'

export async function GET() {
  const supabase = getSupabaseClient()

  if (!supabase) {
    return NextResponse.json(
      {
        error: 'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
      },
      { status: 503 },
    )
  }

  const { data, error } = await supabase.from('products').select('category')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const categories = [...new Set((data ?? []).map((row) => row.category).filter(Boolean))]
  return NextResponse.json(categories)
}
