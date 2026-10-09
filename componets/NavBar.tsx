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
    { href: "/", label: "スタート", icon: LuHouse, exact: true },
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
        <>
        <div className={`sticky top-0 z-40 mx-auto w-full max-w-[430px] pt-[env(safe-area-inset-top)] border-b border-hairline text-ink ${props.bgColor || 'bg-surface/95 backdrop-blur'}`}>
            {/* 1. ヘッダー: 高さ 56px / 左右 16px */}
            <header className="flex h-14 items-center justify-between pl-4 pr-2">
                <Link href="/" aria-label="スタート" className="flex items-center no-underline">
                    <img src="/ryukoku-logo-transparent.png" alt="" className="size-7 shrink-0 object-contain" />
                </Link>
                {/* ハンバーガーメニュー (タップ領域 44px) */}
                <button
                    type="button"
                    className="flex size-11 shrink-0 items-center justify-center rounded-full text-[26px] text-ink transition-colors active:bg-brand-soft"
                    aria-label="メニューを開く"
                    aria-expanded={open}
                    aria-controls={drawerId}
                    onClick={() => setOpen(true)}
                >
                    <IoIosMenu />
                </button>
            </header>
        </div>

            {/* ヘッダーの backdrop-blur が fixed の基準になってしまうため、
                オーバーレイとドロワーはヘッダーの外 (兄弟要素) に置く */}
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
                // 閉じている間は visibility も落とす。画面外に translate しただけだと
                // スマホがその分までページ幅を広げ、全体が縮小表示されてしまう
                className={`fixed inset-y-0 right-0 z-[70] flex w-[80%] max-w-[320px] flex-col bg-surface pt-[env(safe-area-inset-top)] shadow-float transition-[translate,visibility] duration-300 ease-out ${
                    open ? "visible translate-x-0" : "invisible translate-x-full"
                }`}
            >
                <div className="flex h-14 items-center justify-between border-b border-hairline pl-5 pr-2">
                    <span className="text-[15px] font-bold text-ink">メニュー</span>
                    <button
                        type="button"
                        className="flex size-11 items-center justify-center rounded-full text-[30px] text-ink transition-colors active:bg-brand-soft"
                        aria-label="メニューを閉じる"
                        onClick={() => setOpen(false)}
                    >
                        <IoIosClose />
                    </button>
                </div>
                <nav aria-label="メインメニュー" className="flex-1 overflow-y-auto px-3 py-4">
                    <ul className="flex flex-col gap-1">
                        {MENU_ITEMS.map(({ href, label, icon: Icon, exact }) => {
                            const active = isActive(href, exact);
                            return (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        onClick={() => setOpen(false)}
                                        aria-current={active ? "page" : undefined}
                                        className={`flex h-12 items-center gap-3.5 rounded-xl px-3.5 text-[15px] font-semibold no-underline transition-colors ${
                                            active ? "bg-brand-soft text-brand" : "text-ink active:bg-canvas"
                                        }`}
                                    >
                                        <Icon size={20} strokeWidth={2.2} />
                                        {label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </>
    )
}
