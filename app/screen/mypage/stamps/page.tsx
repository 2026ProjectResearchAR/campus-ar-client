import { createPageMetadata } from "@/lib/metadata";

import StampCollection from "./_components/StampCollection";

export const metadata = createPageMetadata(
  "スタンプコレクション",
  "ARCloudでキャンパスのARマーカーをスキャンして集めたスタンプと、コレクションの進み具合を確認できます。",
);

export default function StampsPage() {
  return <StampCollection />;
}
