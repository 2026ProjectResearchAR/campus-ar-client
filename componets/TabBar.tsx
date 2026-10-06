"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuMap, LuScanLine, LuUser } from "react-icons/lu";

/**
 * 共通タブバー (ui.pen "Group 11")
 *
 * デザイン実寸 (frame 402px 基準):
 *   - 白いバー本体 : 402 x 93.22 / radius 50 / group 内 y=21
 *   - 中央の赤い丸 : 110 x 110 / group 内 y=0 (バーから 21px 飛び出す)
 *   - アイコン     : y=47 前後、ラベル(12px/bold) : y=79
 *   - バー下端から画面下端までは 13px
 */
export default function TabBar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-[13px] z-50 mx-auto h-[115px] w-full max-w-[402px]">
      {/* 白いバー本体 */}
      <div className="pointer-events-auto absolute inset-x-0 top-[21px] h-[93px] rounded-[50px] border border-hairline bg-white shadow-card" />

      <div className="absolute inset-x-0 top-[21px] grid h-[93px] grid-cols-3">
        <SideTab
          href="/screen/map"
          label="マップ"
          icon={<LuMap size={26} strokeWidth={2.5} />}
          active={isActive("/screen/map")}
        />

        {/* 中央: スキャン (バーから飛び出す赤い丸) */}
        <Link
          href="/screen/scan"
          className="pointer-events-auto relative -top-[21px] mx-auto flex size-[110px] flex-col items-center rounded-full bg-brand pt-[24px] text-white no-underline transition-transform active:scale-95"
        >
          <LuScanLine size={40} strokeWidth={1.8} />
          <span className="mt-[8px] text-[12px] font-bold">スキャン</span>
        </Link>

        <SideTab
          href="/screen/mypage"
          label="マイページ"
          icon={<LuUser size={26} strokeWidth={2.5} />}
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
      className={`pointer-events-auto flex flex-col items-center pt-[25px] no-underline ${
        active ? "text-brand" : "text-ink"
      }`}
    >
      {icon}
      <span className="mt-[7px] text-[12px] font-bold">{label}</span>
    </Link>
  );
}
