"use client";

import { useCallback, useEffect, useState } from "react";

export type PermissionKind = "geolocation" | "camera";

/**
 * - checking    : 確認中 (初回描画・SSR)
 * - unsupported : Permissions API 未対応 (iOS Safari の一部など) で状態を取得できない
 */
export type PermissionState = "checking" | "granted" | "denied" | "prompt" | "unsupported";

async function queryPermission(kind: PermissionKind): Promise<PermissionStatus | null> {
  if (typeof navigator === "undefined" || !navigator.permissions?.query) return null;
  try {
    return await navigator.permissions.query({ name: kind as PermissionName });
  } catch {
    // "camera" を知らないブラウザ (Firefox の一部など) は TypeError を投げる
    return null;
  }
}

/** ブラウザの許可ダイアログを出す。許可されれば resolve、拒否・未対応なら reject */
async function requestAccess(kind: PermissionKind): Promise<void> {
  if (kind === "geolocation") {
    await new Promise<void>((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error("unsupported"));
      navigator.geolocation.getCurrentPosition(
        () => resolve(),
        // 位置が取れない・タイムアウトは許可自体はされているので成功扱い
        (err) => (err.code === err.PERMISSION_DENIED ? reject(err) : resolve()),
        { timeout: 10000 },
      );
    });
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia) throw new Error("unsupported");
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  // 許可を得るためだけに起動したので、すぐにカメラを止める
  stream.getTracks().forEach((t) => t.stop());
}

/** 権限の現在状態の取得・変更監視・許可リクエストをまとめたフック */
export function usePermission(kind: PermissionKind) {
  const [state, setState] = useState<PermissionState>("checking");
  /** Permissions API 未対応時に、リクエスト結果から分かった状態 */
  const [requested, setRequested] = useState<"granted" | "denied" | null>(null);

  useEffect(() => {
    let cancelled = false;
    let status: PermissionStatus | null = null;
    const onChange = () => {
      if (status) setState(status.state);
    };

    queryPermission(kind).then((s) => {
      if (cancelled) return;
      status = s;
      if (!s) {
        setState("unsupported");
        return;
      }
      setState(s.state);
      s.addEventListener("change", onChange);
    });

    return () => {
      cancelled = true;
      status?.removeEventListener("change", onChange);
    };
  }, [kind]);

  const request = useCallback(async () => {
    let ok = false;
    try {
      await requestAccess(kind);
      ok = true;
    } catch {
      // 拒否・タイムアウト・未対応
    }
    const s = await queryPermission(kind);
    if (s) setState(s.state);
    else setRequested(ok ? "granted" : "denied");
  }, [kind]);

  return { state, requested, request };
}
