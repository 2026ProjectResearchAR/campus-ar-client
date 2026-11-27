"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export type Memo = {
  id: string;
  title: string;
  body: string;
  /** 関連付けたスポット (任意)。name はスナップショット */
  spotId?: number;
  spotName?: string;
  createdAt: number;
  updatedAt: number;
};

export type MemoInput = Pick<Memo, "title" | "body" | "spotId" | "spotName">;

const KEY = "campus-ar:memos";
const EMPTY: Memo[] = [];

/** メモの作成・更新・削除 (新しく更新したものが先頭) */
export function useMemos() {
  const [memos, setMemos] = useLocalStorage<Memo[]>(KEY, EMPTY);

  const addMemo = useCallback(
    (input: MemoInput) => {
      const now = Date.now();
      setMemos((prev) => [
        { ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now },
        ...prev,
      ]);
    },
    [setMemos],
  );

  const updateMemo = useCallback(
    (id: string, input: MemoInput) =>
      setMemos((prev) => {
        const target = prev.find((m) => m.id === id);
        if (!target) return prev;
        return [
          { ...target, ...input, updatedAt: Date.now() },
          ...prev.filter((m) => m.id !== id),
        ];
      }),
    [setMemos],
  );

  const deleteMemo = useCallback(
    (id: string) => setMemos((prev) => prev.filter((m) => m.id !== id)),
    [setMemos],
  );

  return { memos, addMemo, updateMemo, deleteMemo };
}
