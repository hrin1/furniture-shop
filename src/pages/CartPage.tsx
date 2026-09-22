import { Link } from "react-router-dom";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const priceFormatter = new Intl.NumberFormat("ko-KR");

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();

  return (
    <div className="px-6 pb-24 pt-28 md:px-16 md:pb-32 md:pt-36">
      <h1 className="text-3xl font-bold uppercase tracking-tighter text-neutral-900 f-mont md:text-5xl">Cart</h1>

      {items.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-sm text-neutral-500">장바구니가 비어있습니다.</p>
          <Link to="/products" className="mt-4 inline-block text-sm text-neutral-900 underline underline-offset-4">
            쇼핑 계속하기
          </Link>
        </div>
      ) : (
        <div className="mt-10 flex flex-col gap-16 md:mt-14 md:flex-row">
          {/* 상품 목록 */}
          <ul className="flex flex-1 flex-col divide-y divide-neutral-200 border-y border-neutral-200">
            {items.map((item) => {
              const lineKey = `${item.product.id}::${item.selectedColor ?? ""}`;
              return (
                <li key={lineKey} className="flex items-center gap-5 py-6">
                  <Link
                    to={`/products/${item.product.id}`}
                    className="block h-24 w-24 shrink-0 overflow-hidden bg-neutral-100"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/products/${item.product.id}`}
                      className="text-sm text-neutral-900 transition-opacity hover:opacity-60 md:text-base"
                    >
                      {item.product.name}
                    </Link>

                    {item.selectedColor && (
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span
                          className="h-3 w-3 rounded-full border border-black/10"
                          style={{ backgroundColor: item.selectedColor }}
                        />
                        <span className="text-xs text-neutral-500">색상 선택됨</span>
                      </div>
                    )}

                    <p className="mt-2 text-sm text-neutral-500 f-mont tabular-nums">
                      ￦ {priceFormatter.format(item.product.price)}
                    </p>

                    <div className="mt-3 flex items-center border border-neutral-300 w-fit">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedColor)}
                        disabled={item.quantity <= 1}
                        aria-label="수량 감소"
                        className="flex h-8 w-8 cursor-pointer items-center justify-center text-neutral-700 transition-opacity hover:opacity-60 disabled:cursor-default disabled:opacity-30"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-xs f-mont tabular-nums">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedColor)}
                        aria-label="수량 증가"
                        className="flex h-8 w-8 cursor-pointer items-center justify-center text-neutral-700 transition-opacity hover:opacity-60"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4">
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id, item.selectedColor)}
                      aria-label="삭제"
                      className="cursor-pointer text-neutral-400 transition-colors hover:text-neutral-900"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    <p className="text-sm font-medium text-neutral-900 f-mont tabular-nums">
                      ￦ {priceFormatter.format(item.product.price * item.quantity)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* 주문 요약 */}
          <div className="w-full shrink-0 md:w-72">
            <div className="border border-neutral-200 p-6">
              <h2 className="text-sm font-semibold text-neutral-900">주문 요약</h2>

              <div className="mt-5 flex items-center justify-between text-sm">
                <span className="text-neutral-500">상품 금액</span>
                <span className="text-neutral-900 f-mont tabular-nums">￦ {priceFormatter.format(totalPrice)}</span>
              </div>

              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-neutral-500">배송비</span>
                <span className="text-neutral-900 f-mont tabular-nums">무료</span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4 text-sm font-semibold">
                <span className="text-neutral-900">총 결제 금액</span>
                <span className="text-neutral-900 f-mont tabular-nums">￦ {priceFormatter.format(totalPrice)}</span>
              </div>

              <button
                type="button"
                className="mt-6 h-12 w-full cursor-pointer bg-neutral-900 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                주문하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
