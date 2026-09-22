import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, LayoutGrid, List, RotateCcw, SlidersHorizontal } from "lucide-react";
import FilterDropdown from "@/components/FilterDropdown";
import ShopCard from "@/components/ShopCard";
import { categories, products } from "@/data/products";
import type { Product } from "@/types/product";

// TODO: '인기순'을 실제 인기도(조회수·판매량 등)로 정렬하려면 Product에 그 필드를 추가해야 함.
// 현재 데이터에는 인기도 지표가 없어서 당장은 '추천순'과 동일한 기본 순서로 동작함.
type SortKey = "default" | "popular" | "price-asc" | "price-desc";
type ViewMode = "grid" | "list";

const PAGE_SIZE = 12;

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "default", label: "추천순" },
  { value: "popular", label: "인기순" },
  { value: "price-asc", label: "낮은 가격순" },
  { value: "price-desc", label: "높은 가격순" },
];

/** material 문자열("패브릭, 원목 프레임")을 콤마 기준으로 쪼개 토큰화 */
function splitMaterial(material?: string) {
  return (material ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** 주어진 상품 목록에서 실제로 등장하는 재질 토큰만 뽑아 카테고리별 필터 옵션을 만듦 */
function getMaterialOptions(list: Product[]) {
  const set = new Set<string>();
  list.forEach((p) => splitMaterial(p.material).forEach((m) => set.add(m)));
  return Array.from(set).sort((a, b) => a.localeCompare(b, "ko"));
}

/** 주어진 상품 목록에서 실제로 등장하는 색상만 뽑음 */
function getColorOptions(list: Product[]) {
  const set = new Set<string>();
  list.forEach((p) => p.colors?.forEach((c) => set.add(c)));
  return Array.from(set);
}

function getPriceBounds(list: Product[]) {
  if (list.length === 0) return { min: 0, max: 0 };
  const prices = list.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

const priceFormatter = new Intl.NumberFormat("ko-KR");

export default function ProductListPage() {
  const [searchParams] = useSearchParams();
  const category = (searchParams.get("category") as Product["category"] | null) ?? "all";
  const query = searchParams.get("q") ?? "";

  // 정렬 / 보기 / 페이지 / 위시리스트는 URL이 아니라 로컬 상태
  const [sort, setSort] = useState<SortKey>("default");
  const [view, setView] = useState<ViewMode>("grid");
  const [page, setPage] = useState(1);
  const toolbarRef = useRef<HTMLDivElement>(null);

  // 카테고리별 속성 필터
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);

  // 현재 카테고리의 상품만 (속성 필터 옵션을 뽑는 기준)
  const categoryProducts = useMemo(
    () => (category === "all" ? products : products.filter((p) => p.category === category)),
    [category],
  );

  const materialOptions = useMemo(() => getMaterialOptions(categoryProducts), [categoryProducts]);
  const colorOptions = useMemo(() => getColorOptions(categoryProducts), [categoryProducts]);
  const priceBounds = useMemo(() => getPriceBounds(categoryProducts), [categoryProducts]);

  // 카테고리가 바뀌면 그 카테고리에 없는 필터값이 남지 않도록 초기화
  useEffect(() => {
    setSelectedMaterials([]);
    setSelectedColors([]);
    setMaxPrice(null);
    setPage(1);
  }, [category]);

  const filtered = useMemo(() => {
    let result = categoryProducts;

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.material?.toLowerCase().includes(q),
      );
    }

    if (selectedMaterials.length > 0) {
      result = result.filter((p) => splitMaterial(p.material).some((m) => selectedMaterials.includes(m)));
    }

    if (selectedColors.length > 0) {
      result = result.filter((p) => p.colors?.some((c) => selectedColors.includes(c)));
    }

    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    if (maxPrice !== null) {
      result = result.filter((p) => p.price <= maxPrice);
    }

    return result;
  }, [categoryProducts, query, selectedMaterials, selectedColors, inStockOnly, maxPrice]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    switch (sort) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "popular":
        // 인기도 지표가 데이터에 없어 당분간 추천순(기본 순서)과 동일하게 동작
        return list;
      default:
        return list;
    }
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSortChange = (next: SortKey) => {
    setSort(next);
    setPage(1);
  };

  const goToPage = (next: number) => {
    setPage(next);
    toolbarRef.current?.scrollIntoView({ block: "start" });
  };

  const toggleMaterial = (value: string) => {
    setSelectedMaterials((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
    setPage(1);
  };

  const toggleColor = (value: string) => {
    setSelectedColors((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
    setPage(1);
  };

  const activeFilterCount =
    selectedMaterials.length + selectedColors.length + (inStockOnly ? 1 : 0) + (maxPrice !== null ? 1 : 0);

  const resetAttributeFilters = () => {
    setSelectedMaterials([]);
    setSelectedColors([]);
    setMaxPrice(null);
    setInStockOnly(false);
    setPage(1);
  };

  const categoryLabel = categories.find((c) => c.value === category)?.label;
  const title = query ? `"${query}" 검색 결과` : (categoryLabel ?? "All Products");
  const crumb = query ? "Search" : categoryLabel;

  return (
    <div>
      {/* 상단 타이틀 배너 */}
      <section className="bg-neutral-100 px-6 pt-32 pb-14 text-center md:pt-44 md:pb-20">
        <h1 className="text-4xl font-bold uppercase tracking-tighter text-neutral-900 f-mont md:text-6xl">{title}</h1>

        <nav
          aria-label="breadcrumb"
          className="mt-5 flex items-center justify-center gap-2 text-xs text-neutral-500 f-mont"
        >
          <Link to="/" className="text-neutral-900 transition-opacity hover:opacity-60">
            Home
          </Link>
          <span aria-hidden>/</span>
          {crumb ? (
            <>
              <Link to="/products" className="text-neutral-900 transition-opacity hover:opacity-60">
                Shop
              </Link>
              <span aria-hidden>/</span>
              <span>{crumb}</span>
            </>
          ) : (
            <span>Shop</span>
          )}
        </nav>
      </section>

      <div className="px-6 pb-24 md:px-16 md:pb-32">
        <div className="border-b border-neutral-200">
          {/* 상단 줄 : 개수 · 정렬 버튼 · 보기 전환 */}
          <div
            ref={toolbarRef}
            className="flex scroll-mt-24 flex-wrap items-center justify-between gap-x-6 gap-y-4 py-6 md:py-8"
          >
            <p className="text-sm f-mont">
              <span className="font-semibold tabular-nums text-neutral-900">{sorted.length}</span>{" "}
              <span className="text-neutral-500">Products Found</span>
            </p>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <div className="flex items-center gap-5 text-sm">
                {sortOptions.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => handleSortChange(o.value)}
                    aria-pressed={sort === o.value}
                    className={`cursor-pointer whitespace-nowrap transition-colors ${
                      sort === o.value ? "font-semibold text-neutral-900" : "text-neutral-400 hover:text-neutral-900"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  aria-pressed={view === "grid"}
                  aria-label="그리드로 보기"
                  className={`cursor-pointer transition-colors ${view === "grid" ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-900"}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  aria-pressed={view === "list"}
                  aria-label="리스트로 보기"
                  className={`cursor-pointer transition-colors ${view === "list" ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-900"}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 하단 줄 : 필터 타이틀 + 필터들을 항상 펼쳐서 나열 (토글 없음) */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-neutral-200 py-6">
            <span className="flex gap-1 items-center text-sm font-semibold text-neutral-900 f-mont">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </span>

            <FilterDropdown label="재질" activeCount={selectedMaterials.length} disabled={materialOptions.length === 0}>
              <ul className="flex flex-col gap-3">
                {materialOptions.map((m) => (
                  <li key={m}>
                    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-neutral-700">
                      <input
                        type="checkbox"
                        checked={selectedMaterials.includes(m)}
                        onChange={() => toggleMaterial(m)}
                        className="h-4 w-4 cursor-pointer accent-neutral-900"
                      />
                      {m}
                    </label>
                  </li>
                ))}
              </ul>
            </FilterDropdown>

            <FilterDropdown label="색상" activeCount={selectedColors.length} disabled={colorOptions.length === 0}>
              <ul className="flex flex-wrap gap-3">
                {colorOptions.map((c) => {
                  const isSelected = selectedColors.includes(c);
                  return (
                    <li key={c}>
                      <button
                        type="button"
                        onClick={() => toggleColor(c)}
                        aria-pressed={isSelected}
                        aria-label={c}
                        className={`h-7 w-7 cursor-pointer rounded-full border-2 transition-colors ${
                          isSelected ? "border-neutral-900" : "border-transparent hover:border-neutral-300"
                        }`}
                      >
                        <span
                          className="block h-full w-full rounded-full border border-black/10"
                          style={{ backgroundColor: c }}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </FilterDropdown>

            <FilterDropdown label="가격" activeCount={maxPrice !== null ? 1 : 0} disabled={priceBounds.max === 0}>
              <div className="flex flex-col gap-3">
                <p className="text-sm text-neutral-700 f-mont tabular-nums">
                  ￦ {priceFormatter.format(priceBounds.min)} – ￦ {priceFormatter.format(maxPrice ?? priceBounds.max)}
                </p>
                <input
                  type="range"
                  min={priceBounds.min}
                  max={priceBounds.max}
                  step={Math.max(1000, Math.round((priceBounds.max - priceBounds.min) / 100))}
                  value={maxPrice ?? priceBounds.max}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    setMaxPrice(next >= priceBounds.max ? null : next);
                    setPage(1);
                  }}
                  className="w-full cursor-pointer accent-neutral-900"
                />
              </div>
            </FilterDropdown>

            <button
              type="button"
              onClick={() => {
                setInStockOnly((v) => !v);
                setPage(1);
              }}
              aria-pressed={inStockOnly}
              className={`flex cursor-pointer items-center gap-1.5 text-sm transition-colors ${
                inStockOnly ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                  inStockOnly ? "border-neutral-900 bg-neutral-900" : "border-neutral-300"
                }`}
              >
                {inStockOnly && <span className="h-1.5 w-1.5 rounded-sm bg-white" />}
              </span>
              재고 있음만
            </button>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={resetAttributeFilters}
                className="flex cursor-pointer items-center gap-1.5 text-sm text-neutral-400 transition-colors hover:text-neutral-900"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                필터 초기화
              </button>
            )}
          </div>
        </div>

        {/* 상품 목록 */}
        <div
          className={
            view === "grid"
              ? "mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-14 md:gap-x-5 md:gap-y-14 lg:grid-cols-4"
              : "mt-10 flex flex-col gap-8 md:mt-14"
          }
        >
          {paged.map((product) => (
            <ShopCard key={product.id} product={product} view={view} />
          ))}
        </div>

        {sorted.length === 0 && (
          <p className="mt-24 text-center text-sm text-neutral-500">
            {query ? "검색 결과가 없습니다." : "해당 조건에 맞는 상품이 없습니다."}
          </p>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <nav aria-label="페이지" className="mt-16 flex items-center justify-center gap-2 text-sm f-mont md:mt-24">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="이전 페이지"
              className="flex h-9 w-9 cursor-pointer items-center justify-center text-neutral-900 transition-opacity disabled:cursor-default disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => goToPage(n)}
                aria-current={n === currentPage ? "page" : undefined}
                className={`flex h-9 w-9 cursor-pointer items-center justify-center tabular-nums transition-colors ${
                  n === currentPage
                    ? "font-semibold text-neutral-900 underline underline-offset-8"
                    : "text-neutral-400 hover:text-neutral-900"
                }`}
              >
                {n}
              </button>
            ))}

            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="다음 페이지"
              className="flex h-9 w-9 cursor-pointer items-center justify-center text-neutral-900 transition-opacity disabled:cursor-default disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
