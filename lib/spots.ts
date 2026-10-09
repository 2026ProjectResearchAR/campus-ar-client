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
