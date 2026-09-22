import { Link } from "react-router-dom";

import { menuItems } from "@/data/products";

const linkClass = "text-neutral-500 hover:text-neutral-900 text-xs font-medium transition-colors duration-300";

export default function Footer() {
  return (
    <footer className="w-full pt-24 md:pt-32 px-6 md:px-10 overflow-hidden">
      {/* 상단 정보 영역 */}
      <div className="w-full mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between gap-12 md:gap-20">
          {/* 네비게이션 */}
          <nav className="flex flex-wrap items-center gap-x-8 gap-y-4 f-mont">
            <Link to="/" className={linkClass}>
              HOME
            </Link>

            <Link to="/products" className={linkClass}>
              PRODUCTS
            </Link>

            {menuItems.map((m) => (
              <Link key={m.to} to={m.to} className={linkClass}>
                {m.label}
              </Link>
            ))}

            <Link to="/cart" className={linkClass}>
              CART
            </Link>
          </nav>

          {/* 연락처 */}
          <div className="flex flex-col items-start md:items-end gap-2 f-mont">
            <a
              href="mailto:minimal@minimalife.com"
              className="text-neutral-400 hover:text-neutral-900 text-xs transition-colors duration-300"
            >
              minimal@minimalife.com
            </a>

            <a
              href="tel:+8210000000"
              className="text-neutral-400 hover:text-neutral-900 text-xs transition-colors duration-300"
            >
              +82 10-0000-0000
            </a>
          </div>
        </div>
      </div>

      {/* 브랜드 메시지 */}
      <div className="mt-32 md:mt-40 text-center">
        <p className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-neutral-400 f-mont">
          Furniture for everyday spaces
        </p>

        <p className="mt-4 text-sm md:text-base text-neutral-500 tracking-tight">
          오래 사용할수록 더 깊어지는 가구를 만듭니다.
        </p>
      </div>

      {/* 정책 링크 */}
      <div className="flex items-center justify-center gap-4 mt-10">
        <Link
          to="/privacy"
          className="text-[10px] text-neutral-400 hover:text-neutral-700 transition-colors duration-300"
        >
          개인정보처리방침
        </Link>

        <span className="w-px h-2.5 bg-neutral-200" />

        <Link
          to="/terms"
          className="text-[10px] text-neutral-400 hover:text-neutral-700 transition-colors duration-300"
        >
          이용약관
        </Link>
      </div>

      {/* 카피라이트 */}
      <div className="mt-8 text-center">
        <p className="text-[10px] md:text-xs text-neutral-400 f-mont">
          © {new Date().getFullYear()} MINIMALIFE. All rights reserved.
        </p>
      </div>

      {/* 대형 로고 워드마크 */}
      <div className="w-full overflow-hidden mt-10 md:mt-14" style={{ height: "12vw" }}>
        <h1
          className="
            text-[16.2vw]
            leading-[0.82]
            font-bold
            text-neutral-800
            tracking-[-0.065em]
            whitespace-nowrap
            f-mont
          "
        >
          MINIMALIFE
        </h1>
      </div>
    </footer>
  );
}
