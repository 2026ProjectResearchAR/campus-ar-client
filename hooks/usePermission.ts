"use client";

import { useCallback, useEffect, useState } from "react";

export type PermissionKind = "geolocation" | "camera";

/** unsupported: Permissions API 未対応 (iOS Safari の一部など) で状態を取得できない */
export type PermissionStatus = "granted" | "denied" | "prompt" | "unsupported";

async function queryHandle(kind: PermissionKind) {
  if (!navigator.permissions?.query) return null;
  try {
    return await navigator.permissions.query({
      name: kind as PermissionName,
    });
  } catch {
    // "camera" 未対応ブラウザは TypeError を投げる
    return null;
  }
}

async function request(kind: PermissionKind): Promise<void> {
  if (kind === "geolocation") {
    await new Promise<void>((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error("unsupported"));
      navigator.geolocation.getCurrentPosition(() => resolve(), reject, {
        timeout: 10000,
      });
    });
    return;
  }
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  stream.getTracks().forEach((t) => t.stop());
}

/** 権限の現在状態の取得・変更監視・許可リクエストをまとめたフック */
export function usePermission(kind: PermissionKind) {
  const [status, setStatus] = useState<PermissionStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    let handle: globalThis.PermissionStatus | null = null;
    const onChange = () => {
      if (handle) setStatus(handle.state);
    };

    (async () => {
      handle = await queryHandle(kind);
      if (cancelled) return;
      if (!handle) {
        setStatus("unsupported");
        return;
      }
      setStatus(handle.state);
      handle.addEventListener("change", onChange);
    })();

    return () => {
      cancelled = true;
      handle?.removeEventListener("change", onChange);
    };
  }, [kind]);

  const requestPermission = useCallback(async () => {
    try {
      await request(kind);
    } catch {
      // 拒否・未対応いずれも再取得した状態で表示する
    }
    const handle = await queryHandle(kind);
    if (handle) setStatus(handle.state);
  }, [kind]);

  return { status, requestPermission };
}
