"use client";

import { useRouter } from "next/navigation";
import ToggleGlow from "@/components/ToggleGlow";
import VerticalSliderGlow from "@/components/VerticalSliderGlow";
import { useState } from "react";
import GlowSpinRing from "@/components/GlowSpinRing";

export default function Home() {
  const [lamp1, setLamp1] = useState(false);
  const [lamp2, setLamp2] = useState(true);
  const [lamp3, setLamp3] = useState(true);
  const [lamp4, setLamp4] = useState(true);
  const [lamp5, setLamp5] = useState(true);
  const [lamp6, setLamp6] = useState(true);
  const [v1, setV1] = useState(20);
  const [v2, setV2] = useState(20);
  const [v3, setV3] = useState(20);
  const [v4, setV4] = useState(20);
  const router = useRouter();
  return (
    <div className="h-[714px] flex items-center justify-center text-center pl-10">
      <div className="w-[207px] p-5 flex flex-col  rounded-[10px] bg-gradient-to-b from-[#29557B] via-[#3B8161]  via-[#557189] to-[#698195] gap-10">
        <ToggleGlow
          label="무대 스크린 on/off"
          checked={lamp1}
          onChange={setLamp1}
          className="select-none pt-7"
        />
        <ToggleGlow
          label="조명 1 on/off"
          checked={lamp2}
          onChange={setLamp2}
          className="select-none"
        />
        <ToggleGlow
          label="조명 2 on/off"
          checked={lamp3}
          onChange={setLamp3}
          className="select-none"
        />
        <ToggleGlow
          label="마이크 on/off"
          checked={lamp4}
          onChange={setLamp4}
          className="select-none"
        />
        <span className="text-[#C1C1C1] text-[20px] mt-21">현실 설정</span>
      </div>
      <div className=" h-full flex flex-col  ">
        <div className="flex gap-6 pl-10 pr-2 ">
          <div className="w-[100px]">
            <div className="text-[#E9E9E9] flex flex-col items-center pt-10">
              <div className="mb-3 text-lg">마이크 1</div>
              <VerticalSliderGlow value={v1} onChange={setV1} />
              <div className="mt-7 text-center">{Math.round(v1)}</div>
            </div>
          </div>
          <div className="w-[100px]">
            <div className="text-[#E9E9E9] flex flex-col items-center pt-10">
              <div className="mb-3 text-lg">마이크 2</div>
              <VerticalSliderGlow value={v2} onChange={setV2} />
              <div className="mt-7 text-center">{Math.round(v2)}</div>
            </div>
          </div>
          <div className="w-[100px]">
            <div className="text-[#E9E9E9] flex flex-col items-center pt-10">
              <div className="mb-3 text-lg">배경 음악</div>
              <VerticalSliderGlow value={v3} onChange={setV3} />
              <div className="mt-7 text-center">{Math.round(v3)}</div>
            </div>
          </div>
          <div className="w-[100px]">
            <div className="text-[#E9E9E9] flex flex-col items-center pt-10">
              <div className="mb-3 text-lg ">스크린 음악</div>
              <VerticalSliderGlow value={v4} onChange={setV4} />
              <div className="mt-7 text-center">{Math.round(v4)}</div>
            </div>
          </div>
          <div>
            <div className="text-[#E9E9E9] text-[16px] text-[16px] w-[200px] p-5 flex flex-col items-center h-[525px] rounded-[10px] bg-gradient-to-b from-[#29557B] via-[#3B8161]  via-[#557189] to-[#698195] ">
              <div className=" text-center mt-4">기기 1</div>
              <div
                className="relative mt-3 grid place-items-center"
                style={{ width: 94, height: 94 }}
              >
                <GlowSpinRing active={lamp5} />
                <img
                  src="/image/infinite.svg"
                  alt="infinite"
                  className="w-[82px] h-[82px] relative z-10 select-none"
                />
              </div>
              <ToggleGlow
                checked={lamp5}
                onChange={setLamp5}
                className="select-none pt-3"
              />
              <div className=" text-center mt-15">기기 2</div>
              <div
                className="relative mt-3 grid place-items-center"
                style={{ width: 94, height: 94 }}
              >
                <GlowSpinRing active={lamp6} />
                <img
                  src="/image/infinite.svg"
                  alt="infinite"
                  className="w-[82px] h-[82px] relative z-10 select-none"
                />
              </div>
              <ToggleGlow
                checked={lamp6}
                onChange={setLamp6}
                className="select-none pt-3"
              />
            </div>
            <div className="mt-8 text-center text-[#E9E9E9]">
              VR 연결 및 접속
            </div>
          </div>
        </div>
        <div
          className="w-[674px] h-[66px] p-5 ml-17 mt-10 flex items-center justify-center rounded-[10px]
             bg-[radial-gradient(ellipse_at_center,_#395874_0%,_#5E7482_40%,_#63788B_60%,_#698195_100%)]
             text-white"
        >
          만궁 전체 설정
        </div>
      </div>
      <div className="flex justify-start self-start">
        <img
          src="/image/electricity.svg"
          alt="electiricity"
          className="flex "
        />
      </div>
    </div>
  );
}
