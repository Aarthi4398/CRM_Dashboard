import type { MenuItem } from "@/lib/menu";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

type SidebarItemProps = {
  item: MenuItem;
  path: string;
  collapsed: boolean;
  open: boolean;
  toggle: () => void;
  go: () => void;
};

export function SidebarItem({ item, path, collapsed, open, toggle, go }: SidebarItemProps) {
  const Icon = item.icon;
  const active = item.href === path || item.children?.some((child) => child.href === path);
  const base = `flex w-full items-center overflow-hidden rounded-lg px-3 py-2.5 text-sm font-medium transition-[gap,background-color,color] duration-200 ${collapsed ? "gap-0" : "gap-3"} ${active ? "bg-[#465fff]/10 text-[#465fff]" : "text-[var(--muted)] hover:bg-[var(--soft)] hover:text-[var(--text)]"}`;
  const label = <span className={`min-w-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity,transform] duration-200 ease-out ${item.children ? "text-left" : ""} ${collapsed ? "max-w-0 -translate-x-1 opacity-0" : "max-w-[190px] flex-1 translate-x-0 opacity-100 delay-100"}`}>{item.label}</span>;
  const badge = item.badge ? <span className={`overflow-hidden transition-[max-width,opacity] duration-200 ${collapsed ? "max-w-0 opacity-0" : "max-w-14 opacity-100 delay-100"}`}><NewBadge/></span> : null;
  const chevron = item.children ? <ChevronDown size={16} className={`shrink-0 transition-[max-width,opacity,transform] duration-200 ${collapsed ? "max-w-0 opacity-0" : "max-w-4 opacity-100 delay-100"} ${open ? "rotate-180" : ""}`}/> : null;

  return <li>{item.children ? <button className={base} onClick={toggle} aria-expanded={open} title={collapsed ? item.label : undefined}><Icon size={20} className="shrink-0"/>{label}{badge}{chevron}</button> : <Link className={base} href={item.href ?? "#"} onClick={go} title={collapsed ? item.label : undefined}><Icon size={20} className="shrink-0"/>{label}{badge}</Link>}{item.children ? <div className={`grid transition-[grid-template-rows,opacity] duration-200 ease-in-out motion-reduce:transition-none ${open && !collapsed ? "grid-rows-[1fr] opacity-100 delay-100" : "grid-rows-[0fr] opacity-0"}`}><div className="overflow-hidden"><ul className="ml-9 mt-1 space-y-1">{item.children.map((child) => <li key={child.href}><Link href={child.href} onClick={go} className={`flex items-center rounded-lg px-3 py-2 text-sm ${path === child.href ? "font-semibold text-[#465fff]" : "text-[var(--muted)] hover:text-[var(--text)]"}`}><span className="flex-1">{child.label}</span>{child.badge ? <NewBadge/> : null}</Link></li>)}</ul></div></div> : null}</li>;
}

function NewBadge() {
  return <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-600">new</span>;
}
