"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

/** 同一タブ内の更新を他のフックへ通知するためのイベント名 */
const LOCAL_EVENT = "local-storage-sync";

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
    return null;
  }
}

/**
 * localStorage と同期する state。
 * - SSR / hydration 時は常に initialValue を返す (hydration mismatch を防ぐ)
 * - 他コンポーネント・他タブの更新にも追従する
 * - initialValue は定数 (モジュールスコープ等) を渡すこと
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): readonly [T, (next: T | ((prev: T) => T)) => void] {
  // snapshot は文字列 (プリミティブ) なので参照比較が安定する
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(key),
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
    (next: T | ((prev: T) => T)) => {
      try {
        const currentRaw = readRaw(key);
        const prev =
          currentRaw === null ? initialValue : (JSON.parse(currentRaw) as T);
        const resolved =
          typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        window.localStorage.setItem(key, JSON.stringify(resolved));
        window.dispatchEvent(new Event(LOCAL_EVENT));
      } catch {
        // 容量超過・プライベートモード等では何もしない
      }
    },
    [key, initialValue],
  );

  return [value, setValue] as const;
}
