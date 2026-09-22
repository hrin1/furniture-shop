import { useContext, useRef, type ReactNode } from "react";
import { UNSAFE_LocationContext } from "react-router-dom";
import { motion } from "motion/react";

const ease = [0.76, 0, 0.24, 1] as const;

// 3분할 패널 색 (왼쪽 → 오른쪽으로 갈수록 진한 브라운)
const PANEL_COLORS = ["#3f2b20", "#3f2b20", "#3f2b20"];
const STAGGER = 0.1;

/**
 * exit 중인 이전 페이지가 새 location(쿼리 포함)을 읽어서 내용이 먼저 바뀌는 것을 막기 위해
 * 마운트 시점의 location 을 고정해서 하위에 제공
 * (카테고리 → 카테고리처럼 pathname 은 같고 ?category= 만 바뀌는 경우에 필요)
 */
function FrozenLocation({ children }: { children: ReactNode }) {
  const location = useContext(UNSAFE_LocationContext);
  const frozen = useRef(location).current;

  return <UNSAFE_LocationContext.Provider value={frozen}>{children}</UNSAFE_LocationContext.Provider>;
}

/**
 * 페이지 전환 : 3분할 브라운 패널
 *  - exit  : 패널이 아래에서 위로 하나씩 올라오며 화면을 덮음
 *  - enter : 새 페이지가 마운트된 뒤 패널이 위로 하나씩 빠져나가며 드러남
 * 헤더(z-50) 아래(z-40)에 깔려서 메뉴는 전환 중에도 보임
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <>
      <FrozenLocation>{children}</FrozenLocation>

      <div aria-hidden className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
        {PANEL_COLORS.map((color, i) => (
          <motion.div
            key={i}
            className="absolute inset-y-0"
            // 너비를 살짝 겹치게 해서 패널 사이 서브픽셀 틈을 방지
            style={{ left: `${(i * 100) / 3}%`, width: "33.6%", backgroundColor: color }}
            initial={{ y: "0%" }}
            animate={{
              y: "-100%",
              transition: { duration: 0.8, ease, delay: 0.05 + i * STAGGER },
            }}
            exit={{
              y: ["100%", "0%"],
              transition: { duration: 0.6, ease, delay: i * STAGGER },
            }}
          />
        ))}
      </div>
    </>
  );
}