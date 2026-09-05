import { IoIosMenu } from "react-icons/io";

type NavBarProps = {
    bgColor?: string;
}

export default function NavBar(props: NavBarProps) {
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
                <button className="text-[#c8161d] text-xl p-1"><IoIosMenu /></button>
            </header>
        </div>
    )
}