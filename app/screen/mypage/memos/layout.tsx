import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  "メモ",
  "ARCloudでキャンパス見学中に気づいたことや、気になる施設のメモを保存・確認できます。",
);

export default function MemosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
