"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

type PremiumDatePickerProps = {
  name?: string;
  align?: "left" | "right";
  dialogLabel?: string;
  iconSize?: number;
};

export function PremiumDatePicker({ name = "date", align = "left", dialogLabel = "Choose a date", iconSize = 19 }: PremiumDatePickerProps) {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Date | null>(null);
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const days = useMemo(() => {
    const year = month.getFullYear(), monthIndex = month.getMonth();
    return [...Array(new Date(year, monthIndex, 1).getDay()).fill(null), ...Array.from({ length: new Date(year, monthIndex + 1, 0).getDate() }, (_, index) => new Date(year, monthIndex, index + 1))];
  }, [month]);
  const sameDay = (left: Date | null, right: Date) => Boolean(left && left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate());
  const value = selected ? `${selected.getFullYear()}-${String(selected.getMonth() + 1).padStart(2, "0")}-${String(selected.getDate()).padStart(2, "0")}` : "";

  return <div className="relative">
    <input type="hidden" name={name} value={value}/>
    <button type="button" className="control !flex h-11 items-center justify-between py-0 text-left" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen((current) => !current)}><span className={`truncate ${selected ? "" : "muted"}`}>{selected ? new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" }).format(selected) : "Select a date"}</span><CalendarDays className="muted shrink-0" size={iconSize}/></button>
    {open ? <div className={`panel absolute ${align === "right" ? "right-0" : "left-0"} z-40 mt-2 w-[min(20rem,calc(100vw-3rem))] p-4 shadow-[0_12px_32px_rgb(16_24_40/.16)]`} role="dialog" aria-label={dialogLabel}>
      <div className="mb-4 flex items-center justify-between"><button type="button" className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)] hover:bg-[var(--soft)]" aria-label="Previous month" onClick={() => setMonth((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1))}><ChevronLeft size={17}/></button><p className="text-sm font-semibold">{new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(month)}</p><button type="button" className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)] hover:bg-[var(--soft)]" aria-label="Next month" onClick={() => setMonth((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1))}><ChevronRight size={17}/></button></div>
      <div className="grid grid-cols-7 text-center text-xs font-medium text-[var(--muted)]">{["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => <span className="py-2" key={day}>{day}</span>)}</div>
      <div className="grid grid-cols-7 gap-1">{days.map((date, index) => date ? <button type="button" className={`grid aspect-square place-items-center rounded-lg text-sm hover:bg-indigo-50 hover:text-[#465fff] dark:hover:bg-indigo-500/10 ${sameDay(selected, date) ? "bg-[#465fff] text-white hover:bg-[#465fff] hover:text-white" : sameDay(today, date) ? "border border-[#465fff] text-[#465fff]" : ""}`} key={date.toISOString()} onClick={() => { setSelected(date); setOpen(false); }}>{date.getDate()}</button> : <span key={`empty-${index}`}/>)}</div>
      <div className="mt-3 flex justify-between border-t border-[var(--border)] pt-3"><button type="button" className="text-sm text-[var(--muted)] hover:text-[var(--text)]" onClick={() => setSelected(null)}>Clear</button><button type="button" className="text-sm font-medium text-[#465fff]" onClick={() => { setSelected(today); setMonth(new Date(today.getFullYear(), today.getMonth(), 1)); setOpen(false); }}>Today</button></div>
    </div> : null}
  </div>;
}
