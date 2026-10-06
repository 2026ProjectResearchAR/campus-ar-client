"use client";

import { useArMarker } from "@/hooks/useArMarker";

export default function ScanPage() {
  const markerId = useArMarker();

  return (
    <div className="relative w-full flex-1 h-full ">
      {/* Reactの変換を受けないよう iframe で純粋なHTMLを読み込む */}
      <iframe
        src="/ArScanner.html"
        className="w-full h-full border-0 absolute inset-0"
        allow="camera;"
      />
      {markerId && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-4 py-1.5 text-xs font-bold text-[#c8161d] shadow">
          マーカーを認識しました: {markerId}
        </div>
      )}
    </div>
  );
}
