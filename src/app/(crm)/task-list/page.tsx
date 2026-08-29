"use client";

import { Modal } from "@/components/modal";
import { AlignJustify, CalendarDays, Check, ChevronRight, MessageCircle, MoreHorizontal, Plus, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

type Status = "Todo" | "In-Progress" | "Completed";
type Task = { id: number; title: string; status: Status; checked?: boolean; tag?: string; due: string; comments: number; avatar: string };
const seed: Task[] = [
  { id: 1, title: "Finish user onboarding", status: "Todo", tag: "Marketing", due: "Tomorrow", comments: 1, avatar: "AR" },
  { id: 2, title: "Solve the Dribble prioritization issue with the team", status: "Todo", tag: "Marketing", due: "Tomorrow", comments: 2, avatar: "KG" },
  { id: 3, title: "Finish user onboarding", status: "Todo", tag: "Marketing", due: "Feb 12, 2024", comments: 1, avatar: "MS" },
  { id: 4, title: "Work in Progress (WIP) Dashboard", status: "In-Progress", tag: "Template", due: "Jan 8, 2027", comments: 2, avatar: "AR" },
  { id: 5, title: "Product Update - Q4 2024", status: "In-Progress", due: "Jan 8, 2027", comments: 2, avatar: "EM" },
  { id: 6, title: "Kanban Flow Manager", status: "In-Progress", due: "Jan 8, 2027", comments: 2, avatar: "KG" },
  { id: 7, title: "Make internal feedback", status: "In-Progress", due: "Jan 8, 2027", comments: 2, avatar: "MS" },
  { id: 8, title: "Do some projects on React Native with Flutter", status: "Completed", tag: "Marketing", due: "Feb 12, 2027", comments: 1, avatar: "AR" },
  { id: 9, title: "Design marketing assets", status: "Completed", tag: "Marketing", due: "Feb 12, 2027", comments: 1, avatar: "KG" },
  { id: 10, title: "Kanban Flow Manager", status: "Completed", tag: "Marketing", due: "Feb 12, 2027", comments: 1, avatar: "EM" },
  { id: 11, title: "Change license and remove products", status: "Completed", tag: "Marketing", due: "Feb 12, 2027", comments: 1, avatar: "MS" },
];
const groups: Status[] = ["Todo", "In-Progress", "Completed"];

export default function TaskListPage() {
  const [tasks, setTasks] = useState(seed), [tab, setTab] = useState("All Tasks"), [filterOpen, setFilterOpen] = useState(false), [open, setOpen] = useState(false);
  const [sort, setSort] = useState<"Default" | "Due date" | "Name">("Default"), [title, setTitle] = useState(""), [status, setStatus] = useState<Status>("Todo"), [tag, setTag] = useState("Marketing"), [due, setDue] = useState("2027-01-08");
  const counts = { "All Tasks": 14, "To do": tasks.filter(task => task.status === "Todo").length, "In Progress": tasks.filter(task => task.status === "In-Progress").length, Completed: tasks.filter(task => task.status === "Completed").length };
  const visible = useMemo(() => { const statusForTab = tab === "To do" ? "Todo" : tab === "In Progress" ? "In-Progress" : tab === "Completed" ? "Completed" : null; const rows = statusForTab ? tasks.filter(task => task.status === statusForTab) : tasks; return sort === "Name" ? [...rows].sort((a,b) => a.title.localeCompare(b.title)) : sort === "Due date" ? [...rows].sort((a,b) => a.due.localeCompare(b.due)) : rows; }, [sort, tab, tasks]);
  const toggle = (id: number) => setTasks(items => items.map(task => task.id === id ? { ...task, checked: !(task.checked ?? task.status === "Completed") } : task));
  const add = (event: React.FormEvent) => { event.preventDefault(); if (!title.trim()) return; setTasks(items => [{ id: Date.now(), title: title.trim(), status, tag, due: new Date(`${due}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), comments: 0, avatar: "AR" }, ...items]); setTitle(""); setOpen(false); };

  return <div className="-mx-1 space-y-[27px]">
    <header className="flex items-center justify-between"><h1 className="text-xl font-semibold leading-6 tracking-[-.02em]">Task List</h1><nav className="muted flex items-center gap-2 text-sm" aria-label="Breadcrumb"><span>Home</span><ChevronRight size={15}/><span className="text-[var(--text)]">Task List</span></nav></header>
    <section className="panel overflow-x-auto overflow-y-hidden">
      <header className="flex min-h-[92px] min-w-[900px] flex-row items-center gap-4 border-b border-[var(--border)] px-6 py-6">
        <div className="grid w-[539px] flex-none grid-cols-4 rounded-xl bg-[var(--soft)] p-1">{Object.entries(counts).map(([label,count]) => <button key={label} className={`flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium leading-5 ${tab === label ? "bg-[var(--panel)] shadow-sm" : "muted"}`} onClick={() => setTab(label)} aria-pressed={tab === label}>{label}<span className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-xs ${tab === label ? "bg-indigo-50 text-[#465fff]" : "bg-[var(--panel)]"}`}>{count}</span></button>)}</div>
        <div className="ml-auto flex shrink-0 flex-nowrap justify-end gap-4"><div className="relative"><button className="btn h-11 w-[148px] whitespace-nowrap !px-4" onClick={() => setFilterOpen(value => !value)} aria-expanded={filterOpen}><SlidersHorizontal size={17}/>Filter &amp; Short</button>{filterOpen ? <div className="panel absolute right-0 z-30 mt-2 w-48 p-2 shadow-xl">{(["Default", "Due date", "Name"] as const).map(item => <button className={`block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-[var(--soft)] ${sort === item ? "font-semibold text-[#465fff]" : ""}`} key={item} onClick={() => { setSort(item); setFilterOpen(false); }}>{item}</button>)}</div> : null}</div><button className="btn btn-primary h-11 w-[156px] whitespace-nowrap !px-4" onClick={() => setOpen(true)}>Add New Task <Plus size={17}/></button></div>
      </header>
      <div className="space-y-9 p-6 pt-5">{groups.map(group => { const rows = visible.filter(task => task.status === group); return rows.length ? <section key={group}><header className="mb-3 flex items-center justify-between"><h2 className="font-medium leading-5">{group}<span className={`ml-3 rounded-full px-2 py-1 text-xs ${group === "In-Progress" ? "bg-orange-50 text-orange-600" : "bg-[var(--soft)] muted"}`}>{rows.length}</span></h2><button className="rounded-lg p-1.5 hover:bg-[var(--soft)]" aria-label={`${group} options`}><MoreHorizontal size={19}/></button></header><div className="space-y-4">{rows.map(task => <TaskRow task={task} toggle={toggle} key={task.id}/>)}</div></section> : null; })}</div>
    </section>
    <Modal open={open} title="Add New Task" onClose={() => setOpen(false)}><form className="space-y-5" onSubmit={add}><Field label="Task Title"><input className="field" required value={title} onChange={event => setTitle(event.target.value)}/></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Status"><select className="field" value={status} onChange={event => setStatus(event.target.value as Status)}>{groups.map(item => <option key={item}>{item}</option>)}</select></Field><Field label="Category"><input className="field" value={tag} onChange={event => setTag(event.target.value)}/></Field></div><Field label="Due Date"><input className="field" type="date" required value={due} onChange={event => setDue(event.target.value)}/></Field><div className="flex justify-end gap-3"><button className="btn" type="button" onClick={() => setOpen(false)}>Cancel</button><button className="btn btn-primary">Add Task</button></div></form></Modal>
  </div>;
}

function TaskRow({ task, toggle }: { task: Task; toggle: (id: number) => void }) {
  const checked = task.checked ?? task.status === "Completed";
  return <article className="flex min-h-[66px] items-center gap-3 rounded-xl border border-[var(--border)] px-4 py-3 shadow-[0_1px_2px_rgb(16_24_40/.03)] transition hover:border-[#c7d0ff] sm:gap-4 sm:px-5"><AlignJustify className="shrink-0 text-[#98a2b3]" size={18}/><button onClick={() => toggle(task.id)} className={`grid h-5 w-5 shrink-0 place-items-center rounded-[5px] border ${checked ? "border-[#6677f6] bg-[#6677f6] text-white" : "border-[var(--border)]"}`} aria-label={`${checked ? "Uncheck" : "Check"} ${task.title}`} aria-pressed={checked}>{checked ? <Check size={14}/> : null}</button><p className={`min-w-0 flex-1 text-sm font-medium ${checked ? "muted line-through" : ""}`}>{task.title}</p><div className="hidden shrink-0 items-center gap-4 md:flex">{task.tag ? <span className={`rounded-full px-3 py-1 text-xs ${task.tag === "Template" ? "bg-sky-50 text-sky-600" : "bg-indigo-50 text-[#6677f6]"}`}>{task.tag}</span> : null}<span className="muted flex items-center gap-1.5 whitespace-nowrap text-sm"><CalendarDays size={16}/>{task.due}</span><span className="muted flex items-center gap-1 text-sm"><MessageCircle size={17}/>{task.comments}</span><span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-indigo-100 to-orange-100 text-[10px] font-semibold text-[#465fff]">{task.avatar}</span></div></article>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="mb-2 block text-sm font-medium">{label}</span>{children}</label>; }
