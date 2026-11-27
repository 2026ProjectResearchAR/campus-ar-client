import type { Metadata } from "next";
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

import ApiHealthCheck from "@/components/ApiHealthCheck";

/**
 * マイページ (ui.pen frame "My page")
 *
 * レイアウト (ui.pen の構成をベースに、余白とサイズを 4px グリッドで調整):
 *   - 背景の赤い楕円 : 541 x 300 / rotate 12deg / brand 8%
 *   - アバター       : 64 x 64 / 左右 20px
 *   - メニュー行     : 高さ 56px / radius 16 / 行間 8px
 *   - 行内           : アイコン 36px の薄赤タイル / ラベル 15px semibold
 */

const MENU: { label: string; href?: string; icon: React.ReactNode }[] = [
  { label: "スタンプコレクション", icon: <LuAward size={25} strokeWidth={1.6} /> },
  { label: "避難ガイド・安全情報", icon: <LuShield size={25} strokeWidth={2.5} /> },
  { label: "お気に入り", icon: <LuHeart size={25} strokeWidth={2} /> },
  { label: "メモ", icon: <LuSquarePen size={25} strokeWidth={2} /> },
  { label: "イベント案内", icon: <LuCalendar size={25} strokeWidth={2} /> },
  { label: "設定", href: "/screen/mypage/settings", icon: <LuSettings size={25} strokeWidth={1.6} /> },
];

/** href があればリンク、なければ (未実装の) ボタンとして描画する */
function Wrapper({
  href,
  className,
  children,
}: {
  href?: string;
  className: string;
  children: React.ReactNode;
}) {
  return href ? (
    <Link href={href} className={className}>
      {children}
    </Link>
  ) : (
    <button type="button" className={className}>
      {children}
    </button>
  );
}
type MenuItem = { label: string; icon: React.ReactNode; href?: string };

const MENU: MenuItem[] = [
  {
    label: "スタンプコレクション",
    icon: <LuAward size={20} strokeWidth={2} />,
    href: "/screen/mypage/stamps",
  },
  { label: "避難ガイド・安全情報", icon: <LuShield size={20} strokeWidth={2} /> },
  {
    label: "お気に入り",
    icon: <LuHeart size={20} strokeWidth={2} />,
    href: "/screen/mypage/favorites",
  },
  {
    label: "メモ",
    icon: <LuSquarePen size={20} strokeWidth={2} />,
    href: "/screen/mypage/memos",
  },
  {
    label: "イベント案内",
    icon: <LuCalendar size={20} strokeWidth={2} />,
    href: "/screen/mypage/events",
  },
  {
    label: "設定",
    icon: <LuSettings size={20} strokeWidth={2} />,
    href: "/screen/mypage/settings",
  },
];

export const metadata: Metadata = {
  title: "マイページ",
  description: "プロフィールや獲得したバッジ、お気に入りを確認できます。",
};


export default function MyPage() {
  return (
    <div className="relative flex-1 overflow-hidden pt-8">
      {/* 背景の赤い楕円 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[100px] -top-[120px] h-[300px] w-[541px] rotate-12 rounded-[50%] bg-brand/8"
      />

      <div className="relative px-5">
        {/* プロフィール */}
        <div className="flex items-center gap-4">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-brand text-[28px] font-semibold leading-none text-white ring-4 ring-surface">
            G
          </span>
          <div className="min-w-0">
            <p className="text-[22px] font-bold leading-tight text-ink">ゲスト</p>
            <p className="mt-1 text-[13px] text-muted">データはこの端末に保存されます</p>
          </div>
        </div>

        {/* メニュー */}
        <ul className="mt-10 space-y-2">
          {MENU.map((item) => (
            <li key={item.label}>

              <Wrapper
                href={item.href}
                className="flex h-[50px] w-full items-center rounded-[15px] border border-hairline bg-white pl-[20px] pr-[30px] text-left shadow-card transition-colors hover:bg-gray-50"
              >
                <span className="shrink-0 text-ink">{item.icon}</span>
                <span className="ml-[14px] text-[16px] font-semibold text-black">
                  {item.label}
                </span>
                <LuChevronRight
                  size={26}
                  strokeWidth={2.5}
                  className="ml-auto shrink-0 text-ink"
                />
              </Wrapper>

              {item.href ? (
                <Link href={item.href} className={ROW_CLASS}>
                  <MenuRowContent item={item} />
                </Link>
              ) : (
                <button type="button" className={ROW_CLASS}>
                  <MenuRowContent item={item} />
                </button>
              )}
            </li>
          ))}
        </ul>

        {/* API 疎通確認 */}
        <div className="mt-6 pb-[calc(var(--tabbar-h)+24px)]">
          <ApiHealthCheck />
        </div>
      </div>
    </div>
  );
}

const ROW_CLASS =
  "flex h-14 w-full items-center gap-3 rounded-2xl border border-hairline bg-surface pl-3 pr-3 text-left shadow-card transition-colors active:bg-canvas";

function MenuRowContent({ item }: { item: MenuItem }) {
  return (
    <>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
        {item.icon}
      </span>
      <span className="text-[15px] font-semibold text-ink">{item.label}</span>
      <LuChevronRight
        size={20}
        strokeWidth={2.2}
        className="ml-auto shrink-0 text-placeholder"
      />
    </>
  );
}
