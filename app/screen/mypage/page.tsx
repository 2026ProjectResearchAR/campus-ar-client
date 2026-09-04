import TabBar from '@/componets/TabBar';

export default function MyPage() {
    return (
        <div className="relative w-full max-w-[430px] mx-auto min-h-screen bg-gray-100 font-sans pb-24">

            {/*1. 上部ステータスバー＆ヘッダー */}
            <header className="px-5 pt-4 pb-2  flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500">9:41</span>
                <div className="flex gap-2 text-xs text-gray-400">
                    <span>?</span><span>?</span><span>?</span>
                </div>
            </header>

            <main className="p-4 space-y-4">
                {/*2. ユーザープロフィールカード */}
                <div className=" p-4 gap-3 flex items-center justify-between">
                    {/*赤い「G」アイコン*/}
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-base text-white bg-red-500 rounded-full w-12 h-12 flex items-center justify-center">G</span>
                        <span className="font-bold text-base">ゲスト</span>
                    </div>
            
                    {/*STOPバッジ*/}
                    <div className="h-12 border border-gray-200 bg-white rounded-xl px-4 flex gap-1.5 items-center">
                        <span className="text-[#c8161d] rounded-full border w-6 flex justify-center items-center">?</span>
                        <span className="font-extrabold ">8</span>
                        <span className="text-gray-200 text-xs flex">STOPS</span>
                    </div>
                </div>


                {/*3. メニューリスト */}
                <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-300 p-2">
                    <button className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left">
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-400 ">?</span>
                            <span className="text-sm font-bold text-gray-700">スタンプコレクション</span>
                        </div>
                        <div>
                            <span className="text-xs text-gray-400">?</span>
                        </div>
                    </button>
                   <button className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left">
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-400 ">?</span>
                            <span className="text-sm font-bold text-gray-700">スタンプコレクション</span>
                        </div>
                        <div>
                            <span className="text-xs text-gray-400">?</span>
                        </div>
                    </button>
                    <button className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left">
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-400 ">?</span>
                            <span className="text-sm font-bold text-gray-700">スタンプコレクション</span>
                        </div>
                        <div>
                            <span className="text-xs text-gray-400">?</span>
                        </div>
                    </button>
                    <button className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left">
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-400 ">?</span>
                            <span className="text-sm font-bold text-gray-700">スタンプコレクション</span>
                        </div>
                        <div>
                            <span className="text-xs text-gray-400">?</span>
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