import { IoIosArrowForward } from "react-icons/io";
import { FiAward } from "react-icons/fi";
import { LuShield } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa";
import { PiNotePencil } from "react-icons/pi";
import { MdEventNote } from "react-icons/md";
import { CiSettings } from "react-icons/ci";

export default function MyPage() {
    return (
        /* 1. overflow-hidden を追加して、はみ出た丸を切り抜く */
        <div className="relative w-full max-w-[430px] mx-auto min-h-screen bg-[#FFF8F6] flex-1 font-sans pb-24 overflow-hidden">

            {/* ▼ 2. ここに「背景のまる」を追加！ ▼ */}
            <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[600px] h-[360px] rounded-b-[100%] bg-[#FFE3E1] pointer-events-none" />

            {/* 3. 前面のメインコンテンツ（relative z-10 で丸より前に出す） */}
            <main className="relative z-10 p-4 space-y-4">
                {/*2. ユーザープロフィールカード */}
                <div className=" p-4 gap-3 flex items-center justify-between mb-30">
                    {/*赤い「G」アイコン*/}
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-4xl text-white bg-red-500 rounded-full w-15 h-15 flex items-center justify-center">G</span>
                        <span className="font-bold text-3xl text-black">ゲスト</span>
                    </div>
                </div>

                {/*3. メニューリスト */}
                <div className="w-full p-2 space-y-8">
                    <button className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left shadow-lg rounded-xl bg-white">
                        <div className="flex items-center gap-3">
                            <span className="text-xl text-red-500 "><FiAward /></span>
                            <span className="text-sm font-bold text-gray-700">スタンプコレクション</span>
                        </div>
                        <div>
                            <span className="text-xl text-gray-400"><IoIosArrowForward /></span>
                        </div>
                    </button>
            
                    <button className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left shadow-lg rounded-xl bg-white">
                        <div className="flex items-center gap-3">
                            <span className="text-xl text-red-500 ">< LuShield /></span>
                            <span className="text-sm font-bold text-gray-700">スタンプコレクション</span>
                        </div>
                        <div>
                            <span className="text-xl text-gray-400"><IoIosArrowForward /></span>
                        </div>
                    </button>
                    
                    <button className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left shadow-lg rounded-xl bg-white">
                        <div className="flex items-center gap-3">
                            <span className="text-xl text-red-500 ">< FaRegHeart /></span>
                            <span className="text-sm font-bold text-gray-700">スタンプコレクション</span>
                        </div>
                        <div>
                            <span className="text-xl text-gray-400"><IoIosArrowForward /></span>
                        </div>
                    </button>

                    <button className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left shadow-lg rounded-xl bg-white">
                        <div className="flex items-center gap-3">
                            <span className="text-xl text-red-500 ">< PiNotePencil /></span>
                            <span className="text-sm font-bold text-gray-700">スタンプコレクション</span>
                        </div>
                        <div>
                            <span className="text-xl text-gray-400"><IoIosArrowForward /></span>
                        </div>
                    </button>

                    <button className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left shadow-lg rounded-xl bg-white">
                        <div className="flex items-center gap-3">
                            <span className="text-xl text-red-500 ">< MdEventNote /></span>
                            <span className="text-sm font-bold text-gray-700">スタンプコレクション</span>
                        </div>
                        <div>
                            <span className="text-xl text-gray-400"><IoIosArrowForward /></span>
                        </div>
                    </button>

                    <button className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left shadow-lg rounded-xl bg-white">
                        <div className="flex items-center gap-3">
                            <span className="text-xl text-black "><CiSettings /></span>
                            <span className="text-sm font-bold text-gray-700">スタンプコレクション</span>
                        </div>
                        <div>
                            <span className="text-xl text-gray-400"><IoIosArrowForward /></span>
                        </div>
                    </button>
                    

                </div>

                {/* 4. データ保管の注意書きカード */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3 items-start">
                    <span className="text-sm text-blue-500 mt-0.5">?</span>
                    <div className="space-y-1">
                        <h3 className="text-xs font-bold text-gray-800">データはブラウザに完全に保管</h3>
                        <p className="text-[11px] text-gray-500 leading-relaxed" >
                            スタンプや設定などのユーザーデータは、この端末のブラウザ内にのみ保存され、
                            安全に保管されます。外部サーバーには送信されません。
                        </p>
                    </div>
                </div>
            </main>

        </div>
    )
}