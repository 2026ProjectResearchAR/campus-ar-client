"use client";

import { useEffect, useState } from "react";
import { findSensorLocation, getLatestReading, type EnvironmentReading } from "@/lib/sensors";

type State =
  | { kind: "loading" }
  | { kind: "ready"; reading: EnvironmentReading | null; checkedAt: number }
  | { kind: "error" };

const STATUS_LABEL = { crowded: "混雑", moderate: "やや混雑", vacant: "空いています" };

export default function SensorReading({ buildingName }: { buildingName: string }) {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    let locationId: string | null = null;
    async function refresh() {
      try {
        // 初回失敗時は次の更新で建物の解決も再試行する。
        locationId ??= await findSensorLocation(buildingName, controller.signal);
        const reading = locationId ? await getLatestReading(locationId, controller.signal) : null;
        if (!controller.signal.aborted) setState({ kind: "ready", reading, checkedAt: Date.now() });
      } catch {
        if (!controller.signal.aborted) setState({ kind: "error" });
      } finally {
        if (!controller.signal.aborted) timer = setTimeout(refresh, 60_000);
      }
    }
    void refresh();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [buildingName]);

  if (state.kind === "loading") return <p className="text-[12px] text-muted">センサ情報を取得中…</p>;
  if (state.kind === "error") return <p role="status" className="text-[12px] text-muted">センサ情報を取得できません（1分後に再試行）</p>;
  if (!state.reading) return <p className="text-[12px] text-muted">センサ情報は未計測です</p>;

  const reading = state.reading;
  const stale = state.checkedAt - Date.parse(reading.recorded_at) > 5 * 60_000;
  return (
    <div className="mt-1 text-[12px] text-muted">
      <p>{STATUS_LABEL[reading.status]} · {reading.occupancy}人 · CO₂ {reading.co2_ppm} ppm</p>
      <p>
        <time dateTime={reading.recorded_at}>
          計測: {new Date(reading.recorded_at).toLocaleString("ja-JP")}
        </time>
        {stale && "（5分以上前のデータ）"}
      </p>
    </div>
  );
}
