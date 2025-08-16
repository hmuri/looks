// app/live/page.tsx
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

  // 녹화 관련 상태
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);

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

  const pickSupportedMimeType = () => {
    const candidates = [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
      // 사파리 최신 일부: "video/mp4;codecs=h264,aac" 지원 가능하나 호환 이슈가 많아 기본 비활성
    ];
    for (const type of candidates) {
      if (MediaRecorder.isTypeSupported(type)) return type;
    }
    return ""; // 브라우저가 정하도록
  };

  const startRecording = () => {
    if (!stream) return;
    try {
      const mimeType = pickSupportedMimeType();
      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const usedType = mr.mimeType || mimeType || "video/webm";
        const ext = usedType.includes("mp4") ? "mp4" : "webm";
        const ts = new Date();
        const pad = (n: number) => String(n).padStart(2, "0");
        const name =
          `live-` +
          `${ts.getFullYear()}${pad(ts.getMonth() + 1)}${pad(ts.getDate())}-` +
          `${pad(ts.getHours())}${pad(ts.getMinutes())}${pad(
            ts.getSeconds()
          )}.${ext}`;

        const blob = new Blob(chunksRef.current, { type: usedType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 10_000);
        setRecording(false);
      };
      // timeslice를 주면 ondataavailable이 주기적으로 호출되어 메모리 압력이 덜함
      mr.start(1000);
      setRecorder(mr);
      setRecording(true);
    } catch (e: any) {
      setError(e?.message ?? "녹화를 시작할 수 없습니다.");
    }
  };

  const stopRecording = () => {
    try {
      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
      }
    } catch {
      // ignore
    } finally {
      setRecorder(null);
    }
  };

  const startCamera = async () => {
    try {
      setError(null);
      const s = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
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
    if (recording) stopRecording();
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
          <div
            className={[
              "px-2 py-1 rounded text-xs font-semibold",
              recording ? "bg-red-600/80" : "bg-white/10",
            ].join(" ")}
            title={recording ? "녹화 중" : "대기"}
          >
            {recording ? "REC" : "LIVE"} {isLive ? fmt(seconds) : "대기"}
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
                  onClick={() => {
                    setIsLive(true);
                    // 방송 시작 시 녹화도 함께 시작
                    if (!recording) startRecording();
                  }}
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
                  endLive(); // 녹화 종료 & 타이머 리셋
                  stopCamera(); // 카메라/마이크 정지
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
