"use client";

import { menuSections } from "@/lib/menu";
import { AppHeader } from "@/components/layout/app-header";
import { SidebarItem } from "@/components/layout/sidebar-item";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [collapsed, setCollapsed] = useState(false), [hovered, setHovered] = useState(false), [mobile, setMobile] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>(() => menuSections.flatMap(section => section.items.filter(item => item.children?.some(child => child.href === "/dashboard")).map(item => item.label)));
  useEffect(() => { const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setMobile(false); }; document.addEventListener("keydown", escape); return () => document.removeEventListener("keydown", escape); }, []);
  const expanded = mobile || !collapsed || hovered;
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
      <AppHeader collapsed={collapsed} onOpenNavigation={() => setMobile(true)} onToggleSidebar={() => { setCollapsed((value) => !value); setHovered(false); }}/>
      <main className="mx-auto max-w-[1600px] p-4 md:px-6 md:pb-6 md:pt-[23px]">{children}</main>
    </div>
  </div>;
}

function Logo() { return <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#465fff] font-bold text-white"><span className="flex h-4 items-end gap-0.5"><i className="h-2.5 w-1 rounded bg-white"/><i className="h-4 w-1 rounded bg-white"/><i className="h-3 w-1 rounded bg-white"/></span></span>; }
