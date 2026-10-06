"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import EmptyState from "@/componets/EmptyState";
import ErrorState from "@/componets/ErrorState";
import LoadingState from "@/componets/LoadingState";
import { fetchBuildingSpots, type BuildingSpot, type MapSpot } from "@/lib/buildings";

type SpotDetailSheetProps = {
  spot: MapSpot;
  mark: ReactNode;
  onClose: () => void;
};

type SpotsState = {
  buildingId: string;
  spots: BuildingSpot[] | null;
  error: unknown;
};

/**
 * マップのピン押下時に表示するボトムシート。
 * オーバーレイ・Esc・ドラッグハンドル(ボタン)で閉じる。
 * 建物内のスポット (ARマーカー) 一覧は GET /api/v1/buildings/{id}/spots で取得する。
 */
export default function SpotDetailSheet({ spot, mark, onClose }: SpotDetailSheetProps) {
  const [state, setState] = useState<SpotsState | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = `spot-sheet-title-${spot.id}`;

  useEffect(() => {
    const controller = new AbortController();
    fetchBuildingSpots(spot.id, controller.signal)
      .then((spots) => setState({ buildingId: spot.id, spots, error: null }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState({ buildingId: spot.id, spots: null, error });
      });
    return () => controller.abort();
  }, [spot.id, reloadKey]);

  // 開いたら閉じるボタンへフォーカスし、閉じたら元の要素 (ピン) へ戻す。
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => previous?.focus?.();
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
      return;
    }
    // Tab でシート外にフォーカスが出ないようにする
    if (e.key === "Tab") {
      const focusables = e.currentTarget.querySelectorAll<HTMLElement>("button:not([tabindex='-1'])");
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  // 別の建物の結果が残っている間は読み込み中として扱う
  const current = state?.buildingId === spot.id ? state : null;

  return (
    <div
      className="fixed inset-0 z-[60] mx-auto flex w-full max-w-[402px] items-end"
      onKeyDown={handleKeyDown}
    >
      {/* オーバーレイ */}
      <button
        type="button"
        tabIndex={-1}
        aria-label="詳細を閉じる"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-[70vh] w-full overflow-y-auto rounded-t-[24px] bg-white px-5 pb-8 shadow-card"
      >
        {/* ドラッグハンドル (押下で閉じる) */}
        <button
          type="button"
          ref={closeRef}
          aria-label="閉じる"
          onClick={onClose}
          className="mx-auto flex h-8 w-full items-center justify-center"
        >
          <span aria-hidden className="h-1.5 w-10 rounded-full bg-hairline" />
        </button>

        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-[20px] text-white">
            {mark}
          </span>
          <div className="min-w-0">
            <h2 id={titleId} className="truncate text-[18px] font-bold text-black">
              {spot.name}
            </h2>
            <p className="text-[12px] text-gray-500">
              <span className="mr-2 rounded-full border border-hairline px-2 py-0.5">
                {spot.category}
              </span>
              ARマーカー {spot.marker_count} 件
            </p>
          </div>
        </div>

        <h3 className="mt-5 text-[13px] font-semibold text-black">建物内のスポット</h3>
        {current === null ? (
          <LoadingState message="スポットを読み込み中..." />
        ) : current.error != null ? (
          <ErrorState
            error={current.error}
            onRetry={() => {
              setState(null);
              setReloadKey((k) => k + 1);
            }}
          />
        ) : current.spots && current.spots.length > 0 ? (
          <ul className="mt-2 flex flex-col gap-2">
            {current.spots.map((s) => (
              <li key={s.id} className="rounded-[15px] border border-hairline px-4 py-2">
                <p className="text-[14px] font-semibold text-black">{s.name}</p>
                {s.description && (
                  <p className="mt-0.5 text-[12px] text-gray-500">{s.description}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState message="登録されているスポットはありません" />
        )}
      </div>
    </div>
  );
}
