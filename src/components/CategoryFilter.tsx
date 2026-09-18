import { categories } from '@/data/products'
import type { Product } from '@/types/product'

interface CategoryFilterProps {
  selected: Product['category'] | 'all'
  onChange: (category: Product['category'] | 'all') => void
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => onChange('all')}
        className={`px-3 py-1.5 rounded-full text-sm border ${
          selected === 'all'
            ? 'bg-gray-900 text-white border-gray-900'
            : 'border-gray-300 hover:border-gray-500'
        }`}
      >
        ALL
      </button>
      {categories.map((c) => (
        <button
          key={c.value}
          onClick={() => onChange(c.value)}
          className={`px-3 py-1.5 rounded-full text-sm border ${
            selected === c.value
              ? 'bg-gray-900 text-white border-gray-900'
              : 'border-gray-300 hover:border-gray-500'
          }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  )
}