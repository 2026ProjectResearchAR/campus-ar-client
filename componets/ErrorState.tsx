import { ApiError } from "@/lib/api";

type ErrorStateProps = {
  error: unknown;
  onRetry?: () => void;
};

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  const message = error instanceof Error ? error.message : "エラーが発生しました";
  const code = error instanceof ApiError ? error.code : undefined;
  return (
    <div
      role="alert"
      className="rounded-[15px] border border-brand/30 bg-brand/10 px-4 py-3 text-[14px] text-black"
    >
      <p className="font-semibold">{message}</p>
      {code && <p className="mt-1 text-[12px] text-gray-500">code: {code}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 rounded-full bg-brand px-4 py-1 text-[13px] font-semibold text-white"
        >
          再試行
        </button>
      )}
    </div>
  );
}
