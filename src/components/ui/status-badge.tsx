const statusClasses: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700",
  Lead: "bg-indigo-50 text-indigo-700",
  Inactive: "bg-slate-100 text-slate-600",
  Success: "bg-emerald-50 text-emerald-600",
  Complete: "bg-emerald-50 text-emerald-600",
  Delivered: "bg-emerald-50 text-emerald-600",
  Pending: "bg-amber-50 text-amber-600",
  "In Transit": "bg-amber-50 text-amber-600",
  Failed: "bg-red-50 text-red-500",
  Cancel: "bg-red-50 text-red-500",
  Cancelled: "bg-red-50 text-red-500",
};

type StatusBadgeProps = {
  value: string;
  className?: string;
};

export function StatusBadge({ value, className = "" }: StatusBadgeProps) {
  const tone = statusClasses[value] ?? "bg-gray-100 text-gray-600";
  return <span className={`badge ${className} ${tone}`.trim()}>{value}</span>;
}
