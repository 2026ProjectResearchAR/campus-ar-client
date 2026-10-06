"use client";

import { useState } from "react";
import Image from "next/image";
import { BsFillBadgeWcFill } from "react-icons/bs";
import { IoBookOutline, IoFlaskOutline } from "react-icons/io5";
import { LuSearch } from "react-icons/lu";
import { useGeolocation } from "@/hooks/useGeolocation";
import {
  isInsideMap,
  latLngToMapPercent,
  metersToMapPercentX,
} from "@/lib/geo";

/**
 * マップ画面 (ui.pen frame "Map")
 *
 * デザイン実寸 (frame 402 x 874):
 *   - 検索バー   : x=26 / y=50 / 356 x 41 / radius 20
 *   - チップ     : x=16 / y=108 / 52 x 24 / radius 20 / 間隔 16px
 *   - マップ     : x=3  / y=149 / 396 x 666 / opacity 0.8
 *   - ピン       : 52 x 24 の吹き出し + 14 x 10 の足
 *   - 現在地     : 30px / #0085CD
 */
const spotData = [
  {
    id: 1,
    name: "7号館",
    category: "研究室",
    mark: <IoFlaskOutline />,
    top: "50%",
    left: "40%",
  },
  {
    id: 2,
    name: "図書館",
    category: "自習室",
    mark: <IoBookOutline />,
    top: "70%",
    left: "60%",
  },
  {
    id: 3,
    name: "メインWC",
    category: "トイレ",
    mark: <BsFillBadgeWcFill />,
    top: "20%",
    left: "50%",
  },
];

const categories = ["すべて", "研究室", "自習室", "トイレ", "カフェ", "その他"];

/** マップ画像の縦横比 (object-cover の切り抜き計算用) */
const MAP_ASPECT = { w: 4, h: 3 };

/**
 * 画像上の % 座標を、object-cover で表示されたコンテナ上の位置 (CSS) に変換する。
 * コンテナは container-type: size のため cqw / cqh が使える。
 */
function imagePercentToCss(x: number, y: number) {
  const w = `max(100cqw, ${(100 * MAP_ASPECT.w) / MAP_ASPECT.h}cqh)`;
  const h = `max(${(100 * MAP_ASPECT.h) / MAP_ASPECT.w}cqw, 100cqh)`;
  return {
    left: `calc(50cqw + ${(x - 50) / 100} * ${w})`,
    top: `calc(50cqh + ${(y - 50) / 100} * ${h})`,
    w,
  };
}

const GEO_NOTICE: Record<string, string> = {
  denied: "位置情報の利用が許可されていません。ブラウザの設定を確認してください",
  unavailable: "位置情報を取得できません",
  error: "位置情報の取得に失敗しました",
};

export default function MapPage() {
  {
    /* それぞれの選択肢の状態 */
  }
  const [selectedOption, setSelectedOption] = useState<string | null>("すべて");
  {
    /* マップ画像が未配置のときはプレースホルダーに切り替える */
  }
  const [mapImageAvailable, setMapImageAvailable] = useState(true);

  // 現在地 (Geolocation API)
  const geo = useGeolocation();
  const currentPercent =
    geo.status === "granted" && geo.lat !== null && geo.lng !== null
      ? latLngToMapPercent({ lat: geo.lat, lng: geo.lng })
      : null;
  const outOfCampus = currentPercent !== null && !isInsideMap(currentPercent);
  const currentCss =
    currentPercent && !outOfCampus
      ? imagePercentToCss(currentPercent.x, currentPercent.y)
      : null;
  const geoNotice = outOfCampus
    ? "現在地がキャンパス外のため表示できません"
    : (GEO_NOTICE[geo.status] ?? null);

  // 選択されたカテゴリに応じてピンをフィルタリング
  const filteredSpots = spotData.filter((spot) => {
    if (!selectedOption || selectedOption === "すべて") return true;
    return spot.category === selectedOption;
  });

  const handleOptionClick = (option: string) => {
    if (selectedOption === option) {
      setSelectedOption(null);
    } else {
      setSelectedOption(option);
    }
  };

  return (
    // pt-[50px]: ui.pen のステータスバー領域ぶんの余白 (モック自体は描画しない)
    <div className="flex flex-1 flex-col pt-[50px]">
      {/* 検索バー */}
      <div className="px-[23px]">
        <label className="flex h-[41px] items-center gap-[10px] rounded-[20px] border border-hairline bg-white px-4 shadow-card">
          <LuSearch size={18} strokeWidth={2.13} className="shrink-0 text-ink" />
          <input
            type="search"
            placeholder="研究室・施設を検索"
            className="w-full bg-transparent text-[12px] text-black outline-none placeholder:text-placeholder"
          />
        </label>
      </div>

      {/* フィルターボタンエリア */}
      <div className="mt-[17px] flex gap-4 overflow-x-auto px-4 pb-px [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((option) => {
          const active = selectedOption === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => handleOptionClick(option)}
              className={`h-6 w-[52px] shrink-0 rounded-[20px] border border-hairline text-[10px] shadow-card transition-colors ${
                active
                  ? "bg-brand font-bold text-white"
                  : "bg-white font-normal text-black"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* メインマップエリア */}
      <div className="relative mx-[3px] mt-[17px] min-h-[666px] flex-1 overflow-hidden [container-type:size]">
        {mapImageAvailable ? (
          <Image
            src="/seta_b_l_2026.jpg"
            alt="キャンパスマップ"
            fill
            sizes="402px"
            priority
            className="object-cover opacity-80"
            onError={() => setMapImageAvailable(false)}
          />
        ) : (
          // public/seta_b_l_2026.jpg が未配置のときの代替表示
          <div
            aria-hidden
            className="absolute inset-0 bg-[#efeae4] opacity-80 [background-image:linear-gradient(#e3ded8_1px,transparent_1px),linear-gradient(90deg,#e3ded8_1px,transparent_1px)] [background-size:40px_40px]"
          />
        )}

        {/* 画像の上に重ねるピン */}
        {filteredSpots.map((spot) => (
          <button
            key={spot.id}
            type="button"
            style={{ top: spot.top, left: spot.left }}
            onClick={() => alert(`${spot.name} (${spot.category})`)}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center"
          >
            {/* 吹き出し本体 */}
            <span className="flex h-6 min-w-[52px] items-center gap-2 rounded-[20px] border border-hairline bg-brand px-[10px] shadow-card">
              <span className="shrink-0 text-[16px] leading-none text-white">
                {spot.mark}
              </span>
              <span className="whitespace-nowrap text-[12px] font-semibold text-white">
                {spot.name}
              </span>
            </span>
            {/* 吹き出しの足 (ui.pen "Polygon 1"): 14 x 10 */}
            <span className="size-0 border-x-[7px] border-t-[10px] border-x-transparent border-t-brand" />
          </button>
        ))}

        {/* 現在地 */}
        {currentCss && (
          <>
            {geo.accuracy !== null && (
              <div
                aria-hidden
                style={{
                  left: currentCss.left,
                  top: currentCss.top,
                  width: `calc(${(2 * metersToMapPercentX(geo.accuracy)) / 100} * ${currentCss.w})`,
                  aspectRatio: "1",
                }}
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-locator/15"
              />
            )}
            <div
              style={{ left: currentCss.left, top: currentCss.top }}
              className="absolute flex size-[30px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-locator bg-white"
            >
              <span className="size-4 rounded-full bg-locator" />
            </div>
          </>
        )}

        {/* 現在地が表示できない場合の通知 */}
        {geoNotice && (
          <p
            role="status"
            className="absolute inset-x-3 bottom-3 rounded-[12px] border border-hairline bg-white px-3 py-2 text-center text-[11px] text-black shadow-card"
          >
            {geoNotice}
          </p>
        )}
      </div>
    </div>
  );
}
