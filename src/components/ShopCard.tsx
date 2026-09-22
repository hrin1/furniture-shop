import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import type { Product } from "@/types/product";
import { useWishlist } from "@/contexts/WishlistContext";

const priceFormatter = new Intl.NumberFormat("ko-KR");

export type ShopCardViewMode = "grid" | "list";

interface ShopCardProps {
  product: Product;
  view: ShopCardViewMode;
}

/** 레퍼런스 스타일 상품 카드 (회색 이미지 박스 / 이름·가격 / 우측 하트 / 색상 점) */
export default function ShopCard({ product, view }: ShopCardProps) {
  const isList = view === "list";
  const { isLiked, toggleLike } = useWishlist();
  const liked = isLiked(product.id);

  return (
    <article className={isList ? "group flex items-center gap-6 md:gap-10 border-b border-neutral-200 pb-8" : "group"}>
      <div
        className={`relative overflow-hidden bg-neutral-100 aspect-square ${isList ? "w-36 sm:w-56 shrink-0" : "w-full"}`}
      >
        <Link to={`/products/${product.id}`} aria-label={product.name} className="block w-full h-full">
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </Link>

        {!product.inStock && (
          <span className="pointer-events-none absolute right-0 top-4 bg-neutral-900 px-3 py-1 text-[10px] tracking-[0.16em] text-white f-mont">
            SOLD OUT
          </span>
        )}
      </div>

      <div className={`flex items-start justify-between gap-3 ${isList ? "flex-1" : "mt-4"}`}>
        <div className="min-w-0">
          <h3 className="text-sm md:text-base text-neutral-900">
            <Link to={`/products/${product.id}`} className="transition-opacity hover:opacity-60">
              {product.name}
            </Link>
          </h3>

          <p className="mt-1 text-sm text-neutral-500 f-mont tabular-nums">￦ {priceFormatter.format(product.price)}</p>

          {isList && (
            <p className="mt-3 max-w-[520px] text-sm leading-[1.8] text-neutral-500 line-clamp-2">
              {product.description}
            </p>
          )}

          {product.colors && product.colors.length > 0 && (
            <ul className="mt-3 flex items-center gap-1.5" aria-label="색상">
              {product.colors.map((color) => (
                <li
                  key={color}
                  className="h-2.5 w-2.5 rounded-full border border-black/10"
                  style={{ backgroundColor: color }}
                />
              ))}
            </ul>
          )}
        </div>

        <button
          type="button"
          onClick={() => toggleLike(product.id)}
          aria-pressed={liked}
          aria-label={liked ? "위시리스트에서 빼기" : "위시리스트에 담기"}
          className="group shrink-0 cursor-pointer p-1"
        >
          <Heart
            className={`h-4 w-4 transition-colors duration-300 ${
              liked ? "fill-[#FF3F3F] text-[#FF3F3F]" : "fill-transparent text-neutral-400 group-hover:text-[#FF3F3F]"
            }`}
          />
        </button>
      </div>
    </article>
  );
}
