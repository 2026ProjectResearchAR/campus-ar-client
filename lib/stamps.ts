"use client";

import { useCallback } from "react";
import { useLocalStorage, writeLocalStorage } from "./useLocalStorage";

/**
 * スタンプラリー。
 * 獲得状況はこの端末のブラウザ (localStorage) を正とし、すぐに画面へ反映する。
 * あわせて visits API (lib/visits.ts) にも訪問を記録し、サーバー側の記録は
 * スタンプコレクション画面を開いたときにこの端末の記録へマージする。
 * (API に接続できない間はこの端末の記録だけで動く)
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

/**
 * サーバー側の獲得記録をこの端末の記録へマージする。
 * 両方にある場合は早いほうの日時を残す。スタンプ対象外のマーカーは無視する。
 */
export function mergeCollectedStamps(remote: CollectedStamps): void {
  writeLocalStorage<CollectedStamps>(KEY, EMPTY, (prev) => {
    let next = prev;
    for (const [markerId, at] of Object.entries(remote)) {
      if (!findStampSpot(markerId) || Number.isNaN(Date.parse(at))) continue;
      const local = next[markerId];
      if (local && Date.parse(local) <= Date.parse(at)) continue;
      next = { ...next, [markerId]: at };
    }
    return next;
  });
}

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
