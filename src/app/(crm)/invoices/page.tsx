"use client";

import { ArrowDownUp, Download, MoreHorizontal, Plus, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const data = [
  ["#323534","Lindsey Curtis","August 7, 2028","February 28, 2028","$999","Paid"],
  ["#323535","John Doe","July 1, 2028","January 1, 2029","$1200","Unpaid"],
  ["#323536","Jane Smith","June 15, 2028","December 15, 2028","$850","Draft"],
  ["#323537","Michael Brown","May 10, 2028","November 10, 2028","$1500","Paid"],
  ["#323538","Emily Davis","April 5, 2028","October 5, 2028","$700","Unpaid"],
  ["#323539","Chris Wilson","March 1, 2028","September 1, 2028","$1100","Paid"],
  ["#323540","Jessica Lee","February 20, 2028","August 20, 2028","$950","Draft"],
  ["#323541","David Kim","January 15, 2028","July 15, 2028","$1300","Paid"],
  ["#323542","Sarah Clark","December 10, 2027","June 10, 2028","$800","Unpaid"],
  ["#323543","Matthew Lewis","November 5, 2027","May 5, 2028","$1400","Paid"],
] as const;

export default function InvoicesPage() {
  const [tab,setTab] = useState<"All Invoices"|"Unpaid"|"Draft">("All Invoices"), [query,setQuery] = useState(""), [selected,setSelected] = useState<string[]>([]), [page,setPage] = useState(1), [filterOpen,setFilterOpen] = useState(false), [notice,setNotice] = useState("");
  const rows = useMemo(() => data.filter(row => (tab === "All Invoices" || row[5] === tab) && `${row[0]} ${row[1]}`.toLowerCase().includes(query.toLowerCase())), [tab,query]);
  const allSelected = rows.length > 0 && rows.every(row => selected.includes(row[0]));
  const exportCsv = () => { const csv = ["Invoice Number,Customer,Creation Date,Due Date,Total,Status",...rows.map(row => row.join(","))].join("\n"); const url=URL.createObjectURL(new Blob([csv],{type:"text/csv"})); const link=document.createElement("a");link.href=url;link.download="invoices.csv";link.click();URL.revokeObjectURL(url); };
  return <div className="invoices-page space-y-6 text-sm">
    <div className="flex items-center justify-between"><h1 className="text-[22px] font-semibold">Invoices</h1><div className="muted flex items-center gap-2"><Link href="/ecommerce" className="hover:text-[#465fff]">Home</Link><span>/</span><span>Invoices</span></div></div>
    {notice && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700" role="status">{notice}</div>}

    <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)]"><div className="flex items-center justify-between px-6 py-6"><h2 className="text-base font-semibold">Overview</h2><Link href="/create-invoice" className="btn btn-primary h-11 px-5"><Plus size={18}/>Create an Invoice</Link></div><div className="mx-5 mb-5 grid overflow-hidden rounded-xl border border-[var(--border)] sm:grid-cols-2 xl:grid-cols-4">{[["Overdue","$120.80"],["Due within next 30 days","0.00"],["Average time to get paid","24 days"],["Upcoming Payout","$3,450.50"]].map(([label,value],index) => <div key={label} className={`border-[var(--border)] px-5 py-5 ${index%2===1?"sm:border-l":""} ${index>1?"border-t sm:border-t-0":""} ${index>1?"xl:border-l":""}`}><p className="muted">{label}</p><p className="mt-2 text-[30px] font-medium leading-9 tracking-[-.02em]">{value}</p></div>)}</div></section>

    <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)]">
      <div className="grid gap-3 border-b border-[var(--border)] px-5 py-4 lg:grid-cols-[112px_220px_minmax(180px,280px)_auto] lg:items-center lg:justify-between"><div><h2 className="text-base font-semibold">Invoices</h2><p className="muted mt-1 leading-5">Your most recent invoices list</p></div><div className="flex h-11 rounded-lg bg-[var(--soft)] p-1">{(["All Invoices","Unpaid","Draft"] as const).map(item => <button key={item} className={`flex-1 whitespace-nowrap rounded-md px-2 text-xs font-medium ${tab===item?"bg-[var(--panel)] text-[var(--text)] shadow-sm":"muted"}`} onClick={() => setTab(item)}>{item}</button>)}</div><div className="relative w-full lg:max-w-[280px]"><Search className="muted absolute left-4 top-1/2 -translate-y-1/2" size={18}/><input className="control h-11 !pl-11" placeholder="Search..." value={query} onChange={event=>setQuery(event.target.value)}/></div><div className="relative flex gap-3"><button className="btn h-11 min-w-[100px] px-4 !font-normal" onClick={()=>setFilterOpen(value=>!value)}><SlidersHorizontal size={17}/>Filter</button><button className="btn h-11 min-w-[104px] px-4 !font-normal" onClick={exportCsv}><Download size={17}/>Export</button>{filterOpen&&<div className="absolute right-24 top-12 z-10 w-40 rounded-lg border border-[var(--border)] bg-[var(--panel)] p-2 shadow-lg">{(["All Invoices","Unpaid","Draft"] as const).map(item=><button key={item} className="block w-full rounded-md px-3 py-2 text-left text-xs hover:bg-[var(--soft)]" onClick={()=>{setTab(item);setFilterOpen(false)}}>{item}</button>)}</div>}</div></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[940px] text-left"><thead><tr className="border-b border-[var(--border)] text-xs font-medium"><th className="w-12 px-4 py-4"><input type="checkbox" aria-label="Select all invoices" checked={allSelected} onChange={()=>setSelected(allSelected?[]:rows.map(row=>row[0]))}/></th>{["Invoice Number","Customer","Creation Date","Due Date","Total","Status",""] .map((item,index)=><th key={index} className="px-3 py-4 font-medium">{item}{index>0&&index<4?<ArrowDownUp className="muted ml-1 inline" size={12}/>:null}</th>)}</tr></thead><tbody>{rows.map(row=><tr key={row[0]} className="border-b border-[var(--border)] hover:bg-[var(--soft)]/50"><td className="px-4 py-4"><input type="checkbox" aria-label={`Select ${row[0]}`} checked={selected.includes(row[0])} onChange={()=>setSelected(current=>current.includes(row[0])?current.filter(id=>id!==row[0]):[...current,row[0]])}/></td><td className="px-3 py-4 font-medium">{row[0]}</td><td className="px-3 py-4">{row[1]}</td><td className="muted px-3 py-4">{row[2]}</td><td className="muted px-3 py-4">{row[3]}</td><td className="px-3 py-4">{row[4]}</td><td className="px-3 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${row[5]==="Paid"?"bg-emerald-50 text-emerald-600":row[5]==="Unpaid"?"bg-red-50 text-red-600":"bg-slate-100 text-slate-600"}`}>{row[5]}</span></td><td className="px-4 py-4"><button className="muted grid h-8 w-8 place-items-center rounded-md hover:bg-[var(--soft)]" aria-label={`Actions for ${row[0]}`} onClick={()=>setNotice(`Invoice actions opened for ${row[0]}`)}><MoreHorizontal size={18}/></button></td></tr>)}</tbody></table></div>
      <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><p className="muted">Showing 1 to {rows.length} of 25</p><div className="flex items-center gap-3"><button className="btn h-9 px-3 disabled:opacity-40" disabled={page===1} onClick={()=>setPage(value=>value-1)}>Previous</button><span className="muted">Page <b className="text-[var(--text)]">{page}</b> of 3</span><button className="btn h-9 px-3 disabled:opacity-40" disabled={page===3} onClick={()=>setPage(value=>value+1)}>Next</button></div></div>
    </section>
  </div>;
}
