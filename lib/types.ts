export type Product = {
  id: string
  title: string
  price: number
  originalPrice?: number
  rating?: number
  reviewCount?: number
  category: string
  description: string
  images: string[]
  tags?: string[]
}
