"use client";

import { BriefcaseBusiness, Check, Sparkles, UserRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const features = {
  Starter:["5 website","500 MB Storage","Unlimited Sub-Domain","3 Custom Domain","Free SSL Certificate","Unlimited Traffic"],
  Medium:["10 website","1 GB Storage","Unlimited Sub-Domain","5 Custom Domain","Free SSL Certificate","Unlimited Traffic"],
  Large:["15 website","10 GB Storage","Unlimited Sub-Domain","10 Custom Domain","Free SSL Certificate","Unlimited Traffic"],
};
const lifetime = [
  {name:"Personal",price:"$59.00",description:"For solo designers & freelancers",icon:UserRound,features:features.Starter},
  {name:"Professional",price:"$199.00",description:"For working on commercial projects",icon:BriefcaseBusiness,features:features.Medium,featured:true},
  {name:"Enterprise",price:"$599.00",description:"For teams larger than 5 members",icon:Sparkles,features:features.Large},
];

export default function PricingTablesPage(){
  const [annual,setAnnual]=useState(false),[message,setMessage]=useState("");
  const plans=[
    {name:"Starter",monthly:5,old:12,description:"For solo designers & freelancers",features:features.Starter},
    {name:"Medium",monthly:10.99,old:30,description:"For working on commercial projects",features:features.Medium,featured:true},
    {name:"Large",monthly:15,old:59,description:"For teams larger than 5 members",features:features.Large},
  ];
  return <div className="pricing-tables-page space-y-6 text-sm">
    <div className="flex items-center justify-between"><h1 className="text-[22px] font-semibold">Pricing Tables</h1><div className="muted flex items-center gap-2"><Link href="/dashboard" className="hover:text-[#465fff]">Home</Link><span>/</span><span>Pricing Tables</span></div></div>
    {message&&<div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700" role="status">{message}</div>}

    <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)]"><div className="border-b border-[var(--border)] px-6 py-5"><h2 className="text-base font-semibold">Pricing Table 1</h2></div><div className="p-6 sm:p-8"><h3 className="mx-auto max-w-xl text-center text-[30px] font-semibold leading-[1.25] tracking-[-.02em]">Flexible Plans Tailored to Fit<br className="hidden sm:block"/> Your Unique Needs!</h3><div className="mx-auto mt-7 flex h-13 w-[246px] rounded-full bg-[#eaecf0] p-1"><button className={`flex-1 rounded-full font-medium ${!annual?"bg-white shadow-sm":"muted"}`} onClick={()=>setAnnual(false)}>Monthly</button><button className={`flex-1 rounded-full font-medium ${annual?"bg-white shadow-sm":"muted"}`} onClick={()=>setAnnual(true)}>Annually</button></div><div className="mt-10 grid gap-6 lg:grid-cols-3">{plans.map(plan=>{const price=annual?(plan.monthly*10).toFixed(2):plan.monthly.toFixed(2);return <article key={plan.name} className={`flex min-h-[500px] flex-col rounded-2xl border p-6 ${plan.featured?"border-[#1d2939] bg-[#1d2939] text-white":"border-[var(--border)]"}`}><h4 className="text-xl font-semibold">{plan.name}</h4><div className="mt-4 flex flex-wrap items-end gap-2"><span className="text-[38px] font-semibold leading-none">${price}</span><span className={plan.featured?"text-slate-300":"muted"}>/{annual?"year":"month"}</span><span className={`ml-auto text-lg line-through ${plan.featured?"text-slate-400":"text-slate-400"}`}>${annual?(plan.old*10).toFixed(2):plan.old.toFixed(2)}</span></div><p className={`mt-3 ${plan.featured?"text-slate-300":"muted"}`}>{plan.description}</p><div className={`my-6 h-px ${plan.featured?"bg-slate-600":"bg-[var(--border)]"}`}/><ul className="space-y-4">{plan.features.map(item=><li key={item} className={`flex items-center gap-3 ${plan.featured?"text-slate-200":"muted"}`}><Check className="text-emerald-500" size={18}/>{item}</li>)}</ul><button className={`mt-auto h-12 rounded-lg font-semibold ${plan.featured?"bg-[#465fff] text-white":"bg-[#1d2939] text-white"}`} onClick={()=>setMessage(`${plan.name} plan selected.`)}>Choose Starter</button></article>})}</div></div></section>

    <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)]"><div className="border-b border-[var(--border)] px-6 py-5"><h2 className="text-base font-semibold">Pricing Table 2</h2></div><div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-3">{lifetime.map(plan=><article key={plan.name} className={`flex min-h-[480px] flex-col rounded-2xl border p-6 ${plan.featured?"border-[#465fff] ring-1 ring-[#465fff]":"border-[var(--border)]"}`}><div className="flex items-start justify-between"><h3 className="text-xl font-semibold">{plan.name}</h3><span className="grid h-14 w-14 place-items-center rounded-xl bg-[#465fff]/10 text-[#465fff]"><plan.icon size={25}/></span></div><div className="mt-5"><span className="text-[38px] font-semibold leading-none">{plan.price}</span><span className="muted">/ Lifetime</span></div><p className="muted mt-3">{plan.description}</p><div className="my-6 h-px bg-[var(--border)]"/><ul className="space-y-4">{plan.features.map(item=><li key={item} className="muted flex items-center gap-3"><Check className="text-emerald-500" size={18}/>{item}</li>)}</ul><button className={`mt-auto h-12 rounded-lg font-semibold ${plan.featured?"bg-[#465fff] text-white":"border border-[var(--border)]"}`} onClick={()=>setMessage(`${plan.name} lifetime plan selected.`)}>Choose {plan.name}</button></article>)}</div></section>
  </div>;
}
