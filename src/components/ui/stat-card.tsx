type StatCardProps = {
  label: string;
  value: string;
  change: string;
  variant: "summary" | "crm" | "analytics" | "marketing" | "ecommerce" | "logistics" | "ai";
  down?: boolean;
  icon?: React.ReactNode;
  trendIcon?: React.ReactNode;
  comparison?: string;
};

function changeTone(down: boolean) {
  return down ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-600";
}

export function StatCard({ label, value, change, variant, down = false, icon, trendIcon, comparison }: StatCardProps) {
  if (variant === "summary") return <article className="panel px-6 py-6"><p className="text-[30px] font-semibold leading-none tracking-[-.02em] tabular-nums">{value}</p><div className="mt-6 flex items-center justify-between gap-3"><p className="text-sm font-medium">{label}</p><span className={`badge ${changeTone(down)}`}>{change}</span></div></article>;
  if (variant === "crm") return <article className="crm-metric panel p-6"><p className="text-[30px] font-bold leading-[38px] tracking-[-.02em]">{value}</p><div className="mt-5 flex items-center justify-between gap-4"><p className="text-[14px] leading-5">{label}</p><div className="flex items-center gap-2"><span className={`badge ${changeTone(down)}`}>{change}</span><span className="muted text-sm">last month</span></div></div></article>;
  if (variant === "analytics") return <article className="analytics-metric panel"><p className="metric-label muted">{label}</p><div className="metric-row"><p className="metric-value tabular-nums">{value}</p><div className="metric-comparison"><span className={`metric-change ${down ? "down" : "up"}`}>{change}</span><p className="muted">Vs last month</p></div></div></article>;
  if (variant === "marketing") return <article className="marketing-kpi panel p-6"><span className="grid h-[52px] w-[52px] place-items-center rounded-xl bg-[var(--soft)] [&_svg]:h-6 [&_svg]:w-6">{icon}</span><p className="muted mt-6 text-sm">{label}</p><div className="mt-3 flex items-end justify-between gap-3"><p className="text-[30px] font-bold leading-[38px] tabular-nums">{value}</p><div className="flex shrink-0 items-center gap-2"><span className={`badge ${changeTone(down)}`}>{trendIcon} {change}</span><span className="muted whitespace-nowrap text-xs">Vs last month</span></div></div></article>;
  if (variant === "ecommerce") return <article className="ecommerce-kpi panel min-h-[188px] p-6"><span className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--soft)]">{icon}</span><div className="mt-5 flex items-end justify-between gap-3"><div><p className="muted text-sm">{label}</p><p className="mt-1 text-3xl font-semibold tabular-nums">{value}</p></div><span className={`badge ${changeTone(down)}`}>{trendIcon}{change}</span></div></article>;
  if (variant === "logistics") return <article className="panel flex min-h-[98px] items-center gap-5 p-4"><span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[var(--soft)] text-[#344054]">{icon}</span><div className="min-w-0"><p className="text-2xl font-semibold leading-8 tabular-nums">{value}</p><div className="flex flex-wrap items-center gap-3"><p className="muted whitespace-nowrap text-sm">{label}</p><span className="badge bg-emerald-50 text-emerald-600">{change}</span></div></div></article>;
  return <article className="panel p-5"><div className="flex items-center justify-between"><p className="muted text-sm">{label}</p>{icon}</div><p className="mt-3 text-3xl font-semibold">{value}</p><div className="mt-3 flex items-center justify-between"><p className="muted text-xs">{comparison ?? "Last 30 Days"}</p><span className={`flex items-center gap-1 text-xs font-semibold ${down ? "text-red-500" : "text-emerald-600"}`}>{trendIcon} {change}</span></div></article>;
}
