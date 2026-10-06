import { apiFetch } from "@/lib/api";

/**
 * 建物 API (GET /api/v1/buildings) のレスポンス型と、マップ表示用の補助データ。
 * 型は campus-ar-api の src/routes/buildings.ts から手書きしたもの。
 * 生成型 (OpenAPI) に差し替える場合はこのファイルの Building / fetchBuildings のみ置き換える。
 */
export type Building = {
  id: string;
  name: string;
  marker_count: number;
};

/** GET /api/v1/buildings */
export async function fetchBuildings(signal?: AbortSignal): Promise<Building[]> {
  const res = await apiFetch<{ data: Building[] }>("/api/v1/buildings", { signal });
  return res.data;
}

export const MAP_CATEGORIES = ["研究室", "自習室", "トイレ", "カフェ", "その他"] as const;
export type MapCategory = (typeof MAP_CATEGORIES)[number];

/**
 * API の建物にはカテゴリ・地図上の座標が無いため、クライアント側で補う。
 * キーは建物名。未登録の建物は category=その他、座標は {@link fallbackPosition} で自動配置する。
 * top / left はマップ画像に対する割合 (%)。
 */
type BuildingMapMeta = { category: MapCategory; top: number; left: number };

const BUILDING_MAP_META: Record<string, BuildingMapMeta> = {
  "7号館": { category: "研究室", top: 50, left: 40 },
  図書館: { category: "自習室", top: 70, left: 60 },
  メインWC: { category: "トイレ", top: 20, left: 50 },
};

/** 座標未登録の建物を、マップ下部に重ならないよう格子状 (4列) に並べる */
function fallbackPosition(index: number): { top: number; left: number } {
  return {
    left: 15 + (index % 4) * 23,
    top: Math.min(85 + Math.floor(index / 4) * 6, 95),
  };
}

export type MapSpot = Building & {
  category: MapCategory;
  /** CSS の top / left (例: "50%") */
  top: string;
  left: string;
};

/** 建物一覧をマップのピン表示用データに変換する */
export function toMapSpots(buildings: Building[]): MapSpot[] {
  let fallbackIndex = 0;
  return buildings.map((b) => {
    const meta = BUILDING_MAP_META[b.name];
    const pos = meta ?? fallbackPosition(fallbackIndex++);
    return {
      ...b,
      category: meta?.category ?? "その他",
      top: `${pos.top}%`,
      left: `${pos.left}%`,
    };
  });
}
