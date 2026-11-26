import type { Metadata } from "next";

import EventList from "./_components/EventList";

export const metadata: Metadata = {
  title: "イベント案内",
  description: "開催中・開催予定のキャンパスイベントを確認できます。",
};

export default function EventsPage() {
  return <EventList />;
}
