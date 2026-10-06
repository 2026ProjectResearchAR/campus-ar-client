type EmptyStateProps = {
  message?: string;
};

export default function EmptyState({ message = "データがありません" }: EmptyStateProps) {
  return <div className="py-6 text-center text-[14px] text-gray-500">{message}</div>;
}
