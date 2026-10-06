"use client";

import Link from "next/link";
import { LuChevronLeft } from "react-icons/lu";
import SpotListItem from "@/componets/SpotListItem";
import { useFavorites } from "@/lib/favorites";
import { SPOTS } from "@/lib/spots";

/** マイページ > お気に入り */
export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <div className="flex-1 px-[27px] pb-[140px] pt-[66px]">
      <div className="flex items-center gap-2">
        <Link
          href="/screen/mypage"
          aria-label="マイページに戻る"
          className="text-ink"
        >
          <LuChevronLeft size={28} strokeWidth={2.5} />
        </Link>
        <h1 className="text-[24px] font-semibold text-black">お気に入り</h1>
      </div>

      <ul className="mt-6 space-y-4">
        {favorites.map((spot) => (
          <SpotListItem key={spot.id} spot={spot} />
        ))}
      </ul>
      {favorites.length === 0 && (
        <p className="mt-6 rounded-[15px] border border-hairline bg-white p-5 text-center text-[14px] text-ink/60">
          お気に入りのスポットはまだありません。
          <br />
          下の一覧からハートで登録できます。
        </p>
      )}

      <h2 className="mt-10 text-[16px] font-semibold text-black">
        スポット一覧
      </h2>
      <ul className="mt-4 space-y-4">
        {SPOTS.map((spot) => (
          <SpotListItem key={spot.id} spot={spot} />
        ))}
      </ul>
    </div>
  );
}
