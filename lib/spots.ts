import { apiFetch } from "./api";

/** campus-ar-api の ARアセット。3Dモデルは type="3d_model" で url に R2 の公開URLが入る */
export type ArAsset = { type: string; url: string };

/** GET /api/v1/spots/{marker_id} のスポット */
export type Spot = {
  id: string;
  name: string;
  description: string | null;
  building: { id: string; name: string };
  ar_assets: ArAsset[];
};

/**
 * GET /api/v1/spots/{marker_id}
 * marker_id は一意なので先頭の1件を返す。未登録なら null。
 */
export async function getSpotByMarkerId(markerId: string, signal?: AbortSignal): Promise<Spot | null> {
  const res = await apiFetch<{ data: Spot[] }>(`/api/v1/spots/${encodeURIComponent(markerId)}`, {
    signal,
  });
  return res.data[0] ?? null;
}

/** スポットの 3D モデル (.glb) のURL。なければ null */
export function findModelUrl(spot: Spot): string | null {
  return spot.ar_assets.find((a) => a.type === "3d_model")?.url ?? null;
}

/** お気に入り・メモで参照するスポットの基本情報 (マップのピンと id を揃える) */
export type SpotInfo = {
  id: number;
  name: string;
  category: string;
};

export const SPOTS: readonly SpotInfo[] = [
  { id: 1, name: "7号館", category: "研究室" },
  { id: 2, name: "図書館", category: "自習室" },
  { id: 3, name: "メインWC", category: "トイレ" },
  { id: 4, name: "1号館", category: "その他" },
  { id: 5, name: "2号館", category: "その他" },
  { id: 6, name: "3号館", category: "その他" },
  { id: 7, name: "4号館", category: "その他" },
  { id: 8, name: "5号館", category: "その他" },
  { id: 9, name: "6号館", category: "その他" },
  { id: 10, name: "8号館", category: "その他" },
  { id: 11, name: "9号館", category: "その他" },
  { id: 12, name: "瑞光館", category: "その他" },
  { id: 13, name: "HRC棟", category: "その他" },
  { id: 14, name: "実験棟", category: "研究室" },
  { id: 15, name: "第2実験棟", category: "研究室" },
  { id: 16, name: "RECホール", category: "その他" },
  { id: 17, name: "智光館", category: "その他" },
  { id: 18, name: "樹心館", category: "その他" },
  { id: 19, name: "体育館", category: "その他" },
  { id: 20, name: "SETA DOME", category: "その他" },
  { id: 21, name: "青志館", category: "カフェ" },
  { id: 22, name: "青雲館", category: "カフェ" },
  { id: 23, name: "学生交流会館", category: "その他" },
  { id: 24, name: "青朋館", category: "その他" },
];
