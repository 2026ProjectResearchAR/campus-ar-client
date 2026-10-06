/**
 * campus-ar-api の OpenAPI スキーマ (lib/api-schema.d.ts, `npm run gen:api-types` で生成) から
 * 画面側で使いやすい型を取り出す。apiFetch<T> の T に渡して使う。
 *
 * @example
 *   const res = await apiFetch<BuildingsResponse>("/api/v1/buildings");
 *   const buildings: Building[] = res.data;
 */
import type { components, paths } from "./api-schema";

/** パス・メソッド・ステータスを指定して成功レスポンスの JSON ボディ型を取り出す */
export type ApiResponse<
  P extends keyof paths,
  M extends keyof paths[P] = "get" extends keyof paths[P] ? "get" : never,
  S extends number = 200,
> = paths[P][M] extends { responses: infer R }
  ? S extends keyof R
    ? R[S] extends { content: { "application/json": infer B } }
      ? B
      : never
    : never
  : never;

/** リクエストボディ (JSON) の型を取り出す */
export type ApiRequestBody<P extends keyof paths, M extends keyof paths[P]> = paths[P][M] extends {
  requestBody?: { content: { "application/json": infer B } };
}
  ? B
  : never;

// --- レスポンス全体 ({ data: ... } 形式) ---
export type BuildingsResponse = ApiResponse<"/api/v1/buildings">;
export type BuildingSpotsResponse = ApiResponse<"/api/v1/buildings/{building_id}/spots">;
export type SpotsResponse = ApiResponse<"/api/v1/spots/{marker_id}">;
export type EventsResponse = ApiResponse<"/api/v1/events">;
export type VisitsResponse = ApiResponse<"/api/v1/users/me/visits">;
export type CreateVisitResponse = ApiResponse<"/api/v1/users/me/visits", "post", 201>;
export type CreateVisitRequest = ApiRequestBody<"/api/v1/users/me/visits", "post">;

// --- 要素型 ---
/** 建物一覧の 1 件 (GET /api/v1/buildings) */
export type Building = BuildingsResponse["data"][number];
/** 建物内スポット一覧の 1 件 (GET /api/v1/buildings/{building_id}/spots) */
export type BuildingSpot = BuildingSpotsResponse["data"][number];
/** マーカー ID から引いたスポット詳細 (GET /api/v1/spots/{marker_id}) */
export type Spot = SpotsResponse["data"][number];
/** AR アセット (Spot.ar_assets の 1 件) */
export type ArAsset = Spot["ar_assets"][number];
/** イベント (GET /api/v1/events) */
export type Event = EventsResponse["data"][number];
/** 訪問履歴 (GET /api/v1/users/me/visits) */
export type Visit = VisitsResponse["data"][number];

/** 共通エラー形式 `{ error: { code, message, details? } }` */
export type ApiErrorBody = components["schemas"]["Error"];
