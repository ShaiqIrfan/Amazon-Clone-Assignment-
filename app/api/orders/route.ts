import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseAdminClient } from '../../../lib/supabase'

const orderSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2),
    email: z.string().trim().email(),
    phone: z.string().trim().min(7).optional().or(z.literal('')).transform((value) => value || null),
    address: z.string().trim().min(5),
    city: z.string().trim().min(2),
    country: z.string().trim().min(2),
  }),
  items: z.array(
    z.object({
      product_id: z.string().trim().min(1),
      quantity: z.number().int().min(1),
    }),
  ).min(1),
  shipping: z.number().nonnegative().default(0),
})

export async function POST(request: Request) {
  const supabaseAdmin = getSupabaseAdminClient()

  if (!supabaseAdmin) {
    return NextResponse.json(
      {
        error: 'Supabase service role is not configured. Add SUPABASE_SERVICE_ROLE_KEY to the server environment.',
      },
      { status: 503 },
    )
  }

  let body: unknown

  try {
    body = await request.json()
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  const parsed = orderSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: parsed.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      },
      { status: 400 },
    )
  }

  const { customer, items, shipping } = parsed.data
  const productIds = [...new Set(items.map((item) => item.product_id))]

  const { data: products, error: productError } = await supabaseAdmin
    .from('products')
    .select('id, name, price, stock')
    .in('id', productIds)

  if (productError) {
    return NextResponse.json({ error: productError.message }, { status: 500 })
  }

  if (!products || products.length !== productIds.length) {
    return NextResponse.json({ error: 'One or more product IDs are invalid' }, { status: 400 })
  }

  const productMap = new Map((products ?? []).map((product) => [product.id, product]))

  for (const item of items) {
    const product = productMap.get(item.product_id)

    if (!product) {
      return NextResponse.json({ error: `Product not found: ${item.product_id}` }, { status: 400 })
    }

    if (Number(product.stock) < item.quantity) {
      return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 })
    }
  }

  const subtotal = items.reduce((sum, item) => {
    const product = productMap.get(item.product_id)
    return sum + Number(product!.price) * item.quantity
  }, 0)

  const totalAmount = subtotal + Number(shipping)

  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert({
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      shipping_address: customer.address,
      city: customer.city,
      country: customer.country,
      total_amount: totalAmount,
      status: 'pending',
    })
    .select()
    .single()

  if (orderError || !order) {
    return NextResponse.json({ error: orderError?.message ?? 'Unable to create order' }, { status: 500 })
  }

  const orderItems = items.map((item) => {
    const product = productMap.get(item.product_id)
    return {
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: Number(product!.price),
    }
  })

  const { error: orderItemsError } = await supabaseAdmin.from('order_items').insert(orderItems)

  if (orderItemsError) {
    return NextResponse.json({ error: orderItemsError.message }, { status: 500 })
  }

  for (const item of items) {
    const product = productMap.get(item.product_id)
    const updatedStock = Number(product!.stock) - item.quantity

    const { error: stockError } = await supabaseAdmin
      .from('products')
      .update({ stock: updatedStock })
      .eq('id', item.product_id)

    if (stockError) {
      return NextResponse.json({ error: stockError.message }, { status: 500 })
    }
  }

  return NextResponse.json(
    {
      id: order.id,
      reference: `NX-${order.id.slice(0, 8).toUpperCase()}`,
      status: order.status,
      total_amount: Number(order.total_amount),
      customer,
      items: orderItems,
    },
    { status: 201 },
  )
}
