// @.componets/TabBar で作っておいた共通タブバーを読み込む
import TabBar from '@/componets/TabBar';

export default function MapPage() {
    // マーカー取得数（テスト用に定数で設定）
    const TOTAL_MARKERS = 12;
    const collectedMarkers = 8;

    // 取得率（％）計算
    const progressPercentage = Math.min(
        100,
        Math.max(0, (collectedMarkers / TOTAL_MARKERS) * 100)
    )
    return (
        // ph-24 でタブバートコンテンツが被らないように下に隙間を作る
        <div className="relative w-full max-w-[430px] mx-auto min-h-screen font-sans pb-24">

            {/* マップ画面の仮ヘッダー */}
            <header className="px-5 pt-4  pb-3 bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
                {/* 上部の時刻とアイコン */}
                <div>
                    <span className="text-xs font-bold text-gray-500">9:41</span>
                    <div className="flex gap-2 text-xs text-gray-400">
                        <span>?</span><span>?</span><span>?</span>
                    </div>
                </div>

                {/* マーカーカウンター */}
                <div className="flex justify-between items-end mb-1.5">
                    <span className="text-xs font-bold text-gray-700">マーカー</span>
                    <div className="text-xs font-bold text-gray-400">
                        <span className="text-[#c8161d] text-base font-extrabold mr-0.5">
                            {collectedMarkers}
                        </span>
                        / {TOTAL_MARKERS}
                    </div>
                </div>

                {/* 動的プログレスバー背景 */}
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    {/* 中身の赤いバー:styleで直接width(%)を設定 */}
                    <div className="h-full bg-[#c8161d] routded-full transition-all duration-500 ease-out" 
                    style={{ width: `${progressPercentage}%` }}>
                    </div>
                </div>
            </header>

            {/* メインマップエリア */}
            <main className="p-4">
                <div className="w-full h96 bg-gray-200 rouded-2xl flex itemes-center justifi-center text-gray-400 text-sm">
                    [ ここに地図とピンが入ります]
                </div>
            </main>
        </div>
    )
}