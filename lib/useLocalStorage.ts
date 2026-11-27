"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

/**
 * ブラウザ (localStorage) にデータを保存するための共通フック。
 * ログインの概念がないため、ユーザーごとのデータ (スタンプ・お気に入り・メモ等) は
 * すべてこの端末のブラウザに保存する。キーは STORAGE_PREFIX を付けて名前空間を分ける。
 */
export const STORAGE_PREFIX = "campus-ar:";

/** 同一タブ内の更新を他のフックへ通知するためのイベント名 */
const LOCAL_EVENT = "campus-ar:local-storage";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback); // 他タブからの更新
  window.addEventListener(LOCAL_EVENT, callback); // 同一タブ内の更新
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LOCAL_EVENT, callback);
  };
}

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null; // プライベートモード等で localStorage が使えない
  }
}

/**
 * localStorage と同期する state。
 * - SSR / hydration 時は initialValue を返す (hydration mismatch を防ぐ)
 * - 他コンポーネント・他タブの更新にも追従する
 * - initialValue は参照が変わらない値 (モジュールスコープの定数等) を渡すこと
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): readonly [T, (next: T | ((prev: T) => T)) => void] {
  const fullKey = STORAGE_PREFIX + key;

  // snapshot は文字列なので参照比較が安定する
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(fullKey),
    () => null,
  );

  const value = useMemo<T>(() => {
    if (raw === null) return initialValue;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return initialValue;
    }
  }, [raw, initialValue]);

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => writeLocalStorage(key, initialValue, next),
    [key, initialValue],
  );

  return [value, setValue] as const;
}

/** localStorage の値を読む (フックの外から使う用)。読めなければ initialValue */
export function readLocalStorage<T>(key: string, initialValue: T): T {
  if (typeof window === "undefined") return initialValue;
  const raw = readRaw(STORAGE_PREFIX + key);
  if (raw === null) return initialValue;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return initialValue;
  }
}

/**
 * localStorage へ書き込み、同じキーを使っている useLocalStorage へ通知する
 * (フックの外、非同期処理の完了後などから使う用)。
 */
export function writeLocalStorage<T>(
  key: string,
  initialValue: T,
  next: T | ((prev: T) => T),
): void {
  if (typeof window === "undefined") return;
  try {
    const prev = readLocalStorage(key, initialValue);
    const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
    window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(resolved));
    window.dispatchEvent(new Event(LOCAL_EVENT));
  } catch {
    // 容量超過・プライベートモード等では保存しない
  }
}
