import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import heroBg from "@/assets/images/hero-bg.png";
import woodTable01 from "@/assets/images/wood-table_01.png";
import woodTable02 from "@/assets/images/wood-table_02.png";
import tactaChair from "@/assets/images/tacta-chair.png";
import dropTray from "@/assets/images/drop-tray.png";
import rabbitChair from "@/assets/images/rabbit-chair.png";
import birdLamp from "@/assets/images/bird-lamp.png";
import lookBookImg from "@/assets/images/lookbookimg.png";
// TODO: 실제 카테고리 대표 이미지 경로로 교체
import categorySofa from "@/assets/images/card-img01.png";
import categoryChair from "@/assets/images/card-img02.png";
import categoryTable from "@/assets/images/card-img03.png";
import categoryBed from "@/assets/images/card-img04.png";
import categoryStorage from "@/assets/images/card-img05.png";
import categoryLighting from "@/assets/images/card-img06.png";
// TODO: 실제 목공방/장인 손길 이미지로 교체
import craftImg01 from "@/assets/images/craft-01.png";
import craftImg02 from "@/assets/images/craft-02.png";
import craftImg03 from "@/assets/images/craft-03.png";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import MoreViewLink, { MoreViewLabel } from "@/components/MoreViewLink";
import { ArrowRight } from "@/components/animate-ui/icons/arrow-right";

gsap.registerPlugin(SplitText, ScrollTrigger);

const newArrivals = [
  {
    id: "wood-chair",
    title: "Tacta Chair",
    description: "원목의 결을 살린 시그니처 의자",
    image: tactaChair,
    price: "78,000",
  },
  { id: "tray", title: "Drop Tray", description: "가벼운 라인의 트레이", image: dropTray, price: "32,000" },
  {
    id: "rabbit-chair",
    title: "Rabbit Chair",
    description: "귀여운 원목 토끼 의자",
    image: rabbitChair,
    price: "55,000",
  },
  { id: "lamp", title: "BIRD Lamp", description: "협탁과 어울리는 작은 조명", image: birdLamp, price: "27,000" },
];

const categorySections = [
  { value: "sofa", label: "SOFA", description: "공간의 중심이 되는 소파 컬렉션", image: categorySofa },
  { value: "chair", label: "CHAIR", description: "원목 결을 살린 시그니처 체어", image: categoryChair },
  { value: "table", label: "TABLE", description: "다이닝과 일상을 잇는 테이블", image: categoryTable },
  { value: "bed", label: "BED", description: "편안한 휴식을 위한 침실 가구", image: categoryBed },
  { value: "storage", label: "STORAGE", description: "정돈된 일상을 위한 수납 가구", image: categoryStorage },
  { value: "lighting", label: "LIGHTING", description: "공간의 분위기를 완성하는 조명", image: categoryLighting },
] as const;

const craftImages = [craftImg01, craftImg02, craftImg03];

// value는 카운트 대상 숫자, suffix는 숫자 뒤에 고정으로 붙는 기호
const craftStats = [
  { label: "Since", value: 15, suffix: "+", desc: "매년 원목의 결을 연구하며\n기술을 다듬어온 시간" },
  { label: "Material", value: 100, suffix: "%", desc: "합성 자재 없이\n오직 원목만 사용합니다" },
  { label: "Craftsmanship", value: 500, suffix: "+", desc: "장인의 손끝에서\n완성된 가구들" },
] as const;

function CategoryCard({ item }: { item: (typeof categorySections)[number] }) {
  return (
    <Link
      to={`/products?category=${item.value}`}
      className="group relative flex h-[300px] bg-[#f5f5f5] overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
    >
      <div className="relative z-10 flex flex-col justify-center gap-3 w-[55%] p-8 f-mont">
        <h3 className="text-2xl font-semibold tracking-tight text-neutral-900 uppercase">{item.label}</h3>
        <p className="text-sm text-neutral-500 leading-relaxed">{item.description}</p>
        <MoreViewLabel label="Explore category" />
      </div>
      <div className="absolute right-0 top-0 w-[50%] h-full overflow-hidden flex justify-end items-end">
        <img
          src={item.image}
          alt={item.label}
          className="h-full object-contain transition-transform duration-500 group-hover:scale-[1.02] translate-y-4"
        />
      </div>
    </Link>
  );
}

export default function HomePage() {
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);

  // Craft 섹션
  const craftSectionRef = useRef<HTMLElement>(null);
  const craftImageWrapRef = useRef<HTMLDivElement>(null);
  const craftStackRef = useRef<HTMLDivElement>(null);
  const craftHeadingRef = useRef<HTMLHeadingElement>(null);
  const craftDescRef = useRef<HTMLParagraphElement>(null);
  const craftImageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const productSectionRef = useRef<HTMLElement>(null);
  const image1Ref = useRef<HTMLImageElement>(null);
  const image2Ref = useRef<HTMLImageElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const specRef = useRef<HTMLDivElement>(null);

  const newArrivalsSectionRef = useRef<HTMLElement>(null);
  const newHeadingRef = useRef<HTMLHeadingElement>(null);
  const sliderWrapperRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  // 카테고리 섹션
  const categoryGridRef = useRef<HTMLDivElement>(null);

  // Lookbook 섹션
  const lookSectionRef = useRef<HTMLElement>(null);
  const lookHeadingRef = useRef<HTMLHeadingElement>(null);
  const lookDescRef = useRef<HTMLParagraphElement>(null);
  const lookImageRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });
  }, []);

  useEffect(() => {
    if (!line1Ref.current || !line2Ref.current || !subRef.current) return;

    const split1 = new SplitText(line1Ref.current, { type: "chars" });
    const split2 = new SplitText(line2Ref.current, { type: "chars" });
    const splitSub = new SplitText(subRef.current, { type: "chars" });

    const tl = gsap.timeline();

    tl.from(split1.chars, { yPercent: 110, rotate: 4, opacity: 0, duration: 0.7, ease: "expo.out", stagger: 0.025 })
      .from(
        split2.chars,
        { yPercent: 110, rotate: 4, opacity: 0, duration: 0.7, ease: "expo.out", stagger: 0.025 },
        "-=0.5",
      )
      .from(splitSub.chars, { yPercent: 110, opacity: 0, duration: 0.5, ease: "expo.out", stagger: 0.015 }, "-=0.4");

    return () => {
      split1.revert();
      split2.revert();
      splitSub.revert();
      tl.kill();
    };
  }, []);

  /**
   * Craft 섹션
   * 1) 스크롤 진입 시 왼쪽 이미지가 아래에서 위로 클립이 걷히며 등장
   * 2) 우측 헤딩/본문은 라인 단위 스플릿 텍스트, 지표는 숫자 카운트
   * 3) 등장이 끝나면 기존 자동 전환(아래→위 클립) 시작
   *  - 라인 스플릿은 폰트 로드 후에 해야 줄바꿈이 정확해서 fonts.ready 이후 실행
   */
  useEffect(() => {
    const section = craftSectionRef.current;
    const wrap = craftImageWrapRef.current;
    const stack = craftStackRef.current;
    const heading = craftHeadingRef.current;
    const desc = craftDescRef.current;
    if (!section || !wrap || !stack || !heading || !desc) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const images = craftImageRefs.current.filter(Boolean) as HTMLDivElement[];
    const total = images.length;

    let cancelled = false;
    let ctx: gsap.Context | undefined;
    let intervalId: ReturnType<typeof setInterval> | undefined;
    const splits: SplitText[] = [];

    document.fonts.ready.then(() => {
      if (cancelled) return;

      ctx = gsap.context(() => {
        // ---- 자동 전환: 순서(current 기준 거리)에 따라 z-index 재계산 ----
        let current = 0;

        const applyZIndex = () => {
          images.forEach((img, idx) => {
            if (idx === current) {
              gsap.set(img, { zIndex: total + 1 });
            } else {
              const rank = (idx - current - 1 + total) % total; // 0 = 바로 다음 순서
              gsap.set(img, { zIndex: total - rank });
            }
          });
        };

        images.forEach((img) => gsap.set(img, { clipPath: "inset(0% 0 0% 0)" }));
        if (total > 0) applyZIndex();

        const startAutoSlide = () => {
          if (total < 2 || intervalId) return;

          intervalId = setInterval(() => {
            const currentImg = images[current];

            gsap.to(currentImg, {
              clipPath: "inset(0% 0 100% 0)",
              duration: 1.2,
              ease: "power2.inOut",
              onComplete: () => {
                gsap.set(currentImg, { clipPath: "inset(0% 0 0% 0)" });
                // 애니메이션이 끝난 뒤에만 순서를 넘기고 z-index 재배치
                current = (current + 1) % total;
                applyZIndex();
              },
            });
          }, 3500);
        };

        // ---- 스플릿 텍스트 (라인 단위, 마스크) ----
        const headingSplit = new SplitText(heading, { type: "lines", mask: "lines" });
        const descSplit = new SplitText(desc, { type: "lines", mask: "lines" });
        splits.push(headingSplit, descSplit);

        // ---- 등장 타임라인 ----
        const tl = gsap.timeline({
          scrollTrigger: { trigger: section, start: "top 60%", once: true },
          onComplete: startAutoSlide,
        });

        // 이미지: 아래에서 위로 클립이 걷히며 등장 + 살짝 줌아웃
        tl.fromTo(
          wrap,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "power4.out" },
          0,
        ).fromTo(
          stack,
          { scale: 1.25, transformOrigin: "50% 100%" },
          { scale: 1, transformOrigin: "50% 100%", duration: 2, ease: "power3.out" },
          0,
        );

        // 텍스트
        tl.from(".js-craft-eyebrow", { y: 16, opacity: 0, duration: 0.8, ease: "power3.out" }, 0.1)
          .from(headingSplit.lines, { yPercent: 110, duration: 1, ease: "expo.out", stagger: 0.12 }, 0.3)
          .from(descSplit.lines, { yPercent: 110, duration: 0.9, ease: "expo.out", stagger: 0.08 }, "-=0.6")
          .addLabel("stats", "-=0.4");

        // 지표: 등장 + 구분선 + 숫자 카운트
        tl.from(".js-stat", { y: 24, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.15 }, "stats").from(
          ".js-stat-line",
          { scaleX: 0, transformOrigin: "left center", duration: 1, ease: "power3.inOut", stagger: 0.15 },
          "stats",
        );

        gsap.utils.toArray<HTMLElement>(".js-count").forEach((el, i) => {
          const target = Number(el.dataset.count ?? 0);
          const counter = { value: 0 };
          el.textContent = "0";

          tl.to(
            counter,
            {
              value: target,
              duration: 2,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = String(Math.round(counter.value));
              },
            },
            `stats+=${i * 0.15}`,
          );
        });
      }, section);
    });

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
      gsap.killTweensOf(images);
      splits.forEach((s) => s.revert());
      ctx?.revert();
    };
  }, []);

  useEffect(() => {
    if (!productSectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: productSectionRef.current, start: "top 60%" },
      });

      tl.fromTo(
        image1Ref.current,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 2, ease: "power4.out" },
      )
        .fromTo(
          image2Ref.current,
          { clipPath: "inset(100% 0 0 0)" },
          { clipPath: "inset(0% 0 0 0)", duration: 2, ease: "power4.out" },
          "<",
        )
        .from(
          infoRef.current ? Array.from(infoRef.current.children) : [],
          { y: 20, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 },
          "-=1.4",
        )
        .from(
          specRef.current ? Array.from(specRef.current.children) : [],
          { y: 14, opacity: 0, duration: 0.5, ease: "power3.out", stagger: 0.08 },
          "-=0.6",
        );
    }, productSectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!newHeadingRef.current || !sliderWrapperRef.current) return;

    const split = new SplitText(newHeadingRef.current, { type: "chars" });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: newArrivalsSectionRef.current, start: "top 75%" },
      });

      tl.from(split.chars, {
        yPercent: 110,
        rotate: 4,
        opacity: 0,
        duration: 0.7,
        ease: "expo.out",
        stagger: 0.03,
      }).from(sliderWrapperRef.current, { xPercent: 8, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.4");
    }, newArrivalsSectionRef);

    return () => {
      ctx.revert();
      split.revert();
    };
  }, []);

  /**
   * 카테고리 섹션 : 카드가 순서 없이 랜덤하게 페이드인
   * stagger.from = "random" 으로 매 진입마다 다른 순서
   */
  useEffect(() => {
    const grid = categoryGridRef.current;
    if (!grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(Array.from(grid.children), {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: "power3.out",
        stagger: { each: 0.12, from: "random" },
        clearProps: "opacity,transform",
        scrollTrigger: { trigger: grid, start: "top 40%", once: true },
      });
    }, grid);

    return () => ctx.revert();
  }, []);

  /**
   * Lookbook 섹션 : 헤딩/설명 스플릿 텍스트 → 이미지 페이드인 → 하단 메타
   */
  useEffect(() => {
    const section = lookSectionRef.current;
    const heading = lookHeadingRef.current;
    const desc = lookDescRef.current;
    const image = lookImageRef.current;
    if (!section || !heading || !desc || !image) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let ctx: gsap.Context | undefined;
    const splits: SplitText[] = [];

    document.fonts.ready.then(() => {
      if (cancelled) return;

      ctx = gsap.context(() => {
        const headingSplit = new SplitText(heading, { type: "lines", mask: "lines" });
        const descSplit = new SplitText(desc, { type: "lines", mask: "lines" });
        splits.push(headingSplit, descSplit);

        const tl = gsap.timeline({
          scrollTrigger: { trigger: section, start: "top 60%", once: true },
        });

        tl.from(".js-look-eyebrow", { y: 16, opacity: 0, duration: 0.8, ease: "power3.out" })
          .from(headingSplit.lines, { yPercent: 110, duration: 1, ease: "expo.out", stagger: 0.12 }, "-=0.5")
          .from(descSplit.lines, { yPercent: 110, duration: 0.9, ease: "expo.out", stagger: 0.08 }, "-=0.7")
          .fromTo(
            image,
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 1.4, ease: "power3.out", clearProps: "opacity,transform" },
            "-=0.5",
          )
          .from(".js-look-meta", { y: 12, opacity: 0, duration: 0.7, ease: "power3.out" }, "-=0.6");
      }, section);
    });

    return () => {
      cancelled = true;
      splits.forEach((s) => s.revert());
      ctx?.revert();
    };
  }, []);

  return (
    <div>
      <section
        className="w-full h-screen bg-cover bg-center flex items-center justify-center relative"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute top-2/4 left-10 text-white">
          <h1 className="text-7xl font-bold tracking-tighter f-mont uppercase">
            <div ref={line1Ref} className="overflow-hidden">
              We Make
            </div>
            <div ref={line2Ref} className="overflow-hidden">
              Something Different
            </div>
          </h1>
          <p ref={subRef} className="mt-4 text-lg overflow-hidden">
            가구를 넘어 공간의 분위기와 일상의 경험을 디자인합니다
          </p>
        </div>
      </section>

      {/* Craft 섹션 : 좌 - 아래에서 위로 등장하는 이미지(이후 자동 전환) / 우 - 스플릿 텍스트 + 카운트 지표 */}
      <section ref={craftSectionRef} className="w-full bg-white px-6 md:px-16 py-20 md:py-28">
        <p className="js-craft-eyebrow text-xs tracking-[0.2em] uppercase text-neutral-400 mb-10 md:mb-14 f-mont">
          Since 2011 — Our Craft
        </p>

        <div className="flex justify-between">
          <div ref={craftImageWrapRef} className="relative w-90 h-[420px] md:h-[560px] overflow-hidden">
            <div ref={craftStackRef} className="absolute inset-0">
              {craftImages.map((img, idx) => (
                <div
                  key={idx}
                  ref={(el) => {
                    craftImageRefs.current[idx] = el;
                  }}
                  className="absolute inset-0"
                >
                  <img src={img} alt="원목을 다듬는 장인의 손길" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="w-[50%] flex flex-col justify-center">
            {/* Brand Message */}
            <div className="max-w-[720px]">
              <h2
                ref={craftHeadingRef}
                className="text-4xl md:text-5xl lg:text-[52px] font-medium leading-[1.15] tracking-[-0.04em] text-neutral-900"
              >
                원목의 시간을
                <br />
                공간에 담습니다.
              </h2>

              <p ref={craftDescRef} className="mt-8 text-sm md:text-base text-neutral-500 leading-[1.9]">
                원목이 가진 결의 아름다움을 그대로 담아내는 것,
                <br className="hidden md:block" />
                그것이 15년간 집중해온 단 하나의 방향입니다.
                <br />
                합성 자재 없이 오직 원목만을 사용해 만든 가구는
                <br className="hidden md:block" />
                시간이 지날수록 더 깊어지는 색과 결을 갖습니다.
                <br />
                빠르게 소비되는 가구가 아닌, 오래 두고 쓸수록
                <br className="hidden md:block" />
                애착이 쌓이는 물건을 만듭니다.
              </p>
            </div>

            {/* Craft Stats */}
            <div className="mt-16 md:mt-20 grid grid-cols-3 gap-6 md:gap-10">
              {craftStats.map((stat) => (
                <div key={stat.label} className="js-stat f-mont">
                  <div className="flex items-baseline gap-1">
                    <p className="text-4xl md:text-5xl lg:text-[56px] font-semibold tracking-[-0.05em] text-neutral-900 leading-none tabular-nums">
                      <span className="js-count" data-count={stat.value}>
                        {stat.value}
                      </span>
                      {stat.suffix}
                    </p>
                  </div>

                  <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-neutral-400">{stat.label}</p>

                  <div className="js-stat-line mt-4 w-full h-px bg-neutral-200" />

                  <p className="mt-4 text-xs text-neutral-500 leading-[1.7] whitespace-pre-line">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section ref={productSectionRef} className="w-full h-screen border-t border-neutral-200 border-b">
        <div className="h-full grid grid-cols-4 grid-rows-[1fr_1.2fr_1fr]">
          <div className="col-start-1 row-start-1 p-8 border-r border-b border-neutral-200" />
          <div className="col-start-2 row-start-1 p-8 border-r border-b border-neutral-200 flex items-start gap-6" />
          <div className="col-start-3 row-start-1 p-8 border-r border-b border-neutral-200">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 leading-tight f-mont">
              Interior
              <br />
              Furniture
            </h2>
          </div>
          <div className="col-start-4 row-start-1 p-8 border-b border-neutral-200 flex items-start justify-end" />

          <div className="col-start-1 col-span-2 row-start-2 border-r border-b border-neutral-200 h-full overflow-hidden">
            <img ref={image1Ref} src={woodTable01} alt="Dining table" className="w-full h-full object-cover" />
          </div>
          <div
            ref={infoRef}
            className="col-start-3 row-start-2 p-8 border-r border-b border-neutral-200 flex flex-col justify-end f-mont"
          >
            <h3 className="text-2xl font-semibold text-neutral-900">Dining table</h3>
            <p className="text-sm text-neutral-500">Oak Collection</p>
            <p className="mt-3 text-lg text-neutral-800 font-bold">￦ 1,290,000</p>
            <MoreViewLink to="/products/dining-table" className="mt-10" />
          </div>

          <div className="col-start-4 row-start-2 row-span-2 flex flex-col h-full">
            <div className="flex-1 overflow-hidden">
              <img ref={image2Ref} src={woodTable02} alt="Dining table detail" className="w-full h-full object-cover" />
            </div>
          </div>

          <div
            ref={specRef}
            className="col-start-1 row-start-3 p-8 border-r border-neutral-200 flex flex-col justify-end gap-3 f-mont"
          >
            <div>
              <p className="text-sm text-neutral-500">Material</p>
              <p className="text-sm text-neutral-900 font-medium">Solid Oak</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Size</p>
              <p className="text-sm text-neutral-900 font-medium">W1600 · D800 · H720</p>
            </div>
          </div>
          <div className="col-start-2 col-span-2 row-start-3 p-8 border-r border-neutral-200 flex items-end">
            <p className="text-sm leading-relaxed text-neutral-500">
              원목이 가진 결과 무게감을 그대로 드러내면서도 다리 라인을 얇게 다듬어 공간에 무겁게 자리 잡지 않도록
              설계했습니다. <br /> 데일리 다이닝부터 손님을 초대하는 자리까지 어떤 상황에서도 자연스럽게 녹아드는 균형을
              지향합니다.
            </p>
          </div>
        </div>
      </section>

      <section
        ref={newArrivalsSectionRef}
        className="w-full pt-32 pb-24 mt-6 md:pt-40 md:pb-0 md:h-screen overflow-hidden flex flex-col md:flex-row items-start"
      >
        <div className="flex-shrink-0 px-6 md:px-30 flex flex-col justify-start gap-30">
          <div className="flex flex-col justify-start gap-10">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-neutral-400 mb-3 f-mont">Best Sellers</p>
              <h2
                ref={newHeadingRef}
                className="text-6xl md:text-7xl font-bold tracking-tight text-neutral-900 f-mont overflow-hidden uppercase"
              >
                Best Items
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="이전 상품"
                onClick={() => swiperRef.current?.slidePrev()}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-neutral-300 text-neutral-900 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 cursor-pointer"
              >
                <span aria-hidden className="text-sm">
                  <AnimateIcon animateOnHover>
                    <ArrowLeft className="w-3 h-3" />
                  </AnimateIcon>
                </span>
              </button>
              <button
                type="button"
                aria-label="다음 상품"
                onClick={() => swiperRef.current?.slideNext()}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-neutral-300 text-neutral-900 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 cursor-pointer"
              >
                <span aria-hidden className="text-sm">
                  <AnimateIcon animateOnHover>
                    <ArrowRight className="w-3 h-3" />
                  </AnimateIcon>
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0" ref={sliderWrapperRef}>
          <Swiper
            modules={[Autoplay]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            slidesPerView={3}
            spaceBetween={20}
            loop
            observer
            observeParents
            speed={2000}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              768: { slidesPerView: 2.1, spaceBetween: 24 },
              1280: { slidesPerView: 2.6, spaceBetween: 32 },
            }}
          >
            {newArrivals.map((item) => (
              <SwiperSlide key={item.id} className="pb-5">
                <div className="group">
                  <div className="overflow-hidden bg-neutral-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-all duration-500"
                    />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-neutral-600 f-mont">{item.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">{item.description}</p>
                  <p className="mt-4 text-md text-neutral-800 f-mont font-bold">￦ {item.price}</p>
                  <MoreViewLink to={`/products/${item.id}`} className="mt-4" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* 카테고리 섹션 : 카드 랜덤 페이드인 */}
      <section className="w-full p-6">
        <div ref={categoryGridRef} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categorySections.map((item) => (
            <CategoryCard key={item.value} item={item} />
          ))}
        </div>
      </section>

      {/* Lookbook Section : 스플릿 텍스트 + 이미지 페이드인 */}
      <section ref={lookSectionRef} className="w-full px-6 md:px-16 pt-28 md:pt-40">
        <div className="flex flex-col">
          {/* Heading */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12 md:mb-16">
            <div>
              <p className="js-look-eyebrow text-xs tracking-[0.2em] uppercase text-neutral-400 mb-5 f-mont">
                In Your Space
              </p>

              <h2
                ref={lookHeadingRef}
                className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-[-0.04em] leading-[1.1] text-neutral-900"
              >
                가구가 놓이는 순간,
                <br />
                공간의 분위기가 달라집니다.
              </h2>
            </div>

            <p ref={lookDescRef} className="text-sm text-neutral-500 leading-[1.8] max-w-[320px] md:pb-1">
              하나의 가구가 공간과 만나 만들어내는
              <br className="hidden md:block" />
              자연스러운 균형과 일상의 풍경을 소개합니다.
            </p>
          </div>

          {/* Main Image */}
          <Link ref={lookImageRef} to="/lookbook" className="group relative block w-full overflow-hidden bg-neutral-100">
            <div className="aspect-[16/8] md:aspect-[16/7] overflow-hidden">
              <img
                src={lookBookImg}
                alt="미니멀한 가구가 놓인 공간"
                className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
              />
            </div>

            {/* Image Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-700" />

            {/* Image Label */}
            <div className="absolute left-6 bottom-6 md:left-10 md:bottom-10 flex items-end justify-between w-[calc(100%-3rem)] md:w-[calc(100%-5rem)]">
              <div className="text-white">
                <p className="text-[10px] md:text-xs tracking-[0.18em] uppercase mb-2 f-mont">Living Room — 01</p>

                <p className="text-lg md:text-xl font-medium tracking-tight">자연스러운 소재와 균형</p>
              </div>

              <div className="w-11 h-11 md:w-12 md:h-12 rounded-full border border-white/70 flex items-center justify-center text-white transition-all duration-500 group-hover:bg-white group-hover:text-neutral-900">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Bottom Meta */}
          <div className="js-look-meta flex flex-col md:flex-row md:items-center md:justify-between gap-5 mt-6">
            <div className="flex items-center gap-6">
              <span className="text-[10px] tracking-[0.16em] uppercase text-neutral-400 f-mont">Sofa</span>

              <span className="w-px h-3 bg-neutral-300" />

              <span className="text-[10px] tracking-[0.16em] uppercase text-neutral-400 f-mont">Table</span>

              <span className="w-px h-3 bg-neutral-300" />

              <span className="text-[10px] tracking-[0.16em] uppercase text-neutral-400 f-mont">Lighting</span>
            </div>

            <MoreViewLink to="/lookbook" />
          </div>
        </div>
      </section>
    </div>
  );
}