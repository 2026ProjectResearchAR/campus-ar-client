"use client";

import { useState } from "react";
import Image from "next/image";
import { BsFillBadgeWcFill } from "react-icons/bs";
import { IoBookOutline, IoFlaskOutline } from "react-icons/io5";
import { LuSearch } from "react-icons/lu";

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

/** 現在地マーカー (ui.pen "Group 13") の中心座標 */
const CURRENT_POSITION = { left: "39.9%", top: "52.3%" };

export default function MapPage() {
  {
    /* それぞれの選択肢の状態 */
  }
  const [selectedOption, setSelectedOption] = useState<string | null>("すべて");
  {
    /* マップ画像が未配置のときはプレースホルダーに切り替える */
  }
  const [mapImageAvailable, setMapImageAvailable] = useState(true);

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
      <div className="relative mx-[3px] mt-[17px] min-h-[666px] flex-1 overflow-hidden">
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
        <div
          style={CURRENT_POSITION}
          className="absolute flex size-[30px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-locator bg-white"
        >
          <span className="size-4 rounded-full bg-locator" />
        </div>
      </div>
    </div>
  );
}
