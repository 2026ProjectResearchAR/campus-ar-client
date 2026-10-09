"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

/**
 * お気に入りスポット。
 * API にお気に入りのエンドポイントがなく、ログインもないため、
 * スタンプ (lib/stamps.ts) と同じくこの端末のブラウザ (localStorage) に保存する。
 */

export type FavoriteSpot = {
  /** スポットID (マップのピンのID。API の建物 ID に変わっても扱えるよう文字列で持つ) */
  id: string;
  name: string;
  category: string;
  /** 登録日時 (ISO 8601) */
  addedAt: string;
};

/** お気に入り登録に必要なスポット情報 */
export type FavoriteTarget = { id: string | number; name: string; category: string };

const KEY = "favorites:v1";
const EMPTY: FavoriteSpot[] = [];

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<FavoriteSpot[]>(KEY, EMPTY);

  const isFavorite = useCallback(
    (id: string | number) => favorites.some((f) => f.id === String(id)),
    [favorites],
  );

  /** 登録済みなら解除、未登録なら登録する */
  const toggleFavorite = useCallback(
    (spot: FavoriteTarget) => {
      const id = String(spot.id);
      setFavorites((prev) =>
        prev.some((f) => f.id === id)
          ? prev.filter((f) => f.id !== id)
          : [
              ...prev,
              { id, name: spot.name, category: spot.category, addedAt: new Date().toISOString() },
            ],
      );
    },
    [setFavorites],
  );

  return { favorites, isFavorite, toggleFavorite };
}
