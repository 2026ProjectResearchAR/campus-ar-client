import { createPageMetadata } from "@/lib/metadata";

// map/page.tsx は client component のため、metadata はこの layout から設定する
export const metadata = createPageMetadata(
  "キャンパスマップ",
  "ARCloudのキャンパスマップで、龍谷大学 瀬田キャンパスの研究室や施設の場所を確認できます。",
);

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
