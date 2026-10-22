"use client";

import { apiFetch, ApiError } from "./api";
import { getSpotByMarkerId } from "./spots";
import { type CollectedStamps, mergeCollectedStamps, STAMP_SPOTS } from "./stamps";
import { readLocalStorage, writeLocalStorage } from "./useLocalStorage";

/**
 * スタンプラリーの訪問記録 (visits API) との連携。
 *
 * - スタンプ獲得時に POST /api/v1/users/me/visits で訪問を記録する
 * - スタンプコレクション画面で GET /api/v1/users/me/visits から獲得状況を取得し、
 *   この端末の記録 (localStorage) へマージする
 *
 * visits API は spot_id (UUID) で記録するが、AR 側が扱うのは markerId なので、
 * GET /api/v1/spots/{marker_id} で解決した markerId -> spot_id を端末にキャッシュする。
 * 送信できなかった訪問は「未送信」として端末に残し、次の同期時に再送する。
 */

/** GET/POST /api/v1/users/me/visits の訪問記録 */
export type Visit = { id: string; spot_id: string; visited_at: string };

/** POST /api/v1/users/me/visits */
export async function createVisit(spotId: string, signal?: AbortSignal): Promise<Visit> {
  const res = await apiFetch<{ data: Visit }>("/api/v1/users/me/visits", {
    method: "POST",
    json: { spot_id: spotId },
    signal,
  });
  return res.data;
}

/** GET /api/v1/users/me/visits */
export async function listVisits(signal?: AbortSignal): Promise<Visit[]> {
  const res = await apiFetch<{ data: Visit[] }>("/api/v1/users/me/visits", { signal });
  return Array.isArray(res?.data) ? res.data : [];
}

/* ---------------------------------------------------------------
 * 端末内のキャッシュ
 * --------------------------------------------------------------- */

/** markerId -> spot_id */
type SpotIdCache = Record<string, string>;
const SPOT_IDS_KEY = "stamps:spot-ids:v1";
const EMPTY_SPOT_IDS: SpotIdCache = {};

/** まだサーバーへ送れていない訪問の markerId */
const PENDING_KEY = "stamps:pending-visits:v1";
const EMPTY_PENDING: string[] = [];

/** markerId に対応する spot_id。未登録のマーカーなら null */
async function resolveSpotId(markerId: string): Promise<string | null> {
  const cached = readLocalStorage(SPOT_IDS_KEY, EMPTY_SPOT_IDS)[markerId];
  if (cached) return cached;
  const spot = await getSpotByMarkerId(markerId);
  if (!spot) return null;
  writeLocalStorage<SpotIdCache>(SPOT_IDS_KEY, EMPTY_SPOT_IDS, (prev) => ({
    ...prev,
    [markerId]: spot.id,
  }));
  return spot.id;
}

/** 通信できない・サーバー側の一時的な失敗なら再送する価値がある */
function isRetryable(error: unknown): boolean {
  if (!(error instanceof ApiError)) return true;
  return error.status === 0 || error.status >= 500 || error.status === 429;
}

function removePending(markerId: string) {
  writeLocalStorage<string[]>(PENDING_KEY, EMPTY_PENDING, (prev) =>
    prev.filter((id) => id !== markerId),
  );
}

/* ---------------------------------------------------------------
 * 送信・同期
 * --------------------------------------------------------------- */

let flushing: Promise<void> | null = null;

/** 未送信の訪問をまとめて送る。同時に呼ばれても 1 回分の送信にまとめる */
export function flushPendingVisits(): Promise<void> {
  flushing ??= (async () => {
    try {
      for (const markerId of readLocalStorage(PENDING_KEY, EMPTY_PENDING)) {
        try {
          const spotId = await resolveSpotId(markerId);
          // spots API に未登録のマーカーは記録しようがないので破棄する
          if (spotId) await createVisit(spotId);
          removePending(markerId);
        } catch (e) {
          if (!isRetryable(e)) {
            removePending(markerId);
            continue;
          }
          // 接続できないなら残りも失敗するので次回に回す
          break;
        }
      }
    } finally {
      flushing = null;
    }
  })();
  return flushing;
}

/**
 * スタンプ獲得時に訪問をサーバーへ記録する。失敗しても例外は投げず、
 * 未送信として端末に残して次回の同期で再送する。
 */
export async function recordVisit(markerId: string): Promise<void> {
  writeLocalStorage<string[]>(PENDING_KEY, EMPTY_PENDING, (prev) =>
    prev.includes(markerId) ? prev : [...prev, markerId],
  );
  // 送信中なら終わるのを待ってから、今回の分を含めて送り直す
  if (flushing) await flushing;
  await flushPendingVisits();
}

export type SyncResult = "synced" | "offline";

/**
 * サーバーの訪問記録を取得してこの端末の獲得状況へマージする。
 * 未送信の訪問があれば先に送る。API に接続できなければ "offline"。
 */
export async function syncStampsFromServer(signal?: AbortSignal): Promise<SyncResult> {
  try {
    await flushPendingVisits();
    const visits = await listVisits(signal);

    // 別の端末で獲得したスタンプも対応付けられるよう、未解決の spot_id を引いておく
    const spotIds = readLocalStorage(SPOT_IDS_KEY, EMPTY_SPOT_IDS);
    await Promise.all(
      STAMP_SPOTS.filter((s) => !spotIds[s.markerId]).map((s) =>
        resolveSpotId(s.markerId).catch(() => null),
      ),
    );

    const markerBySpotId = new Map(
      Object.entries(readLocalStorage(SPOT_IDS_KEY, EMPTY_SPOT_IDS)).map(([m, s]) => [s, m]),
    );
    const remote: CollectedStamps = {};
    for (const v of visits) {
      const markerId = markerBySpotId.get(v.spot_id);
      if (!markerId) continue;
      // 同じスポットへの訪問が複数あれば最初の訪問を獲得日時とする
      if (!remote[markerId] || Date.parse(v.visited_at) < Date.parse(remote[markerId])) {
        remote[markerId] = v.visited_at;
      }
    }
    mergeCollectedStamps(remote);
    return "synced";
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") throw e;
    return "offline";
  }
}
