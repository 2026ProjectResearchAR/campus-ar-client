"use client";

import { useEffect, useState } from "react";

export type GeolocationStatus =
  | "idle"
  | "loading"
  | "granted"
  | "denied"
  | "unavailable"
  | "error";

export type GeolocationState = {
  status: GeolocationStatus;
  lat: number | null;
  lng: number | null;
  /** 水平方向の精度 (m) */
  accuracy: number | null;
};

const INITIAL: GeolocationState = {
  status: "idle",
  lat: null,
  lng: null,
  accuracy: null,
};

/** Geolocation API (watchPosition) で現在地を継続取得する。アンマウント時に watch を解除する。 */
export function useGeolocation(options?: PositionOptions): GeolocationState {
  const [state, setState] = useState<GeolocationState>(INITIAL);
  const enableHighAccuracy = options?.enableHighAccuracy ?? true;
  const maximumAge = options?.maximumAge ?? 5000;
  const timeout = options?.timeout ?? 20000;

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      const t = setTimeout(
        () => setState({ ...INITIAL, status: "unavailable" }),
        0,
      );
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () =>
        setState((s) => (s.status === "idle" ? { ...s, status: "loading" } : s)),
      0,
    );
    const id = navigator.geolocation.watchPosition(
      (pos) =>
        setState({
          status: "granted",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        }),
      (err) =>
        setState((s) => ({
          ...s,
          status:
            err.code === err.PERMISSION_DENIED
              ? "denied"
              : err.code === err.POSITION_UNAVAILABLE
                ? "unavailable"
                : "error",
        })),
      { enableHighAccuracy, maximumAge, timeout },
    );
    return () => {
      clearTimeout(t);
      navigator.geolocation.clearWatch(id);
    };
  }, [enableHighAccuracy, maximumAge, timeout]);

  return state;
}
