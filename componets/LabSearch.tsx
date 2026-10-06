"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { fetchLabs, filterLabs, type LabEntry } from "@/lib/lab-search";
import EmptyState from "@/componets/EmptyState";
import ErrorState from "@/componets/ErrorState";
import LoadingState from "@/componets/LoadingState";
import styles from "@/app/page.module.css";

const DEBOUNCE_MS = 250;

/** attempt: どの取得試行の結果か(再試行で進む)。現在の attempt と違えば読み込み中 */
type Load =
  | { attempt: number; status: "ready"; labs: LabEntry[] }
  | { attempt: number; status: "error"; error: unknown };

/** ホームの検索バーと結果一覧。入力があった時点で研究室データを取得する */
export default function LabSearch() {
  const [input, setInput] = useState("");
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
  const current = load?.attempt === attempt ? load : null;

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  const results = useMemo(
    () => (current?.status === "ready" ? filterLabs(current.labs, query) : []),
    [current, query],
  );

  return (
    <>
      <div className="flex items-center bg-white rounded-full px-4 py-1.5 shadow-md border border-gray-100 mb-6">
        <input
          type="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="教授名・研究分野を検索"
          aria-label="研究室を検索"
          className={`w-full text-xs text-gray-700 bg-transparent border-none ${styles.searchInput}`}
        />
        <span className="bg-[#c8161d] text-white rounded-full w-7 h-7 flex items-center justify-center text-xs shrink-0 ml-2">
          <FaSearch />
        </span>
      </div>

      {query !== "" && (
        <section aria-label="検索結果" className="-mt-3 mb-6">
          {current?.status === "error" ? (
            <ErrorState error={current.error} onRetry={retry} />
          ) : current?.status !== "ready" ? (
            <LoadingState message="検索中..." />
          ) : results.length === 0 ? (
            <EmptyState message="該当する研究室が見つかりません" />
          ) : (
            <ul className="flex flex-col gap-2">
              {results.map((l) => (
                <li key={l.id}>
                  <Link
                    href={`/screen/map?spot=${encodeURIComponent(l.id)}`}
                    className="block rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm no-underline"
                  >
                    <div className="text-sm font-bold text-gray-900">{l.name}</div>
                    <div className="text-[11px] text-[#c8161d]">{l.buildingName}</div>
                    {l.description && (
                      <p className="mt-1 text-[11px] leading-relaxed text-gray-600">{l.description}</p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </>
  );
}
