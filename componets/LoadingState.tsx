type LoadingStateProps = {
  message?: string;
};

export default function LoadingState({ message = "読み込み中..." }: LoadingStateProps) {
  return (
    <div role="status" className="flex items-center justify-center gap-2 py-6 text-[14px] text-gray-500">
      <span
        aria-hidden
        className="size-4 animate-spin rounded-full border-2 border-gray-300 border-t-brand"
      />
      {message}
    </div>
  );
}
