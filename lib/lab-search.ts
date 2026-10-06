/**
 * ホームの研究室検索用データ取得・絞り込み。
 *
 * API に検索エンドポイントがないため、建物一覧 + 建物ごとのスポット一覧を取得し
 * クライアント側で絞り込む。スポット(ARマーカー)=研究室として扱い、
 * 研究室名(name)・教授名/研究分野(description)・建物名を検索対象にする。
 * 型は OpenAPI 生成型に依存せずここでローカル定義する。
 */
import { apiFetch } from "@/lib/api";

type Building = { id: string; name: string; marker_count: number };
type BuildingSpot = { id: string; name: string; description: string | null; marker_id: string };

export type LabEntry = {
  id: string;
  markerId: string;
  name: string;
  description: string;
  buildingId: string;
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
          markerId: s.marker_id,
          name: s.name,
          description: s.description ?? "",
          buildingId: b.id,
          buildingName: b.name,
        }));
      }),
  );
  return perBuilding.flat();
}

/** 大文字小文字・全角半角(NFKC)・カタカナ/ひらがなの差を吸収する */
export function normalize(text: string): string {
  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
}

/** 空白区切りの全キーワードを含む(AND)研究室だけを返す */
export function filterLabs(labs: LabEntry[], query: string): LabEntry[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  return labs.filter((l) => {
    const haystack = normalize(`${l.name} ${l.description} ${l.buildingName}`);
    return terms.every((t) => haystack.includes(t));
  });
}
