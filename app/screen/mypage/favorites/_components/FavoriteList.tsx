"use client";

import Link from "next/link";
import { LuChevronLeft, LuHeart, LuMap } from "react-icons/lu";

import FavoriteButton from "@/componets/FavoriteButton";
import { useFavorites } from "@/lib/favorites";

const dateFormat = new Intl.DateTimeFormat("ja-JP", { month: "numeric", day: "numeric" });

export default function FavoriteList() {
  const { favorites } = useFavorites();

  return (
    <div className="flex-1 px-5 pt-4 pb-[calc(var(--tabbar-h)+24px)]">
      <Link
        href="/screen/mypage"
        className="-ml-2 inline-flex h-10 items-center gap-1 pr-3 pl-1 text-[14px] font-semibold text-muted"
      >
        <LuChevronLeft size={20} strokeWidth={2.2} />
        マイページ
      </Link>

      <h1 className="mt-2 text-[22px] font-bold text-ink">お気に入り</h1>

      {favorites.length === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-2xl border border-hairline bg-surface px-5 py-8 text-center shadow-card">
          <span className="flex size-12 items-center justify-center rounded-full bg-brand-soft text-brand">
            <LuHeart size={24} strokeWidth={2} />
          </span>
          <p className="mt-3 text-[14px] font-semibold text-ink">お気に入りはまだありません</p>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">
            マップのピンをタップして、ハートから登録できます。
          </p>
          <Link
            href="/screen/map"
            className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-full bg-brand px-4 text-[14px] font-bold text-white active:bg-brand-strong"
          >
            <LuMap size={18} strokeWidth={2.2} />
            マップを開く
          </Link>
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {favorites.map((spot) => (
            <li
              key={spot.id}
              className="flex items-center gap-3 rounded-2xl border border-hairline bg-surface py-2 pr-1 pl-4 shadow-card"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold text-ink">{spot.name}</p>
                <p className="text-[12px] text-muted">
                  {spot.category} ・ {dateFormat.format(new Date(spot.addedAt))} に登録
                </p>
              </div>
              <FavoriteButton spot={spot} />
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6 text-[12px] leading-relaxed text-muted">
        お気に入りはこの端末のブラウザに保存されます。ブラウザのデータを削除したり、別の端末・ブラウザで開いたりすると引き継がれません。
      </p>
    </div>
  );
}
