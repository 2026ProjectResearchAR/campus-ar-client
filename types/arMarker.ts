/** ArScanner.html (iframe) から親ウィンドウへ送られるメッセージ */
export type ArMarkerMessageType = "markerFound" | "markerLost" | "modelError";

export type ArMarkerMessage = {
  type: ArMarkerMessageType;
  markerId: string;
};

export function isArMarkerMessage(data: unknown): data is ArMarkerMessage {
  if (typeof data !== "object" || data === null) return false;
  const { type, markerId } = data as Record<string, unknown>;
  return (
    (type === "markerFound" || type === "markerLost" || type === "modelError") &&
    typeof markerId === "string" &&
    markerId.length > 0
  );
}

/** 親ウィンドウから ArScanner.html (iframe) へ送るメッセージ。url が null なら仮表示に戻す */
export type ShowModelMessage = {
  type: "showModel";
  markerId: string;
  url: string | null;
};
