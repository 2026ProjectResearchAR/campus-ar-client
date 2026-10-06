"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { SpotInfo } from "./spots";

const KEY = "campus-ar:favorites";
const EMPTY: SpotInfo[] = [];

/** お気に入りスポット (id + name/category のスナップショット) */
export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<SpotInfo[]>(KEY, EMPTY);

  const isFavorite = useCallback(
    (id: number) => favorites.some((f) => f.id === id),
    [favorites],
  );

  const toggleFavorite = useCallback(
    (spot: SpotInfo) =>
      setFavorites((prev) =>
        prev.some((f) => f.id === spot.id)
          ? prev.filter((f) => f.id !== spot.id)
          : [...prev, { id: spot.id, name: spot.name, category: spot.category }],
      ),
    [setFavorites],
  );

  return { favorites, isFavorite, toggleFavorite };
}
