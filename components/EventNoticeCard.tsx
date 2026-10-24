"use client";

import Link from "next/link";

import { formatEventPeriod, isOngoing, pickFeaturedEvent } from "@/lib/events";
import { useUpcomingEvents } from "@/lib/useUpcomingEvents";

type EventNoticeCardProps = {
  className?: string;
};

/**
 * ホームのお知らせカード (GET /api/v1/events?upcoming=true)。
 * 開催中のイベントを優先し、なければ直近の開催予定を表示する。
 * 読み込み中・エラー・イベントなしの場合は何も表示しない。
 */
export default function EventNoticeCard({ className = "" }: EventNoticeCardProps) {
  const { state } = useUpcomingEvents();
  if (state.kind !== "ok") return null;

  const now = new Date();
  const event = pickFeaturedEvent(state.events, now);
  if (!event) return null;

  const ongoing = isOngoing(event, now);

  return (
    <Link
      href="/screen/mypage/events"
      className={`block rounded-2xl border border-brand/15 bg-brand-soft px-4 py-3.5 no-underline ${className}`}
    >
      <p className="text-[14px] font-bold text-brand">
        {ongoing ? `${event.title} 開催中！` : `開催予定: ${event.title}`}
      </p>
      <p className="mt-1 text-[12px] text-muted">{formatEventPeriod(event)}</p>
      {event.description && (
        <p className="mt-1 line-clamp-3 whitespace-pre-line text-[13px] leading-relaxed text-ink/80">
          {event.description}
        </p>
      )}
    </Link>
  );
}
