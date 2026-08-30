"use client";

import { Modal } from "@/components/modal";
import { CalendarDays, ChevronRight, Link2, MessageCircle, MoreHorizontal, Plus, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

type Status = "To Do" | "In Progress" | "Completed";
type Card = { id: number; title: string; status: Status; due: string; comments: number; links?: number; tag: "Development" | "Marketing" | "Template" | "Dev"; avatar: string; description?: string };
const columns: Status[] = ["To Do", "In Progress", "Completed"];
const initialCards: Card[] = [
  { id: 1, title: "Finish user onboarding", status: "To Do", due: "Tomorrow", comments: 1, tag: "Development", avatar: "AR" },
  { id: 2, title: "Solve the dribble prioritization issue with the team", status: "To Do", due: "Jan 08, 2027", comments: 1, tag: "Marketing", avatar: "KG" },
  { id: 3, title: "Change license and remove products", status: "To Do", due: "Jan 8, 2027", comments: 0, tag: "Dev", avatar: "MS" },
  { id: 4, title: "Work in progress(WIP) Dashboard", status: "In Progress", due: "Today", comments: 1, tag: "Development", avatar: "EM" },
  { id: 5, title: "Kanban manager", status: "In Progress", due: "Jan 08, 2027", comments: 8, links: 2, tag: "Template", avatar: "AR" },
  { id: 6, title: "Product Update - Q4 (2024)", description: "Dedicated from a category of users that will perform actions.", status: "In Progress", due: "Today", comments: 1, tag: "Development", avatar: "KG" },
  { id: 7, title: "Make figbot send comment when ticket is auto-moved back to inbox", status: "In Progress", due: "Mar 08, 2027", comments: 1, tag: "Dev", avatar: "MS" },
  { id: 8, title: "Manage internal feedback", status: "Completed", due: "Tomorrow", comments: 1, tag: "Dev", avatar: "EM" },
  { id: 9, title: "Do some projects on React Native with Flutter", status: "Completed", due: "Jan 8, 2027", comments: 1, tag: "Development", avatar: "AR" },
  { id: 10, title: "Design marketing assets", status: "Completed", due: "Jan 08, 2027", comments: 2, links: 1, tag: "Marketing", avatar: "KG" },
  { id: 11, title: "Kanban flow manager", status: "Completed", due: "Jan 08, 2027", comments: 8, links: 2, tag: "Template", avatar: "MS" },
];

export default function TaskKanbanPage() {
  const [cards, setCards] = useState(initialCards), [tab, setTab] = useState("All Tasks"), [filter, setFilter] = useState(false), [open, setOpen] = useState(false);
  const [title, setTitle] = useState(""), [status, setStatus] = useState<Status>("To Do"), [tag, setTag] = useState<Card["tag"]>("Development"), [due, setDue] = useState("2027-01-08");
  const counts = { "All Tasks": 14, "To do": cards.filter(card => card.status === "To Do").length, "In Progress": cards.filter(card => card.status === "In Progress").length, Completed: cards.filter(card => card.status === "Completed").length };
  const visibleColumns = useMemo(() => tab === "To do" ? ["To Do" as Status] : tab === "All Tasks" ? columns : [tab as Status], [tab]);
  const move = (id: number, next: Status) => setCards(items => items.map(card => card.id === id ? { ...card, status: next } : card));
  const add = (event: React.FormEvent) => { event.preventDefault(); if (!title.trim()) return; setCards(items => [{ id: Date.now(), title: title.trim(), status, due: new Date(`${due}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }), comments: 0, tag, avatar: "AR" }, ...items]); setTitle(""); setOpen(false); };

  return <div className="-mx-1 space-y-[27px]">
    <header className="flex items-center justify-between"><h1 className="text-xl font-semibold leading-6 tracking-[-.02em]">Task Kanban</h1><nav className="muted flex items-center gap-2 text-sm"><span>Home</span><ChevronRight size={15}/><span className="text-[var(--text)]">Task Kanban</span></nav></header>
    <section className="panel overflow-x-auto overflow-y-hidden">
      <header className="flex min-h-[92px] min-w-[900px] items-center gap-4 border-b border-[var(--border)] px-6 py-6">
        <div className="grid w-[539px] flex-none grid-cols-4 rounded-xl bg-[var(--soft)] p-1">{Object.entries(counts).map(([label,count]) => <button key={label} className={`flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium leading-5 ${tab === label ? "bg-[var(--panel)] shadow-sm" : "muted"}`} onClick={() => setTab(label)} aria-pressed={tab === label}>{label}<span className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-xs ${tab === label ? "bg-indigo-50 text-[#465fff]" : "bg-[var(--panel)]"}`}>{count}</span></button>)}</div>
        <div className="ml-auto flex shrink-0 gap-3"><div className="relative"><button className="btn h-11 w-[140px] whitespace-nowrap !px-3 !font-normal" onClick={() => setFilter(value => !value)} aria-expanded={filter}><SlidersHorizontal size={17}/>Filter &amp; Short</button>{filter ? <div className="panel absolute right-0 z-30 mt-2 w-44 p-2 shadow-xl"><button className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-[var(--soft)]" onClick={() => { setCards(items => [...items].sort((a,b) => a.title.localeCompare(b.title))); setFilter(false); }}>Sort by name</button><button className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-[var(--soft)]" onClick={() => { setCards(initialCards); setFilter(false); }}>Default order</button></div> : null}</div><button className="btn btn-primary h-11 w-[146px] whitespace-nowrap !px-3" onClick={() => setOpen(true)}>Add New Task <Plus size={17}/></button></div>
      </header>
      <div className={`grid min-h-[820px] min-w-[900px] ${visibleColumns.length === 1 ? "grid-cols-1" : "grid-cols-3"}`}>{visibleColumns.map(column => <KanbanColumn key={column} status={column} cards={cards.filter(card => card.status === column)} move={move}/>)}</div>
    </section>
    <Modal open={open} title="Add New Task" onClose={() => setOpen(false)}><form className="space-y-5" onSubmit={add}><Field label="Task Title"><input className="field" required value={title} onChange={event => setTitle(event.target.value)}/></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Status"><select className="field" value={status} onChange={event => setStatus(event.target.value as Status)}>{columns.map(item => <option key={item}>{item}</option>)}</select></Field><Field label="Category"><select className="field" value={tag} onChange={event => setTag(event.target.value as Card["tag"])}>{["Development","Marketing","Template","Dev"].map(item => <option key={item}>{item}</option>)}</select></Field></div><Field label="Due Date"><input className="field" type="date" value={due} onChange={event => setDue(event.target.value)}/></Field><div className="flex justify-end gap-3"><button type="button" className="btn" onClick={() => setOpen(false)}>Cancel</button><button className="btn btn-primary">Add Task</button></div></form></Modal>
  </div>;
}

function KanbanColumn({ status, cards, move }: { status: Status; cards: Card[]; move: (id: number, status: Status) => void }) {
  return <section className="border-r border-[var(--border)] p-6 last:border-r-0" onDragOver={event => event.preventDefault()} onDrop={event => move(Number(event.dataTransfer.getData("task-id")), status)}><header className="mb-7 flex items-center justify-between"><h2 className="font-medium">{status}<span className={`ml-3 rounded-full px-2 py-1 text-xs ${status === "In Progress" ? "bg-orange-50 text-orange-600" : status === "Completed" ? "bg-emerald-50 text-emerald-600" : "bg-[var(--soft)] muted"}`}>{cards.length}</span></h2><button className="rounded-lg p-1.5 hover:bg-[var(--soft)]" aria-label={`${status} options`}><MoreHorizontal size={19}/></button></header><div className="space-y-5">{cards.map(card => <article draggable onDragStart={event => event.dataTransfer.setData("task-id", String(card.id))} className="cursor-grab rounded-xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_1px_2px_rgb(16_24_40/.04)] transition hover:border-[#c7d0ff] active:cursor-grabbing" key={card.id}><div className="flex items-start gap-3"><h3 className="min-w-0 flex-1 text-base font-medium leading-6">{card.title}</h3><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-100 to-orange-100 text-[10px] font-semibold text-[#465fff]">{card.avatar}</span></div>{card.description ? <p className="muted mt-3 text-sm leading-5">{card.description}</p> : null}<div className="muted mt-5 flex items-center gap-3 text-sm"><span className="flex items-center gap-1.5"><CalendarDays size={16}/>{card.due}</span><span className="flex items-center gap-1"><MessageCircle size={17}/>{card.comments}</span>{card.links ? <span className="flex items-center gap-1"><Link2 size={15}/>{card.links}</span> : null}</div><span className={`mt-4 inline-flex rounded-full px-2.5 py-1 text-xs ${card.tag === "Marketing" ? "bg-indigo-50 text-[#6677f6]" : card.tag === "Template" ? "bg-emerald-50 text-emerald-600" : card.tag === "Dev" ? "bg-slate-100 text-slate-600" : "bg-orange-50 text-orange-600"}`}>{card.tag}</span></article>)}</div></section>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="mb-2 block text-sm font-medium">{label}</span>{children}</label>; }
