import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { CartItem, Product } from "@/types/product";

const STORAGE_KEY = "cart-items";

/** 같은 상품이라도 선택 색상이 다르면 별도 라인아이템으로 취급하기 위한 key */
function makeLineKey(productId: string, selectedColor?: string) {
  return `${productId}::${selectedColor ?? ""}`;
}

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: Product, quantity: number, selectedColor?: string) => void;
  removeFromCart: (productId: string, selectedColor?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedColor?: string) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

function readInitial(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readInitial);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity: number, selectedColor?: string) => {
    setItems((prev) => {
      const key = makeLineKey(product.id, selectedColor);
      const existing = prev.find((item) => makeLineKey(item.product.id, item.selectedColor) === key);

      if (existing) {
        return prev.map((item) =>
          makeLineKey(item.product.id, item.selectedColor) === key
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [...prev, { product, quantity, selectedColor }];
    });
  };

  const removeFromCart = (productId: string, selectedColor?: string) => {
    const key = makeLineKey(productId, selectedColor);
    setItems((prev) => prev.filter((item) => makeLineKey(item.product.id, item.selectedColor) !== key));
  };

  const updateQuantity = (productId: string, quantity: number, selectedColor?: string) => {
    if (quantity < 1) return;
    const key = makeLineKey(productId, selectedColor);
    setItems((prev) =>
      prev.map((item) => (makeLineKey(item.product.id, item.selectedColor) === key ? { ...item, quantity } : item)),
    );
  };

  const clearCart = () => setItems([]);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalCount, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
