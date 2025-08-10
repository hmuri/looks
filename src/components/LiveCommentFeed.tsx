// components/LiveCommentFeed.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import COMMENTS from "@/data/comments.json";

type Msg = { user: string; text: string };

export default function LiveCommentFeed({
  // 기본 템포 범위 (일반 모드)
  baseMin = 600,
  baseMax = 1200,
  // 버스트(와라르르) 설정
  burstChance = 0.28,
  burstMin = 2,
  burstMax = 5,
  burstGapMin = 70,
  burstGapMax = 140,
  // 스톨(렉) 설정
  stallChance = 0.14,
  stallMin = 1200,
  stallMax = 2600,
  // 기타
  loop = true,
  height = 420,
  standalone = true,
  containerClassName = "",
  maxItems = 250, // 너무 길어지면 앞부분 잘라 메모리 보호
}: {
  baseMin?: number;
  baseMax?: number;
  burstChance?: number;
  burstMin?: number;
  burstMax?: number;
  burstGapMin?: number;
  burstGapMax?: number;
  stallChance?: number;
  stallMin?: number;
  stallMax?: number;
  loop?: boolean;
  height?: number;
  standalone?: boolean;
  containerClassName?: string;
  maxItems?: number;
}) {
  const [items, setItems] = useState<Msg[]>([]);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const idxRef = useRef(0);
  const runningRef = useRef(true);

  const rand = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const addOne = () => {
    const next = COMMENTS[idxRef.current] as Msg | undefined;
    if (!next) return;
    setItems((prev) => {
      const arr = [...prev, next];
      // 메모리 보호
      if (arr.length > maxItems) arr.splice(0, arr.length - maxItems);
      // 다음 프레임에 맨 아래로 스크롤
      requestAnimationFrame(() => {
        if (boxRef.current) {
          boxRef.current.scrollTop = boxRef.current.scrollHeight;
        }
      });
      return arr;
    });
    const ni = idxRef.current + 1;
    idxRef.current = loop
      ? ni % COMMENTS.length
      : Math.min(ni, COMMENTS.length - 1);
  };

  useEffect(() => {
    runningRef.current = true;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    (async function pump() {
      while (runningRef.current) {
        const r = Math.random();

        // 스톨(렉 먹은 듯 멈춤)
        if (r < stallChance) {
          await sleep(rand(stallMin, stallMax));
          continue;
        }

        // 버스트(여러 줄이 와라르르)
        if (r < stallChance + burstChance) {
          const count = rand(burstMin, burstMax);
          for (let i = 0; i < count && runningRef.current; i++) {
            addOne();
            await sleep(rand(burstGapMin, burstGapMax));
          }
          // 버스트 직후 살짝 텀
          await sleep(rand(baseMin >> 1, baseMax >> 1));
          continue;
        }

        // 일반
        addOne();
        await sleep(rand(baseMin, baseMax));
      }
    })();

    return () => {
      runningRef.current = false;
    };
  }, [
    baseMin,
    baseMax,
    burstChance,
    burstMin,
    burstMax,
    burstGapMin,
    burstGapMax,
    stallChance,
    stallMin,
    stallMax,
    loop,
    maxItems,
  ]);

  const List = (
    <>
      {items.map((m, i) => (
        <ChatRow key={`${i}-${m.user}-${m.text.slice(0, 4)}`}>
          <Avatar name={m.user} />
          <div className="text-sm">
            <span className="text-white/70 mr-2">{m.user}</span>
            <span className="text-white/95 break-words">{m.text}</span>
          </div>
        </ChatRow>
      ))}
    </>
  );

  if (!standalone) {
    return (
      <div
        ref={boxRef}
        className={`overflow-y-auto ${containerClassName}`}
        style={height ? { maxHeight: height } : undefined}
      >
        {List}
      </div>
    );
  }

  return (
    <div>
      <div
        ref={boxRef}
        className="flex-1 overflow-y-auto px-3 py-3 space-y-2 scroll-smooth"
        style={{ height }}
      >
        {List}
      </div>
    </div>
  );
}

function ChatRow({ children }: { children: React.ReactNode }) {
  return <div className="flex items-start gap-2">{children}</div>;
}

function Avatar({ name }: { name: string }) {
  const initial =
    name.trim().length > 0 ? name.trim().slice(0, 1).toUpperCase() : "?";
  return (
    <div className="w-6 h-6 rounded-full bg-white/10 grid place-items-center text-[11px] text-white/70 shrink-0">
      {initial}
    </div>
  );
}
