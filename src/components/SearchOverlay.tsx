import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "@/components/animate-ui/icons/search";
import { products } from "@/data/products";
import { AnimateIcon } from "./animate-ui/icons/icon";
import { X } from "./animate-ui/icons/x";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  excludeRef?: React.RefObject<HTMLElement | null>;
}

const popularSearches = ["소파", "다이닝 테이블", "침대", "조명", "수납장"];

export default function SearchOverlay({ isOpen, onClose, excludeRef }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [closeHover, setCloseHover] = useState(false);
  const [height, setHeight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // isOpen이 바뀌거나(열기/닫기), 내용물(query→추천목록)이 바뀔 때 높이 재측정
  useLayoutEffect(() => {
    if (!contentRef.current) return;

    if (isOpen) {
      const target = contentRef.current.scrollHeight;
      // 다음 프레임에 목표 높이로 전환 → transition이 항상 정확히 재생됨
      requestAnimationFrame(() => setHeight(target));
    } else {
      setHeight(0);
    }
  }, [isOpen, query]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
    else setQuery("");
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        overlayRef.current &&
        !overlayRef.current.contains(e.target as Node) &&
        !excludeRef?.current?.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, excludeRef]);

  const suggestions =
    query.trim().length > 0
      ? products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
      : [];

  const handleSubmit = (value: string) => {
    if (!value.trim()) return;
    navigate(`/products?q=${encodeURIComponent(value)}`);
    onClose();
  };

  return (
    <div
      ref={overlayRef}
      style={{ height }}
      className="absolute top-full left-0 w-full bg-white border-b shadow-lg z-50 overflow-hidden transition-[height] duration-300 ease-in-out"
    >
      <div ref={contentRef} className="max-w-3xl mx-auto px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-3 bg-gray-100 rounded-full px-5 py-3">
            <Search className="w-5 h-5 text-gray-400 shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(query)}
              placeholder="검색어를 입력하세요"
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-400"
            />
          </div>

          <button
            onClick={onClose}
            onMouseEnter={() => setCloseHover(true)}
            onMouseLeave={() => setCloseHover(false)}
            className="shrink-0 flex items-center p-2.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 cursor-pointer rounded-full transition-all"
          >
            <AnimateIcon animate={closeHover}>
              <X className="w-5 h-5" />
            </AnimateIcon>
          </button>
        </div>

        {query.trim().length === 0 ? (
          <div className="mt-4">
            <p className="text-xs text-gray-400 mb-2">인기 검색어</p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handleSubmit(term)}
                  className="px-3 py-1.5 rounded-full text-sm bg-gray-50 text-gray-600 hover:bg-gray-100"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-4">
            {suggestions.length > 0 ? (
              <ul className="flex flex-col">
                {suggestions.map((p) => (
                  <li key={p.id}>
                    <button
                      onClick={() => handleSubmit(p.name)}
                      className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                    >
                      {p.name}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 px-2 py-2">검색 결과가 없습니다.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}