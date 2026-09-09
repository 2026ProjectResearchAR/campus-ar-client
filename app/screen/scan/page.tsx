import { LuMaximize, LuScanLine } from "react-icons/lu";

/**
 * スキャン画面 (ui.pen frame "Scan")
 *
 * デザイン実寸 (frame 402 x 874):
 *   - カメラ映像   : frame 全面
 *   - ガイドバナー : x=42 / y=104 / 318 x 76 / radius 20 / #434343
 *   - 読み取り枠   : x=26 / y=262 / 350 x 350 / stroke #1E1E1E 4px
 */
export default function ScanPage() {
  return (
    <div className="relative flex-1 overflow-hidden">
      {/* カメラ映像 */}
      {/* TODO: getUserMedia の <video> に差し替える (現状はプレースホルダー) */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(160deg,#d5d1cc_0%,#b7b2ac_55%,#9c968f_100%)]"
      />

      {/* ガイドバナー */}
      <div className="absolute left-[42px] top-[104px] flex h-[76px] w-[318px] items-center gap-[22px] rounded-[20px] bg-overlay pl-[25px]">
        <LuScanLine size={30} strokeWidth={2.4} className="shrink-0 text-brand" />
        <span className="text-[15px] font-bold text-white">
          ARマーカーにかざしてください
        </span>
      </div>

      {/* 読み取り枠 (四隅のカギ括弧) */}
      <LuMaximize
        aria-hidden
        size={350}
        strokeWidth={0.274}
        className="absolute left-[26px] top-[262px] text-ink"
      />
    </div>
  );
}
