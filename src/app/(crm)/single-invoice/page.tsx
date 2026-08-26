"use client";

import { Printer } from "lucide-react";
import { useState } from "react";

const items = [
  ["1", "Macbook pro 13”", "1", "$48", "0%", "$1,200"],
  ["2", "Apple Watch Ultra", "1", "$300", "50%", "$150"],
  ["3", "iPhone 15 Pro Max", "3", "$800", "0%", "$1,600"],
  ["4", "iPad Pro 3rd Gen", "1", "$900", "0%", "$900"],
];

export default function SingleInvoicePage() {
  const [message, setMessage] = useState("");
  return <div className="mx-auto max-w-[1180px]">
    {message && <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300" role="status">{message}</div>}
    <article className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] text-sm">
      <header className="flex items-center justify-between border-b border-[var(--border)] px-6 py-5"><h1 className="text-[21px] font-semibold">Invoice</h1><p className="text-base font-semibold">ID : #348</p></header>
      <div className="p-6 sm:p-8">
        <div className="grid gap-8 md:grid-cols-2">
          <section className="md:border-r md:border-[var(--border)] md:pr-8"><p className="muted">From</p><h2 className="mt-1 text-base font-semibold">Pimjo LLC</h2><p className="muted mt-2 leading-5">1280, Clair Street,<br/>Massachusetts, New York - 02543</p><p className="mt-4 font-medium">Issued On:</p><p className="muted mt-2">11 March, 2027</p></section>
          <section className="text-left md:pl-8 md:text-right"><p className="muted">To</p><h2 className="mt-1 text-base font-semibold">Albert Word</h2><p className="muted mt-2 leading-5">355, Shobe Lane<br/>Colorado, Fort Collins - 80543</p><p className="mt-4 font-medium">Due On:</p><p className="muted mt-2">16 March, 2027</p></section>
        </div>

        <div className="mt-9 overflow-x-auto rounded-xl border border-[var(--border)]"><table className="w-full min-w-[760px] text-left"><thead className="bg-[var(--soft)]"><tr>{["S.No.#","Products","Quantity","Unit Cost","Discount","Total"].map((heading,index)=><th key={heading} className={`px-5 py-4 font-medium ${index>1?"text-center":""} ${index===5?"text-right":""}`}>{heading}</th>)}</tr></thead><tbody>{items.map(item=><tr key={item[0]} className="border-t border-[var(--border)]"><td className="muted px-5 py-4">{item[0]}</td><td className="px-5 py-4 font-medium">{item[1]}</td><td className="muted px-5 py-4 text-center">{item[2]}</td><td className="muted px-5 py-4 text-center">{item[3]}</td><td className="muted px-5 py-4 text-center">{item[4]}</td><td className="muted px-5 py-4 text-right">{item[5]}</td></tr>)}</tbody></table></div>

        <div className="ml-auto mt-6 w-full max-w-[290px] space-y-3 text-right"><p className="muted">Sub Total amount: $3,098</p><p className="muted">Vat (10%): $312</p><p className="text-xl font-semibold">Total : $3,410</p></div>
        <div className="mt-6 border-t border-[var(--border)] pt-6"><div className="flex flex-col justify-end gap-3 sm:flex-row"><button className="btn h-12 px-5" onClick={()=>setMessage("Payment flow opened for invoice #348.")}>Proceed to payment</button><button className="btn btn-primary h-12 px-6" onClick={()=>window.print()}><Printer size={18}/>Print</button></div></div>
      </div>
    </article>
  </div>;
}
