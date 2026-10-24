"use client";

import type { ReactNode } from "react";

import { type PermissionKind, usePermission } from "@/hooks/usePermission";

type Display = "checking" | "granted" | "denied" | "prompt" | "unknown";

const BADGE: Record<Display, { label: string; className: string }> = {
  checking: { label: "確認中", className: "bg-canvas text-muted" },
  granted: { label: "許可済み", className: "bg-[#e6f4ea] text-[#1e7b34]" },
  denied: { label: "拒否", className: "bg-brand-soft text-brand" },
  prompt: { label: "未設定", className: "bg-canvas text-muted" },
  unknown: { label: "確認できません", className: "bg-canvas text-muted" },
};

const GUIDE = [
  {
    title: "iPhone (Safari)",
    steps:
      "アドレスバーの「ぁあ」→「Webサイトの設定」で位置情報・カメラを「許可」にします。項目がない場合は「設定」アプリ →「アプリ」→「Safari」→ 位置情報 / カメラ を確認してください。",
  },
  {
    title: "Android (Chrome)",
    steps:
      "アドレスバー左のアイコン →「権限」で位置情報・カメラを許可します。または Chrome の「設定」→「サイトの設定」から変更できます。",
  },
];

export default function PermissionItem({
  kind,
  label,
  usage,
  icon,
}: {
  kind: PermissionKind;
  label: string;
  /** 何に使うかの説明 */
  usage: string;
  icon: ReactNode;
}) {
  const { state, requested, request } = usePermission(kind);
  const display: Display =
    state === "unsupported" ? (requested ?? "unknown") : state;

  const canRequest = display === "prompt" || display === "unknown";
  const showGuide = display === "denied" || display === "unknown";
  const badge = BADGE[display];

  return (
    <div className="p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-ink">{label}</p>
          <p className="text-[12px] text-muted">{usage}</p>
        </div>
        <span
          role="status"
          className={`shrink-0 rounded-full px-2.5 py-1 text-[12px] font-semibold ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>

      {canRequest && (
        <button
          type="button"
          onClick={request}
          className="mt-3 h-11 w-full rounded-xl bg-brand text-[14px] font-bold text-white active:bg-brand-strong"
        >
          {label}の利用を許可する
        </button>
      )}

      {showGuide && (
        <details className="mt-3 rounded-xl bg-canvas px-3 py-2 text-[12px] leading-relaxed text-muted">
          <summary className="cursor-pointer py-1 font-semibold text-ink">
            {display === "denied"
              ? "ブラウザの設定から許可する方法"
              : "このブラウザでは状態を確認できません。設定方法"}
          </summary>
          {GUIDE.map((g) => (
            <div key={g.title} className="mt-2">
              <p className="font-semibold text-ink">{g.title}</p>
              <p>{g.steps}</p>
            </div>
          ))}
          <p className="mt-2">設定を変えたら、このページを再読み込みしてください。</p>
        </details>
      )}
    </div>
  );
}
