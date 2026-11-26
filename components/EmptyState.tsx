type EmptyStateProps = {
  message?: string;
};

export default function EmptyState({ message = "データがありません" }: EmptyStateProps) {
  return <div className="py-8 text-center text-[14px] text-muted">{message}</div>;
}
