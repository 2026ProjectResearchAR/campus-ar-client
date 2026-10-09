"use client";

import { useState } from "react";
import Image from "next/image";
import { BsFillBadgeWcFill } from "react-icons/bs";
import {
  IoBasketballOutline,
  IoBookOutline,
  IoBusinessOutline,
  IoFlaskOutline,
  IoPeopleOutline,
  IoRestaurantOutline,
} from "react-icons/io5";
import { LuLocateFixed, LuMinus, LuPlus, LuSearch } from "react-icons/lu";
import { useGeolocation } from "@/hooks/useGeolocation";
import { usePanZoom } from "@/hooks/usePanZoom";
import {
  isInsideMap,
  latLngToMapPercent,
  metersToMapPercentX,
} from "@/lib/geo";

/**
 * マップ画面 (ui.pen frame "Map")
 *
 * レイアウト (ui.pen の構成をベースに、余白とサイズを 4px グリッドで調整):
 *   - 検索バー   : 左右 16px / 高さ 44px / 完全な角丸
 *   - チップ     : 高さ 32px / 幅は文字に合わせる / 間隔 8px
 *   - マップ     : 残りの高さいっぱい (タブバーの下まで敷く)。ドラッグで移動・ピンチで拡大
 *   - ピン       : 高さ 28px の吹き出し + 12 x 8 の足。拡大しても大きさは変えない
 *   - 現在地     : 24px / #0085CD
 */

/** x / y はマップ画像上の % 座標 (左上 0,0 / 右下 100,100)。ピンの足の先端がこの点を指す */
const spotData = [
  {
    id: 1,
    name: "7号館",
    category: "研究室",
    mark: <IoFlaskOutline />,
    x: 47,
    y: 20,
  },
  {
    id: 2,
    name: "図書館",
    category: "自習室",
    mark: <IoBookOutline />,
    x: 58,
    y: 73,
  },
  {
    // TODO: 仮の位置。実際のトイレの位置に合わせる
    id: 3,
    name: "メインWC",
    category: "トイレ",
    mark: <BsFillBadgeWcFill />,
    x: 64,
    y: 53,
  },
  // 以下はマップ画像 (public/seta_b_l_2026.jpg) 上の建物の位置を目視で読み取った値
  {
    id: 4,
    name: "1号館",
    category: "その他",
    mark: <IoBusinessOutline />,
    x: 64.5,
    y: 48,
  },
  {
    id: 5,
    name: "2号館",
    category: "その他",
    mark: <IoBusinessOutline />,
    x: 54,
    y: 63,
  },
  {
    id: 6,
    name: "3号館",
    category: "その他",
    mark: <IoBusinessOutline />,
    x: 75,
    y: 60,
  },
  {
    id: 7,
    name: "4号館",
    category: "その他",
    mark: <IoBusinessOutline />,
    x: 85,
    y: 50,
  },
  {
    id: 8,
    name: "5号館",
    category: "その他",
    mark: <IoBusinessOutline />,
    x: 39.5,
    y: 31,
  },
  {
    id: 9,
    name: "6号館",
    category: "その他",
    mark: <IoBusinessOutline />,
    x: 46.5,
    y: 60,
  },
  {
    id: 10,
    name: "8号館",
    category: "その他",
    mark: <IoBusinessOutline />,
    x: 38,
    y: 70,
  },
  {
    id: 11,
    name: "9号館",
    category: "その他",
    mark: <IoBusinessOutline />,
    x: 34,
    y: 21,
  },
  {
    id: 12,
    name: "瑞光館",
    category: "その他",
    mark: <IoBusinessOutline />,
    x: 53,
    y: 25,
  },
  {
    id: 13,
    name: "HRC棟",
    category: "その他",
    mark: <IoBusinessOutline />,
    x: 46,
    y: 35,
  },
  {
    id: 14,
    name: "実験棟",
    category: "研究室",
    mark: <IoFlaskOutline />,
    x: 74,
    y: 45.5,
  },
  {
    id: 15,
    name: "第2実験棟",
    category: "研究室",
    mark: <IoFlaskOutline />,
    x: 80.5,
    y: 45,
  },
  {
    id: 16,
    name: "RECホール",
    category: "その他",
    mark: <IoBusinessOutline />,
    x: 84.5,
    y: 66,
  },
  {
    id: 17,
    name: "智光館",
    category: "その他",
    mark: <IoBusinessOutline />,
    x: 58.5,
    y: 82,
  },
  {
    id: 18,
    name: "樹心館",
    category: "その他",
    mark: <IoBusinessOutline />,
    x: 54,
    y: 44.5,
  },
  {
    id: 19,
    name: "体育館",
    category: "その他",
    mark: <IoBasketballOutline />,
    x: 45,
    y: 44.5,
  },
  {
    id: 20,
    name: "SETA DOME",
    category: "その他",
    mark: <IoBasketballOutline />,
    x: 31,
    y: 36,
  },
  {
    id: 21,
    name: "青志館",
    category: "カフェ",
    mark: <IoRestaurantOutline />,
    x: 34,
    y: 46,
  },
  {
    id: 22,
    name: "青雲館",
    category: "カフェ",
    mark: <IoRestaurantOutline />,
    x: 32.5,
    y: 56,
  },
  {
    id: 23,
    name: "学生交流会館",
    category: "その他",
    mark: <IoPeopleOutline />,
    x: 39.5,
    y: 58.5,
  },
  {
    id: 24,
    name: "青朋館",
    category: "その他",
    mark: <IoBusinessOutline />,
    x: 14,
    y: 59.5,
  },
];

const categories = ["すべて", "研究室", "自習室", "トイレ", "カフェ", "その他"];

/** マップ画像 (public/seta_b_l_2026.jpg) の実寸 */
const MAP_SIZE = { w: 1200, h: 900 };

const GEO_NOTICE: Record<string, string> = {
  denied: "位置情報がオフのため、現在地を表示できません",
  unavailable: "現在地を取得できません",
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
  const current = currentPercent && !outOfCampus ? currentPercent : null;
  const geoNotice = outOfCampus
    ? "現在地がキャンパス外のため表示できません"
    : (GEO_NOTICE[geo.status] ?? null);

  // 選択されたカテゴリに応じてピンをフィルタリング
  const filteredSpots = spotData.filter((spot) => {
    if (!selectedOption || selectedOption === "すべて") return true;
    return spot.category === selectedOption;
  });

  // マップの移動・拡大
  const { containerRef, view, canZoomIn, canZoomOut, zoomBy, centerOn, handlers } =
    usePanZoom(MAP_SIZE);

  /** 画像上の % 座標 -> マップ領域内の表示位置 (px) */
  const toScreen = (x: number, y: number) =>
    view
      ? {
          left: view.x + (x / 100) * MAP_SIZE.w * view.scale,
          top: view.y + (y / 100) * MAP_SIZE.h * view.scale,
        }
      : null;

  const handleOptionClick = (option: string) => {
    if (selectedOption === option) {
      setSelectedOption(null);
    } else {
      setSelectedOption(option);
    }
  };

  return (
    <div className="flex flex-1 flex-col pt-3">
      {/* 検索バー */}
      <div className="px-4">
        <label className="flex h-11 items-center gap-2.5 rounded-full border border-hairline bg-surface px-4 shadow-card focus-within:border-brand/40">
          <LuSearch size={18} strokeWidth={2.2} className="shrink-0 text-muted" />
          {/* 16px 未満だと iOS Safari がフォーカス時にズームするため text-base */}
          <input
            type="search"
            placeholder="研究室・施設を検索"
            className="w-full bg-transparent text-base text-ink outline-none placeholder:text-[14px] placeholder:text-placeholder"
          />
        </label>
      </div>

      {/* フィルターボタンエリア */}
      <div className="mt-3 flex gap-2 overflow-x-auto px-4 pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((option) => {
          const active = selectedOption === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => handleOptionClick(option)}
              aria-pressed={active}
              className={`h-8 shrink-0 rounded-full border px-3.5 text-[13px] transition-colors ${
                active
                  ? "border-brand bg-brand font-bold text-white"
                  : "border-hairline bg-surface font-medium text-ink active:bg-canvas"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* メインマップエリア */}
      {/* touch-action: none でページ全体の拡大・スクロールと競合させない */}
      <div
        ref={containerRef}
        {...handlers}
        className="relative mt-3 min-h-0 flex-1 touch-none select-none overflow-hidden border-t border-hairline bg-[#e9efe4]"
      >
        {/* 画像は実寸のまま置き、transform で移動・拡大する */}
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: MAP_SIZE.w,
            height: MAP_SIZE.h,
            transform: view
              ? `translate(${view.x}px, ${view.y}px) scale(${view.scale})`
              : undefined,
            visibility: view ? "visible" : "hidden",
          }}
        >
          {mapImageAvailable ? (
            <Image
              src="/seta_b_l_2026.jpg"
              alt="キャンパスマップ"
              fill
              sizes="1200px"
              priority
              draggable={false}
              className="opacity-90"
              onError={() => setMapImageAvailable(false)}
            />
          ) : (
            // public/seta_b_l_2026.jpg が未配置のときの代替表示
            <div
              aria-hidden
              className="absolute inset-0 bg-[#efeae4] opacity-90 [background-image:linear-gradient(#e3ded8_1px,transparent_1px),linear-gradient(90deg,#e3ded8_1px,transparent_1px)] [background-size:40px_40px]"
            />
          )}
        </div>

        {/* 画像の上に重ねるピン */}
        {filteredSpots.map((spot) => (
          <button
            key={spot.id}
            type="button"
            style={toScreen(spot.x, spot.y) ?? { visibility: "hidden" }}
            onClick={() => alert(`${spot.name} (${spot.category})`)}
            // 足の先端が座標を指すよう、ピン全体の下端を基準に配置する
            className="absolute flex -translate-x-1/2 -translate-y-full cursor-pointer flex-col items-center drop-shadow-[0_2px_4px_rgb(31_35_40/0.25)] transition-transform active:scale-95"
          >
            {/* 吹き出し本体 */}
            <span className="flex h-7 items-center gap-1.5 rounded-full border-[1.5px] border-white bg-brand pl-2 pr-2.5">
              <span className="shrink-0 text-[14px] leading-none text-white">
                {spot.mark}
              </span>
              <span className="whitespace-nowrap text-[12px] font-bold text-white">
                {spot.name}
              </span>
            </span>
            {/* 吹き出しの足 (ui.pen "Polygon 1"): 12 x 8 */}
            <span className="-mt-px size-0 border-x-[6px] border-t-[8px] border-x-transparent border-t-brand" />
          </button>
        ))}

        {/* 現在地 */}
        {current && view && (
          <>
            {geo.accuracy !== null && (
              <div
                aria-hidden
                style={{
                  ...toScreen(current.x, current.y),
                  width:
                    ((2 * metersToMapPercentX(geo.accuracy)) / 100) *
                    MAP_SIZE.w *
                    view.scale,
                  aspectRatio: "1",
                }}
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-locator/15"
              />
            )}
            <div
              style={toScreen(current.x, current.y) ?? undefined}
              className="pointer-events-none absolute size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-locator shadow-[0_0_0_1px_rgb(0_133_205/0.3),0_2px_6px_rgb(0_0_0/0.25)]"
            />
          </>
        )}

        {/* 拡大・縮小・現在地ボタン (タップ領域 44px) */}
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <div className="flex flex-col overflow-hidden rounded-xl border border-hairline bg-surface/95 shadow-card backdrop-blur">
            <button
              type="button"
              aria-label="拡大"
              disabled={!canZoomIn}
              onClick={() => zoomBy(1.5)}
              className="flex size-11 items-center justify-center text-ink active:bg-canvas disabled:text-placeholder"
            >
              <LuPlus size={20} strokeWidth={2.2} />
            </button>
            <span aria-hidden className="mx-2 h-px bg-hairline" />
            <button
              type="button"
              aria-label="縮小"
              disabled={!canZoomOut}
              onClick={() => zoomBy(1 / 1.5)}
              className="flex size-11 items-center justify-center text-ink active:bg-canvas disabled:text-placeholder"
            >
              <LuMinus size={20} strokeWidth={2.2} />
            </button>
          </div>
          {current && (
            <button
              type="button"
              aria-label="現在地を表示"
              onClick={() =>
                centerOn(
                  (current.x / 100) * MAP_SIZE.w,
                  (current.y / 100) * MAP_SIZE.h,
                )
              }
              className="flex size-11 items-center justify-center rounded-xl border border-hairline bg-surface/95 text-locator shadow-card backdrop-blur active:bg-canvas"
            >
              <LuLocateFixed size={20} strokeWidth={2.2} />
            </button>
          )}
        </div>

        {/* 現在地が表示できない場合の通知 */}
        {geoNotice && (
          <p
            role="status"
            // 下はタブバー、右は拡大ボタンがあるので、左上に小さく出す
            className="pointer-events-none absolute left-3 right-[68px] top-3 rounded-xl border border-hairline bg-surface/95 px-3 py-2 text-[12px] leading-snug text-muted shadow-card backdrop-blur"
          >
            {geoNotice}
          </p>
        )}
      </div>
    </div>
  );
}
