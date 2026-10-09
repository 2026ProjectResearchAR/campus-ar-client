import Image from 'next/image';
import Link from 'next/link';
// モジュールも一緒に読み込む
import styles from './page.module.css';
import { LuChevronRight, LuMapPin } from "react-icons/lu";


export default function StartPage() {
  return (
    // w-full max-w-[430px]: 幅100%かつ最大430px
    // mx-auto: 左右中央揃え (margin: 0 auto)
    <div className="mx-auto w-full max-w-[430px] flex-1 bg-canvas pb-12 text-ink">

      {/* スタート画面: キャッチコピー → キャンパス画像 → はじめる (→ マップ) */}
      {/* 2. メインコンテンツ (左右 20px / 要素間 16〜24px) */}
      <main className="px-5 pt-6">

        {/* キャッチコピー */}
        <h1 className="text-[28px] font-extrabold leading-[1.35] tracking-tight text-ink">
          <span className="text-[34px] text-brand">i</span>nnovationを<br />
          巻き起こせ
        </h1>

        {/* キャンパス画像エリア */}
        {/* overflow-hidden: 画像の角を丸めるため */}
        <div className="relative mt-5 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-hairline bg-surface">
          {/* TODO: キャンパスの写真が用意できたら差し替える (現状はキャンパスマップの画像を使用) */}
          <Image
            src="/seta_b_l_2026.jpg"
            alt="龍谷大学 瀬田キャンパス"
            fill
            sizes="(max-width: 430px) 100vw, 430px"
            loading="eager"
            className="object-cover"
          />
        </div>

        {/* スタートボタン: マップ画面へ進む */}
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
            <span className="block text-[18px] font-bold leading-snug">はじめる</span>
            <span className="mt-0.5 block text-[12px] leading-snug text-white/85">キャンパスマップから研究室を探しましょう</span>
          </span>
          <LuChevronRight size={22} className="shrink-0 text-white/80" />
        </Link>

        {/* 下部案内カード */}
        <div className="mt-4 rounded-2xl border border-brand/15 bg-brand-soft px-4 py-3.5">
          <p className="text-[14px] font-bold text-brand">
            オープンキャンパス開催中！
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-ink/80">
            研究室前のマーカーにスマホの背面をタッチすると研究室ごとの情報が表示されます✨
          </p>
        </div>

      </main>
    </div>
  );
}
