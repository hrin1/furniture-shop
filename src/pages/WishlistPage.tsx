import { Link } from "react-router-dom";
import ShopCard from "@/components/ShopCard";
import { products } from "@/data/products";
import { useWishlist } from "@/contexts/WishlistContext";

export default function WishlistPage() {
  const { likedIds } = useWishlist();
  const likedProducts = products.filter((p) => likedIds.has(p.id));

  return (
    <div>
      <section className="bg-neutral-100 px-6 pt-32 pb-14 text-center md:pt-44 md:pb-20">
        <h1 className="text-4xl font-bold uppercase tracking-tighter text-neutral-900 f-mont md:text-6xl">
          Wishlist
        </h1>

        <nav
          aria-label="breadcrumb"
          className="mt-5 flex items-center justify-center gap-2 text-xs text-neutral-500 f-mont"
        >
          <Link to="/" className="text-neutral-900 transition-opacity hover:opacity-60">
            Home
          </Link>
          <span aria-hidden>/</span>
          <span>Wishlist</span>
        </nav>
      </section>

      <div className="px-6 pb-24 md:px-16 md:pb-32">
        <p className="border-b border-neutral-200 py-6 text-sm f-mont md:py-8">
          <span className="font-semibold tabular-nums text-neutral-900">{likedProducts.length}</span>{" "}
          <span className="text-neutral-500">Products</span>
        </p>

        {likedProducts.length === 0 ? (
          <p className="mt-24 text-center text-sm text-neutral-500">담은 상품이 없습니다.</p>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-14 md:gap-x-5 md:gap-y-14 lg:grid-cols-4">
            {likedProducts.map((product) => (
              <ShopCard key={product.id} product={product} view="grid" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
