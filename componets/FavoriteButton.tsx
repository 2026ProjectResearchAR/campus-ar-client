"use client";

import { LuHeart } from "react-icons/lu";
import { FaHeart } from "react-icons/fa";
import { useFavorites } from "@/lib/favorites";
import type { SpotInfo } from "@/lib/spots";

/** スポットのお気に入りトグル (ハートアイコン) */
export default function FavoriteButton({ spot }: { spot: SpotInfo }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(spot.id);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={
        active
          ? `${spot.name}をお気に入りから外す`
          : `${spot.name}をお気に入りに追加`
      }
      onClick={() => toggleFavorite(spot)}
      className="flex size-9 shrink-0 items-center justify-center rounded-full text-brand transition-colors hover:bg-brand/10"
    >
      {active ? <FaHeart size={20} /> : <LuHeart size={22} strokeWidth={2} />}
    </button>
  );
}
