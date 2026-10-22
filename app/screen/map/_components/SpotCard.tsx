"use client";

import { LuX } from "react-icons/lu";

import FavoriteButton from "@/componets/FavoriteButton";
import type { FavoriteTarget } from "@/lib/favorites";

/**
 * ピンをタップしたときにマップ下部 (タブバーの上) に出すスポットのカード。
 * お気に入りの登録/解除ができる。
 */
export default function SpotCard({
  spot,
  onClose,
}: {
  spot: FavoriteTarget;
  onClose: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-label={spot.name}
      className="absolute inset-x-3 bottom-[calc(var(--tabbar-h)+12px)] z-10 flex items-center gap-1 rounded-2xl border border-hairline bg-surface/95 py-2 pr-1 pl-4 shadow-float backdrop-blur"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-[16px] font-bold text-ink">{spot.name}</p>
        <p className="text-[12px] text-muted">{spot.category}</p>
      </div>
      <FavoriteButton spot={spot} />
      <button
        type="button"
        aria-label="閉じる"
        onClick={onClose}
        className="flex size-11 shrink-0 items-center justify-center rounded-full text-muted active:bg-canvas"
      >
        <LuX size={20} strokeWidth={2.2} />
      </button>
    </div>
  );
}
