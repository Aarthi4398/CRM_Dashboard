"use client";

import { Modal } from "@/components/modal";
import { useCRMActions, useCRMSelector } from "@/lib/store";
import type { CalendarEvent } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const featured: CalendarEvent[] = [
  { id: "calendar-event-conf", title: "Event Conf.", date: "2026-08-24", time: "10:00", category: "Meeting", attendees: 12, relatedTo: "CRM" },
  { id: "calendar-meeting", title: "Meeting", date: "2026-08-25", time: "11:30", category: "Call", attendees: 4, relatedTo: "Sales" },
  { id: "calendar-workshop", title: "Workshop", date: "2026-08-26", time: "14:00", category: "Deadline", attendees: 8, relatedTo: "Marketing" },
];
type View = "month" | "week" | "day";
type FormState = { id?: string; title: string; date: string; time: string; category: CalendarEvent["category"] };
const emptyForm: FormState = { title: "", date: "2026-08-24", time: "10:00", category: "Meeting" };

export default function CalendarPage() {
  const events = useCRMSelector(state => state.events);
  const { setState } = useCRMActions();
  const [cursor, setCursor] = useState(new Date(2026, 7, 1));
  const [view, setView] = useState<View>("month");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [open, setOpen] = useState(false);
  const year = cursor.getFullYear(), month = cursor.getMonth();
  const allEvents = useMemo(() => [...featured, ...events.filter(event => !featured.some(item => item.id === event.id))], [events]);
  const monthCells = useMemo(() => {
    const first = new Date(year, month, 1), start = new Date(year, month, 1 - first.getDay());
    return Array.from({ length: 42 }, (_, index) => { const date = new Date(start); date.setDate(start.getDate() + index); return date; });
  }, [month, year]);
  const openNew = (date = `${year}-${String(month + 1).padStart(2, "0")}-01`) => { setForm({ ...emptyForm, date }); setOpen(true); };
  const openEvent = (event: CalendarEvent) => { setForm({ id: event.id, title: event.title, date: event.date, time: event.time, category: event.category }); setOpen(true); };
  const save = (event: React.FormEvent) => {
    event.preventDefault(); if (!form.title.trim()) return;
    const next: CalendarEvent = { id: form.id ?? crypto.randomUUID(), title: form.title.trim(), date: form.date, time: form.time, category: form.category, attendees: 2, relatedTo: "CRM" };
    setState(current => ({ ...current, events: form.id ? current.events.map(item => item.id === form.id ? next : item).concat(featured.some(item => item.id === form.id) && !current.events.some(item => item.id === form.id) ? [next] : []) : [...current.events, next] }));
    setOpen(false);
  };
  const remove = () => { if (!form.id) return; setState(current => ({ ...current, events: current.events.filter(item => item.id !== form.id) })); setOpen(false); };
  const move = (amount: number) => setCursor(view === "month" ? new Date(year, month + amount, 1) : new Date(year, month, cursor.getDate() + amount * (view === "week" ? 7 : 1)));

  return <div className="space-y-7">
    <header className="flex items-center justify-between gap-4"><h1 className="text-2xl font-semibold tracking-[-.02em]">Calendar</h1><nav className="muted flex items-center gap-2 text-sm" aria-label="Breadcrumb"><span>Home</span><ChevronRight size={15}/><span className="text-[var(--text)]">Calendar</span></nav></header>
    <section className="panel overflow-x-auto overflow-y-hidden">
      <header className="relative flex min-h-[88px] min-w-[760px] flex-wrap items-center gap-3 border-b border-[var(--border)] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2"><button className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--border)] hover:bg-[var(--soft)]" onClick={() => move(-1)} aria-label={`Previous ${view}`}><ChevronLeft size={20}/></button><button className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--border)] hover:bg-[var(--soft)]" onClick={() => move(1)} aria-label={`Next ${view}`}><ChevronRight size={20}/></button><button className="ml-1 h-10 rounded-lg bg-[#465fff] px-5 text-sm font-medium text-white shadow-sm hover:bg-[#3b50df]" onClick={() => openNew()}>Add Event +</button></div>
        <h2 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold">{cursor.toLocaleString("en-US", { month: "long", year: "numeric" })}</h2>
        <div className="ml-auto grid grid-cols-3 rounded-lg bg-[var(--soft)] p-1">{(["month", "week", "day"] as View[]).map(item => <button key={item} onClick={() => setView(item)} aria-pressed={view === item} className={`rounded-md px-5 py-2 text-sm capitalize ${view === item ? "bg-[var(--panel)] font-medium shadow-sm" : "muted"}`}>{item}</button>)}</div>
      </header>
      {view === "month" ? <MonthView cells={monthCells} month={month} events={allEvents} onDay={openNew} onEvent={openEvent}/> : <AgendaView view={view} cursor={cursor} events={allEvents} onEvent={openEvent}/>} 
    </section>
    <Modal open={open} title={form.id ? "Edit Event" : "Add Event"} onClose={() => setOpen(false)}><form className="space-y-5" onSubmit={save}>
      <Field label="Event Title"><input className="field" required value={form.title} onChange={event => setForm(current => ({ ...current, title: event.target.value }))}/></Field>
      <div className="grid gap-4 sm:grid-cols-2"><Field label="Event Date"><input className="field" type="date" required value={form.date} onChange={event => setForm(current => ({ ...current, date: event.target.value }))}/></Field><Field label="Event Time"><input className="field" type="time" required value={form.time} onChange={event => setForm(current => ({ ...current, time: event.target.value }))}/></Field></div>
      <Field label="Event Type"><select className="field" value={form.category} onChange={event => setForm(current => ({ ...current, category: event.target.value as CalendarEvent["category"] }))}><option>Meeting</option><option>Call</option><option>Deadline</option></select></Field>
      <div className="flex justify-end gap-3 pt-2">{form.id ? <button type="button" className="btn mr-auto text-red-500" onClick={remove}>Delete</button> : null}<button type="button" className="btn" onClick={() => setOpen(false)}>Cancel</button><button className="btn btn-primary">{form.id ? "Save Changes" : "Add Event"}</button></div>
    </form></Modal>
  </div>;
}

function MonthView({ cells, month, events, onDay, onEvent }: { cells: Date[]; month: number; events: CalendarEvent[]; onDay: (date: string) => void; onEvent: (event: CalendarEvent) => void }) {
  return <div className="min-w-[760px]"><div className="grid grid-cols-7 bg-[var(--soft)]">{weekDays.map(day => <div className="border-r border-[var(--border)] px-5 py-[17px] text-xs font-medium text-[#98a2b3] last:border-r-0" key={day}>{day}</div>)}</div><div className="grid grid-cols-7">{cells.map(date => { const iso = localDate(date), dateEvents = events.filter(event => event.date === iso), outside = date.getMonth() !== month; return <button type="button" onClick={() => onDay(iso)} className="group min-h-[102px] border-r border-t border-[var(--border)] p-4 text-left align-top transition-colors hover:bg-[var(--soft)] last:border-r-0 xl:min-h-[116px]" key={iso}><span className={`text-sm font-medium ${outside ? "text-[#98a2b3]" : ""}`}>{date.getDate()}</span><span className="mt-4 block space-y-1">{dateEvents.map(event => <span role="button" tabIndex={0} onClick={click => { click.stopPropagation(); onEvent(event); }} onKeyDown={key => { if (key.key === "Enter" || key.key === " ") { key.preventDefault(); key.stopPropagation(); onEvent(event); } }} className={`block truncate border-l-[3px] px-2 py-1 text-xs font-medium ${event.category === "Meeting" ? "border-[#465fff] bg-indigo-50 text-[#465fff]" : event.category === "Call" ? "border-emerald-500 bg-emerald-50 text-emerald-600" : "border-orange-500 bg-orange-50 text-orange-600"}`} key={event.id}>{event.title}</span>)}</span></button>; })}</div></div>;
}

function AgendaView({ view, cursor, events, onEvent }: { view: Exclude<View, "month">; cursor: Date; events: CalendarEvent[]; onEvent: (event: CalendarEvent) => void }) {
  const dates = Array.from({ length: view === "week" ? 7 : 1 }, (_, index) => { const date = new Date(cursor); date.setDate(cursor.getDate() - (view === "week" ? cursor.getDay() : 0) + index); return date; });
  return <div className={`grid min-h-[620px] min-w-[760px] ${view === "week" ? "grid-cols-7" : "grid-cols-1"}`}>{dates.map(date => { const iso = localDate(date); return <div className="border-r border-[var(--border)] last:border-r-0" key={iso}><div className="border-b border-[var(--border)] bg-[var(--soft)] p-4 text-center"><p className="muted text-xs font-medium">{weekDays[date.getDay()]}</p><p className="mt-1 text-xl font-semibold">{date.getDate()}</p></div><div className="space-y-2 p-3">{events.filter(event => event.date === iso).map(event => <button className="w-full rounded-lg bg-indigo-50 p-3 text-left text-sm font-medium text-[#465fff]" onClick={() => onEvent(event)} key={event.id}>{event.time}<br/>{event.title}</button>)}</div></div>; })}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="mb-2 block text-sm font-medium">{label}</span>{children}</label>; }
function localDate(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
