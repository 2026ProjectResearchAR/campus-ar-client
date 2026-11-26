import type { Metadata } from "next";

import StampCollection from "./_components/StampCollection";

export const metadata: Metadata = {
  title: "スタンプコレクション",
  description: "ARマーカーをスキャンして集めたスタンプを確認できます。",
};

export default function StampsPage() {
  return <StampCollection />;
}
