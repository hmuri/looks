// app/live/page.tsx (또는 원하는 경로)
// 유튜브 스튜디오 느낌의 라이브 프리뷰 (웹캠 사용, 송출 X)
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Power,
  Users,
  MessageCircle,
  FlipHorizontal,
} from "lucide-react";
import LiveCommentFeed from "@/components/LiveCommentFeed";

export default function LiveStudioMock() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [camOn, setCamOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [mirrored, setMirrored] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [seconds, setSeconds] = useState(320);
  const [viewers, setViewers] = useState(28619);
  const [error, setError] = useState<string | null>(null);

  // 타이머 & 가짜 시청자 수 변화
  useEffect(() => {
    let t: any, v: any;
    if (isLive) {
      t = setInterval(() => setSeconds((s) => s + 1), 1000);
      v = setInterval(() => {
        setViewers((n) => Math.max(1, n + (Math.random() > 0.5 ? 1 : -1)));
      }, 300);
    }
    return () => {
      clearInterval(t);
      clearInterval(v);
    };
  }, [isLive]);

  const startCamera = async () => {
    try {
      setError(null);
      const s = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: true,
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        // iOS/Safari: playsInline+muted로 자동재생 허용
        await videoRef.current.play().catch(() => {});
      }
      setCamOn(true);
      setMicOn(true);
    } catch (e: any) {
      setError(e?.message ?? "카메라/마이크 접근 실패");
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setCamOn(false);
    setMicOn(false);
  };

  const toggleCam = () => {
    if (!stream) return;
    const v = stream.getVideoTracks()[0];
    if (v) {
      v.enabled = !v.enabled;
      setCamOn(v.enabled);
    }
  };

  const toggleMic = () => {
    if (!stream) return;
    const a = stream.getAudioTracks()[0];
    if (a) {
      a.enabled = !a.enabled;
      setMicOn(a.enabled);
    }
  };

  const endLive = () => {
    setIsLive(false);
    setSeconds(320);
  };

  const fmt = (n: number) => new Date(n * 1000).toISOString().substring(11, 19); // 00:00:00

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* 상단 바 */}
      <header className="h-14 bg-[#202020] flex items-center px-4 gap-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Studio</span>
        </div>
        <div className="ml-auto flex items-center gap-5 text-sm text-white/80">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{viewers.toLocaleString()}</span>
          </div>
          <div className="px-2 py-1 rounded bg-red-600/80 text-xs font-semibold">
            LIVE {isLive ? fmt(seconds) : "대기"}
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto p-4 grid grid-cols-[1fr_360px] gap-4">
        {/* 왼쪽: 미리보기 */}
        <section className="bg-[#1E1E1E] rounded-lg overflow-hidden border border-white/10 relative">
          <div className="aspect-video bg-black relative">
            <video
              ref={videoRef}
              className={[
                "absolute inset-0 w-full h-full object-cover",
                "transform",
                mirrored ? "scale-x-[-1]" : "",
              ].join(" ")}
              playsInline
              muted
              autoPlay
            />
            {!stream && (
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <div className="text-white/80 mb-4">
                    카메라가 꺼져 있습니다
                  </div>
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 rounded-md bg-white text-black font-medium hover:bg-white/90"
                  >
                    카메라 켜기
                  </button>
                  {error && (
                    <div className="mt-3 text-red-400 text-sm">{error}</div>
                  )}
                </div>
              </div>
            )}
            {/* 좌상단 LIVE 배지 */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-2 px-2 py-[2px] rounded bg-red-600/90 text-xs font-semibold">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                실시간
              </span>
              <span className="text-xs text-white/80">
                {isLive ? fmt(seconds) : "00:00:00"}
              </span>
            </div>
          </div>

          {/* 하단 컨트롤 바 */}
          <div className="h-14 px-4 flex items-center gap-3 border-t border-white/10 bg-[#1A1A1A]/80">
            <button
              onClick={toggleCam}
              disabled={!stream}
              className="flex items-center gap-2 px-3 py-2 rounded bg-white/10 hover:bg-white/15 disabled:opacity-40"
            >
              {camOn ? (
                <Video className="w-4 h-4" />
              ) : (
                <VideoOff className="w-4 h-4" />
              )}
              <span className="text-sm">
                {camOn ? "카메라 켜짐" : "카메라 꺼짐"}
              </span>
            </button>

            <button
              onClick={toggleMic}
              disabled={!stream}
              className="flex items-center gap-2 px-3 py-2 rounded bg-white/10 hover:bg-white/15 disabled:opacity-40"
            >
              {micOn ? (
                <Mic className="w-4 h-4" />
              ) : (
                <MicOff className="w-4 h-4" />
              )}
              <span className="text-sm">
                {micOn ? "마이크 켜짐" : "마이크 꺼짐"}
              </span>
            </button>

            <button
              onClick={() => setMirrored((m) => !m)}
              disabled={!stream}
              className="flex items-center gap-2 px-3 py-2 rounded bg-white/10 hover:bg-white/15 disabled:opacity-40"
              title="미러 토글"
            >
              <FlipHorizontal className="w-4 h-4" />
              <span className="text-sm">미러</span>
            </button>

            <div className="ml-auto flex items-center gap-2">
              {!isLive ? (
                <button
                  onClick={() => setIsLive(true)}
                  disabled={!stream}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 disabled:opacity-40 font-semibold"
                >
                  방송 시작
                </button>
              ) : (
                <button
                  onClick={endLive}
                  className="px-4 py-2 rounded bg-white/10 hover:bg-white/15 font-semibold"
                >
                  방송 일시정지
                </button>
              )}
              <button
                onClick={() => {
                  endLive();
                  stopCamera();
                }}
                className="px-3 py-2 rounded bg-white/10 hover:bg-white/15"
                title="스트림 종료"
              >
                <Power className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* 오른쪽: 채팅 패널 */}
        <aside className="bg-[#1E1E1E] rounded-lg border border-white/10 flex flex-col overflow-hidden">
          <div className="h-12 px-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2 text-sm">
              <MessageCircle className="w-4 h-4" />
              주요 채팅
            </div>
          </div>

          {/* 리스트만 임베드 */}
          <LiveCommentFeed burstChance={0.15} stallChance={0.08} loop />

          <div className="h-14 px-3 py-2 border-t border-white/10 flex items-center gap-2">
            <input
              placeholder="채팅..."
              className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:border-white/20"
            />
            <button className="px-3 py-2 rounded bg-white/10 hover:bg-white/15 text-sm">
              전송
            </button>
          </div>
        </aside>
      </main>

      <footer className="text-center text-white/40 text-xs py-3"></footer>
    </div>
  );
}

function ChatBubble({ name, text }: { name: string; text: string }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <div className="w-6 h-6 rounded-full bg-white/10 grid place-items-center text-white/70">
        {name}
      </div>
      <div className="bg-white/5 rounded px-3 py-2 border border-white/10">
        {text}
      </div>
    </div>
  );
}

function SystemBubble({ text }: { text: string }) {
  return (
    <div className="text-xs text-white/60 bg-white/5 border border-white/10 rounded px-3 py-2">
      {text}
    </div>
  );
}
