import { createPageMetadata } from "@/lib/metadata";

import FavoriteList from "./_components/FavoriteList";

export const metadata = createPageMetadata(
  "お気に入り",
  "ARCloudでお気に入りに登録した研究室・施設を確認できます。",
);

export default function FavoritesPage() {
  return <FavoriteList />;
}
