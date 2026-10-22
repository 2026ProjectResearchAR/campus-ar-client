import { createPageMetadata } from "@/lib/metadata";

import ArScanView from "./_components/ArScanView";

export const metadata = createPageMetadata(
  "ARスキャン",
  "ARCloudのARスキャナーです。施設のARマーカーを読み取り、施設情報や3Dモデルを表示します。",
);

export default function ScanPage() {
  return <ArScanView />;
}
