// components/ToggleGlow.tsx
"use client";

import { useId } from "react";

type ToggleGlowProps = {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  className?: string;
};

export default function ToggleGlow({
  checked,
  onChange,
  label,
  className = "",
}: ToggleGlowProps) {
  const id = useId();

  return (
    <label
      htmlFor={id}
      className={`flex flex-col items-center gap-4 ${className}`}
    >
      {label && <span className="text-[#C1C1C1] text-[16px]">{label}</span>}

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          "relative w-[76px] h-[40px] rounded-full transition-all duration-300 ease-out",

          checked
            ? "bg-[linear-gradient(180deg,#6CA0C8_0%,#8CB3C8_100%)]"
            : "bg-[linear-gradient(180deg,#243745_0%,#1d2b36_100%)]",

          "backdrop-blur-[1px]",

          "ring-1 ring-white/25",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-1 left-1 h-8 w-8 rounded-full transition-all duration-300 ease-out",
            "bg-[#DFF6FF]",
            "shadow-[0_0_24px_4px_rgba(173,216,230,0.45),inset_0_0_8px_rgba(255,255,255,0.65)]",
            "ring-2 ring-white/60",
            checked ? "translate-x-[36px]" : "translate-x-0",
          ].join(" ")}
        />
      </button>
    </label>
  );
}
