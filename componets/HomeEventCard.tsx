"use client";

import Link from "next/link";

import { formatEventPeriod, isOngoing, pickFeaturedEvent } from "@/lib/events";
import { useUpcomingEvents } from "@/lib/useUpcomingEvents";

/**
 * ホームのお知らせカード。開催中のイベントを優先し、なければ直近の開催予定を表示する。
 * 読み込み中・エラー・イベントなしの場合は何も表示しない。
 */
export default function HomeEventCard() {
  const { state } = useUpcomingEvents();
  if (state.kind !== "ok") return null;

  const now = new Date();
  const event = pickFeaturedEvent(state.events, now);
  if (!event) return null;

  const ongoing = isOngoing(event, now);

  return (
    <Link
      href="/screen/mypage/events"
      className="mt-5 block rounded-xl border border-[#ffe0e0] bg-[#fff5f5] p-4 text-left no-underline"
    >
      <div className="mb-1.5 flex items-center gap-1 text-xs font-bold text-[#c8161d]">
        {ongoing ? `${event.title} 開催中！` : `開催予定: ${event.title}`}
      </div>
      <p className="margin-0 text-[11px] leading-relaxed text-gray-600">
        {formatEventPeriod(event)}
        {event.description && (
          <>
            <br />
            {event.description}
          </>
        )}
      </p>
    </Link>
  );
}
