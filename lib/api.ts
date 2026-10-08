/**
 * campus-ar-api との通信基盤。
 * 成功時は { data } / 失敗時は { error: { code, message, details? } } の共通形式。
 */

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");

/** API の共通エラー形式 `{ error: { code, message, details? } }` を表す例外 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

type ErrorBody = { error: { code: string; message: string; details?: unknown } };

function isErrorBody(value: unknown): value is ErrorBody {
  if (typeof value !== "object" || value === null) return false;
  const e = (value as { error?: unknown }).error;
  return (
    typeof e === "object" &&
    e !== null &&
    typeof (e as { code?: unknown }).code === "string" &&
    typeof (e as { message?: unknown }).message === "string"
  );
}

export type ApiFetchOptions = Omit<RequestInit, "body"> & {
  /** JSON としてシリアライズして送信するボディ */
  json?: unknown;
};

/**
 * API を呼び出して JSON を返す。失敗時は ApiError を throw する。
 * ネットワーク失敗は code="network_error"(status 0) の ApiError になる。
 */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiError(0, "config_error", "NEXT_PUBLIC_API_BASE_URL が設定されていません");
  }

  const { json, headers, ...init } = options;
  const finalHeaders = new Headers(headers);
  finalHeaders.set("Accept", "application/json");
  if (json !== undefined) finalHeaders.set("Content-Type", "application/json");

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`, {
      ...init,
      headers: finalHeaders,
      body: json === undefined ? undefined : JSON.stringify(json),
    });
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") throw e;
    throw new ApiError(0, "network_error", "サーバーに接続できませんでした");
  }

  let body: unknown;
  try {
    body = res.status === 204 ? undefined : await res.json();
  } catch {
    body = undefined;
  }

  if (!res.ok) {
    if (isErrorBody(body)) {
      const { code, message, details } = body.error;
      throw new ApiError(res.status, code, message, details);
    }
    throw new ApiError(res.status, "unknown_error", `リクエストに失敗しました (${res.status})`);
  }

  return body as T;
}

export type Health = { status: string; timestamp: string };

/** GET /api/health */
export function getHealth(signal?: AbortSignal): Promise<Health> {
  return apiFetch<Health>("/api/health", { signal });
}

/** ARマーカーが設置されている建物 */
export type Building = { id: string; name: string; marker_count: number };

/** GET /api/v1/buildings */
export async function getBuildings(signal?: AbortSignal): Promise<Building[]> {
  const res = await apiFetch<{ data: Building[] }>("/api/v1/buildings", { signal });
  return res.data;
}
