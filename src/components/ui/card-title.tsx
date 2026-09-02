import { EllipsisVertical } from "lucide-react";

type CardTitleProps = {
  title: string;
  subtitle?: string;
  variant?: "default" | "analytics" | "marketing" | "stocks";
};

export function CardTitle({ title, subtitle, variant = "default" }: CardTitleProps) {
  const wrapperClass = variant === "analytics"
    ? "flex items-start justify-between gap-3"
    : variant === "marketing"
      ? "marketing-card-title flex items-center justify-between gap-2"
      : "flex items-center justify-between";
  const headingClass = variant === "marketing"
    ? "text-[18px] font-semibold leading-7"
    : "text-xl font-semibold";
  const buttonClass = variant === "marketing"
    ? "rounded-lg p-1.5 hover:bg-[var(--soft)]"
    : "rounded-lg p-2 hover:bg-[var(--soft)]";

  return (
    <div className={wrapperClass}>
      <div>
        <h2 className={headingClass}>{title}</h2>
        {subtitle ? <p className="muted mt-1 text-sm">{subtitle}</p> : null}
      </div>
      <button className={buttonClass} aria-label={`${title} options`}>
        <EllipsisVertical
          className={variant === "stocks" ? "muted" : undefined}
          size={variant === "stocks" ? 20 : 18}
          aria-hidden={variant === "stocks" ? "true" : undefined}
        />
      </button>
    </div>
  );
}
