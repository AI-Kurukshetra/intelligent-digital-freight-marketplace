type StatCardProps = {
  label: string;
  value: string;
  tone?: "default" | "accent" | "surge";
};

export function StatCard({ label, value, tone = "default" }: StatCardProps) {
  const toneClass =
    tone === "accent"
      ? "bg-accent text-white"
      : tone === "surge"
        ? "bg-surge text-white"
        : "bg-white text-ink";

  return (
    <div className={`rounded-[24px] border border-white/50 p-6 shadow-soft ${toneClass}`}>
      <p className={`text-sm ${tone === "default" ? "text-slate" : "text-white/80"}`}>{label}</p>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
    </div>
  );
}
