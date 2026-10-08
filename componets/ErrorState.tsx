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
      className="rounded-2xl border border-brand/20 bg-brand-soft px-4 py-3.5 text-[14px] text-ink"
    >
      <p className="font-semibold">{message}</p>
      {code && <p className="mt-1 text-[12px] text-muted">code: {code}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 h-9 rounded-full bg-brand px-5 text-[13px] font-semibold text-white transition-colors active:bg-brand-strong"
        >
          再試行
        </button>
      )}
    </div>
  );
}
