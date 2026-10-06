import Link from "next/link";
import {
  LuAward,
  LuCalendar,
  LuChevronRight,
  LuHeart,
  LuSettings,
  LuShield,
  LuSquarePen,
} from "react-icons/lu";

/**
 * マイページ (ui.pen frame "My page")
 *
 * デザイン実寸 (frame 402 x 874):
 *   - 背景の赤い楕円 : 541 x 330 / rotate 12deg / #F50000 10%
 *   - アバター       : x=35 / y=66 / 80 x 80 / #F50000
 *   - メニュー行     : x=26 / 348 x 50 / radius 15 / 白 + #CBD6DC の枠線
 *   - 行内           : アイコン x=20(25px) / ラベル x=59(16px semibold)
 */
const MENU: { label: string; icon: React.ReactNode; href?: string }[] = [
  { label: "スタンプコレクション", icon: <LuAward size={25} strokeWidth={1.6} /> },
  { label: "避難ガイド・安全情報", icon: <LuShield size={25} strokeWidth={2.5} /> },
  {
    label: "お気に入り",
    icon: <LuHeart size={25} strokeWidth={2} />,
    href: "/screen/mypage/favorites",
  },
  { label: "メモ", icon: <LuSquarePen size={25} strokeWidth={2} /> },
  { label: "イベント案内", icon: <LuCalendar size={25} strokeWidth={2} /> },
  { label: "設定", icon: <LuSettings size={25} strokeWidth={1.6} /> },
];

const ROW_CLASS =
  "flex h-[50px] w-full items-center rounded-[15px] border border-hairline bg-white pl-[20px] pr-[30px] text-left shadow-card transition-colors hover:bg-gray-50";

export default function MyPage() {
  return (
    // pt-[66px]: ステータスバー領域 + アバターまでの余白
    <div className="relative flex-1 overflow-hidden pt-[66px]">
      {/* 背景の赤い楕円 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[100px] -top-[88px] h-[330px] w-[541px] rotate-12 rounded-[50%] bg-brand/10"
      />

      <div className="relative">
        {/* プロフィール */}
        <div className="flex items-center gap-[28px] pl-[35px]">
          <span className="flex size-20 shrink-0 items-center justify-center rounded-full bg-brand text-[40px] font-medium leading-none text-white">
            G
          </span>
          <span className="text-[36px] font-medium text-black">ゲスト</span>
        </div>

        {/* メニュー */}
        <ul className="mt-[116px] space-y-7 px-[27px] pb-[140px]">
          {MENU.map((item) => {
            const content = (
              <>
                <span className="shrink-0 text-ink">{item.icon}</span>
                <span className="ml-[14px] text-[16px] font-semibold text-black">
                  {item.label}
                </span>
                <LuChevronRight
                  size={26}
                  strokeWidth={2.5}
                  className="ml-auto shrink-0 text-ink"
                />
              </>
            );
            return (
              <li key={item.label}>
                {item.href ? (
                  <Link href={item.href} className={ROW_CLASS}>
                    {content}
                  </Link>
                ) : (
                  <button type="button" className={ROW_CLASS}>
                    {content}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
