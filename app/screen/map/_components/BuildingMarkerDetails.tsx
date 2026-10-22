"use client";

import { useEffect, useState } from "react";
import { LuX } from "react-icons/lu";
import { findBuilding, getBuildings } from "@/lib/buildings";

type CountState =
  | { kind: "loading" }
  | { kind: "ready"; count: number | null }
  | { kind: "error" };

export default function BuildingMarkerDetails({
  buildingName,
  onClose,
}: {
  buildingName: string;
  onClose: () => void;
}) {
  const [state, setState] = useState<CountState>({ kind: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getBuildings(controller.signal)
      .then((buildings) => {
        if (controller.signal.aborted) return;
        const building = findBuilding(buildings, buildingName);
        setState({ kind: "ready", count: building?.marker_count ?? null });
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ kind: "error" });
      });
    return () => controller.abort();
  }, [buildingName, attempt]);

  return (
    <section
      id="building-marker-details"
      aria-labelledby="building-marker-title"
      onPointerDown={(event) => event.stopPropagation()}
      className="absolute inset-x-3 bottom-[calc(var(--tabbar-h)+12px)] z-10 rounded-2xl border border-hairline bg-surface p-4 shadow-float"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id="building-marker-title" className="text-base font-bold text-ink">
          {buildingName}
        </h2>
        <button
          type="button"
          aria-label="館の詳細を閉じる"
          onClick={onClose}
          className="-mr-2 -mt-2 flex size-11 shrink-0 items-center justify-center rounded-full text-muted active:bg-canvas"
        >
          <LuX size={20} aria-hidden />
        </button>
      </div>
      <div role="status" aria-live="polite" aria-atomic="true">
        {state.kind === "loading" && (
          <p className="text-sm text-muted">マーカー数を読み込み中…</p>
        )}
        {state.kind === "ready" && (
          state.count === null ? (
            <p className="text-sm text-muted">この館のマーカー情報は未登録です</p>
          ) : (
            <p className="flex items-baseline gap-2 text-sm text-muted">
              ARマーカー
              <span className="text-2xl font-bold tabular-nums text-brand">
                {state.count}
              </span>
              個
            </p>
          )
        )}
        {state.kind === "error" && (
          <>
            <p className="text-sm text-muted">マーカー数を取得できませんでした</p>
            <button
              type="button"
              onClick={() => {
                setState({ kind: "loading" });
                setAttempt((value) => value + 1);
              }}
              className="mt-2 min-h-11 rounded-xl bg-brand px-4 text-sm font-bold text-white active:bg-brand-strong"
            >
              再読み込み
            </button>
          </>
        )}
      </div>
    </section>
  );
}
