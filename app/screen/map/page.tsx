"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { BsFillBadgeWcFill } from "react-icons/bs";
import {
  IoBookOutline,
  IoCafeOutline,
  IoFlaskOutline,
  IoLocationOutline,
} from "react-icons/io5";
import { LuSearch } from "react-icons/lu";
import EmptyState from "@/componets/EmptyState";
import ErrorState from "@/componets/ErrorState";
import LoadingState from "@/componets/LoadingState";
import SpotDetailSheet from "@/componets/SpotDetailSheet";
import {
  fetchBuildings,
  MAP_CATEGORIES,
  toMapSpots,
  type MapCategory,
  type MapSpot,
} from "@/lib/buildings";
import { matchesQuery } from "@/lib/search";

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
/** カテゴリごとのピンアイコン */
const CATEGORY_MARKS: Record<MapCategory, ReactNode> = {
  研究室: <IoFlaskOutline />,
  自習室: <IoBookOutline />,
  トイレ: <BsFillBadgeWcFill />,
  カフェ: <IoCafeOutline />,
  その他: <IoLocationOutline />,
};

const categories = ["すべて", ...MAP_CATEGORIES];

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

  // buildings API から取得したピン
  const [spots, setSpots] = useState<MapSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [reloadKey, setReloadKey] = useState(0);
  // 詳細シートに表示中の建物
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchBuildings(controller.signal)
      .then((buildings) => {
        setSpots(toMapSpots(buildings));
        setError(null);
      })
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setError(e);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [reloadKey]);

  const retry = useCallback(() => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  }, []);

  // 検索キーワード (名前の部分一致。かな・全半角・大小文字を緩く正規化)
  const [query, setQuery] = useState("");
  const [resultsOpen, setResultsOpen] = useState(false);
  const pinRefs = useRef(new Map<string, HTMLButtonElement>());
  const searching = query.trim() !== "";

  // 選択されたカテゴリと検索キーワードに応じてピンをフィルタリング
  const filteredSpots = spots.filter((spot) => {
    if (!matchesQuery(spot.name, query)) return false;
    if (!selectedOption || selectedOption === "すべて") return true;
    return spot.category === selectedOption;
  });

  // 検索結果を選ぶ: 該当ピンへスクロール・フォーカスして詳細シートを開く
  const selectResult = (spot: MapSpot) => {
    setQuery(spot.name);
    setResultsOpen(false);
    const pin = pinRefs.current.get(spot.id);
    pin?.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
    pin?.focus({ preventScroll: true });
    setSelectedSpotId(spot.id);
  };

  const selectedSpot = spots.find((spot) => spot.id === selectedSpotId) ?? null;

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
        <div
          className="relative"
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setResultsOpen(false);
          }}
        >
          <label className="flex h-[41px] items-center gap-[10px] rounded-[20px] border border-hairline bg-white px-4 shadow-card">
            <LuSearch size={18} strokeWidth={2.13} className="shrink-0 text-ink" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setResultsOpen(true);
              }}
              onFocus={() => setResultsOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setResultsOpen(false);
                if (e.key === "Enter" && filteredSpots.length > 0) {
                  selectResult(filteredSpots[0]);
                }
              }}
              aria-label="研究室・施設を検索"
              placeholder="研究室・施設を検索"
              className="w-full bg-transparent text-[12px] text-black outline-none placeholder:text-placeholder"
            />
          </label>

          {/* 検索結果 */}
          {searching && resultsOpen && !loading && error == null && (
            <ul
              id="map-search-results"
              className="absolute inset-x-0 top-[45px] z-20 max-h-[220px] overflow-y-auto rounded-[15px] border border-hairline bg-white py-1 shadow-card"
            >
              {filteredSpots.length === 0 ? (
                <li role="status" className="px-4 py-3 text-[12px] text-gray-500">
                  「{query.trim()}」に一致する施設は見つかりませんでした
                </li>
              ) : (
                filteredSpots.map((spot) => (
                  <li key={spot.id}>
                    <button
                      type="button"
                      onClick={() => selectResult(spot)}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-[13px] text-black hover:bg-brand/10 focus-visible:bg-brand/10"
                    >
                      <span className="text-[16px] text-brand">{CATEGORY_MARKS[spot.category]}</span>
                      <span className="font-semibold">{spot.name}</span>
                      <span className="ml-auto text-[11px] text-gray-500">{spot.category}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
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

        {/* 取得状態の表示 */}
        {(loading || error != null || filteredSpots.length === 0) && (
          <div className="absolute inset-x-4 top-4 z-10 rounded-[15px] bg-white/90 shadow-card">
            {loading ? (
              <LoadingState message="建物を読み込み中..." />
            ) : error != null ? (
              <ErrorState error={error} onRetry={retry} />
            ) : (
              <EmptyState
                message={
                  spots.length === 0
                    ? "表示できる建物がありません"
                    : searching
                      ? "条件に一致する建物はありません"
                      : "このカテゴリの建物はありません"
                }
              />
            )}
          </div>
        )}

        {/* 画像の上に重ねるピン */}
        {filteredSpots.map((spot) => (
          <button
            key={spot.id}
            type="button"
            ref={(el) => {
              if (el) pinRefs.current.set(spot.id, el);
              else pinRefs.current.delete(spot.id);
            }}
            style={{ top: spot.top, left: spot.left }}
            aria-haspopup="dialog"
            onClick={() => setSelectedSpotId(spot.id)}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center"
          >
            {/* 吹き出し本体 */}
            <span
              className={`flex h-6 min-w-[52px] items-center gap-2 rounded-[20px] border border-hairline bg-brand px-[10px] shadow-card ${
                searching ? "ring-2 ring-locator ring-offset-1 motion-safe:animate-pulse" : ""
              }`}
            >
              <span className="shrink-0 text-[16px] leading-none text-white">
                {CATEGORY_MARKS[spot.category]}
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

      {selectedSpot && (
        <SpotDetailSheet
          spot={selectedSpot}
          mark={CATEGORY_MARKS[selectedSpot.category]}
          onClose={() => setSelectedSpotId(null)}
        />
      )}
    </div>
  );
}
