"use client";

import { useCallback, useEffect, useState } from "react";

import { getUpcomingEvents, type CampusEvent } from "@/lib/events";

export type UpcomingEventsState =
  | { kind: "loading" }
  | { kind: "ok"; events: CampusEvent[] }
  | { kind: "error"; error: unknown };

/** 開催予定・開催中のイベントを取得する。retry で再取得 */
export function useUpcomingEvents() {
  const [state, setState] = useState<UpcomingEventsState>({ kind: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getUpcomingEvents(controller.signal)
      .then((events) => setState({ kind: "ok", events }))
      .catch((error) => {
        if (controller.signal.aborted) return;
        setState({ kind: "error", error });
      });
    return () => controller.abort();
  }, [attempt]);

  const retry = useCallback(() => {
    setState({ kind: "loading" });
    setAttempt((n) => n + 1);
  }, []);

  return { state, retry };
}
