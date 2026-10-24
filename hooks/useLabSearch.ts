"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchLabs, filterLabs, type LabEntry } from "@/lib/lab-search";

const DEBOUNCE_MS = 250;

/** attempt: どの取得試行の結果か (再試行で進む)。現在の attempt と違えば読み込み中 */
type Load =
  | { attempt: number; status: "ready"; labs: LabEntry[] }
  | { attempt: number; status: "error"; error: unknown };

export type LabSearchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; error: unknown; retry: () => void }
  | { status: "ready"; results: LabEntry[] };

/**
 * 研究室 (教授名・研究分野) 検索。
 * 初めてキーワードが入力された時点で API から研究室データを取得し、以降はクライアント側で絞り込む。
 */
export function useLabSearch(input: string): LabSearchState {
  const [query, setQuery] = useState("");
  const [load, setLoad] = useState<Load | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setQuery(input.trim()), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [input]);

  const needData = query !== "";
  useEffect(() => {
    if (!needData) return;
    const ctrl = new AbortController();
    fetchLabs(ctrl.signal)
      .then((labs) => setLoad({ attempt, status: "ready", labs }))
      .catch((error) => {
        if (!ctrl.signal.aborted) setLoad({ attempt, status: "error", error });
      });
    return () => ctrl.abort();
  }, [needData, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  const current = load?.attempt === attempt ? load : null;

  return useMemo<LabSearchState>(() => {
    if (query === "") return { status: "idle" };
    if (!current) return { status: "loading" };
    if (current.status === "error") return { status: "error", error: current.error, retry };
    return { status: "ready", results: filterLabs(current.labs, query) };
  }, [query, current, retry]);
}
