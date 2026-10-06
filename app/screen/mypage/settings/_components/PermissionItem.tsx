"use client";

import type { ReactNode } from "react";
import {
  usePermission,
  type PermissionKind,
  type PermissionStatus,
} from "@/hooks/usePermission";

const LABEL: Record<PermissionStatus, string> = {
  granted: "許可済み",
  denied: "拒否",
  prompt: "未設定",
  unsupported: "確認できません",
};

const GUIDE = [
  {
    title: "iOS Safari",
    steps:
      "「設定」アプリ > Safari > 位置情報 / カメラ から「許可」または「確認」を選択。サイト単位では、アドレスバーの「ぁあ」> Webサイトの設定 から変更できます。",
  },
  {
    title: "Android Chrome",
    steps:
      "アドレスバー左の設定アイコン > 権限 から位置情報 / カメラを「許可」にします。または Chrome の「設定」> サイトの設定 から変更できます。",
  },
];

export default function PermissionItem({
  kind,
  label,
  icon,
}: {
  kind: PermissionKind;
  label: string;
  icon: ReactNode;
}) {
  const { status, requestPermission } = usePermission(kind);
  const canRequest = status === "prompt" || status === "unsupported";

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <span className="shrink-0 text-ink">{icon}</span>
        <span className="text-[16px] font-semibold text-black">{label}</span>
        <span
          className={`ml-auto rounded-full px-3 py-0.5 text-[12px] font-semibold ${
            status === "granted"
              ? "bg-green-100 text-green-700"
              : status === "denied"
                ? "bg-brand/10 text-brand"
                : "bg-gray-100 text-black/60"
          }`}
        >
          {status ? LABEL[status] : "確認中"}
        </span>
      </div>

      {canRequest && (
        <button
          type="button"
          onClick={requestPermission}
          className="h-[40px] w-full rounded-[12px] bg-brand text-[14px] font-semibold text-white"
        >
          {label}を許可する
        </button>
      )}

      {status === "unsupported" && (
        <p className="text-[12px] text-black/60">
          このブラウザでは権限の状態を確認できません。上のボタンで許可を求めるか、下記の手順で設定してください。
        </p>
      )}

      {(status === "denied" || status === "unsupported") && (
        <div className="space-y-2 rounded-[12px] bg-gray-50 p-3">
          <p className="text-[12px] font-semibold text-black">
            ブラウザの設定から許可する方法
          </p>
          {GUIDE.map((g) => (
            <div key={g.title}>
              <p className="text-[12px] font-semibold text-black/80">
                {g.title}
              </p>
              <p className="text-[12px] text-black/60">{g.steps}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
