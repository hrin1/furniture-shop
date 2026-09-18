import { Link } from 'react-router-dom'
import type { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group block rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-square bg-gray-100 overflow-hidden relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!product.inStock && (
          <span className="absolute top-2 left-2 bg-gray-900/80 text-white text-xs px-2 py-1 rounded">
            SOLD OUT
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm text-gray-500">{product.material}</p>
        <h3 className="font-medium mt-1">{product.name}</h3>
        <p className="mt-1 font-semibold">{product.price.toLocaleString()}원</p>
      </div>
    </Link>
  )
}