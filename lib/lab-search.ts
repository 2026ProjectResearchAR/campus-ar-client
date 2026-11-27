/**
 * 研究室 (教授名・研究分野) 検索用のデータ取得・絞り込み。
 *
 * TODO: campus-ar-api に検索エンドポイントがないため、建物一覧 + 建物ごとのスポット一覧を
 * 取得してクライアント側で絞り込んでいる。API に横断検索 (例: GET /api/v1/spots?q=) が
 * 追加されたらそちらに切り替える。
 * スポット (AR マーカー) = 研究室として扱い、研究室名 (name)・教授名/研究分野 (description)・
 * 建物名を検索対象にする。
 */
import { apiFetch } from "@/lib/api";
import { normalizeSearchText } from "@/lib/search";

type Building = { id: string; name: string; marker_count: number };
type BuildingSpot = { id: string; name: string; description: string | null; marker_id: string };

export type LabEntry = {
  id: string;
  name: string;
  description: string;
  buildingName: string;
};

/** GET /api/v1/buildings と /api/v1/buildings/{id}/spots から全スポットを集める */
export async function fetchLabs(signal?: AbortSignal): Promise<LabEntry[]> {
  const { data: buildings } = await apiFetch<{ data: Building[] }>("/api/v1/buildings", { signal });
  const perBuilding = await Promise.all(
    buildings
      .filter((b) => b.marker_count > 0)
      .map(async (b) => {
        const { data } = await apiFetch<{ data: BuildingSpot[] }>(
          `/api/v1/buildings/${encodeURIComponent(b.id)}/spots`,
          { signal },
        );
        return data.map<LabEntry>((s) => ({
          id: s.id,
          name: s.name,
          description: s.description ?? "",
          buildingName: b.name,
        }));
      }),
  );
  return perBuilding.flat();
}

/** 空白区切りの全キーワードを、研究室名・説明 (教授名/研究分野)・建物名のどこかに含む研究室 (AND) */
export function filterLabs(labs: LabEntry[], query: string): LabEntry[] {
  const terms = query.split(/\s+/).map(normalizeSearchText).filter(Boolean);
  if (terms.length === 0) return [];
  return labs.filter((l) => {
    const haystack = normalizeSearchText(`${l.name} ${l.description} ${l.buildingName}`);
    return terms.every((t) => haystack.includes(t));
  });
}
