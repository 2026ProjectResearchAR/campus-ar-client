"use client";

import { useState } from "react";
import { LuTrash2 } from "react-icons/lu";

import { clearLocalData } from "@/lib/useLocalStorage";

/** この端末に保存したアプリのデータ (スタンプ・お気に入りなど) を削除する */
export default function ClearLocalData() {
  const [message, setMessage] = useState<string | null>(null);

  const handleClear = () => {
    if (
      !window.confirm(
        "スタンプの獲得状況など、この端末に保存したデータをすべて削除します。元に戻せません。よろしいですか？",
      )
    ) {
      return;
    }
    try {
      const count = clearLocalData();
      setMessage(count > 0 ? "保存データを削除しました。" : "削除するデータはありませんでした。");
    } catch {
      setMessage("データを削除できませんでした。");
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
          <LuTrash2 size={20} strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-ink">保存データの削除</p>
          <p className="text-[12px] text-muted">スタンプ・お気に入りなど、この端末のデータを初期化します</p>
        </div>
      </div>
      <button
        type="button"
        onClick={handleClear}
        className="mt-3 h-11 w-full rounded-xl border border-brand text-[14px] font-bold text-brand active:bg-brand-soft"
      >
        データを削除する
      </button>
      {message && (
        <p role="status" className="mt-2 text-[12px] text-muted">
          {message}
        </p>
      )}
    </div>
  );
}
