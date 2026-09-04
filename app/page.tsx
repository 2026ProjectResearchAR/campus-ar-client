import Link from 'next/link';
// モジュールも一緒に読み込む
import styles from './page.module.css';
import { FaSearch } from "react-icons/fa";
import { LuMapPin } from "react-icons/lu";


export default function HomePage() {
  return (
    // w-full max-w-[430px]: 幅100%かつ最大430px
    // mx-auto: 左右中央揃え (margin: 0 auto)
    // min-h-screen: 画面の高さいっぱい
    <div className="w-full max-w-[430px] mx-auto min-h-screen bg-white font-sans text-gray-800 pb-10">

      {/* 2. メインコンテンツ */}
      <main className="px-4">
        
        {/* キャッチコピー */}
        <div className="text-left mb-4">
          <h1 className="text-2xl font-extrabold leading-snug tracking-tight text-gray-900">
            <span className="text-[#c8161d] text-3xl">i</span>nnovationを<br />
            巻き起こせ
          </h1>
        </div>

        {/* キャンパス画像エリア */}
        {/* overflow-hidden: 画像の角を丸めるため */}
        <div className="w-full h-44 rounded-lg overflow-hidden mb-5 bg-gray-100 flex items-center justify-center border border-gray-200">
          <span className="text-xs text-gray-400">[ キャンパス画像: 100% × auto ]</span>
        </div>

        {/* 検索バー */}
        {/* shadow-md: 影をつける */}
        <div className="flex items-center bg-white rounded-full px-4 py-1.5 shadow-md border border-gray-100 mb-6">
          <input 
            type="text" 
            placeholder="教授名・研究分野を検索" 
            className={`w-full text-xs text-gray-700 bg-transparent border-none ${styles.searchInput}`}
          />
          <button className="bg-[#c8161d] text-white rounded-full w-7 h-7 flex items-center justify-center text-xs shrink-0 ml-2">
            <FaSearch />
          </button>
        </div>

        {/* 赤いメインボタン（Tailwind + モジュールの併用例） */}
        {/* `${styles.customGlow}` でモジュールの影を追加 */}
        <Link 
          href="screen/map" 
          className={`bg-[#c8161d] text-white rounded-2xl px-4 py-0 flex items-center gap-3 no-underline active:scale-[0.98] transition-transform ${styles.customGlow}`}
        >
          {/* 白丸アイコン背景 */}
          <div className="h-10 w-auto p-0 m-0 flex items-center justify-center text-lg shrink-0">
            <LuMapPin className="h-full w-auto" />
          </div>
          <div className="text-left py-3" >
            <div className="font-bold text-sm leading-tight py-1">キャンパスマップを見る</div>
            <div className="text-[10px] opacity-90 font-normal flex justify-center">研究室の場所を確認できます</div>
          </div>
        </Link>

        {/* 下部案内カード */}
        <div className="bg-[#fff5f5] border border-[#ffe0e0] rounded-xl p-4 mt-5 text-left">
          <div className="text-[#c8161d] font-bold text-xs mb-1.5 flex items-center gap-1">
            オープンキャンパス開催中！
          </div>
          <p className="text-[11px] text-gray-600 leading-relaxed margin-0">
            研究室前のマーカーにスマホの背面をタッチすると研究室ごとの情報が表示されます✨
          </p>
        </div>

      </main>
    </div>
  );
}