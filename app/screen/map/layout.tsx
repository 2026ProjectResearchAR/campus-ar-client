import type { Metadata } from "next";

// map/page.tsx は client component のため、metadata はこの layout から設定する
export const metadata: Metadata = {
  title: "キャンパスマップ",
  description: "瀬田キャンパスのマップから研究室や施設を探せます。",
};

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
