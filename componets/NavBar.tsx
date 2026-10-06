"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { IoIosClose, IoIosMenu } from "react-icons/io";
import { LuHouse, LuMap, LuScanLine, LuUser } from "react-icons/lu";

type NavBarProps = {
    bgColor?: string;
}

const MENU_ITEMS = [
    { href: "/", label: "ホーム", icon: LuHouse, exact: true },
    { href: "/screen/map", label: "マップ", icon: LuMap, exact: false },
    { href: "/screen/scan", label: "スキャン", icon: LuScanLine, exact: false },
    { href: "/screen/mypage", label: "マイページ", icon: LuUser, exact: false },
];

export default function NavBar(props: NavBarProps) {
    const pathname = usePathname();
    const drawerId = useId();
    const [open, setOpen] = useState(false);
    const [prevPathname, setPrevPathname] = useState(pathname);

    // ルート遷移したらドロワーを閉じる (レンダー中の state 調整)
    if (pathname !== prevPathname) {
        setPrevPathname(pathname);
        setOpen(false);
    }

    // 開いている間: Esc で閉じる / 背面スクロールを固定
    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.body.style.overflow = prevOverflow;
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    const isActive = (href: string, exact: boolean) =>
        exact ? pathname === href : pathname.startsWith(href);

    return (
        <div className={`w-full max-w-[430px] mx-auto font-san border-b border-gray-100 text-gray-800 pb-3 ${props.bgColor || 'bg-white'}`}>
            {/* 1. ヘッダー */}
            {/* flex justify-between items-center: 左右に振り分けて上下中央 */}
            <header className="flex justify-between items-center px-4 pt-3">
            <div className="flex items-center gap-2">
                {/* w-6 h-6: 24px × 24px */}
                <div className="w-6 h-6 flex items-center justify-center text-white text-xs font-bold">
                    <img src="/ryukoku-logo-transparent.png" alt="Ryukoku Logo" />
                </div>
                <span className="text-[11px] font-bold text-[#c8161d] tracking-tight">
                    知能情報メディア課程　研究室ガイド
                </span>
                </div>
                {/* ハンバーガーメニュー */}
                <button
                    type="button"
                    className="text-[#c8161d] text-xl p-1"
                    aria-label="メニューを開く"
                    aria-expanded={open}
                    aria-controls={drawerId}
                    onClick={() => setOpen(true)}
                >
                    <IoIosMenu />
                </button>
            </header>

            {/* オーバーレイ */}
            <div
                aria-hidden="true"
                onClick={() => setOpen(false)}
                className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 ${
                    open ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
            />

            {/* スライドインするドロワー */}
            <div
                id={drawerId}
                role="dialog"
                aria-modal="true"
                aria-label="メニュー"
                aria-hidden={!open}
                inert={!open}
                className={`fixed inset-y-0 right-0 z-[70] flex w-[78%] max-w-[300px] flex-col bg-white shadow-card transition-transform duration-300 ${
                    open ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between px-4 pt-3 pb-3 border-b border-hairline">
                    <span className="text-[13px] font-bold text-[#c8161d]">メニュー</span>
                    <button
                        type="button"
                        className="text-[#c8161d] text-2xl p-1"
                        aria-label="メニューを閉じる"
                        onClick={() => setOpen(false)}
                    >
                        <IoIosClose />
                    </button>
                </div>
                <nav aria-label="メインメニュー" className="flex-1 overflow-y-auto p-3">
                    <ul className="flex flex-col gap-1">
                        {MENU_ITEMS.map(({ href, label, icon: Icon, exact }) => {
                            const active = isActive(href, exact);
                            return (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        onClick={() => setOpen(false)}
                                        aria-current={active ? "page" : undefined}
                                        className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[14px] font-bold no-underline ${
                                            active ? "bg-canvas text-brand" : "text-ink active:bg-gray-100"
                                        }`}
                                    >
                                        <Icon size={22} strokeWidth={2.5} />
                                        {label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </div>
    )
}
