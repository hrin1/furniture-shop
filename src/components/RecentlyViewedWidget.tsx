import { useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { products } from "@/data/products";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";

export default function RecentlyViewedWidget() {
  const { items } = useRecentlyViewed();
  const [collapsed, setCollapsed] = useState(false);

  const viewedProducts = items
    .map((item) => products.find((p) => p.id === item.id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (viewedProducts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 w-40">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wide text-neutral-900 f-mont">오늘 본 상품</span>
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "펼치기" : "접기"}
          aria-expanded={!collapsed}
          className="cursor-pointer text-neutral-400 hover:text-neutral-900"
        >
          <X className={`h-3.5 w-3.5 transition-transform duration-300 ${collapsed ? "rotate-45" : ""}`} />
        </button>
      </div>

      {!collapsed && (
        <ul className="flex flex-col gap-2">
          {viewedProducts.map((product) => (
            <li key={product.id}>
              <Link
                to={`/products/${product.id}`}
                className="flex items-center gap-2 bg-white p-1.5 shadow-md transition-opacity hover:opacity-80"
              >
                <span className="h-10 w-10 shrink-0 overflow-hidden bg-neutral-100">
                  <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                </span>
                <span className="min-w-0 text-[11px] leading-tight text-neutral-700 line-clamp-2">
                  {product.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
