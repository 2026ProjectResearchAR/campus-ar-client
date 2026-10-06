"use client";

import { useCallback, useEffect, useState } from "react";

import { getHealth, type Health } from "@/lib/api";
import ErrorState from "./ErrorState";
import LoadingState from "./LoadingState";

/** GET /api/health の疎通確認用の小さな表示 */
export default function ApiHealthCheck() {
  const [state, setState] = useState<
    | { kind: "loading" }
    | { kind: "ok"; health: Health }
    | { kind: "error"; error: unknown }
  >({ kind: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getHealth(controller.signal)
      .then((health) => setState({ kind: "ok", health }))
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

  if (state.kind === "loading") return <LoadingState message="API に接続中..." />;
  if (state.kind === "error") return <ErrorState error={state.error} onRetry={retry} />;
  return (
    <p className="text-center text-[12px] text-gray-500">API 接続: {state.health.status}</p>
  );
}
