import FavoriteButton from "./FavoriteButton";
import type { SpotInfo } from "@/lib/spots";

/** スポット1件ぶんの行 (名前・カテゴリ + お気に入りトグル) */
export default function SpotListItem({ spot }: { spot: SpotInfo }) {
  return (
    <li className="flex h-[50px] items-center rounded-[15px] border border-hairline bg-white pl-5 pr-3 shadow-card">
      <span className="text-[16px] font-semibold text-black">{spot.name}</span>
      <span className="ml-3 text-[12px] text-ink/60">{spot.category}</span>
      <span className="ml-auto">
        <FavoriteButton spot={spot} />
      </span>
    </li>
  );
}
