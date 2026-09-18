import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Link } from "react-router-dom";
import { categories } from "@/data/products";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Menu } from "@/components/animate-ui/icons/menu";
import CartIcon from "@/components/icons/cart";
import { Search } from "@/components/animate-ui/icons/search";
import { UserRound } from "./animate-ui/icons/user-round";
import SearchOverlay from "./SearchOverlay";

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);

  const [cartAnimKey, setCartAnimKey] = useState(0);
  const [cartAnimate, setCartAnimate] = useState(false);
  const [searchHover, setSearchHover] = useState(false);
  const [userHover, setUserHover] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const searchButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!headerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        yPercent: -100,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.2,
      });
    });

    return () => ctx.revert();
  }, []);

  const handleCartHover = () => {
    setCartAnimKey((k) => k + 1);
    setCartAnimate(true);
  };

  // 메뉴 텍스트 글자 단위 flip 애니메이션
  const handleMenuHover = (el: HTMLElement) => {
    const chars = el.querySelectorAll(".char");

    chars.forEach((char, i) => {
      const top = char.querySelector(".top") as HTMLElement;
      const bottom = char.querySelector(".bottom") as HTMLElement;
      if (!top || !bottom) return;

      top.style.animation = "none";
      bottom.style.animation = "none";

      void top.offsetHeight; // 리플로우 강제 → 애니메이션 재시작 가능하게

      const delay = i * 0.045;
      const duration = 0.65;

      top.style.animation = `slideUp ${duration}s cubic-bezier(0.33, 1, 0.68, 1) forwards ${delay}s`;
      bottom.style.animation = `slideIn ${duration}s cubic-bezier(0.33, 1, 0.68, 1) forwards ${delay}s`;
    });
  };

  const SplitText = ({ text }: { text: string }) => (
    <span className="text-wrap">
      {text.split("").map((char, i) => (
        <span className="char" key={i}>
          <span className="top">{char === " " ? "\u00A0" : char}</span>
          <span className="bottom">{char === " " ? "\u00A0" : char}</span>
        </span>
      ))}
    </span>
  );

  return (
    <header
      ref={headerRef}
      className="fixed top-0 z-50 w-full flex items-center justify-between px-6 py-4 mix-blend-difference"
    >
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="text-xl font-bold text-white f-mont tracking-[-2px]">
            MINIMALIFE
          </Link>

          <nav className="flex">
            <ul className="flex items-center gap-6 text-sm">
              <li>
                <AnimateIcon animateOnHover>
                  <Menu className="w-5 h-5 cursor-pointer text-white" />
                </AnimateIcon>
              </li>
              {categories.map((c) => (
                <li key={c.value} onMouseEnter={(e) => handleMenuHover(e.currentTarget)}>
                  <Link
                    to={`/products?category=${c.value}`}
                    className="text-white font-medium f-mont p-2"
                  >
                    <SplitText text={c.label} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <ul className="flex items-center gap-3 text-sm">
          <li>
            <button
              ref={searchButtonRef}
              onClick={() => setSearchOpen((v) => !v)}
              onMouseEnter={() => setSearchHover(true)}
              onMouseLeave={() => setSearchHover(false)}
              className="flex items-center p-2 text-white hover:opacity-70 cursor-pointer rounded-sm transition-opacity"
            >
              <AnimateIcon animate={searchHover}>
                <Search className="w-4 h-4" />
              </AnimateIcon>
            </button>
          </li>
          {searchOpen && (
            <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} excludeRef={searchButtonRef} />
          )}
          <li>
            <button
              onMouseEnter={() => setUserHover(true)}
              onMouseLeave={() => setUserHover(false)}
              className="flex items-center p-2 text-white hover:opacity-70 cursor-pointer rounded-sm transition-opacity"
            >
              <AnimateIcon animate={userHover}>
                <UserRound className="w-4.5 h-4.5" />
              </AnimateIcon>
            </button>
          </li>
          <li>
            <button
              onMouseEnter={handleCartHover}
              className="flex items-center p-2 text-white hover:opacity-70 cursor-pointer rounded-sm transition-opacity"
            >
              <CartIcon key={cartAnimKey} animate={cartAnimate} className="w-4.5 h-4.5 text-white" />
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}