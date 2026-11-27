/**
 * 検索用の正規化。
 * - NFKC で全角英数・半角カナ等の幅を統一
 * - 英字を小文字化
 * - カタカナをひらがなに統一
 * - 空白を除去
 */
export function normalizeSearchText(text: string): string {
  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))
    .replace(/\s+/g, "");
}

/** name が query を (正規化したうえで) 部分一致として含むか。空クエリは常に true */
export function matchesQuery(name: string, query: string): boolean {
  const q = normalizeSearchText(query);
  return q === "" || normalizeSearchText(name).includes(q);
}
