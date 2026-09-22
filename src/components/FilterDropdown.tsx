import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface FilterDropdownProps {
  label: string;
  /** 선택된 값 개수. 0보다 크면 라벨 옆에 배지로 표시 */
  activeCount?: number;
  children: ReactNode;
  disabled?: boolean;
  width?: string;
}

/**
 * <select> 대신 쓰는 커스텀 드롭다운.
 * 바깥 클릭 / Escape 로 닫히고, 내용(children)은 체크박스·스와치·슬라이더 등 자유롭게 구성.
 */
export default function FilterDropdown({
  label,
  activeCount = 0,
  children,
  disabled = false,
  width = "w-64",
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    const onClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // 비활성화되면(해당 카테고리에 옵션이 없으면) 패널도 같이 닫음
  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  const isActive = activeCount > 0;

  return (
    <div ref={rootRef} className="relative">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-expanded={open}
        aria-controls={panelId}
        aria-disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
        className={`flex select-none items-center gap-1.5 text-sm transition-colors ${
          disabled
            ? "cursor-not-allowed text-neutral-300"
            : `cursor-pointer ${open || isActive ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-900"}`
        }`}
      >
        <span>{label}</span>

        {isActive && (
          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-neutral-900 px-1 text-[10px] text-white f-mont tabular-nums">
            {activeCount}
          </span>
        )}

        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </div>

      {open && (
        <div
          id={panelId}
          className={`absolute left-0 top-full z-30 mt-3 ${width} border border-neutral-200 bg-white p-4 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.18)]`}
        >
          {children}
        </div>
      )}
    </div>
  );
}