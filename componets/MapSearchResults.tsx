import type { ReactNode } from "react";
import { LuFlaskConical } from "react-icons/lu";
import type { LabSearchState } from "@/hooks/useLabSearch";
import ErrorState from "@/componets/ErrorState";
import LoadingState from "@/componets/LoadingState";

export type SearchSpot = { id: number; name: string; category: string; mark: ReactNode };

type MapSearchResultsProps = {
  query: string;
  /** 名前が一致した建物・施設 */
  spots: SearchSpot[];
  /** 研究室 (教授名・研究分野) の検索状態 */
  labs: LabSearchState;
  /** 建物名から、マップ上のピンを探す (位置が未登録なら null) */
  findSpot: (buildingName: string) => SearchSpot | null;
  onSelect: (spot: SearchSpot) => void;
};

/** マップの検索バー直下に出す結果リスト (研究室 + 建物・施設) */
export default function MapSearchResults({
  query,
  spots,
  labs,
  findSpot,
  onSelect,
}: MapSearchResultsProps) {
  const labResults = labs.status === "ready" ? labs.results : [];
  const empty = labs.status === "ready" && labResults.length === 0 && spots.length === 0;

  return (
    // mousedown でフォーカスを奪わない: iOS Safari ではボタンにフォーカスが移らず、
    // 入力欄の blur でリストが閉じてタップが効かなくなるため
    <div
      onMouseDown={(e) => e.preventDefault()}
      className="absolute inset-x-0 top-[calc(100%+6px)] z-20 max-h-[min(360px,55dvh)] overflow-y-auto rounded-2xl border border-hairline bg-surface py-1 shadow-card">
      {spots.length > 0 && (
        <section aria-label="建物・施設">
          <p className="px-4 pb-1 pt-2 text-[11px] font-bold text-muted">建物・施設</p>
          <ul>
            {spots.map((spot) => (
              <li key={spot.id}>
                <button
                  type="button"
                  onClick={() => onSelect(spot)}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[14px] text-ink active:bg-canvas"
                >
                  <span className="text-[16px] text-brand">{spot.mark}</span>
                  <span className="font-semibold">{spot.name}</span>
                  <span className="ml-auto text-[11px] text-muted">{spot.category}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-label="研究室">
        {labResults.length > 0 && (
          <p className="px-4 pb-1 pt-2 text-[11px] font-bold text-muted">研究室</p>
        )}
        {labs.status === "loading" && <LoadingState message="研究室を検索中..." />}
        {labs.status === "error" && (
          <div className="p-2">
            <ErrorState error={labs.error} onRetry={labs.retry} />
          </div>
        )}
        <ul>
          {labResults.map((lab) => {
            const spot = findSpot(lab.buildingName);
            return (
              <li key={lab.id}>
                <button
                  type="button"
                  disabled={!spot}
                  onClick={() => spot && onSelect(spot)}
                  className="flex w-full items-start gap-2 px-4 py-2.5 text-left active:bg-canvas disabled:active:bg-transparent"
                >
                  <LuFlaskConical size={16} className="mt-0.5 shrink-0 text-brand" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-semibold text-ink">{lab.name}</span>
                    <span className="block text-[11px] text-brand">
                      {lab.buildingName}
                      {!spot && <span className="text-muted">（マップ上の位置は未登録）</span>}
                    </span>
                    {lab.description && (
                      <span className="mt-0.5 block text-[12px] leading-relaxed text-muted">
                        {lab.description}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {empty && (
        <p role="status" className="px-4 py-3 text-[13px] text-muted">
          「{query.trim()}」に一致する研究室・施設は見つかりませんでした
        </p>
      )}
    </div>
  );
}
