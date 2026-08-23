import Link from 'next/link';

export default function TabBar() {
  return (
    /* fixed bottom-4 で画面の下側に固定表示します */
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[398px] bg-white/90 backdrop-blur border border-gray-100 rounded-full shadow-lg h-14 flex items-center justify-around z-50 px-2">
      
      {/* 1. マップボタン */}
      <Link href="/map" className="flex flex-col items-center text-[10px] text-[#c8161d] font-bold no-underline">
        <span className="text-base">📍</span>
        <span>マップ</span>
      </Link>

      {/* 2. スキャンボタン（真ん中の飛び出る赤ボタン） */}
      <Link href="/scan" className="relative -top-4 w-14 h-14 bg-[#c8161d] rounded-full flex flex-col items-center justify-center text-white text-[10px] font-bold shadow-md active:scale-95 transition-transform no-underline">
        <span className="text-base">📷</span>
        <span>スキャン</span>
      </Link>

      {/* 3. マイページボタン */}
      <Link href="/mypage" className="flex flex-col items-center text-[10px] text-gray-400 no-underline">
        <span className="text-base">👤</span>
        <span>マイページ</span>
      </Link>

    </nav>
  );
}