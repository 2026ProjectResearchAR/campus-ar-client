"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { LuCheck, LuRotate3D, LuX } from "react-icons/lu";

import FavoriteButton from "@/components/FavoriteButton";
import type { Spot } from "@/lib/spots";

type ModelViewerModalProps = {
  spot: Spot;
  modelUrl: string | null;
  onClose: () => void;
};

function ModelPreview({ url, name }: { url: string; name: string }) {
  const viewerRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const onLoad = () => setStatus("ready");
    const onError = (event: Event) => {
      console.error("[ModelViewer] Failed to display model", url, (event as CustomEvent).detail);
      setStatus("error");
    };
    viewer.addEventListener("load", onLoad);
    viewer.addEventListener("error", onError);
    const timer = window.setTimeout(() => setIsSlow(true), 15000);
    return () => {
      viewer.removeEventListener("load", onLoad);
      viewer.removeEventListener("error", onError);
      window.clearTimeout(timer);
    };
  }, [url]);

  return (
    <>
      <Script
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
        type="module"
        strategy="afterInteractive"
        onError={() => setStatus("error")}
      />
      <model-viewer
        ref={viewerRef}
        src={url}
        alt={name}
        loading="eager"
        auto-rotate
        camera-controls
        camera-target="auto auto auto"
        camera-orbit="0deg 75deg 105%"
        touch-action="pan-y"
        shadow-intensity="1"
        exposure="1.0"
        interaction-prompt="auto"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", background: "transparent" }}
      />
      {status === "loading" && (
        <div role="status" className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 px-6 text-center text-white">
          <span className="size-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          <p className="text-[14px]">3Dモデルを読み込んでいます...</p>
          {isSlow && <p className="text-[12px] text-white/70">通信状況によって時間がかかることがあります</p>}
        </div>
      )}
      {status === "error" && (
        <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/80 px-6 text-center text-white">
          <p className="text-[14px]">3Dモデルを表示できませんでした</p>
          <p className="text-[12px] text-white/70">通信環境やブラウザを確認して、画面を閉じてもう一度お試しください</p>
        </div>
      )}
      {status === "ready" && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/60 px-3.5 py-1 text-[11px] font-medium text-white/80 backdrop-blur">
          指でドラッグして回転 / ピンチで拡大
        </div>
      )}
    </>
  );
}

export default function ModelViewerModal({ spot, modelUrl, onClose }: ModelViewerModalProps) {
  // Esc キーで閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <>
      <div role="dialog" aria-modal="true" aria-label="3D モデルビューアー" className="fixed inset-0 z-[70] flex flex-col bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
        {/* ヘッダー */}
        <header className="flex h-14 shrink-0 items-center justify-between px-4 text-white">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-brand text-[14px]">
              <LuRotate3D />
            </span>
            <span className="text-[14px] font-bold tracking-tight">3D モデルビューアー</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white/90 transition-colors hover:bg-white/20 active:scale-95"
          >
            <LuX size={20} />
          </button>
        </header>

        {/* 3D モデル表示メイン領域 */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
          {modelUrl ? (
            <ModelPreview key={modelUrl} url={modelUrl} name={spot.name} />
          ) : (
            <div className="flex flex-col items-center gap-2 text-center text-white/60">
              <LuRotate3D size={48} className="stroke-[1.5]" />
              <p className="text-[14px]">このスポットには 3D モデルが登録されていません</p>
            </div>
          )}
        </div>

        {/* フッター情報カード */}
        <footer className="shrink-0 rounded-t-3xl border-t border-white/10 bg-surface px-5 pt-4 pb-8 text-ink shadow-2xl">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="inline-block rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-semibold text-brand">
                {spot.building.name}
              </span>
              <h2 className="mt-1 truncate text-[20px] font-bold text-ink">{spot.name}</h2>
              {spot.description && (
                <p className="mt-1 text-[13px] leading-relaxed text-muted">{spot.description}</p>
              )}
            </div>
            <div className="shrink-0 pt-1">
              <FavoriteButton spot={{ id: spot.id, name: spot.name, category: "研究室" }} />
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[12px] font-bold text-brand">
            <span className="flex size-4 items-center justify-center rounded-full bg-brand text-white">
              <LuCheck size={12} strokeWidth={3} />
            </span>
            <span>スタンプを獲得しました！</span>
          </div>
        </footer>
      </div>
    </>
  );
}
