import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Link } from "react-router-dom";
import { menuItems } from "@/data/products";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Menu } from "@/components/animate-ui/icons/menu";
import CartIcon from "@/components/icons/cart";
import { Search } from "@/components/animate-ui/icons/search";
import { UserRound } from "./animate-ui/icons/user-round";
import SearchOverlay from "./SearchOverlay";
import { Heart } from "./animate-ui/icons/heart";
import { useWishlist } from "@/contexts/WishlistContext";

// 컴포넌트 밖으로 이동: 안에 두면 리렌더(헤더 호버 등)마다 새 컴포넌트로 인식되어
// 글자 DOM이 통째로 재생성되고 flip 애니메이션이 끊김
function FlipText({ text }: { text: string }) {
  return (
    <span className="text-wrap">
      {text.split("").map((char, i) => (
        <span className="char" key={i}>
          <span className="top">{char === " " ? "\u00A0" : char}</span>
          <span className="bottom">{char === " " ? "\u00A0" : char}</span>
        </span>
      ))}
    </span>
  );
}

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);

  const [cartAnimKey, setCartAnimKey] = useState(0);
  const [cartAnimate, setCartAnimate] = useState(false);
  const [searchHover, setSearchHover] = useState(false);
  const [userHover, setUserHover] = useState(false);
  const [heartHover, setHeartHover] = useState(false);

  const [headerHover, setHeaderHover] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const { count: wishlistCount } = useWishlist();

  // 헤더 호버 또는 검색창이 열려 있으면 흰 배경 + 어두운 글자
  const isSolid = headerHover || searchOpen;

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

  return (
    // mix-blend-difference는 자식(SearchOverlay 포함)까지 한 레이어로 블렌딩해서
    // 흰 배경이 반전되어 버림 → 흰 배경일 때는 블렌드를 끄고, 평소에만 적용
    <header
      ref={headerRef}
      onMouseEnter={() => setHeaderHover(true)}
      onMouseLeave={() => setHeaderHover(false)}
      className={`fixed top-0 z-50 w-full flex items-center justify-between px-10 py-4 transition-colors duration-300 ${
        isSolid ? "bg-white text-neutral-900" : "bg-transparent text-white mix-blend-difference"
      }`}
    >
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="text-xl font-bold text-inherit f-mont tracking-[-2px]">
            MINIMALIFE
          </Link>

          <nav className="flex">
            <ul className="flex items-center gap-6 text-sm">
              <li>
                <AnimateIcon animateOnHover>
                  <Menu className="w-5 h-5 cursor-pointer text-inherit" />
                </AnimateIcon>
              </li>
              {menuItems.map((m) => (
                <li key={m.to} onMouseEnter={(e) => handleMenuHover(e.currentTarget)}>
                  <Link to={m.to} className="text-inherit font-medium f-mont p-2">
                    <FlipText text={m.label} />
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
              className="flex items-center p-2 text-inherit hover:opacity-70 cursor-pointer rounded-sm transition-opacity"
            >
              <AnimateIcon animate={searchHover}>
                <Search className="w-4 h-4" />
              </AnimateIcon>
            </button>
          </li>
          <li>
            <button
              onMouseEnter={() => setUserHover(true)}
              onMouseLeave={() => setUserHover(false)}
              className="flex items-center p-2 text-inherit hover:opacity-70 cursor-pointer rounded-sm transition-opacity"
            >
              <AnimateIcon animate={userHover}>
                <UserRound className="w-4.5 h-4.5" />
              </AnimateIcon>
            </button>
          </li>
          <li>
            <Link
              to="/wishlist"
              onMouseEnter={() => setHeartHover(true)}
              onMouseLeave={() => setHeartHover(false)}
              className="relative flex items-center p-2 text-inherit hover:opacity-70 cursor-pointer rounded-sm transition-opacity"
            >
              <AnimateIcon animate={heartHover}>
                <Heart className="w-4.5 h-4.5" />
              </AnimateIcon>
              {wishlistCount > 0 && (
                <span
                  style={{ mixBlendMode: "normal", isolation: "isolate" }}
                  className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF3F3F] px-1 text-[10px] font-semibold leading-none text-white f-mont"
                >
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>
          </li>
          <li>
            <button
              onMouseEnter={handleCartHover}
              className="flex items-center p-2 text-inherit hover:opacity-70 cursor-pointer rounded-sm transition-opacity"
            >
              <CartIcon key={cartAnimKey} animate={cartAnimate} className="w-4.5 h-4.5 text-inherit" />
            </button>
          </li>
        </ul>
      </div>

      {/* ul 안이 아니라 header 직속으로 (div를 ul 자식으로 두면 잘못된 DOM) */}
      {searchOpen && (
        <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} excludeRef={searchButtonRef} />
      )}
    </header>
  );
}
