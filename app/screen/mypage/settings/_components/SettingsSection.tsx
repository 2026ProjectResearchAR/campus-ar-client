/** 設定ページのセクション (見出し + 白いカード) */
export default function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="px-1 text-[13px] font-semibold text-muted">{title}</h2>
      <div className="mt-2 divide-y divide-hairline rounded-2xl border border-hairline bg-surface shadow-card">
        {children}
      </div>
    </section>
  );
}
