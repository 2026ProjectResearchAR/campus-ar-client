/**
 * QRコードのURLまたはテキストから marker_id を抽出するユーティリティ。
 *
 * 想定される入力形式:
 * - https://campus-ar-api.chikai400up.workers.dev/api/v1/spots/@marker_fuzimotolab
 * - https://example.com/spots/@marker_miyoshilab
 * - @marker_fuzimotolab
 * - marker_fuzimotolab (直接マーカーIDが渡された場合)
 */
export function extractMarkerIdFromUrl(input: string): string | null {
  if (!input || typeof input !== "string") return null;
  const trimmed = input.trim();

  // 1. "@" から始まるマーカーIDを抽出 (例: .../@marker_fuzimotolab)
  const atMatch = trimmed.match(/@([a-zA-Z0-9_-]+)/);
  if (atMatch && atMatch[1]) {
    return atMatch[1];
  }

  // 2. "marker_" から始まるマーカーIDを直接抽出
  const markerMatch = trimmed.match(/\b(marker_[a-zA-Z0-9_-]+)\b/);
  if (markerMatch && markerMatch[1]) {
    return markerMatch[1];
  }

  // 3. パス末尾がマーカーIDになっている形式 (.../spots/marker_fuzimotolab)
  const segments = trimmed.replace(/\/+$/, "").split("/");
  const last = segments[segments.length - 1];
  if (last && /^[a-zA-Z0-9_-]+$/.test(last) && !last.startsWith("http")) {
    return last;
  }

  return null;
}
