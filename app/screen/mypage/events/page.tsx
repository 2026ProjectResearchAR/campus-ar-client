import { createPageMetadata } from "@/lib/metadata";

import EventList from "./_components/EventList";

export const metadata = createPageMetadata(
  "イベント案内",
  "ARCloudで龍谷大学 瀬田キャンパスの開催中・開催予定のイベントを確認できます。",
);

export default function EventsPage() {
  return <EventList />;
}
