import type { SVGProps } from "react";

interface CartIconProps extends SVGProps<SVGSVGElement> {
  animate?: boolean;
}

export default function CartIcon({ animate = false, ...props }: CartIconProps) {
  return (
    <svg width="28" height="28" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g>
        <path
          d="M27 5.98197L23.9007 2.12179C23.3313 1.41259 22.4709 1 21.5614 1H5.68775C4.63397 1 3.65744 1.5529 3.11527 2.45651L1 5.98197V23.9062C1 25.5631 2.34315 26.9062 4 26.9062H24C25.6569 26.9062 27 25.5631 27 23.9063V5.98197ZM1 5.98197H27"
          stroke="currentColor"
          strokeWidth="2.2"
          style={
            animate
              ? {
                  strokeDasharray: 122,
                  strokeDashoffset: 122,
                  animation: "cart-draw-0 1.2s ease-out forwards",
                }
              : undefined
          }
        />
        <path
          d="M7 11.9531C9 17.9531 19 17.9531 21 11.9531"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={
            animate
              ? {
                  strokeDasharray: 18,
                  strokeDashoffset: 18,
                  animation: "cart-draw-1 0.5s ease-out 0.15s forwards",
                }
              : undefined
          }
        />
      </g>
      <style>{`
        @keyframes cart-draw-0 {
          to { stroke-dashoffset: 0; }
        }
        @keyframes cart-draw-1 {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  );
}
