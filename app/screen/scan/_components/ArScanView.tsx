"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import ErrorState from "@/componets/ErrorState";
import LoadingState from "@/componets/LoadingState";
import { useArMarker } from "@/hooks/useArMarker";
import { findModelUrl, getSpotByMarkerId, type Spot } from "@/lib/spots";
import type { ShowModelMessage } from "@/types/arMarker";

type SpotResult = { kind: "ok"; spot: Spot | null } | { kind: "error"; error: unknown };

/**
 * ARスキャン画面。
 * iframe の ArScanner.html がマーカーを認識したら spots API でスポット情報を取得し、
 * 情報をオーバーレイ表示しつつ 3D モデルの URL を iframe へ渡して AR 上に描画させる。
 */
export default function ArScanView() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { markerId, modelErrorId } = useArMarker();
  // markerId -> 取得結果 (マーカーの見失い・再認識のたびに再取得しないよう保持する)
  const [results, setResults] = useState<Record<string, SpotResult>>({});
  const hasResult = markerId !== null && markerId in results;

  useEffect(() => {
    if (markerId === null || hasResult) return;
    const controller = new AbortController();
    getSpotByMarkerId(markerId, controller.signal)
      .then((spot) => {
        setResults((prev) => ({ ...prev, [markerId]: { kind: "ok", spot } }));
        const message: ShowModelMessage = {
          type: "showModel",
          markerId,
          url: spot ? findModelUrl(spot) : null,
        };
        iframeRef.current?.contentWindow?.postMessage(message, window.location.origin);
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setResults((prev) => ({ ...prev, [markerId]: { kind: "error", error } }));
      });
    return () => controller.abort();
  }, [markerId, hasResult]);

  const retry = useCallback(() => {
    if (markerId === null) return;
    setResults((prev) => {
      const next = { ...prev };
      delete next[markerId];
      return next;
    });
  }, [markerId]);

  const result = markerId !== null ? results[markerId] : undefined;

  return (
    <div className="relative w-full flex-1 h-full ">
      {/* Reactの変換を受けないよう iframe で純粋なHTMLを読み込む */}
      <iframe
        ref={iframeRef}
        src="/ArScanner.html"
        className="w-full h-full border-0 absolute inset-0"
        allow="camera;"
      />
      {markerId !== null && (
        <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-surface/95 px-4 py-3 shadow-float">
          {!result ? (
            <LoadingState message="スポット情報を取得中..." />
          ) : result.kind === "error" ? (
            <ErrorState error={result.error} onRetry={retry} />
          ) : result.spot === null ? (
            <p className="text-[13px] text-muted">このマーカーに登録されたスポットはありません</p>
          ) : (
            <div>
              <p className="text-[12px] text-muted">{result.spot.building.name}</p>
              <p className="text-[15px] font-bold text-ink">{result.spot.name}</p>
              {result.spot.description && (
                <p className="mt-1 text-[13px] text-ink">{result.spot.description}</p>
              )}
              {modelErrorId === markerId && (
                <p className="mt-1 text-[12px] text-brand">3Dモデルを読み込めませんでした</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
