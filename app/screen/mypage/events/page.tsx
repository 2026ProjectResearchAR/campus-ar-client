"use client";

import Link from "next/link";
import { LuChevronLeft } from "react-icons/lu";

import EmptyState from "@/componets/EmptyState";
import ErrorState from "@/componets/ErrorState";
import LoadingState from "@/componets/LoadingState";
import { formatEventPeriod, isOngoing } from "@/lib/events";
import { useUpcomingEvents } from "@/lib/useUpcomingEvents";

/** イベント案内: GET /api/v1/events?upcoming=true の一覧 */
export default function EventsPage() {
  const { state, retry } = useUpcomingEvents();
  const now = new Date();

  return (
    <div className="flex-1 px-[27px] pb-[140px] pt-[66px]">
      <div className="mb-6 flex items-center gap-2">
        <Link
          href="/screen/mypage"
          aria-label="マイページに戻る"
          className="-ml-2 flex size-9 items-center justify-center text-ink"
        >
          <LuChevronLeft size={26} strokeWidth={2.5} />
        </Link>
        <h1 className="text-[24px] font-semibold text-black">イベント案内</h1>
      </div>

      {state.kind === "loading" && <LoadingState message="イベントを読み込み中..." />}
      {state.kind === "error" && <ErrorState error={state.error} onRetry={retry} />}
      {state.kind === "ok" &&
        (state.events.length === 0 ? (
          <EmptyState message="開催予定のイベントはありません" />
        ) : (
          <ul className="space-y-4">
            {state.events.map((event) => (
              <li
                key={event.id}
                className="rounded-[15px] border border-hairline bg-white px-5 py-4 shadow-card"
              >
                <div className="flex items-start gap-2">
                  <h2 className="text-[16px] font-semibold text-black">{event.title}</h2>
                  {isOngoing(event, now) && (
                    <span className="mt-0.5 shrink-0 rounded-full bg-brand px-2 py-0.5 text-[11px] font-semibold text-white">
                      開催中
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[13px] text-gray-500">{formatEventPeriod(event)}</p>
                {event.description && (
                  <p className="mt-2 whitespace-pre-line text-[13px] leading-relaxed text-gray-700">
                    {event.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ))}
    </div>
  );
}
