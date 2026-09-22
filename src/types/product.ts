export interface Product {
  id: string
  name: string
  price: number
  category: ProductCategory
  imageUrl: string
  images?: string[]
  description: string
  colors?: string[]
  material?: string
  dimensions?: {
    width: number
    height: number
    depth: number
  }
  inStock: boolean
}

export type ProductCategory =
  | 'sofa'
  | 'chair'
  | 'table'
  | 'bed'
  | 'storage'
  | 'lighting'

export interface CartItem {
  product: Product
  quantity: number
  selectedColor?: string
}