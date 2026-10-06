/** ArScanner.html (iframe) から親ウィンドウへ送られるメッセージ */
export type ArMarkerMessageType = "markerFound" | "markerLost";

export type ArMarkerMessage = {
  type: ArMarkerMessageType;
  markerId: string;
};

export function isArMarkerMessage(data: unknown): data is ArMarkerMessage {
  if (typeof data !== "object" || data === null) return false;
  const { type, markerId } = data as Record<string, unknown>;
  return (
    (type === "markerFound" || type === "markerLost") &&
    typeof markerId === "string" &&
    markerId.length > 0
  );
}
