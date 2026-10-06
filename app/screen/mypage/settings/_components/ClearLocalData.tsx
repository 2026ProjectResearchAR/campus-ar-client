"use client";

import { useState } from "react";

export default function ClearLocalData() {
  const [done, setDone] = useState(false);

  const handleClear = () => {
    if (
      !window.confirm(
        "お気に入り・メモなど、この端末に保存したデータをすべて削除します。この操作は取り消せません。よろしいですか？",
      )
    ) {
      return;
    }
    try {
      localStorage.clear();
      setDone(true);
    } catch {
      window.alert("データを削除できませんでした。");
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-[12px] text-black/60">
        お気に入りやメモなど、この端末に保存されたデータを削除します。
      </p>
      <button
        type="button"
        onClick={handleClear}
        className="h-[40px] w-full rounded-[12px] border border-brand text-[14px] font-semibold text-brand transition-colors hover:bg-brand/10"
      >
        ローカルデータを削除
      </button>
      {done && (
        <p role="status" className="text-[12px] text-green-700">
          削除しました。
        </p>
      )}
    </div>
  );
}
