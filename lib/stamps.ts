"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

/**
 * スタンプラリー。
 * ログインがないため獲得状況はサーバーではなくこの端末のブラウザに保存する。
 * (ブラウザのデータを消すと獲得状況もリセットされる)
 */

export type StampSpot = {
  /** ARScanner から届くマーカーID */
  markerId: string;
  name: string;
};

/**
 * スタンプ対象のスポット一覧。
 * TODO: スポットごとの AR マーカー (#31) が揃ったら差し替える。
 */
export const STAMP_SPOTS: StampSpot[] = [{ markerId: "hiro-placeholder", name: "テストスポット" }];

/** マーカーIDに対応するスタンプ対象スポット (対象外なら undefined) */
export function findStampSpot(markerId: string): StampSpot | undefined {
  return STAMP_SPOTS.find((s) => s.markerId === markerId);
}

/** markerId -> 獲得日時 (ISO 8601) */
export type CollectedStamps = Record<string, string>;

const KEY = "stamps:v1";
const EMPTY: CollectedStamps = {};

export function useStamps() {
  const [collected, setCollected] = useLocalStorage<CollectedStamps>(KEY, EMPTY);

  /** スタンプを獲得する。新規獲得なら true、獲得済み・対象外なら false */
  const collect = useCallback(
    (markerId: string): boolean => {
      if (collected[markerId]) return false;
      if (!findStampSpot(markerId)) return false;
      setCollected((prev) =>
        prev[markerId] ? prev : { ...prev, [markerId]: new Date().toISOString() },
      );
      return true;
    },
    [collected, setCollected],
  );

  const count = STAMP_SPOTS.filter((s) => collected[s.markerId]).length;

  return {
    collected,
    collect,
    count,
    total: STAMP_SPOTS.length,
    isComplete: count === STAMP_SPOTS.length,
  };
}
