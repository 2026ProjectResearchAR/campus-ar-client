"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuMap, LuScanLine, LuUser } from "react-icons/lu";

/**
 * 共通タブバー (ui.pen "Group 11")
 *
 * ui.pen の構成 (白いピル型バー + 中央に飛び出す赤い丸) は維持し、
 * 画面に占める割合が大きすぎたためサイズを詰めている:
 *   - 白いバー本体 : 高さ 64px / 左右 12px の余白 / 完全な角丸
 *   - 中央の赤い丸 : 68px / バーから 16px 飛び出す
 *   - バー下端から画面下端までは 12px + セーフエリア
 *   - 合計の占有高さは globals.css の --tabbar-h と揃える
 */
export default function TabBar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname.startsWith(href);
  const scanActive = isActive("/screen/scan");

  return (
    <nav
      aria-label="画面切り替え"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(12px+env(safe-area-inset-bottom))] z-50 mx-auto h-20 w-[calc(100%-24px)] max-w-[406px]"
    >
      {/* 白いバー本体 */}
      <div className="pointer-events-auto absolute inset-x-0 bottom-0 h-16 rounded-full border border-hairline bg-surface/95 shadow-float backdrop-blur" />

      <div className="absolute inset-x-0 bottom-0 grid h-16 grid-cols-3">
        <SideTab
          href="/screen/map"
          label="マップ"
          icon={<LuMap size={22} strokeWidth={2.2} />}
          active={isActive("/screen/map")}
        />

        {/* 中央: スキャン (バーから飛び出す赤い丸) */}
        <Link
          href="/screen/scan"
          aria-current={scanActive ? "page" : undefined}
          className={`pointer-events-auto relative -top-4 mx-auto flex size-[68px] flex-col items-center justify-center gap-0.5 rounded-full text-white no-underline shadow-[0_6px_16px_rgb(200_22_29/0.32)] ring-4 ring-canvas transition-[transform,background-color] active:scale-95 active:bg-brand-strong ${
            scanActive ? "bg-brand-strong" : "bg-brand"
          }`}
        >
          <LuScanLine size={26} strokeWidth={2} />
          <span className="text-[11px] font-bold leading-none">スキャン</span>
        </Link>

        <SideTab
          href="/screen/mypage"
          label="マイページ"
          icon={<LuUser size={22} strokeWidth={2.2} />}
          active={isActive("/screen/mypage")}
        />
      </div>
    </nav>
  );
}

type SideTabProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
};

function SideTab({ href, label, icon, active }: SideTabProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`pointer-events-auto flex flex-col items-center justify-center gap-1 no-underline transition-colors ${
        active ? "text-brand" : "text-muted"
      }`}
    >
      {icon}
      <span className="text-[11px] font-bold leading-none">{label}</span>
    </Link>
  );
}
