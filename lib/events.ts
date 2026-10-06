import { apiFetch } from "@/lib/api";

/** GET /api/v1/events のイベント1件 (campus-ar-api の EventSchema / snake_case) */
export type CampusEvent = {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
};

type EventsResponse = { data: CampusEvent[] };

/** GET /api/v1/events?upcoming=true (終了していないイベントを開始時刻の昇順で取得) */
export async function getUpcomingEvents(signal?: AbortSignal): Promise<CampusEvent[]> {
  const res = await apiFetch<EventsResponse>("/api/v1/events?upcoming=true", { signal });
  return res.data;
}

/** 現在開催中か (start_time <= now <= end_time) */
export function isOngoing(event: CampusEvent, now: Date = new Date()): boolean {
  const t = now.getTime();
  return new Date(event.start_time).getTime() <= t && t <= new Date(event.end_time).getTime();
}

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "short",
});

const timeFormatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** 例: 「2026年10月10日(土) 10:00〜16:00」。日をまたぐ場合は終了側にも日付を付ける */
export function formatEventPeriod(event: CampusEvent): string {
  const start = new Date(event.start_time);
  const end = new Date(event.end_time);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "";
  const head = `${dateFormatter.format(start)} ${timeFormatter.format(start)}`;
  if (dateFormatter.format(start) === dateFormatter.format(end)) {
    return `${head}〜${timeFormatter.format(end)}`;
  }
  return `${head}〜${dateFormatter.format(end)} ${timeFormatter.format(end)}`;
}

/** 開催中のイベントを優先し、なければ最も開始が近いイベントを返す */
export function pickFeaturedEvent(
  events: CampusEvent[],
  now: Date = new Date(),
): CampusEvent | undefined {
  return events.find((e) => isOngoing(e, now)) ?? events[0];
}
