"use client";

import { menuSections, type MenuItem } from "@/lib/menu";
import { Bell, ChevronDown, Menu, Moon, Search, Sun, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname(), router = useRouter();
  const [collapsed, setCollapsed] = useState(false), [hovered, setHovered] = useState(false), [mobile, setMobile] = useState(false);
  const [theme, setTheme] = useState("light"), [notice, setNotice] = useState(false), [profile, setProfile] = useState(false), [query, setQuery] = useState("");
  const [openGroups, setOpenGroups] = useState<string[]>(() => menuSections.flatMap(section => section.items.filter(item => item.children?.some(child => child.href === "/dashboard")).map(item => item.label)));
  const headerRef = useRef<HTMLElement>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light"); }, []);
  useEffect(() => { const close = (event: MouseEvent) => { if (!headerRef.current?.contains(event.target as Node)) { setNotice(false); setProfile(false); } }; document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close); }, []);
  useEffect(() => { const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setMobile(false); }; document.addEventListener("keydown", escape); return () => document.removeEventListener("keydown", escape); }, []);
  const expanded = mobile || !collapsed || hovered;
  const toggleTheme = () => { const dark = !document.documentElement.classList.contains("dark"); document.documentElement.classList.toggle("dark", dark); localStorage.setItem("aarthi-theme", dark ? "dark" : "light"); setTheme(dark ? "dark" : "light"); };
  const search = (event: React.FormEvent) => { event.preventDefault(); if (query.trim()) router.push(`/contacts?q=${encodeURIComponent(query.trim())}`); };
  const toggleGroup = (label: string) => setOpenGroups(groups => groups.includes(label) ? groups.filter(group => group !== label) : [...groups, label]);
  const go = () => setMobile(false);

  if (["/signin","/signup","/reset-password","/two-step-verification","/error-404","/error-500","/error-503","/coming-soon","/maintenance","/success"].includes(path) || path.startsWith("/layout-")) return <>{children}</>;

  return <div>
    <aside onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setHovered(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setHovered(false); }} className={`fixed inset-y-0 left-0 z-[60] flex flex-col overflow-x-hidden border-r border-[var(--border)] bg-[var(--panel)] shadow-sm transition-[width,transform] duration-300 ease-in-out motion-reduce:transition-none ${expanded ? "w-[290px]" : "w-[90px]"} ${mobile ? "translate-x-0" : "max-lg:-translate-x-full"}`} aria-label="Main navigation">
      <div className={`flex h-[77px] shrink-0 items-center border-b border-[var(--border)] transition-[padding] duration-300 ease-in-out motion-reduce:transition-none ${expanded ? "px-5" : "px-[29px]"}`}>
        <Link href="/dashboard" onClick={go} className={`flex min-w-0 items-center overflow-hidden transition-[gap] duration-300 ease-in-out ${expanded ? "gap-3" : "gap-0"}`} aria-label="Aarthi CRM dashboard"><Logo/><b className={`max-w-[190px] shrink-0 truncate text-2xl font-semibold tracking-[-.02em] text-[#101828] transition-[max-width,opacity,transform] duration-200 ease-out dark:text-[#f2f4f7] ${expanded ? "translate-x-0 opacity-100 delay-100" : "max-w-0 -translate-x-1 opacity-0"}`}>Aarthi CRM</b></Link>
        <button className="rounded-lg p-2 hover:bg-[var(--soft)] lg:hidden" onClick={() => setMobile(false)} aria-label="Close navigation"><X size={19}/></button>
      </div>
      <nav className="sidebar-scroll flex-1 overflow-y-auto overflow-x-hidden px-4 py-5">{menuSections.map(section => <section key={section.title} className="mb-7"><h2 className="muted relative mb-3 h-4 overflow-hidden px-3 text-[11px] font-medium uppercase tracking-wide"><span className={`absolute left-3 whitespace-nowrap transition-[opacity,transform] duration-200 ${expanded ? "translate-x-0 opacity-100 delay-100" : "-translate-x-1 opacity-0"}`}>{section.title}</span><span aria-hidden="true" className={`absolute inset-x-0 text-center transition-opacity duration-200 ${expanded ? "opacity-0" : "opacity-100 delay-100"}`}>•••</span></h2><ul className="space-y-1">{section.items.map(item => <SidebarItem key={item.label} item={item} path={path} collapsed={!expanded} open={openGroups.includes(item.label)} toggle={() => toggleGroup(item.label)} go={go}/>)}</ul></section>)}
        <div className={`grid transition-[grid-template-rows,opacity] duration-200 ease-in-out ${expanded ? "grid-rows-[1fr] opacity-100 delay-100" : "grid-rows-[0fr] opacity-0"}`}><div className="overflow-hidden"><div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-white p-5 text-center dark:from-indigo-950/30 dark:to-[var(--panel)]"><h3 className="font-semibold">#1 CRM Portfolio</h3><p className="muted mt-2 text-sm">Original Next.js dashboard with connected UI pages.</p><Link href="/dashboard" className="btn btn-primary mt-4 w-full">View CRM</Link></div></div></div>
      </nav>
    </aside>
    {mobile ? <button className="fixed inset-0 z-50 bg-black/40 lg:hidden" aria-label="Close navigation overlay" onClick={() => setMobile(false)}/> : null}
    <div className={`min-h-screen transition-[padding-left] duration-300 ease-in-out motion-reduce:transition-none ${expanded ? "lg:pl-[290px]" : "lg:pl-[90px]"}`}>
      <header ref={headerRef} className="sticky top-0 z-40 flex h-[77px] items-center gap-3 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_94%,transparent)] px-4 backdrop-blur md:px-6">
        <button className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[var(--border)] hover:bg-[var(--soft)] lg:hidden" onClick={() => setMobile(true)} aria-label="Open navigation"><Menu className="muted" size={20} aria-hidden="true"/></button>
        <button className="hidden h-11 w-11 shrink-0 place-items-center rounded-xl border border-[var(--border)] hover:bg-[var(--soft)] lg:grid" onClick={() => { setCollapsed(value => !value); setHovered(false); }} aria-label="Toggle Sidebar" aria-expanded={!collapsed}><Menu className="muted" size={20} aria-hidden="true"/></button>
        <form onSubmit={search} className="relative max-w-[430px] flex-1"><Search className="muted pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" size={18} aria-hidden="true"/><input className="field !h-11 !rounded-lg !pl-11 !pr-16 text-[15px]" placeholder="Search or type command…" aria-label="Global search" autoComplete="off" name="dashboard-search" value={query} onChange={event => setQuery(event.target.value)}/><span className="muted pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-[var(--border)] px-2 py-1 text-xs sm:block">⌘&nbsp;K</span></form>
        <button className="ml-auto grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--border)] hover:bg-[var(--soft)]" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>{theme === "dark" ? <Sun className="muted" size={19} aria-hidden="true"/> : <Moon className="muted" size={19} aria-hidden="true"/>}</button>
        <div className="relative"><button className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--border)] hover:bg-[var(--soft)]" onClick={() => { setNotice(value => !value); setProfile(false); }} aria-label="Notifications"><Bell className="muted" size={19} aria-hidden="true"/><span className="notification-heartbeat absolute right-[7px] top-[5px] h-2.5 w-2.5 rounded-full border-2 border-[var(--panel)] bg-orange-400"/></button>{notice ? <div className="panel absolute right-0 mt-2 w-80 p-4 shadow-xl"><b>Notifications</b><p className="muted mt-2 text-sm">Nova Labs proposal is due tomorrow.</p><p className="muted mt-2 text-sm">Cloudly moved to Negotiation.</p></div> : null}</div>
        <div className="relative"><button className="flex min-h-11 items-center gap-3 rounded-xl px-1.5 py-1 hover:bg-[var(--soft)]" onClick={() => { setProfile(value => !value); setNotice(false); }} aria-label="Open profile menu"><Image src="/logistics/courier-avatar.png" alt="Aarthi profile" width={40} height={40} priority className="h-10 w-10 shrink-0 rounded-full object-cover"/><span className="hide-mobile whitespace-nowrap text-left text-sm font-semibold text-[#101828] dark:text-[#f2f4f7]">Aarthi</span><ChevronDown className="muted" size={16} aria-hidden="true"/></button>{profile ? <div className="panel absolute right-0 mt-2 w-56 p-2 shadow-xl"><Link className="block rounded-lg px-3 py-2 hover:bg-[var(--soft)]" href="/profile">My profile</Link><button className="w-full rounded-lg px-3 py-2 text-left hover:bg-[var(--soft)]" onClick={() => alert("Demo account — no sign out required.")}>Sign out</button></div> : null}</div>
      </header>
      <main className="mx-auto max-w-[1600px] p-4 md:px-6 md:pb-6 md:pt-[23px]">{children}</main>
    </div>
  </div>;
}

function Logo() { return <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#465fff] font-bold text-white"><span className="flex h-4 items-end gap-0.5"><i className="h-2.5 w-1 rounded bg-white"/><i className="h-4 w-1 rounded bg-white"/><i className="h-3 w-1 rounded bg-white"/></span></span>; }
function SidebarItem({ item, path, collapsed, open, toggle, go }: { item: MenuItem; path: string; collapsed: boolean; open: boolean; toggle: () => void; go: () => void }) {
  const Icon = item.icon, active = item.href === path || item.children?.some(child => child.href === path);
  const base = `flex w-full items-center overflow-hidden rounded-lg px-3 py-2.5 text-sm font-medium transition-[gap,background-color,color] duration-200 ${collapsed ? "gap-0" : "gap-3"} ${active ? "bg-[#465fff]/10 text-[#465fff]" : "text-[var(--muted)] hover:bg-[var(--soft)] hover:text-[var(--text)]"}`;
  const label = <span className={`min-w-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity,transform] duration-200 ease-out ${item.children ? "text-left" : ""} ${collapsed ? "max-w-0 -translate-x-1 opacity-0" : "max-w-[190px] flex-1 translate-x-0 opacity-100 delay-100"}`}>{item.label}</span>;
  const badge = item.badge ? <span className={`overflow-hidden transition-[max-width,opacity] duration-200 ${collapsed ? "max-w-0 opacity-0" : "max-w-14 opacity-100 delay-100"}`}><NewBadge/></span> : null;
  const chevron = item.children ? <ChevronDown size={16} className={`shrink-0 transition-[max-width,opacity,transform] duration-200 ${collapsed ? "max-w-0 opacity-0" : "max-w-4 opacity-100 delay-100"} ${open ? "rotate-180" : ""}`}/> : null;
  return <li>{item.children ? <button className={base} onClick={toggle} aria-expanded={open} title={collapsed ? item.label : undefined}><Icon size={20} className="shrink-0"/>{label}{badge}{chevron}</button> : <Link className={base} href={item.href ?? "#"} onClick={go} title={collapsed ? item.label : undefined}><Icon size={20} className="shrink-0"/>{label}{badge}</Link>}{item.children ? <div className={`grid transition-[grid-template-rows,opacity] duration-200 ease-in-out motion-reduce:transition-none ${open && !collapsed ? "grid-rows-[1fr] opacity-100 delay-100" : "grid-rows-[0fr] opacity-0"}`}><div className="overflow-hidden"><ul className="ml-9 mt-1 space-y-1">{item.children.map(child => <li key={child.href}><Link href={child.href} onClick={go} className={`flex items-center rounded-lg px-3 py-2 text-sm ${path === child.href ? "font-semibold text-[#465fff]" : "text-[var(--muted)] hover:text-[var(--text)]"}`}><span className="flex-1">{child.label}</span>{child.badge ? <NewBadge/> : null}</Link></li>)}</ul></div></div> : null}</li>;
}
function NewBadge() { return <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-600">new</span>; }
