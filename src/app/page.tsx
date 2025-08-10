"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-4">
      <div className="relative w-full max-w-xl flex flex-col items-center">
        <div className="font-bold text-3xl p-2 ">직무 유형 테스트</div>
        <div className="text-sm mb-4">
          나에게 <span className="text-[#456FFE] font-semibold">딱 맞는</span>{" "}
          직무와 자격증을 찾아보세요!
        </div>
        <div className="w-full">
          <div className="flex justify-center pb-4 h-[420px]"></div>
        </div>
        <div className="w-full flex justify-center mt-3"></div>
      </div>
    </div>
  );
}
