import fs from 'node:fs/promises'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  const seedFilePath = path.join(process.cwd(), 'data', 'products.json')
  const file = await fs.readFile(seedFilePath, 'utf8')
  const products = JSON.parse(file)

  for (const product of products) {
    const { data, error } = await supabase
      .from('products')
      .upsert(
        {
          id: product.id,
          name: product.title,
          description: product.description,
          price: Number(product.price),
          original_price: product.originalPrice ?? null,
          image: product.images?.[0] ?? null,
          category: product.category,
          rating: Number(product.rating ?? 0),
          review_count: Number(product.reviewCount ?? 0),
          badge: Array.isArray(product.tags) && product.tags.length ? product.tags[0] : null,
          stock: product.stock ?? 100,
        },
        { onConflict: 'id' },
      )
      .select()

    if (error) {
      console.error('Failed to upsert product', product.id, error.message)
      process.exit(1)
    }

    console.log('Upserted', data?.[0]?.name || product.title)
  }

  console.log(`Seeded ${products.length} products into Supabase.`)
}

main().catch((error: unknown) => {
  console.error('Seed failed:', error)
  process.exit(1)
})
