import { Link } from "react-router-dom";
import { categories } from "@/data/products";

export default function Footer() {
  return (
    <footer className="pt-20 pb-0 px-6 overflow-hidden mt-25">
      <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* 네비게이션 */}
        <nav className="flex items-start gap-10 f-mont">
          <Link
            to="/"
            className="text-neutral-500 hover:text-neutral-800 text-xs font-medium transition-all duration-300"
          >
            HOME
          </Link>
          <Link
            to="/products"
            className="text-neutral-500 hover:text-neutral-800 text-xs font-medium transition-all duration-300"
          >
            PRODUCTS
          </Link>
          {categories.slice(0, 3).map((c) => (
            <Link
              key={c.value}
              to={`/products?category=${c.value}`}
              className="text-neutral-500 hover:text-neutral-800 text-xs font-medium transition-all duration-300"
            >
              {c.label}
            </Link>
          ))}
          <Link
            to="/cart"
            className="text-neutral-500 hover:text-neutral-800 text-xs font-medium transition-all duration-300"
          >
            CART
          </Link>
          <div className="flex items-start md:items-end gap-3 ml-6">
            <Link
              to="/privacy"
              className="text-neutral-700 hover:text-neutral-300 text-xs font-bold transition-all duration-300"
            >
              개인정보처리방침
            </Link>
            <Link
              to="/terms"
              className="text-neutral-700 hover:text-neutral-300 text-xs font-bold transition-all duration-300"
            >
              이용약관
            </Link>
          </div>
        </nav>

        {/* 연락처 */}
        <div className="flex flex-col items-start md:items-end gap-2 f-mont">
          <a
            href="mailto:hello@minimalife.com"
            className="text-neutral-400 hover:text-neutral-800 text-xs transition-all duration-300"
          >
            minimal@minimalife.com
          </a>
          <a
            href="tel:+8210000000"
            className="text-neutral-400 hover:text-neutral-800 text-xs transition-all duration-300"
          >
            +82 10-0000-0000
          </a>
        </div>
      </div>

      {/* 카피라이트 */}
      <div className="text-center text-neutral-500 text-sm mt-40">
        <p>© {new Date().getFullYear()} MINIMALIFE. All rights reserved.</p>
      </div>

      {/* 대형 로고 워드마크 */}
      <div className="w-full overflow-hidden" style={{ height: "12vw" }}>
        <h1 className="text-[16.2vw] leading-none font-bold text-neutral-800 tracking-tighter whitespace-nowrap f-mont">
          MINIMALIFE
        </h1>
      </div>
    </footer>
  );
}
