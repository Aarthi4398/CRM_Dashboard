"use client";

import { ChevronLeft, ChevronRight, EllipsisVertical, Laugh, Mic, Paperclip, Phone, Search, Send, Video } from "lucide-react";
import { useMemo, useRef, useState } from "react";

const contacts = [
  { name: "Kaiya George", role: "Project Manager", time: "15 mins", initials: "KG", tone: "from-rose-100 to-amber-100" },
  { name: "Lindsey Curtis", role: "Designer", time: "30 mins", initials: "LC", tone: "from-indigo-100 to-sky-100" },
  { name: "Zain Geidt", role: "Content Writer", time: "45 mins", initials: "ZG", tone: "from-pink-100 to-purple-100" },
  { name: "Carla George", role: "Front-end Developer", time: "2 days", initials: "CG", tone: "from-orange-100 to-stone-100", away: true },
  { name: "Abram Schleifer", role: "Digital Marketer", time: "1 hour", initials: "AS", tone: "from-emerald-100 to-cyan-100" },
  { name: "Lincoln Donin", role: "Project Manager Product Designer", time: "3 days", initials: "LD", tone: "from-blue-100 to-violet-100" },
  { name: "Erin Geidthem", role: "Copyrighter", time: "5 days", initials: "EG", tone: "from-yellow-100 to-red-100" },
  { name: "Alena Baptista", role: "SEO Expert", time: "2 hours", initials: "AB", tone: "from-fuchsia-100 to-indigo-100" },
  { name: "Wilium vamos", role: "Content Writer", time: "5 days", initials: "WV", tone: "from-slate-100 to-blue-100" },
];
type Message = { id: number; text: string; mine: boolean; author: string; time: string; attachment?: string };
const initialMessages: Message[] = [
  { id: 1, text: "I want to make an appointment tomorrow from 2:00 to 5:00pm?", mine: false, author: "Kaiya George", time: "15 mins" },
  { id: 2, text: "I want to make an appointment tomorrow from 2:00 to 5:00pm?", mine: false, author: "Lindsey Curtis", time: "30 mins" },
  { id: 3, text: "If don’t like something, I’ll stay away from it.", mine: true, author: "You", time: "2 hours ago" },
  { id: 4, text: "I want more detailed information.", mine: false, author: "Lindsey Curtis", time: "2 hours ago" },
  { id: 5, text: "They got there early, and got really good seats.", mine: true, author: "You", time: "2 hours ago" },
  { id: 6, text: "Please preview the image", mine: false, author: "Lindsey Curtis", time: "2 hours ago", attachment: "project-preview.png" },
];

export default function ChatPage() {
  const [active, setActive] = useState(contacts[1]), [query, setQuery] = useState(""), [text, setText] = useState(""), [messages, setMessages] = useState(initialMessages), [mobileChat, setMobileChat] = useState(false), [menu, setMenu] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const visibleContacts = useMemo(() => contacts.filter(contact => `${contact.name} ${contact.role}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const send = (event: React.FormEvent) => { event.preventDefault(); if (!text.trim()) return; setMessages(items => [...items, { id: Date.now(), text: text.trim(), mine: true, author: "You", time: "Just now" }]); setText(""); };
  const attach = (file?: File) => { if (!file) return; setMessages(items => [...items, { id: Date.now(), text: `Shared ${file.name}`, mine: true, author: "You", time: "Just now", attachment: file.name }]); };
  return <div className="space-y-6">
    <header className="flex items-center justify-between"><h1 className="text-xl font-semibold leading-6">Chats</h1><nav className="muted flex items-center gap-2 text-sm"><span>Home</span><ChevronRight size={15}/><span className="text-[var(--text)]">Chats</span></nav></header>
    <div className="grid h-[540px] gap-5 lg:grid-cols-[224px_minmax(0,1fr)]">
      <aside className={`panel overflow-hidden ${mobileChat ? "hidden lg:block" : "block"}`}><header className="flex h-[70px] items-center justify-between px-5"><h2 className="text-2xl font-semibold">Chats</h2><button className="rounded-lg p-1 hover:bg-[var(--soft)]" aria-label="Chat list options"><EllipsisVertical className="muted" size={18}/></button></header><div className="px-5"><label className="relative block"><Search className="muted absolute left-4 top-1/2 -translate-y-1/2" size={18}/><input className="control !pl-11" placeholder="Search..." value={query} onChange={event => setQuery(event.target.value)}/></label></div><div className="mt-2 h-[408px] overflow-y-auto px-3 pb-4">{visibleContacts.map(contact => <button className={`flex w-full items-start gap-3 rounded-xl px-2 py-3 text-left hover:bg-[var(--soft)] ${active.name === contact.name ? "bg-[var(--soft)]" : ""}`} key={contact.name} onClick={() => { setActive(contact); setMobileChat(true); }}><Avatar contact={contact}/><div className="min-w-0 flex-1"><p className="text-sm font-medium leading-5">{contact.name}</p><p className="muted mt-0.5 text-xs leading-4">{contact.role}</p></div><span className="muted text-right text-xs leading-4">{contact.time}</span></button>)}</div></aside>
      <section className={`panel min-w-0 overflow-hidden ${mobileChat ? "block" : "hidden lg:block"}`}><header className="flex h-[78px] items-center border-b border-[var(--border)] px-6"><button className="mr-2 rounded-lg p-2 hover:bg-[var(--soft)] lg:hidden" onClick={() => setMobileChat(false)} aria-label="Back to chats"><ChevronLeft size={19}/></button><Avatar contact={active}/><div className="ml-3"><h2 className="text-sm font-medium">{active.name}</h2><p className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600"><i className="h-2 w-2 rounded-full bg-emerald-500"/>Online</p></div><div className="ml-auto flex items-center gap-2"><button className="rounded-lg p-2 hover:bg-[var(--soft)]" onClick={() => alert(`Calling ${active.name}`)} aria-label={`Call ${active.name}`}><Phone size={20}/></button><button className="rounded-lg p-2 hover:bg-[var(--soft)]" onClick={() => alert(`Starting video with ${active.name}`)} aria-label={`Video call ${active.name}`}><Video size={21}/></button><div className="relative"><button className="rounded-lg p-2 hover:bg-[var(--soft)]" onClick={() => setMenu(value => !value)} aria-label="Conversation options"><EllipsisVertical size={19}/></button>{menu ? <div className="panel absolute right-0 z-20 mt-1 w-36 p-1 shadow-xl"><button className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[var(--soft)]">View profile</button><button className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[var(--soft)]">Clear chat</button></div> : null}</div></div></header>
        <div className="h-[400px] space-y-7 overflow-y-auto px-6 py-5">{messages.map(message => <div className={`flex gap-3 ${message.mine ? "justify-end" : "justify-start"}`} key={message.id}>{message.mine ? null : <Avatar contact={active} small/>}<div className={`max-w-[78%] ${message.mine ? "text-right" : ""}`}><div className={`inline-block rounded-xl px-4 py-2.5 text-left text-sm leading-5 ${message.mine ? "bg-[#465fff] text-white" : "bg-[var(--soft)]"}`}>{message.text}{message.attachment ? <span className={`mt-2 block rounded-md px-3 py-2 text-xs ${message.mine ? "bg-white/15" : "bg-[var(--panel)]"}`}><Paperclip className="mr-1 inline" size={13}/>{message.attachment}</span> : null}</div><p className="muted mt-2 text-xs">{message.mine ? message.time : `${message.author}, ${message.time}`}</p></div></div>)}</div>
        <form className="flex h-[60px] items-center gap-2 border-t border-[var(--border)] px-5" onSubmit={send}><button type="button" className="muted rounded-lg p-2 hover:bg-[var(--soft)]" onClick={() => setText(value => `${value} 😊`)} aria-label="Add emoji"><Laugh size={20}/></button><input className="min-w-0 flex-1 bg-transparent px-1 text-sm outline-none" placeholder="Type a message" value={text} onChange={event => setText(event.target.value)}/><button type="button" className="muted rounded-lg p-2 hover:bg-[var(--soft)]" onClick={() => fileRef.current?.click()} aria-label="Attach file"><Paperclip size={20}/></button><input ref={fileRef} className="sr-only" type="file" onChange={event => attach(event.target.files?.[0])}/><button type="button" className="muted rounded-lg p-2 hover:bg-[var(--soft)]" aria-label="Record voice message"><Mic size={20}/></button><button className="grid h-10 w-10 place-items-center rounded-lg bg-[#465fff] text-white hover:bg-[#3b50df]" aria-label="Send message"><Send size={19}/></button></form>
      </section>
    </div>
  </div>;
}

function Avatar({ contact, small = false }: { contact: (typeof contacts)[number]; small?: boolean }) { return <span className={`relative grid shrink-0 place-items-center rounded-full bg-gradient-to-br text-xs font-semibold text-slate-700 ${contact.tone} ${small ? "h-10 w-10" : "h-12 w-12"}`}>{contact.initials}<i className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[var(--panel)] ${contact.away ? "bg-orange-400" : "bg-emerald-500"}`}/></span>; }
