import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import heroBg from "@/assets/images/hero-bg.png";
import woodTable01 from "@/assets/images/wood-table_01.png";
import woodTable02 from "@/assets/images/wood-table_02.png";
import tactaChair from "@/assets/images/tacta-chair.png";
import dropTray from "@/assets/images/drop-tray.png";
import rabbitChair from "@/assets/images/rabbit-chair.png";
import birdLamp from "@/assets/images/bird-lamp.png";
// TODO: 실제 카테고리 대표 이미지 경로로 교체
import categorySofa from "@/assets/images/card-img01.png";
import categoryChair from "@/assets/images/card-img02.png";
import categoryTable from "@/assets/images/card-img03.png";
import categoryBed from "@/assets/images/card-img04.png";
import categoryStorage from "@/assets/images/card-img05.png";
import categoryLighting from "@/assets/images/card-img06.png";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import MoreViewLink, { MoreViewLabel } from "@/components/MoreViewLink";
import { ArrowRight } from "@/components/animate-ui/icons/arrow-right";

gsap.registerPlugin(SplitText, ScrollTrigger);

// TODO: 실제 신상품 데이터 구조에 맞게 @/data/products 에서 가져오도록 교체
const newArrivals = [
  {
    id: "wood-chair",
    title: "Tacta Chair",
    description: "원목의 결을 살린 시그니처 의자",
    image: tactaChair,
    price: "78,000",
  },
  {
    id: "tray",
    title: "Drop Tray",
    description: "가벼운 라인의 트레이",
    image: dropTray,
    price: "32,000",
  },
  {
    id: "rabbit-chair",
    title: "Rabbit Chair",
    description: "귀여운 원목 토끼 의자",
    image: rabbitChair,
    price: "55,000",
  },
  {
    id: "lamp",
    title: "BIRD Lamp",
    description: "협탁과 어울리는 작은 조명",
    image: birdLamp,
    price: "27,000",
  },
];

// TODO: 실제 categories 데이터(Product['category'] 기반)와 연결
const categorySections = [
  {
    value: "sofa",
    label: "SOFA",
    description: "공간의 중심이 되는 소파 컬렉션",
    image: categorySofa,
  },
  {
    value: "chair",
    label: "CHAIR",
    description: "원목 결을 살린 시그니처 체어",
    image: categoryChair,
  },
  {
    value: "table",
    label: "TABLE",
    description: "다이닝과 일상을 잇는 테이블",
    image: categoryTable,
  },
  {
    value: "bed",
    label: "BED",
    description: "편안한 휴식을 위한 침실 가구",
    image: categoryBed,
  },
  {
    value: "storage",
    label: "STORAGE",
    description: "정돈된 일상을 위한 수납 가구",
    image: categoryStorage,
  },
  {
    value: "lighting",
    label: "LIGHTING",
    description: "공간의 분위기를 완성하는 조명",
    image: categoryLighting,
  },
] as const;

function CategoryCard({ item }: { item: (typeof categorySections)[number] }) {
  return (
    <Link
      to={`/products?category=${item.value}`}
      className="group relative flex h-[260px] bg-[#f5f5f5] overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
    >
      {/* 텍스트 영역 */}
      <div className="relative z-10 flex flex-col justify-center gap-3 w-[55%] p-8 f-mont">
        <h3 className="text-2xl font-semibold tracking-tight text-neutral-900 uppercase">{item.label}</h3>
        <p className="text-sm text-neutral-500 leading-relaxed">{item.description}</p>
        <MoreViewLabel label="Explore category" />
      </div>

      {/* 이미지 영역: 카드 우측을 가장자리까지 꽉 채움 */}
      <div className="absolute right-0 top-0 w-[50%] h-full overflow-hidden flex justify-end items-end">
        <img
          src={item.image}
          alt={item.label}
          className="h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    </Link>
  );
}

export default function HomePage() {
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);

  const productSectionRef = useRef<HTMLElement>(null);
  const image1Ref = useRef<HTMLImageElement>(null);
  const image2Ref = useRef<HTMLImageElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const specRef = useRef<HTMLDivElement>(null);

  const newArrivalsSectionRef = useRef<HTMLElement>(null);
  const newHeadingRef = useRef<HTMLHeadingElement>(null);
  const sliderWrapperRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  // 폰트 로드 후 ScrollTrigger 위치 재계산 (텍스트 폭 변화로 트리거 지점이 어긋나는 것 방지)
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

    tl.from(split1.chars, {
      yPercent: 110,
      rotate: 4,
      opacity: 0,
      duration: 0.7,
      ease: "expo.out",
      stagger: 0.025,
    })
      .from(
        split2.chars,
        {
          yPercent: 110,
          rotate: 4,
          opacity: 0,
          duration: 0.7,
          ease: "expo.out",
          stagger: 0.025,
        },
        "-=0.5",
      )
      .from(
        splitSub.chars,
        {
          yPercent: 110,
          opacity: 0,
          duration: 0.5,
          ease: "expo.out",
          stagger: 0.015,
        },
        "-=0.4",
      );

    return () => {
      split1.revert();
      split2.revert();
      splitSub.revert();
      tl.kill();
    };
  }, []);

  // 두 번째 섹션 : 스크롤 진입 시 이미지 클립 리빌
  useEffect(() => {
    if (!productSectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: productSectionRef.current,
          start: "top 60%",
        },
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

  // 세 번째 섹션 : "BEST ITEMS" 스플릿 텍스트 + 우측 슬라이더 스르륵 등장
  useEffect(() => {
    if (!newHeadingRef.current || !sliderWrapperRef.current) return;

    const split = new SplitText(newHeadingRef.current, { type: "chars" });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: newArrivalsSectionRef.current,
          start: "top 75%",
        },
      });

      tl.from(split.chars, {
        yPercent: 110,
        rotate: 4,
        opacity: 0,
        duration: 0.7,
        ease: "expo.out",
        stagger: 0.03,
      }).from(
        sliderWrapperRef.current,
        {
          xPercent: 8,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.4",
      );
    }, newArrivalsSectionRef);

    return () => {
      ctx.revert();
      split.revert();
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

      {/* 프로젝트/시그니처 제품 소개 섹션 */}
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

      {/* 신상품 슬라이드 섹션 : 좌 - Best Items / 우 - 슬라이더 */}
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

        {/* 우측 슬라이더 */}
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
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
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

      {/* 카테고리 바로가기 섹션 */}
      <section className="w-full p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categorySections.map((item) => (
            <CategoryCard key={item.value} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}