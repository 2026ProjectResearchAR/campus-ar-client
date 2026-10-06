"use client";

import { useState } from "react";
import Link from "next/link";
import { LuChevronLeft, LuPlus, LuSquarePen, LuTrash2 } from "react-icons/lu";
import { useMemos, type Memo } from "@/lib/memos";
import { SPOTS } from "@/lib/spots";

/** 編集中の状態: null = フォーム非表示 / "new" = 新規 / Memo = 編集 */
type Editing = null | "new" | Memo;

const FIELD =
  "w-full rounded-[15px] border border-hairline bg-white px-4 py-3 text-[14px] text-black outline-none focus:border-brand";

/** マイページ > メモ */
export default function MemosPage() {
  const { memos, addMemo, updateMemo, deleteMemo } = useMemos();
  const [editing, setEditing] = useState<Editing>(null);

  const handleDelete = (memo: Memo) => {
    if (window.confirm(`「${memo.title || "無題"}」を削除しますか？`)) {
      deleteMemo(memo.id);
    }
  };

  return (
    <div className="flex-1 px-[27px] pb-[140px] pt-[66px]">
      <div className="flex items-center gap-2">
        <Link
          href="/screen/mypage"
          aria-label="マイページに戻る"
          className="text-ink"
        >
          <LuChevronLeft size={28} strokeWidth={2.5} />
        </Link>
        <h1 className="text-[24px] font-semibold text-black">メモ</h1>
        {editing === null && (
          <button
            type="button"
            onClick={() => setEditing("new")}
            aria-label="メモを追加"
            className="ml-auto flex size-10 items-center justify-center rounded-full bg-brand text-white shadow-card"
          >
            <LuPlus size={22} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {editing !== null ? (
        <MemoForm
          // 編集対象が変わったらフォームの入力状態をリセットする
          key={editing === "new" ? "new" : editing.id}
          initial={editing === "new" ? undefined : editing}
          onCancel={() => setEditing(null)}
          onSubmit={(input) => {
            if (editing === "new") addMemo(input);
            else updateMemo(editing.id, input);
            setEditing(null);
          }}
        />
      ) : memos.length === 0 ? (
        <p className="mt-6 rounded-[15px] border border-hairline bg-white p-5 text-center text-[14px] text-ink/60">
          メモはまだありません。
          <br />
          右上の＋ボタンから作成できます。
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {memos.map((memo) => (
            <li
              key={memo.id}
              className="rounded-[15px] border border-hairline bg-white p-4 shadow-card"
            >
              <div className="flex items-start gap-2">
                <h2 className="flex-1 break-all text-[16px] font-semibold text-black">
                  {memo.title || "無題"}
                </h2>
                <button
                  type="button"
                  onClick={() => setEditing(memo)}
                  aria-label="編集"
                  className="text-ink"
                >
                  <LuSquarePen size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(memo)}
                  aria-label="削除"
                  className="text-brand"
                >
                  <LuTrash2 size={20} />
                </button>
              </div>
              {memo.spotName && (
                <span className="mt-1 inline-block rounded-[20px] border border-hairline px-2 text-[10px] text-ink">
                  {memo.spotName}
                </span>
              )}
              {memo.body && (
                <p className="mt-2 whitespace-pre-wrap break-all text-[14px] text-black">
                  {memo.body}
                </p>
              )}
              <p className="mt-2 text-[10px] text-ink/50">
                {new Date(memo.updatedAt).toLocaleString("ja-JP")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MemoForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Memo;
  onSubmit: (input: {
    title: string;
    body: string;
    spotId?: number;
    spotName?: string;
  }) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [spotId, setSpotId] = useState(initial?.spotId?.toString() ?? "");

  const canSave = title.trim() !== "" || body.trim() !== "";

  return (
    <form
      className="mt-6 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSave) return;
        const spot = SPOTS.find((s) => String(s.id) === spotId);
        onSubmit({
          title: title.trim(),
          body: body.trim(),
          spotId: spot?.id,
          spotName: spot?.name,
        });
      }}
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タイトル"
        maxLength={50}
        className={FIELD}
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="メモの内容"
        rows={6}
        className={FIELD}
      />
      <select
        value={spotId}
        onChange={(e) => setSpotId(e.target.value)}
        className={FIELD}
      >
        <option value="">スポットを関連付けない</option>
        {SPOTS.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} ({s.category})
          </option>
        ))}
      </select>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="h-[44px] flex-1 rounded-[15px] border border-hairline bg-white text-[14px] font-semibold text-black"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={!canSave}
          className="h-[44px] flex-1 rounded-[15px] bg-brand text-[14px] font-semibold text-white disabled:opacity-40"
        >
          保存
        </button>
      </div>
    </form>
  );
}
