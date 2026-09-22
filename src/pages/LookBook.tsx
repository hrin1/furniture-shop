import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { looks } from "@/data/lookbook";

const pad = (n: number) => String(n).padStart(2, "0");

const CLIP_FULL = "inset(0% 0% 0% 0%)";
// 위쪽 라인만 남고 높이 0 — 아래에서 위로 걷혀 사라지는 끝 상태(= 위에서 아래로 열리는 시작 상태)
const CLIP_HIDDEN = "inset(0% 0% 100% 0%)";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * 룩북 : 풀스크린 슬라이더 (홈 Craft 섹션 좌측 슬라이드와 같은 클립 전환)
 *  - 다음: 현재 슬라이드가 아래→위로 걷히며 뒤의 슬라이드가 드러남
 *  - 이전: 이전 슬라이드가 위→아래로 열리며 덮음 (다음의 역방향)
 *  - 텍스트는 슬라이드 안에 있어서 이미지와 함께 걷히고, 새 텍스트는 이어서 올라옴
 */
export default function LookbookPage() {
  const rootRef = useRef<HTMLElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctxRef = useRef<gsap.Context | null>(null);
  const currentRef = useRef(0);
  const busyRef = useRef(false);

  const [active, setActive] = useState(0);
  const total = looks.length;

  // 첫 진입 연출: 이미지는 페이지 전환 커튼이 드러내므로 텍스트/버튼만 지연 등장
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;

      const first = slideRefs.current[0];
      if (!first) return;
      const q = gsap.utils.selector(first);

      gsap
        .timeline({ delay: 0.6 })
        .fromTo(
          q(".js-slide-text"),
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.08 },
        )
        .from(".js-nav", { y: 12, opacity: 0, duration: 0.8, ease: "power3.out" }, 0.4);
    }, root);

    ctxRef.current = ctx;

    return () => {
      busyRef.current = false;
      ctx.revert();
      ctxRef.current = null;
    };
  }, []);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (busyRef.current || total < 2) return;

      const nextIndex = (currentRef.current + dir + total) % total;
      const from = slideRefs.current[currentRef.current];
      const to = slideRefs.current[nextIndex];
      if (!from || !to) return;

      busyRef.current = true;

      // 전환이 끝나면 이전 슬라이드는 숨기고 상태를 초기화
      const finish = () => {
        gsap.set(from, { visibility: "hidden", zIndex: 0, clipPath: CLIP_FULL });
        gsap.set(to, { zIndex: 2, clipPath: CLIP_FULL });
        currentRef.current = nextIndex;
        setActive(nextIndex);
        busyRef.current = false;
      };

      if (prefersReducedMotion()) {
        gsap.set(to, { visibility: "visible" });
        finish();
        return;
      }

      ctxRef.current?.add(() => {
        const q = gsap.utils.selector(to);

        // 다음(1): 새 슬라이드는 아래에 깔고, 현재 슬라이드를 걷어냄
        // 이전(-1): 새 슬라이드를 위에 올려 위→아래로 열음
        gsap.set(to, {
          visibility: "visible",
          zIndex: dir === 1 ? 1 : 3,
          clipPath: dir === 1 ? CLIP_FULL : CLIP_HIDDEN,
        });
        gsap.set(from, { zIndex: dir === 1 ? 3 : 2 });

        gsap
          .timeline({ onComplete: finish })
          .to(
            dir === 1 ? from : to,
            { clipPath: dir === 1 ? CLIP_HIDDEN : CLIP_FULL, duration: 1.4, ease: "power3.inOut" },
            0,
          )
          .fromTo(q(".js-slide-img"), { scale: 1.2 }, { scale: 1, duration: 1.8, ease: "power3.out" }, 0)
          .fromTo(
            q(".js-slide-text"),
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.08 },
            0.6,
          );
      });
    },
    [total],
  );

  // 키보드 ← →
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <main ref={rootRef} className="relative w-full h-screen overflow-hidden bg-[#3f2b20]">
      <h1 className="sr-only">Lookbook</h1>

      {looks.map((look, idx) => {
        // 마침표 기준 문장 분리 (문장마다 한 줄)
        const sentences = (look.description.match(/[^.]+\.?/g) ?? [look.description]).map((s) => s.trim());

        return (
          <div
            key={look.id}
            ref={(el) => {
              slideRefs.current[idx] = el;
            }}
            aria-hidden={idx !== active}
            className="absolute inset-0"
            style={{ visibility: idx === 0 ? "visible" : "hidden", zIndex: idx === 0 ? 2 : 0 }}
          >
            <img
              src={look.imageUrl}
              alt={`${look.space} — ${look.title}`}
              className="js-slide-img absolute inset-0 w-full h-full object-cover"
            />

            {/* 텍스트 가독성용 그라데이션 */}
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0)_45%,rgba(0,0,0,0.35)_100%)]"
            />

            {/* 좌측 상단 : 타이틀 */}
            <h2 className="js-slide-text absolute left-6 md:left-16 top-28 md:top-32 max-w-[85%] text-6xl md:text-8xl xl:text-9xl font-bold tracking-tighter leading-[0.95] text-white f-mont break-words">
              {look.space}
            </h2>

            {/* 좌측 하단 : 텍스트 */}
            <div className="absolute left-6 md:left-16 bottom-10 md:bottom-14 w-[calc(100%-10rem)]">
              <h3 className="js-slide-text text-xl md:text-2xl font-medium tracking-[-0.03em] leading-[1.3] text-white">
                {look.title}
              </h3>

              <p className="mt-4 text-sm md:text-base text-white/80 leading-[1.9]">
                {sentences.map((s, i) => (
                  <span key={i} className="js-slide-text block">
                    {s}
                  </span>
                ))}
              </p>
            </div>
          </div>
        );
      })}

      {/* 우측 하단 : 카운터 + 이전/다음 */}
      <div className="js-nav absolute right-6 md:right-16 bottom-10 md:bottom-14 z-10 flex items-center gap-5">
        <p aria-live="polite" className="text-xs tracking-[0.2em] text-white f-mont tabular-nums">
          {pad(active + 1)} / {pad(total)}
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="이전 룩"
            onClick={() => go(-1)}
            className="flex items-center justify-center w-12 h-12 rounded-full border border-white/70 text-white hover:bg-white hover:text-neutral-900 hover:border-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="다음 룩"
            onClick={() => go(1)}
            className="flex items-center justify-center w-12 h-12 rounded-full border border-white/70 text-white hover:bg-white hover:text-neutral-900 hover:border-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </main>
  );
}
