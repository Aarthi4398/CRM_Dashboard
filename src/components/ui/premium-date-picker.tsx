"use client";

import { useEscapeKey } from "@/hooks/use-escape-key";
import { useOutsidePointerDown } from "@/hooks/use-outside-pointer-down";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useId, useMemo, useRef, useState } from "react";

type PremiumDatePickerProps = {
  id?: string;
  name?: string;
  align?: "left" | "right";
  dialogLabel?: string;
  iconSize?: number;
};

function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function sameDay(left: Date | null, right: Date): boolean {
  return Boolean(
    left &&
      left.getFullYear() === right.getFullYear() &&
      left.getMonth() === right.getMonth() &&
      left.getDate() === right.getDate(),
  );
}

function isToday(date: Date): boolean {
  const now = new Date();
  return sameDay(now, date);
}

export function PremiumDatePicker({
  id,
  name = "date",
  align = "left",
  dialogLabel = "Choose a date",
  iconSize = 19,
}: PremiumDatePickerProps) {
  const dialogId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Date | null>(null);
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [focusedDate, setFocusedDate] = useState<Date>(() => new Date());

  const days = useMemo(() => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    return [
      ...Array(new Date(year, monthIndex, 1).getDay()).fill(null),
      ...Array.from({ length: new Date(year, monthIndex + 1, 0).getDate() }, (_, index) => new Date(year, monthIndex, index + 1)),
    ];
  }, [month]);

  const value = selected
    ? `${selected.getFullYear()}-${String(selected.getMonth() + 1).padStart(2, "0")}-${String(selected.getDate()).padStart(2, "0")}`
    : "";

  const closePicker = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) {
      triggerRef.current?.focus();
    }
  }, []);

  const openPicker = useCallback(
    (focusCalendar = false) => {
      const now = new Date();
      const initialFocus =
        selected ??
        (month.getMonth() === now.getMonth() && month.getFullYear() === now.getFullYear()
          ? now
          : startOfMonth(month));
      setFocusedDate(initialFocus);
      setOpen(true);
      if (focusCalendar) {
        requestAnimationFrame(() => {
          const button = containerRef.current?.querySelector<HTMLButtonElement>(`[data-date="${formatDateKey(initialFocus)}"]`);
          button?.focus();
        });
      }
    },
    [month, selected],
  );

  useOutsidePointerDown(containerRef, open, () => closePicker(true));
  useEscapeKey(open, () => closePicker(true));

  const focusDay = useCallback((date: Date) => {
    setFocusedDate(date);
    requestAnimationFrame(() => {
      const button = containerRef.current?.querySelector<HTMLButtonElement>(`[data-date="${formatDateKey(date)}"]`);
      button?.focus();
    });
  }, []);

  const selectDate = useCallback(
    (date: Date) => {
      setSelected(date);
      closePicker(true);
    },
    [closePicker],
  );

  const handleDayKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, date: Date) => {
    let next = date;

    switch (event.key) {
      case "ArrowLeft":
        next = addDays(date, -1);
        break;
      case "ArrowRight":
        next = addDays(date, 1);
        break;
      case "ArrowUp":
        next = addDays(date, -7);
        break;
      case "ArrowDown":
        next = addDays(date, 7);
        break;
      case "Home":
        next = startOfMonth(date);
        break;
      case "End":
        next = endOfMonth(date);
        break;
      case "PageUp":
        next = addDays(startOfMonth(date), -1);
        break;
      case "PageDown":
        next = addDays(endOfMonth(date), 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        selectDate(date);
        return;
      default:
        return;
    }

    event.preventDefault();
    if (next.getMonth() !== month.getMonth() || next.getFullYear() !== month.getFullYear()) {
      setMonth(new Date(next.getFullYear(), next.getMonth(), 1));
    }
    focusDay(next);
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" && !open) {
      event.preventDefault();
      openPicker(true);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <input type="hidden" name={name} value={value} />
      <button
        id={id}
        ref={triggerRef}
        type="button"
        className="control !flex h-11 items-center justify-between py-0 text-left"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
        onClick={() => (open ? closePicker(false) : openPicker(false))}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className={`truncate ${selected ? "" : "muted"}`}>
          {selected
            ? new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" }).format(selected)
            : "Select a date"}
        </span>
        <CalendarDays className="muted shrink-0" size={iconSize} />
      </button>
      {open ? (
        <div
          id={dialogId}
          className={`panel absolute ${align === "right" ? "right-0" : "left-0"} z-40 mt-2 w-[min(20rem,calc(100vw-3rem))] p-4 shadow-[0_12px_32px_rgb(16_24_40/.16)]`}
          role="dialog"
          aria-label={dialogLabel}
        >
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)] hover:bg-[var(--soft)]"
              aria-label="Previous month"
              onClick={() => setMonth((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1))}
            >
              <ChevronLeft size={17} />
            </button>
            <p className="text-sm font-semibold">
              {new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(month)}
            </p>
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)] hover:bg-[var(--soft)]"
              aria-label="Next month"
              onClick={() => setMonth((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1))}
            >
              <ChevronRight size={17} />
            </button>
          </div>
          <div className="grid grid-cols-7 text-center text-xs font-medium text-[var(--muted)]">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <span className="py-2" key={day}>{day}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1" role="grid" aria-label="Calendar days">
            {days.map((date, index) =>
              date ? (
                <button
                  type="button"
                  className={`grid aspect-square place-items-center rounded-lg text-sm hover:bg-indigo-50 hover:text-[#465fff] dark:hover:bg-indigo-500/10 ${sameDay(selected, date) ? "bg-[#465fff] text-white hover:bg-[#465fff] hover:text-white" : isToday(date) ? "border border-[#465fff] text-[#465fff]" : ""}`}
                  key={date.toISOString()}
                  data-date={formatDateKey(date)}
                  role="gridcell"
                  aria-selected={sameDay(selected, date)}
                  aria-current={isToday(date) ? "date" : undefined}
                  tabIndex={sameDay(focusedDate, date) ? 0 : -1}
                  onKeyDown={(event) => handleDayKeyDown(event, date)}
                  onClick={() => selectDate(date)}
                  onFocus={() => setFocusedDate(date)}
                >
                  {date.getDate()}
                </button>
              ) : (
                <span key={`empty-${index}`} role="presentation" />
              ),
            )}
          </div>
          <div className="mt-3 flex justify-between border-t border-[var(--border)] pt-3">
            <button
              type="button"
              className="text-sm text-[var(--muted)] hover:text-[var(--text)]"
              onClick={() => setSelected(null)}
            >
              Clear
            </button>
            <button
              type="button"
              className="text-sm font-medium text-[#465fff]"
              onClick={() => {
                const now = new Date();
                setSelected(now);
                setMonth(new Date(now.getFullYear(), now.getMonth(), 1));
                closePicker(true);
              }}
            >
              Today
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
