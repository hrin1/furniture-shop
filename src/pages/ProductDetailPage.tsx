import { useParams } from 'react-router-dom'
import { getProductById } from '@/data/products'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const product = id ? getProductById(id) : undefined

  if (!product) return <div className="p-6">Product not found.</div>

  return <div className="p-6">{product.name}</div>
}