import Link from 'next/link';
// モジュールも一緒に読み込む
import styles from './page.module.css';
import { FaSearch } from "react-icons/fa";
import { LuChevronRight, LuMapPin } from "react-icons/lu";
import EventNoticeCard from '@/componets/EventNoticeCard';


export default function HomePage() {
  return (
    // w-full max-w-[430px]: 幅100%かつ最大430px
    // mx-auto: 左右中央揃え (margin: 0 auto)
    <div className="mx-auto w-full max-w-[430px] flex-1 bg-canvas pb-12 text-ink">

      {/* 2. メインコンテンツ (左右 20px / 要素間 16〜24px) */}
      <main className="px-5 pt-6">

        {/* キャッチコピー */}
        <h1 className="text-[28px] font-extrabold leading-[1.35] tracking-tight text-ink">
          <span className="text-[34px] text-brand">i</span>nnovationを<br />
          巻き起こせ
        </h1>

        {/* キャンパス画像エリア */}
        {/* overflow-hidden: 画像の角を丸めるため */}
        <div className="mt-5 flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-2xl border border-hairline bg-surface">
          <span className="text-[12px] text-placeholder">[ キャンパス画像: 100% × auto ]</span>
        </div>

        {/* 検索バー */}
        <div className="mt-5 flex h-12 items-center rounded-full border border-hairline bg-surface pl-5 pr-1.5 shadow-card focus-within:border-brand/40">
          {/* 16px 未満だと iOS Safari がフォーカス時にズームするため text-base */}
          <input
            type="text"
            placeholder="教授名・研究分野を検索"
            className={`w-full bg-transparent text-base text-ink placeholder:text-[14px] placeholder:text-placeholder ${styles.searchInput}`}
          />
          <button
            type="button"
            aria-label="検索"
            className="ml-2 flex size-9 shrink-0 items-center justify-center rounded-full bg-brand text-[14px] text-white transition-colors active:bg-brand-strong"
          >
            <FaSearch />
          </button>
        </div>

        {/* 赤いメインボタン（Tailwind + モジュールの併用例） */}
        {/* `${styles.customGlow}` でモジュールの影を追加 */}
        <Link
          href="/screen/map"
          className={`mt-6 flex items-center gap-3.5 rounded-2xl bg-brand py-4 pl-4 pr-3 text-white no-underline transition-[transform,background-color] active:scale-[0.98] active:bg-brand-strong ${styles.customGlow}`}
        >
          {/* アイコンの下地 */}
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-[22px]">
            <LuMapPin />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[16px] font-bold leading-snug">キャンパスマップを見る</span>
            <span className="mt-0.5 block text-[12px] leading-snug text-white/85">研究室の場所を確認できます</span>
          </span>
          <LuChevronRight size={22} className="shrink-0 text-white/80" />
        </Link>

        {/* 下部案内カード (events API) */}
        <EventNoticeCard className="mt-4" />

      </main>
    </div>
  );
}
