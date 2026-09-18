import { Link } from "react-router-dom";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { ArrowRight } from "@/components/animate-ui/icons/arrow-right";

const baseClass =
  "inline-flex items-center gap-2 w-fit text-xs font-medium tracking-[0.08em] uppercase text-neutral-900 pb-1 border-b border-neutral-900";

function ArrowContent({ label }: { label: string }) {
  return (
    <>
      {label}
      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
        <AnimateIcon animateOnHover>
          <ArrowRight className="w-3 h-3" />
        </AnimateIcon>
      </span>
    </>
  );
}

interface MoreViewLinkProps {
  to: string;
  label?: string;
  className?: string;
}

/**
 * 독립적으로 쓰이는 링크. 부모 요소가 <Link>가 아닌 곳에서 사용.
 * (예: Dining table 섹션, Swiper 슬라이드 카드)
 */
export default function MoreViewLink({ to, label = "More view", className = "" }: MoreViewLinkProps) {
  return (
    <Link
      to={to}
      className={`group ${baseClass} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 ${className}`}
    >
      <ArrowContent label={label} />
    </Link>
  );
}

interface MoreViewLabelProps {
  label?: string;
  className?: string;
}

/**
 * 부모 요소가 이미 <Link>인 경우 사용 (진짜 링크 아님, 시각적 표시만).
 * <a> 태그 중첩을 피하기 위한 용도. hover는 부모의 group을 그대로 상속받음.
 * (예: CategoryCard처럼 카드 전체가 <Link>인 컴포넌트)
 */
export function MoreViewLabel({ label = "More view", className = "" }: MoreViewLabelProps) {
  return (
    <span className={`${baseClass} ${className}`}>
      <ArrowContent label={label} />
    </span>
  );
}