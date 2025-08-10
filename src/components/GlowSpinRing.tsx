// components/GlowSpinRing.tsx
type GlowSpinRingProps = {
  active: boolean;
  size?: number; // px
  thickness?: number; // 링 두께(px)
  baseColor?: string; // 베이스(항상 보임)
  className?: string;
  speedMs?: number; // 회전 속도(ms)
};

export default function GlowSpinRing({
  active,
  size = 94,
  thickness = 4, // 조금 더 두껍게 기본값↑
  baseColor = "rgba(255,255,255,0.18)",
  className = "",
  speedMs = 1400, // 조금 더 빠르게
}: GlowSpinRingProps) {
  const mask = `radial-gradient(farthest-side, transparent calc(100% - ${thickness}px), #000 calc(100% - ${thickness}px))`;

  // 더 또렷한 하이라이트: 하얀 '머리' + 진한 꼬리, 나머지는 투명
  const highlight = `conic-gradient(
      from 0deg,
      rgba(108,160,200,0) 0deg 210deg,
      rgba(108,160,200,0.32) 230deg,
      rgba(140,179,200,0.88) 246deg,
      #FFFFFF 257deg,                      /* 가장 밝은 머리 */
      rgba(167,203,224,0.88) 268deg,
      rgba(108,160,200,0.32) 286deg,
      rgba(108,160,200,0) 320deg 360deg
    )`;

  return (
    <div
      className={`absolute inset-0 m-auto rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      {/* 1) 항상 보이는 베이스 링 */}
      {!active && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: baseColor,
            WebkitMask: mask,
            mask,
          }}
        />
      )}

      {/* 3) 활성 시 바깥 글로우(블러된 링) */}
      {active && (
        <div
          className="absolute -inset-[2px] rounded-full animate-spin will-change-transform pointer-events-none"
          style={{
            background: highlight,
            WebkitMask: mask,
            mask,
            animationDuration: `${speedMs}ms`,
            filter: "blur(6px) drop-shadow(0 0 14px rgba(160,210,240,0.45))",
            opacity: 0.9,
            mixBlendMode: "screen",
          }}
        />
      )}
    </div>
  );
}
