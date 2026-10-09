"use client";

import { FaHeart } from "react-icons/fa";
import { LuHeart } from "react-icons/lu";

import { type FavoriteTarget, useFavorites } from "@/lib/favorites";

/** スポットのお気に入り登録/解除ボタン (ハートアイコン)。タップ領域 44px */
export default function FavoriteButton({ spot }: { spot: FavoriteTarget }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(spot.id);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? `${spot.name}をお気に入りから外す` : `${spot.name}をお気に入りに追加`}
      onClick={() => toggleFavorite(spot)}
      className="flex size-11 shrink-0 items-center justify-center rounded-full text-brand transition-colors active:bg-brand-soft"
    >
      {active ? <FaHeart size={20} /> : <LuHeart size={22} strokeWidth={2} />}
    </button>
  );
}
