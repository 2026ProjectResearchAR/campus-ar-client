"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LuQrCode } from "react-icons/lu";

import ErrorState from "@/components/ErrorState";
import LoadingState from "@/components/LoadingState";
import ModelViewerModal from "@/components/ModelViewerModal";
import { useArMarker } from "@/hooks/useArMarker";
import { extractMarkerIdFromUrl } from "@/lib/qr";
import { findModelUrl, getSpotByMarkerId, type Spot } from "@/lib/spots";
import { useStamps } from "@/lib/stamps";
import { recordVisit } from "@/lib/visits";
import type { ShowModelMessage } from "@/types/arMarker";
import StampOverlay from "./StampOverlay";

type SpotResult = { kind: "ok"; spot: Spot | null } | { kind: "error"; error: unknown };

/**
 * ARスキャン画面。
 * - AR.js / A-Frame による Hiro マーカー認識
 * - jsQR による QR コード認識 (URL から @marker_xxx を抽出)
 * - QR 認識時は方式 1 (3D モデル鑑賞モーダル) をポップアップ表示
 */
export default function ArScanView() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { markerId, modelErrorId } = useArMarker();
  const { collect } = useStamps();

  // markerId -> 取得結果
  const [results, setResults] = useState<Record<string, SpotResult>>({});

  // 方式1: QRコード検出で開く 3D モデル鑑賞モーダル
  const [modalSpot, setModalSpot] = useState<Spot | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [scanError, setScanError] = useState<{ markerId: string; error: unknown } | null>(null);
  const spotRequestPending = useRef(false);
  // スキャン枠の発光アニメーション用フラグ
  const [isFrameFlashing, setIsFrameFlashing] = useState(false);

  // マーカー・QR からスポットを取得して 3D モーダルを開く処理
  const openSpotModal = useCallback(
    async (targetMarkerId: string) => {
      if (spotRequestPending.current) return;
      spotRequestPending.current = true;
      setScanError(null);
      // スキャン枠を一時的にグリーンに発光
      setIsFrameFlashing(true);
      setTimeout(() => setIsFrameFlashing(false), 1200);

      if (typeof window !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate(100);
        } catch {
          // ignore
        }
      }

      console.log("[ArScanView] 🚀 Requesting spot from API for markerId:", targetMarkerId);
      setIsModalLoading(true);
      try {
        const spot = await getSpotByMarkerId(targetMarkerId);
        console.log("[ArScanView] ✅ Spot API Success:", spot);
        if (spot) {
          collect(targetMarkerId);
          recordVisit(targetMarkerId).catch((err) =>
            console.warn("[ArScanView] Failed to record visit:", err)
          );
          setModalSpot(spot);
        } else {
          console.warn("[ArScanView] ⚠️ Spot not found (null) for markerId:", targetMarkerId);
          setScanError({
            markerId: targetMarkerId,
            error: new Error("このQRコードに対応するスポットが登録されていません"),
          });
        }
      } catch (err) {
        console.error("[ArScanView] ❌ Spot API Error for markerId:", targetMarkerId, err);
        setScanError({ markerId: targetMarkerId, error: err });
      } finally {
        spotRequestPending.current = false;
        setIsModalLoading(false);
      }
    },
    [collect]
  );

  // iframe からの QR コード検出メッセージ (qrFound) を監視
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data) return;

      if (data.type === "qrFound" && typeof data.url === "string") {
        console.log("[ArScanView] 📥 Received QR raw data:", data.url);
        const extractedId = extractMarkerIdFromUrl(data.url);
        console.log("[ArScanView] 🔍 Extracted markerId:", extractedId, "from raw:", data.url);
        if (extractedId) {
          openSpotModal(extractedId);
        } else {
          console.warn("[ArScanView] ⚠️ Could not extract markerId from URL:", data.url);
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [openSpotModal]);

  // URL のクエリパラメータ (?url=... または ?markerId=...) による直接オープン
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get("url");
    const markerParam = params.get("markerId") || params.get("marker_id");

    const target = markerParam || (urlParam ? extractMarkerIdFromUrl(urlParam) : null);
    if (!target) return;

    // 初回描画後に開き、アンマウント時や Effect の再実行時は予約を取り消す。
    const frame = requestAnimationFrame(() => {
      void openSpotModal(target);
    });
    return () => cancelAnimationFrame(frame);
  }, [openSpotModal]);

  // AR マーカー (Hiro 等) 検知時のモデル URL 送信
  useEffect(() => {
    if (markerId === null) return;

    const sendModel = (spot: Spot | null) => {
      const url = spot ? findModelUrl(spot) : null;
      const message: ShowModelMessage = {
        type: "showModel",
        markerId,
        url,
      };
      iframeRef.current?.contentWindow?.postMessage(message, "*");
    };

    const existing = results[markerId];
    if (existing) {
      if (existing.kind === "ok") {
        sendModel(existing.spot);
      }
      return;
    }

    const controller = new AbortController();
    getSpotByMarkerId(markerId, controller.signal)
      .then((spot) => {
        setResults((prev) => ({ ...prev, [markerId]: { kind: "ok", spot } }));
        sendModel(spot);
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setResults((prev) => ({ ...prev, [markerId]: { kind: "error", error } }));
      });
    return () => controller.abort();
  }, [markerId, results]);

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
    <div className="relative w-full flex-1 h-full select-none overflow-hidden">
      {/* カメラ映像 (A-Frame + AR.js + jsQR) - キャッシュバスター付き */}
      <iframe
        ref={iframeRef}
        src="/ArScanner.html?v=20261023_qr2"
        className="w-full h-full border-0 absolute inset-0"
        allow="camera;"
      />

      {/* スキャン照準フレームガイド (カメラ中央の視覚的ヒント) */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-6">
        <div
          className={`relative size-60 rounded-3xl border-2 transition-all duration-300 shadow-[0_0_0_9999px_rgba(0,0,0,0.25)] ${
            isFrameFlashing
              ? "border-emerald-400 scale-105 shadow-[0_0_24px_rgba(52,211,153,0.8)]"
              : "border-white/50"
          }`}
        >
          {/* 四隅の強調アクセント */}
          <span
            className={`absolute -left-0.5 -top-0.5 size-5 rounded-tl-xl border-l-4 border-t-4 transition-colors duration-300 ${
              isFrameFlashing ? "border-emerald-400" : "border-brand"
            }`}
          />
          <span
            className={`absolute -right-0.5 -top-0.5 size-5 rounded-tr-xl border-r-4 border-t-4 transition-colors duration-300 ${
              isFrameFlashing ? "border-emerald-400" : "border-brand"
            }`}
          />
          <span
            className={`absolute -bottom-0.5 -left-0.5 size-5 rounded-bl-xl border-b-4 border-l-4 transition-colors duration-300 ${
              isFrameFlashing ? "border-emerald-400" : "border-brand"
            }`}
          />
          <span
            className={`absolute -bottom-0.5 -right-0.5 size-5 rounded-br-xl border-b-4 border-r-4 transition-colors duration-300 ${
              isFrameFlashing ? "border-emerald-400" : "border-brand"
            }`}
          />
        </div>
        <p className="mt-4 flex items-center gap-1.5 rounded-full bg-black/60 px-4 py-1.5 text-[12px] font-medium text-white/90 backdrop-blur">
          <LuQrCode className="text-[14px] text-brand" />
          <span>QRコードを枠内に合わせてください</span>
        </p>
      </div>

      {/* QR スポット読み込み中のインジケーター */}
      {isModalLoading && (
        <div className="absolute inset-x-4 top-20 z-50 flex items-center justify-center">
          <div className="flex items-center gap-2.5 rounded-full bg-surface/95 px-5 py-2.5 shadow-float">
            <span className="size-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
            <span className="text-[13px] font-bold text-ink">3Dモデルを取得中...</span>
          </div>
        </div>
      )}

      {/* QR認識後のスポット取得エラー */}
      {scanError && (
        <div className="absolute inset-x-3 bottom-3 z-50">
          <ErrorState
            error={scanError.error}
            onRetry={() => void openSpotModal(scanError.markerId)}
          />
        </div>
      )}

      {/* AR マーカー (Hiro) 検出時の下部情報カード */}
      {markerId !== null && (
        <div className="absolute inset-x-3 bottom-3 z-40 rounded-2xl bg-surface/95 px-4 py-3 shadow-float">
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

      {/* スタンプ獲得演出 (はんこ演出・コンプリート表示) */}
      <StampOverlay />

      {/* 方式 1: QR コードから開く 3D モデル鑑賞モーダル */}
      {modalSpot && (
        <ModelViewerModal
          spot={modalSpot}
          modelUrl={findModelUrl(modalSpot)}
          onClose={() => setModalSpot(null)}
        />
      )}
    </div>
  );
}
