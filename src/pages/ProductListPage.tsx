import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '@/components/ProductCard'
import CategoryFilter from '@/components/CategoryFilter'
import { products } from '@/data/products'
import type { Product } from '@/types/product'

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = (searchParams.get('category') as Product['category'] | null) ?? 'all'
  const query = searchParams.get('q') ?? ''

  const filtered = useMemo(() => {
    let result = products

    if (category !== 'all') {
      result = result.filter((p) => p.category === category)
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.material?.toLowerCase().includes(q)
      )
    }

    return result
  }, [category, query])

  const handleCategoryChange = (next: Product['category'] | 'all') => {
    const params: Record<string, string> = {}
    if (next !== 'all') params.category = next
    if (query) params.q = query
    setSearchParams(params)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-xl font-semibold mb-1">
        {query ? `"${query}" 검색 결과` : '전체 상품'}
      </h1>
      {query && (
        <p className="text-sm text-gray-500 mb-4">{filtered.length}개의 상품을 찾았습니다.</p>
      )}

      <CategoryFilter selected={category} onChange={handleCategoryChange} />

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-gray-500 mt-12">
          {query ? '검색 결과가 없습니다.' : '해당 카테고리에 상품이 없습니다.'}
        </p>
      )}
    </div>
  )
}