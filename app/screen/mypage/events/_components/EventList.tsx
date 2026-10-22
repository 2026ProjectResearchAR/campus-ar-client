"use client";

import Link from "next/link";
import { LuChevronLeft } from "react-icons/lu";

import EmptyState from "@/componets/EmptyState";
import ErrorState from "@/componets/ErrorState";
import LoadingState from "@/componets/LoadingState";
import { formatEventPeriod, isOngoing } from "@/lib/events";
import { useUpcomingEvents } from "@/lib/useUpcomingEvents";

/** イベント案内: GET /api/v1/events?upcoming=true の一覧 */
export default function EventList() {
  const { state, retry } = useUpcomingEvents();
  const now = new Date();

  return (
    <div className="flex-1 px-5 pt-4 pb-[calc(var(--tabbar-h)+24px)]">
      <Link
        href="/screen/mypage"
        className="-ml-2 inline-flex h-10 items-center gap-1 pr-3 pl-1 text-[14px] font-semibold text-muted"
      >
        <LuChevronLeft size={20} strokeWidth={2.2} />
        マイページ
      </Link>

      <h1 className="mt-2 text-[22px] font-bold text-ink">イベント案内</h1>

      <div className="mt-4">
        {state.kind === "loading" && <LoadingState message="イベントを読み込み中..." />}
        {state.kind === "error" && <ErrorState error={state.error} onRetry={retry} />}
        {state.kind === "ok" &&
          (state.events.length === 0 ? (
            <EmptyState message="開催予定のイベントはありません" />
          ) : (
            <ul className="space-y-3">
              {state.events.map((event) => (
                <li
                  key={event.id}
                  className="rounded-2xl border border-hairline bg-surface p-4 shadow-card"
                >
                  <div className="flex items-start gap-2">
                    <h2 className="min-w-0 flex-1 text-[16px] font-bold leading-snug text-ink">
                      {event.title}
                    </h2>
                    {isOngoing(event, now) && (
                      <span className="mt-0.5 shrink-0 rounded-full bg-brand px-2 py-0.5 text-[11px] font-semibold text-white">
                        開催中
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[13px] text-muted">{formatEventPeriod(event)}</p>
                  {event.description && (
                    <p className="mt-2 whitespace-pre-line text-[13px] leading-relaxed text-ink/80">
                      {event.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ))}
      </div>
    </div>
  );
}
