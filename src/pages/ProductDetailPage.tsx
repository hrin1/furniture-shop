import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getProductById } from '@/data/products'
import { useRecentlyViewed } from '@/contexts/RecentlyViewedContext'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const product = id ? getProductById(id) : undefined
  const { addViewed } = useRecentlyViewed()

  useEffect(() => {
    if (product) addViewed(product.id)
  }, [product?.id])

  if (!product) return <div className="p-6">Product not found.</div>

  return <div className="p-6">{product.name}</div>
}