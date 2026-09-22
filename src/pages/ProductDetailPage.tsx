import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Heart, Minus, Plus } from "lucide-react";
import { getProductById } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";

const priceFormatter = new Intl.NumberFormat("ko-KR");

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = id ? getProductById(id) : undefined;

  const { addToCart } = useCart();
  const { isLiked, toggleLike } = useWishlist();
  const { addViewed } = useRecentlyViewed();

  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  // 상품이 바뀌면(다른 상세 페이지로 이동) 선택 상태 초기화
  useEffect(() => {
    setSelectedColor(product?.colors?.[0]);
    setQuantity(1);
    setJustAdded(false);
    setActiveImage(0);
  }, [product?.id]);

  useEffect(() => {
    if (product) addViewed(product.id);
  }, [product?.id]);

  if (!product) {
    return (
      <div className="px-6 py-32 text-center md:py-44">
        <p className="text-sm text-neutral-500">상품을 찾을 수 없습니다.</p>
        <Link to="/products" className="mt-4 inline-block text-sm text-neutral-900 underline underline-offset-4">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const liked = isLiked(product.id);
  const hasColors = !!product.colors && product.colors.length > 0;
  const needsColorSelection = hasColors && !selectedColor;
  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl];

  const handleAddToCart = () => {
    if (!product.inStock || needsColorSelection) return;
    addToCart(product, quantity, selectedColor);
    setJustAdded(true);
  };

  const handleBuyNow = () => {
    if (!product.inStock || needsColorSelection) return;
    addToCart(product, quantity, selectedColor);
    navigate("/cart");
  };

  return (
    <div className="px-6 pb-24 pt-28 md:px-16 md:pb-32 md:pt-36">
      <nav aria-label="breadcrumb" className="flex items-center gap-2 text-xs text-neutral-500 f-mont">
        <Link to="/" className="text-neutral-900 transition-opacity hover:opacity-60">
          Home
        </Link>
        <span aria-hidden>/</span>
        <Link to="/products" className="text-neutral-900 transition-opacity hover:opacity-60">
          Shop
        </Link>
        <span aria-hidden>/</span>
        <span>{product.name}</span>
      </nav>

      <div className="mt-8 grid grid-cols-1 gap-10 md:mt-12 md:grid-cols-2 md:gap-16">
        {/* 이미지 */}
        <div className="flex flex-col gap-3 md:flex-row">
          {/* 메인 이미지 */}
          <div className="relative order-1 aspect-square flex-1 overflow-hidden bg-neutral-100 md:order-2">
            <img src={images[activeImage]} alt={product.name} className="h-full w-full object-cover" />
            {!product.inStock && (
              <span className="pointer-events-none absolute right-0 top-4 bg-neutral-900 px-3 py-1 text-[10px] tracking-[0.16em] text-white f-mont">
                SOLD OUT
              </span>
            )}
          </div>

          {/* 썸네일 리스트 */}
          {images.length > 1 && (
            <ul
              aria-label="상품 이미지 목록"
              className="order-2 flex gap-3 overflow-x-auto md:order-1 md:w-20 md:flex-col md:overflow-visible"
            >
              {images.map((img, i) => {
                const isActive = activeImage === i;
                return (
                  <li key={img + i} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveImage(i)}
                      aria-label={`${product.name} 이미지 ${i + 1}`}
                      aria-pressed={isActive}
                      className={`h-16 w-16 cursor-pointer overflow-hidden border-2 transition-colors md:h-20 md:w-20 ${
                        isActive ? "border-neutral-900" : "border-transparent hover:border-neutral-300"
                      }`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* 정보 */}
        <div className="flex flex-col">
          {product.material && <p className="text-xs text-neutral-500 f-mont">{product.material}</p>}

          <h1 className="mt-2 text-2xl font-semibold text-neutral-900 md:text-3xl">{product.name}</h1>

          <p className="mt-3 text-xl text-neutral-900 f-mont tabular-nums">￦ {priceFormatter.format(product.price)}</p>

          <p className="mt-6 max-w-[520px] text-sm leading-[1.8] text-neutral-500">{product.description}</p>

          {product.dimensions && (
            <p className="mt-4 text-sm text-neutral-500 f-mont tabular-nums">
              W {product.dimensions.width} × H {product.dimensions.height} × D {product.dimensions.depth} (cm)
            </p>
          )}

          {hasColors && (
            <div className="mt-8">
              <p className="mb-3 text-sm font-medium text-neutral-900">
                색상{" "}
                {selectedColor ? (
                  <span className="text-neutral-400">선택됨</span>
                ) : (
                  <span className="text-neutral-400">선택해주세요</span>
                )}
              </p>
              <ul className="flex flex-wrap gap-3" aria-label="색상 선택">
                {product.colors!.map((color) => {
                  const isSelected = selectedColor === color;
                  return (
                    <li key={color}>
                      <button
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        aria-pressed={isSelected}
                        aria-label={color}
                        className={`h-9 w-9 cursor-pointer rounded-full border-2 transition-colors ${
                          isSelected ? "border-neutral-900" : "border-transparent hover:border-neutral-300"
                        }`}
                      >
                        <span
                          className="block h-full w-full rounded-full border border-black/10"
                          style={{ backgroundColor: color }}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="mt-8">
            <p className="mb-3 text-sm font-medium text-neutral-900">수량</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-neutral-300">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="수량 감소"
                  className="flex h-10 w-10 cursor-pointer items-center justify-center text-neutral-700 transition-opacity hover:opacity-60 disabled:cursor-default disabled:opacity-30"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-10 text-center text-sm f-mont tabular-nums">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="수량 증가"
                  className="flex h-10 w-10 cursor-pointer items-center justify-center text-neutral-700 transition-opacity hover:opacity-60"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <p className="text-sm text-neutral-500 f-mont tabular-nums">
                총 ￦ {priceFormatter.format(product.price * quantity)}
              </p>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.inStock || needsColorSelection}
              className="h-13 flex-1 cursor-pointer bg-neutral-900 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-30"
            >
              {!product.inStock ? "품절" : justAdded ? "담았습니다" : "장바구니 담기"}
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!product.inStock || needsColorSelection}
              className="h-13 flex-1 cursor-pointer border border-neutral-900 text-sm font-medium text-neutral-900 transition-opacity hover:opacity-60 disabled:cursor-default disabled:opacity-30"
            >
              바로 구매
            </button>

            <button
              type="button"
              onClick={() => toggleLike(product.id)}
              aria-pressed={liked}
              aria-label={liked ? "위시리스트에서 빼기" : "위시리스트에 담기"}
              className="group flex h-13 w-13 shrink-0 cursor-pointer items-center justify-center border border-neutral-300"
            >
              <Heart
                className={`h-4.5 w-4.5 transition-colors duration-300 ${
                  liked
                    ? "fill-[#FF3F3F] text-[#FF3F3F]"
                    : "fill-transparent text-neutral-400 group-hover:text-[#FF3F3F]"
                }`}
              />
            </button>
          </div>

          {needsColorSelection && <p className="mt-3 text-xs text-[#FF3F3F]">색상을 선택해주세요.</p>}
        </div>
      </div>
    </div>
  );
}
