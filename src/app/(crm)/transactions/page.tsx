"use client";

import { ArrowDownUp, ArrowLeft, ArrowRight, Download, MoreHorizontal, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type Transaction = {id:string;customer:string;email:string;amount:string;date:string;status:"Completed"|"Pending"|"Failed"};
const transactions:Transaction[] = [
  {id:"#323537",customer:"Abram Schleifer",email:"abram@example.com",amount:"$43,999",date:"25 Apr, 2027",status:"Completed"},
  {id:"#323544",customer:"Ava Smith",email:"ava.smith@example.com",amount:"$1,200",date:"01 Dec, 2027",status:"Pending"},
  {id:"#323538",customer:"Carla George",email:"carla65@example.com",amount:"$919",date:"11 May, 2027",status:"Completed"},
  {id:"#323543",customer:"Ekstrom Bothman",email:"ekstrom@example.com",amount:"$679",date:"15 Nov, 2027",status:"Completed"},
  {id:"#323552",customer:"Ella Davis",email:"ella.davis@example.com",amount:"$210",date:"01 Mar, 2028",status:"Failed"},
  {id:"#323539",customer:"Emery Culhane",email:"emery09@example.com",amount:"$839",date:"29 Jun, 2027",status:"Completed"},
  {id:"#323547",customer:"Ethan Patel",email:"ethan.patel@example.com",amount:"$2,100",date:"05 Jan, 2028",status:"Pending"},
  {id:"#323553",customer:"James Martinez",email:"james.martinez@example.com",amount:"$3,300",date:"15 Mar, 2028",status:"Completed"},
  {id:"#323535",customer:"Kaiya George",email:"kaiya@example.com",amount:"$1,579",date:"13 Mar, 2027",status:"Failed"},
  {id:"#323549",customer:"Liam Brown",email:"liam.brown@example.com",amount:"$450",date:"28 Jan, 2028",status:"Failed"},
];

export default function TransactionsPage(){
  const [query,setQuery]=useState(""),[range,setRange]=useState("Last 7 Days"),[selected,setSelected]=useState<string[]>([]),[page,setPage]=useState(1),[notice,setNotice]=useState("");
  const rows=useMemo(()=>transactions.filter(item=>`${item.id} ${item.customer} ${item.email}`.toLowerCase().includes(query.toLowerCase())),[query]);
  const allSelected=rows.length>0&&rows.every(row=>selected.includes(row.id));
  const exportCsv=()=>{const csv=["Order ID,Customer,Email,Total Amount,Due Date,Status",...rows.map(row=>[row.id,row.customer,row.email,row.amount,row.date,row.status].join(","))].join("\n");const url=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));const link=document.createElement("a");link.href=url;link.download="transactions.csv";link.click();URL.revokeObjectURL(url)};
  return <div className="space-y-6 text-sm">
    <div className="flex items-center justify-between"><h1 className="text-[22px] font-semibold">Transactions</h1><div className="muted flex items-center gap-2"><Link href="/ecommerce" className="hover:text-[#465fff]">Home</Link><span>/</span><span>Transactions</span></div></div>
    {notice&&<div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700" role="status">{notice}</div>}
    <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)]">
      <div className="grid gap-4 border-b border-[var(--border)] px-5 py-5 lg:grid-cols-[minmax(180px,1fr)_298px_160px_142px] lg:items-center"><div><h2 className="text-[18px] font-semibold">Transactions</h2><p className="muted mt-1 whitespace-nowrap">Your most recent transactions list</p></div><div className="relative"><Search className="muted absolute left-4 top-1/2 -translate-y-1/2" size={18}/><input className="control h-11 !pl-11" placeholder="Search..." value={query} onChange={event=>setQuery(event.target.value)}/></div><select className="control h-11" value={range} onChange={event=>setRange(event.target.value)}><option>Last 7 Days</option><option>Last 30 Days</option><option>Last 3 Months</option><option>This Year</option></select><button className="btn h-11 px-4" onClick={exportCsv}><Download size={17}/>Export CSV</button></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[940px] text-left"><thead><tr className="border-b border-[var(--border)] text-xs"><th className="w-12 px-4 py-4"><input type="checkbox" aria-label="Select all transactions" checked={allSelected} onChange={()=>setSelected(allSelected?[]:rows.map(row=>row.id))}/></th>{["Order ID","Customer","Email","Total Amount","Due Date","Status",""] .map((heading,index)=><th key={index} className="px-3 py-4 font-medium">{heading}{[1,2,3].includes(index)?<ArrowDownUp className="muted ml-1 inline" size={12}/>:null}</th>)}</tr></thead><tbody>{rows.map(row=><tr key={row.id} className="border-b border-[var(--border)] hover:bg-[var(--soft)]/50"><td className="px-4 py-4"><input type="checkbox" aria-label={`Select ${row.id}`} checked={selected.includes(row.id)} onChange={()=>setSelected(current=>current.includes(row.id)?current.filter(id=>id!==row.id):[...current,row.id])}/></td><td className="px-3 py-4 font-medium">{row.id}</td><td className="px-3 py-4 font-medium">{row.customer}</td><td className="muted px-3 py-4">{row.email}</td><td className="px-3 py-4">{row.amount}</td><td className="px-3 py-4">{row.date}</td><td className="px-3 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${row.status==="Completed"?"bg-emerald-50 text-emerald-600":row.status==="Pending"?"bg-orange-50 text-orange-600":"bg-red-50 text-red-600"}`}>{row.status}</span></td><td className="px-4 py-4"><button className="muted grid h-8 w-8 place-items-center rounded-md hover:bg-[var(--soft)]" onClick={()=>setNotice(`Transaction options opened for ${row.id}`)} aria-label={`Actions for ${row.id}`}><MoreHorizontal size={18}/></button></td></tr>)}</tbody></table></div>
      <div className="flex items-center justify-between px-5 py-4"><p className="muted">Showing 1 to 10 of 20</p><div className="flex items-center gap-2"><button className="btn h-10 w-10 !p-0 disabled:opacity-40" disabled={page===1} onClick={()=>setPage(1)} aria-label="Previous page"><ArrowLeft size={17}/></button><button className={`h-10 w-10 rounded-lg ${page===1?"bg-[#465fff] text-white":""}`} onClick={()=>setPage(1)}>1</button><button className={`h-10 w-10 rounded-lg ${page===2?"bg-[#465fff] text-white":""}`} onClick={()=>setPage(2)}>2</button><button className="btn h-10 w-10 !p-0 disabled:opacity-40" disabled={page===2} onClick={()=>setPage(2)} aria-label="Next page"><ArrowRight size={17}/></button></div></div>
    </section>
  </div>;
}
