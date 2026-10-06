export default function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-[14px] font-semibold text-black/60">{title}</h2>
      <div className="space-y-3 rounded-[15px] border border-hairline bg-white p-5 shadow-card">
        {children}
      </div>
    </section>
  );
}
