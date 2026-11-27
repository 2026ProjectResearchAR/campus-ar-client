"use client";

import Link from "next/link";
import { useEffect, useEffectEvent, useState } from "react";
import { LuAward, LuCheck, LuTrophy, LuX } from "react-icons/lu";

import { findStampSpot, type StampSpot, useStamps } from "@/lib/stamps";
import { recordVisit } from "@/lib/visits";
import { isArMarkerMessage } from "@/types/arMarker";

/**
 * スキャン画面のスタンプ獲得演出。
 * ArScanner.html (iframe) から postMessage で届く markerFound を受け取り、
 * スタンプ対象のマーカーならスタンプを記録して獲得演出を表示する。
 * スタンプは端末に即時保存し、visits API への記録は裏で送る (lib/visits.ts)。
 *   - 新規獲得     : スタンプが押される演出のカード (閉じるまで表示)
 *   - コンプリート : 上記に加えて紙吹雪とコンプリート表示
 *   - 獲得済み     : 小さなトーストを数秒だけ表示
 */
type Notice =
  | { kind: "acquired"; spot: StampSpot; count: number; total: number; complete: boolean }
  | { kind: "already"; spot: StampSpot };

const ALREADY_TOAST_MS = 2500;

export default function StampOverlay() {
  const { collected, collect, count, total } = useStamps();
  const [notice, setNotice] = useState<Notice | null>(null);

  const onMarkerFound = useEffectEvent((markerId: string) => {
    // 演出中は次の認識を無視する (markerFound はマーカーが揺れるたびに何度も届く)
    if (notice) return;
    const spot = findStampSpot(markerId);
    if (!spot) return;

    if (collected[markerId]) {
      setNotice({ kind: "already", spot });
      return;
    }
    if (collect(markerId)) {
      // サーバーへの訪問記録は裏で送る (失敗時は端末に残して次回再送)
      void recordVisit(markerId);
      const next = count + 1;
      setNotice({ kind: "acquired", spot, count: next, total, complete: next >= total });
    }
  });

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (!isArMarkerMessage(event.data) || event.data.type !== "markerFound") return;
      onMarkerFound(event.data.markerId);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // 獲得済みトーストは自動で消す
  useEffect(() => {
    if (notice?.kind !== "already") return;
    const id = window.setTimeout(() => setNotice(null), ALREADY_TOAST_MS);
    return () => window.clearTimeout(id);
  }, [notice]);

  if (!notice) return null;

  if (notice.kind === "already") {
    return (
      <div
        role="status"
        className="pointer-events-none absolute inset-x-0 top-4 z-10 flex justify-center px-4"
      >
        <p className="flex animate-sheet-in items-center gap-2 rounded-full bg-surface/95 px-4 py-2 text-[13px] font-semibold text-ink shadow-float">
          <LuCheck size={16} strokeWidth={2.6} className="text-brand" />
          「{notice.spot.name}」のスタンプは獲得済みです
        </p>
      </div>
    );
  }

  const { spot, count: got, total: all, complete } = notice;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="stamp-overlay-title"
      className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden bg-ink/40 px-6 pb-[var(--tabbar-h)]"
    >
      {complete && <Confetti />}

      <div className="relative w-full max-w-[320px] animate-sheet-in rounded-3xl bg-surface px-6 pt-8 pb-6 text-center shadow-float">
        <button
          type="button"
          onClick={() => setNotice(null)}
          aria-label="閉じる"
          className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full text-muted active:bg-canvas"
        >
          <LuX size={20} strokeWidth={2.2} />
        </button>

        <span className="mx-auto flex size-24 animate-stamp-pop items-center justify-center rounded-full border-4 border-brand/30 bg-brand text-white ring-4 ring-brand-soft">
          {complete ? <LuTrophy size={44} strokeWidth={2} /> : <LuAward size={44} strokeWidth={2} />}
        </span>

        <p className="mt-5 text-[13px] font-semibold text-brand">
          {complete ? "スタンプラリー コンプリート！" : "スタンプゲット！"}
        </p>
        <h2 id="stamp-overlay-title" className="mt-1 text-[20px] font-bold text-ink">
          {spot.name}
        </h2>
        <p className="mt-2 text-[13px] text-muted">
          {complete
            ? `全${all}個のスタンプを集めました。おめでとうございます！`
            : `集めたスタンプ ${got} / ${all}`}
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <Link
            href="/screen/mypage/stamps"
            className="flex h-12 items-center justify-center rounded-full bg-brand text-[15px] font-semibold text-white active:bg-brand-strong"
          >
            スタンプコレクションを見る
          </Link>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="h-11 rounded-full text-[14px] font-semibold text-muted active:bg-canvas"
          >
            スキャンを続ける
          </button>
        </div>
      </div>
    </div>
  );
}

const CONFETTI_COLORS = ["bg-brand", "bg-amber-400", "bg-locator", "bg-emerald-500"];

/** コンプリート時の紙吹雪 (位置・遅延は固定値にして描画ごとに変わらないようにする) */
function Confetti() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-full">
      {Array.from({ length: 18 }, (_, i) => (
        <span
          key={i}
          className={`absolute top-0 block h-3 w-1.5 animate-confetti rounded-sm ${CONFETTI_COLORS[i % CONFETTI_COLORS.length]}`}
          style={{
            left: `${(i * 37) % 100}%`,
            animationDelay: `${(i % 6) * 120}ms`,
          }}
        />
      ))}
    </div>
  );
}
