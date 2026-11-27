"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LuAward, LuChevronLeft, LuCloudOff, LuLock, LuTrophy } from "react-icons/lu";

import { STAMP_SPOTS, useStamps } from "@/lib/stamps";
import { type SyncResult, syncStampsFromServer } from "@/lib/visits";

const dateFormat = new Intl.DateTimeFormat("ja-JP", { month: "numeric", day: "numeric" });

export default function StampCollection() {
  const { collected, count, total, isComplete } = useStamps();
  const percent = total === 0 ? 0 : Math.round((count / total) * 100);
  const sync = useServerSync();

  return (
    <div className="flex-1 px-5 pt-4 pb-[calc(var(--tabbar-h)+24px)]">
      <Link
        href="/screen/mypage"
        className="-ml-2 inline-flex h-10 items-center gap-1 pr-3 pl-1 text-[14px] font-semibold text-muted"
      >
        <LuChevronLeft size={20} strokeWidth={2.2} />
        マイページ
      </Link>

      <h1 className="mt-2 text-[22px] font-bold text-ink">スタンプコレクション</h1>

      {/* 進捗 */}
      <section className="mt-4 rounded-2xl border border-hairline bg-surface p-4 shadow-card">
        <div className="flex items-baseline justify-between">
          <p className="text-[13px] text-muted">
            {isComplete ? "コンプリート！" : "集めたスタンプ"}
          </p>
          <p className="text-[15px] font-bold text-ink">
            <span className="text-[22px] text-brand">{count}</span> / {total}
          </p>
        </div>
        <div
          role="progressbar"
          aria-valuenow={count}
          aria-valuemin={0}
          aria-valuemax={total}
          className="mt-3 h-2 overflow-hidden rounded-full bg-brand-soft"
        >
          <div className="h-full rounded-full bg-brand transition-[width]" style={{ width: `${percent}%` }} />
        </div>
      </section>

      {/* コンプリート時のお祝い */}
      {isComplete && (
        <section className="mt-4 flex items-center gap-3 rounded-2xl bg-brand p-4 text-white shadow-card">
          <span className="flex size-12 shrink-0 animate-stamp-pop items-center justify-center rounded-full bg-white/15">
            <LuTrophy size={26} strokeWidth={2} />
          </span>
          <div>
            <p className="text-[15px] font-bold">スタンプラリー コンプリート！</p>
            <p className="mt-0.5 text-[12px] text-white/85">
              全{total}個のスタンプを集めました。キャンパス探検おつかれさまでした！
            </p>
          </div>
        </section>
      )}

      {/* スタンプ一覧 */}
      <ul className="mt-6 grid grid-cols-3 gap-3">
        {STAMP_SPOTS.map((spot) => {
          const acquiredAt = collected[spot.markerId];
          return (
            <li
              key={spot.markerId}
              className="flex flex-col items-center gap-2 rounded-2xl border border-hairline bg-surface px-2 py-4 text-center shadow-card"
            >
              <span
                className={
                  acquiredAt
                    ? "flex size-14 items-center justify-center rounded-full bg-brand text-white"
                    : "flex size-14 items-center justify-center rounded-full border-2 border-dashed border-hairline text-placeholder"
                }
              >
                {acquiredAt ? <LuAward size={28} strokeWidth={2} /> : <LuLock size={20} strokeWidth={2} />}
              </span>
              <span className="text-[12px] font-semibold leading-tight text-ink">
                {acquiredAt ? spot.name : "？？？"}
              </span>
              <span className="text-[11px] text-muted">
                {acquiredAt ? dateFormat.format(new Date(acquiredAt)) : "未獲得"}
              </span>
            </li>
          );
        })}
      </ul>

      {sync === "offline" && (
        <p role="status" className="mt-6 flex items-start gap-2 rounded-xl bg-brand-soft px-3 py-2 text-[12px] leading-relaxed text-ink">
          <LuCloudOff size={16} strokeWidth={2.2} className="mt-0.5 shrink-0 text-brand" />
          サーバーに接続できないため、この端末に保存された記録を表示しています。未送信の記録は次に接続できたときに送信されます。
        </p>
      )}

      <p className="mt-6 text-[12px] leading-relaxed text-muted">
        {sync === "syncing"
          ? "サーバーの記録を確認しています..."
          : "スタンプはこの端末に保存され、サーバーにも記録されます。"}
      </p>
    </div>
  );
}

/** 画面を開いたときにサーバーの訪問記録を取得して端末の記録へマージする */
function useServerSync(): SyncResult | "syncing" {
  const [state, setState] = useState<SyncResult | "syncing">("syncing");

  useEffect(() => {
    const controller = new AbortController();
    syncStampsFromServer(controller.signal)
      .then(setState)
      .catch(() => {
        // アンマウント時の中断
      });
    return () => controller.abort();
  }, []);

  return state;
}
