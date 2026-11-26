import type { Metadata } from "next";

import ArScanView from "./_components/ArScanView";

export const metadata: Metadata = {
  title: "ARスキャン",
  description: "カメラでARマーカーを読み取り、研究室や施設の情報を表示します。",
};

export default function ScanPage() {
  return <ArScanView />;
}
