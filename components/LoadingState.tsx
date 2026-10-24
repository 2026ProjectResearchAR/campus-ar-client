type LoadingStateProps = {
  message?: string;
};

export default function LoadingState({ message = "読み込み中..." }: LoadingStateProps) {
  return (
    <div role="status" className="flex items-center justify-center gap-2 py-6 text-[13px] text-muted">
      <span
        aria-hidden
        className="size-4 animate-spin rounded-full border-2 border-hairline border-t-brand"
      />
      {message}
    </div>
  );
}
