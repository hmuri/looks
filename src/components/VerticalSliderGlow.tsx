// components/VerticalSliderGlow.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  value: number; // 0 ~ 100
  onChange: (v: number) => void;
  height?: number; // px (기본 스타일용)
  disabled?: boolean;
  ariaLabel?: string;
};

export default function VerticalSliderGlow({
  value,
  onChange,
  height = 448,
  disabled = false,
  ariaLabel = "vertical slider",
}: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const PAD = 8; // 트랙 끝 둥근 모서리 여유
  const KNOB = 32; // 노브 크기 (px)
  const R = KNOB / 2; // 노브 반지름

  const clamp = (n: number) => Math.min(100, Math.max(0, n));
  const getH = () => trackRef.current?.clientHeight ?? height;

  const valueToY = useCallback(
    (v: number) => {
      const H = getH();
      const usable = H - PAD * 2;
      // v=0 → 맨 아래, v=100 → 맨 위 (중심 y 좌표)
      return H - PAD - (v / 100) * usable;
    },
    [height]
  );

  const yToValue = useCallback(
    (clientY: number) => {
      const el = trackRef.current;
      if (!el) return value;
      const rect = el.getBoundingClientRect();
      const H = getH();
      const usable = H - PAD * 2;
      const y = clientY - rect.top; // 트랙 상단 기준 y
      const fromBottom = H - y - PAD; // 아래쪽 기준 거리
      const v = (fromBottom / usable) * 100;
      return clamp(v);
    },
    [height, value]
  );

  const startDrag = (e: React.PointerEvent) => {
    if (disabled) return;
    setDragging(true);
    (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (clientY: number) => {
    if (!dragging) return;
    onChange(yToValue(clientY));
  };

  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => onPointerMove(e.clientY);
    const up = () => setDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [dragging]);

  const knobCenterY = valueToY(value);

  return (
    <div className="select-none">
      <div
        ref={trackRef}
        role="slider"
        aria-label={ariaLabel}
        aria-orientation="vertical"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value)}
        tabIndex={0}
        onPointerDown={(e) => {
          startDrag(e);
          onChange(yToValue(e.clientY));
        }}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "ArrowUp") onChange(clamp(value + 2));
          if (e.key === "ArrowDown") onChange(clamp(value - 2));
          if (e.key === "Home") onChange(0);
          if (e.key === "End") onChange(100);
        }}
        style={{
          height, // 스타일용 기본값. 실제 계산은 clientHeight 사용
          background: `linear-gradient(
            to top,
            rgba(108,160,200,0.9) 0%,
            rgba(153,198,224,0.55) 60%,
            rgba(255,255,255,0.1) 100%
          )`,
        }}
        className={[
          "relative w-[16px] rounded-full",
          "bg-white/10 backdrop-blur-[1px]",
          "transition-[box-shadow] duration-200",
          disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
          "focus:outline-none focus:ring-0",
          "touch-none", // 스크롤 제스처 방지
        ].join(" ")}
      >
        {/* 채워진 진행 바(아래→노브 중심까지) */}
        <div
          className="absolute left-0 w-full rounded-full pointer-events-none"
          style={{
            bottom: 0,
            top: knobCenterY + R,
            background: `linear-gradient(
              to top,
              rgba(59,130,246,0.65),
              rgba(135,206,235,0.55)
            )`,
          }}
        />

        {/* 노브 */}
        <div
          className={[
            "absolute left-1/2 -translate-x-1/2",
            "h-8 w-8 rounded-full",
            "bg-[#DFF6FF]",
            "shadow-[0_0_24px_6px_rgba(173,216,230,0.45),inset_0_0_10px_rgba(255,255,255,0.8)]",
            "ring-2 ring-white/60",
            "pointer-events-none",
            dragging ? "scale-[1.03]" : "",
            "transition-transform duration-150",
          ].join(" ")}
          style={{ top: knobCenterY - R }}
        />
      </div>
    </div>
  );
}
