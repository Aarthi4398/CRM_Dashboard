"use client";

import { Download, Eye, MoreVertical, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const invoices = [
  ["Invoice #012 - May 2024", "May 01, 2024", "$120.00", "Starter Plan", "Paid"],
  ["Invoice #013 - June 2024", "June 01, 2024", "$120.00", "Starter Plan", "Paid"],
  ["Invoice #014 - July 2024", "July 01, 2024", "$120.00", "Starter Plan", "Unpaid"],
  ["Invoice #015 - August 2024", "August 01, 2024", "$250.00", "Pro Plan", "Paid"],
  ["Invoice #016 - September 2024", "September 01, 2024", "$250.00", "Pro Plan", "Paid"],
];

export default function BillingPage() {
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState(false);
  const [defaultPayment, setDefaultPayment] = useState("mastercard");
  const [payments, setPayments] = useState(["mastercard", "visa", "paypal"]);
  const [page, setPage] = useState(1);
  const download = (name: string) => { const url = URL.createObjectURL(new Blob([`Aarthi CRM\n${name}`], { type: "text/plain" })); const link = document.createElement("a"); link.href = url; link.download = `${name.replace(/\s+/g, "-").toLowerCase()}.txt`; link.click(); URL.revokeObjectURL(url); };

  return <div className="billing-page grid gap-6 xl:grid-cols-3">
    <div className="flex items-center justify-between xl:col-span-3"><h1 className="text-2xl font-semibold">Billing</h1><div className="muted flex items-center gap-2 text-sm"><Link href="/ecommerce" className="hover:text-[#465fff]">Home</Link><span>/</span><span>Billing</span></div></div>

    {notice && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 xl:col-span-3" role="status">{notice}</div>}

    <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] xl:col-span-2"><div className="border-b border-[var(--border)] px-5 py-4 sm:px-6"><h2 className="text-lg font-semibold">Plan Details</h2></div><div className="grid lg:grid-cols-[1.05fr_.95fr]">
      <div className="p-5 sm:p-6">
        <div className="overflow-hidden rounded-xl border border-[var(--border)]">
          <div className="divide-y divide-[var(--border)] px-5">{[["Current Plan","Professional"],["Monthly Limits","25,000 Orders"],["Cost","$199.00/month"],["Renewal Date","Mar 22, 2028"]].map(([label,value]) => <div key={label} className="py-4"><p className="muted text-sm">{label}</p><p className="mt-1 font-semibold">{value}</p></div>)}</div>
          <div className="border-t border-[var(--border)] p-5"><div className="mb-4 flex flex-wrap justify-between gap-1 text-sm"><span className="font-medium">Orders</span><span className="muted">15,299 of 25,500 orders used</span></div><div className="h-2.5 overflow-hidden rounded-full bg-[var(--soft)]"><div className="h-full w-[60%] rounded-full bg-[#465fff]"/></div></div>
        </div>
      </div>
      <div className="flex flex-col border-t border-[var(--border)] p-5 sm:p-6 lg:border-t-0"><h3 className="font-semibold">Plan Benefits</h3><ul className="mt-5 space-y-4">{["25,500 orders per month","Unlimited integrations","Exclusive AutoFile discount","10 GB Storage","Custom Templates","Advanced Marketing tool"].map((item,index) => <li key={item} className={`flex items-center gap-3 text-sm ${index > 3 ? "text-[var(--muted)] line-through" : ""}`}><span className="w-4 text-center">{index > 3 ? "×" : "✓"}</span>{item}</li>)}</ul><div className="mt-auto flex flex-wrap gap-3 pt-8"><button className="btn h-11 flex-1 px-4" onClick={() => setNotice("Subscription cancellation request opened.")}>Cancel Subscription</button><button className="btn btn-primary h-11 flex-1 px-4" onClick={() => setNotice("Your account is ready to upgrade to Pro.")}>Upgrade to Pro</button></div></div>
    </div></section>

    <div className="contents">
      <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)]">
        <div className="border-b border-[var(--border)] px-5 py-4"><h2 className="text-lg font-semibold">Billing Info</h2></div>
        <div className="p-5">
          <div className="divide-y divide-[var(--border)]">{[["Name","Mushafrof Chowdhury"],["Street","800 E Elcamino Real, suite #400"],["City/State","Mountain View, CA, 94040"],["Country","United States of America"],["Zip/Postal code","19029"],["Town/City","New York"],["VAT Number","DE4920348"]].map(([label,value]) => <label key={label} className="grid grid-cols-[88px_minmax(0,1fr)] items-start gap-3 py-3 first:pt-0"><span className="muted text-xs leading-5">{label}</span>{editing ? <input className="control h-9 min-w-0 !px-2 !py-1" defaultValue={value}/> : <span className="min-w-0 break-words text-sm font-medium leading-5">{value}</span>}</label>)}</div>
          <button className="btn mt-4 h-11 w-full text-sm" onClick={() => setEditing(value => !value)}>{editing ? "Save Changes" : "✎  Update Billing Address"}</button>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] xl:col-span-3"><div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4"><h2 className="text-lg font-semibold">Payment Methods</h2><button className="btn h-9 px-3 text-sm" onClick={() => setNotice("Add New Card form opened.")}><Plus size={16}/>Add New Card</button></div><div className="grid gap-5 p-5 md:grid-cols-2 xl:grid-cols-3">{payments.includes("mastercard") && <Payment id="mastercard" title="Mastercard" detail="**** **** **** 9029" expiry="Expiry 01/24" isDefault={defaultPayment === "mastercard"} setDefault={setDefaultPayment} remove={() => setPayments(items => items.filter(item => item !== "mastercard"))}/>} {payments.includes("visa") && <Payment id="visa" title="Visa" detail="**** **** **** 4328" expiry="Expiry 01/25" isDefault={defaultPayment === "visa"} setDefault={setDefaultPayment} remove={() => setPayments(items => items.filter(item => item !== "visa"))}/>} {payments.includes("paypal") && <Payment id="paypal" title="Paypal" detail="name@example.com" expiry="" isDefault={defaultPayment === "paypal"} setDefault={setDefaultPayment} remove={() => setPayments(items => items.filter(item => item !== "paypal"))}/>}</div></section>
    </div>

    <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)]"><div className="flex flex-col gap-3 border-b border-[var(--border)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-semibold">Invoices</h2><p className="muted mt-1 text-sm">Access all your previous invoices.</p></div><button className="btn h-10 px-4" onClick={() => download("all-invoices")}><Download size={16}/>Download All</button></div><div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm"><thead className="bg-[var(--soft)] text-xs uppercase tracking-wide text-[var(--muted)]"><tr>{["Name","Date","Price","Plan","Status","Action"].map(item => <th key={item} className="px-5 py-4 font-medium">{item}</th>)}</tr></thead><tbody>{invoices.map(row => <tr key={row[0]} className="border-t border-[var(--border)]"><td className="px-5 py-4 font-medium">{row[0]}</td><td className="muted px-5 py-4">{row[1]}</td><td className="px-5 py-4">{row[2]}</td><td className="muted px-5 py-4">{row[3]}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${row[4] === "Paid" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40" : "bg-orange-50 text-orange-600 dark:bg-orange-950/40"}`}>{row[4]}</span></td><td className="px-5 py-4"><div className="flex gap-2"><button className="muted grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)] hover:bg-[var(--soft)] hover:text-[#465fff]" onClick={() => download(row[0])} aria-label={`Download ${row[0]}`}><Download size={16}/></button><button className="muted grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)] hover:bg-[var(--soft)] hover:text-[#465fff]" onClick={() => setNotice(`Viewing ${row[0]}`)} aria-label={`View ${row[0]}`}><Eye size={16}/></button></div></td></tr>)}</tbody></table></div><div className="flex flex-col gap-4 border-t border-[var(--border)] px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="muted">Showing 1 to 5 of 12 invoices</p><div className="flex items-center gap-3"><button className="btn h-9 px-3" disabled={page === 1} onClick={() => setPage(value => Math.max(1,value-1))}>Previous</button><span className="muted">Page <b className="text-[var(--text)]">{page}</b> of 3</span><button className="btn h-9 px-3" disabled={page === 3} onClick={() => setPage(value => Math.min(3,value+1))}>Next</button></div></div></section>
  </div>;
}

function Payment({id,title,detail,expiry,isDefault,setDefault,remove}:{id:string;title:string;detail:string;expiry:string;isDefault:boolean;setDefault:(id:string)=>void;remove:()=>void}) { return <div className="grid min-h-[190px] grid-cols-[52px_1fr] content-start gap-x-4 gap-y-4 rounded-xl border border-[var(--border)] p-4"><PaymentIcon id={id}/><div className="min-w-0"><div className="flex items-center gap-2"><h3 className="font-semibold">{title}</h3>{isDefault && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">✓ Default</span>}</div><p className="muted mt-2 text-sm">{detail}</p></div>{expiry && <p className="muted col-start-2 text-sm">{expiry}</p>}<div className="col-start-2 flex flex-wrap gap-2">{!isDefault && <button className="btn h-8 px-3 text-xs" onClick={() => setDefault(id)}>Make Default</button>}<button className="btn h-8 px-3 text-xs">Edit</button><button className="btn h-8 px-3 text-xs" onClick={remove}>Delete</button><button className="muted grid h-8 w-8 place-items-center sm:hidden" aria-label={`${title} options`}><MoreVertical size={17}/></button></div></div>; }

function PaymentIcon({id}:{id:string}) { if (id === "mastercard") return <span className="relative grid h-12 w-12 place-items-center rounded-lg border border-[var(--border)] bg-white"><i className="absolute left-2.5 h-5 w-5 rounded-full bg-[#eb001b]"/><i className="absolute right-2.5 h-5 w-5 rounded-full bg-[#f79e1b] opacity-90"/></span>; if (id === "visa") return <span className="grid h-12 w-12 place-items-center rounded-lg border border-[var(--border)] bg-white text-sm font-black italic text-[#1434cb]">VISA</span>; return <span className="grid h-12 w-12 place-items-center rounded-lg border border-[var(--border)] bg-white text-2xl font-black italic text-[#1473e6]">P</span>; }
