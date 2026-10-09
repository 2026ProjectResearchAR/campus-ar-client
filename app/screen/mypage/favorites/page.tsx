import type { Metadata } from "next";

import FavoriteList from "./_components/FavoriteList";

export const metadata: Metadata = {
  title: "お気に入り",
  description: "お気に入りに登録した研究室・施設を確認できます。",
};

export default function FavoritesPage() {
  return <FavoriteList />;
}
