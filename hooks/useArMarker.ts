"use client";

import { useEffect, useState } from "react";
import { isArMarkerMessage } from "@/types/arMarker";

/**
 * ArScanner.html の iframe から postMessage で届くマーカー認識結果を受け取る。
 * 認識中のマーカーIDを返し、未認識の場合は null を返す。
 * 3D モデルの読み込みに失敗したマーカーIDは modelErrorId で返す。
 */
export function useArMarker(): { markerId: string | null; modelErrorId: string | null } {
  const [markerId, setMarkerId] = useState<string | null>(null);
  const [modelErrorId, setModelErrorId] = useState<string | null>(null);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (!isArMarkerMessage(event.data)) return;
      const { type, markerId: id } = event.data;
      if (type === "markerFound") {
        setMarkerId(id);
      } else if (type === "markerLost") {
        // 別マーカーが先に認識されている場合は消さない
        setMarkerId((current) => (current === id ? null : current));
      } else {
        setModelErrorId(id);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return { markerId, modelErrorId };
}
