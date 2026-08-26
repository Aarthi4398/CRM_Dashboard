"use client";

import { Eye, Info, Minus, Plus, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type Item = { id:number; name:string; price:number; quantity:number; discount:number };
const seed: Item[] = [
  {id:1,name:'Macbook pro 13”',price:1200,quantity:1,discount:0},
  {id:2,name:"Apple Watch Ultra",price:300,quantity:1,discount:50},
  {id:3,name:"iPhone 15 Pro Max",price:800,quantity:2,discount:0},
  {id:4,name:"iPad Pro 3rd Gen",price:900,quantity:1,discount:0},
];
const money = (value:number) => `$${value.toFixed(2)}`;

export default function CreateInvoicePage() {
  const [items,setItems] = useState(seed), [name,setName] = useState(""), [price,setPrice] = useState(""), [quantity,setQuantity] = useState(1), [discount,setDiscount] = useState(0), [message,setMessage] = useState("");
  const subtotal = useMemo(()=>items.reduce((sum,item)=>sum + item.price*item.quantity*(1-item.discount/100),0),[items]);
  const vat = subtotal*.1, total = subtotal+vat;
  const add = () => { const numeric=Number(price); if(!name.trim()||!numeric)return; setItems(current=>[...current,{id:Date.now(),name:name.trim(),price:numeric,quantity,discount}]);setName("");setPrice("");setQuantity(1);setDiscount(0);setMessage("Product added to the invoice."); };
  return <div className="space-y-6 text-sm">
    <div className="flex items-center justify-between"><h1 className="text-[22px] font-semibold">Create Invoice</h1><div className="muted flex items-center gap-2"><Link href="/ecommerce" className="hover:text-[#465fff]">Home</Link><span>/</span><span>Create Invoice</span></div></div>
    {message&&<div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700" role="status">{message}</div>}
    <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)]">
      <div className="border-b border-[var(--border)] px-6 py-5"><h2 className="text-[20px] font-semibold">Create Invoice</h2></div>
      <div className="grid gap-5 border-b border-[var(--border)] p-6 sm:p-8 md:grid-cols-2"><label><span className="mb-2 block font-medium">Invoice Number</span><input className="control h-11" defaultValue="WP-3434434"/></label><label><span className="mb-2 block font-medium">Customer Name</span><input className="control h-11" defaultValue="John Deniyal"/></label><label className="md:col-span-2"><span className="mb-2 block font-medium">Customer Address</span><input className="control h-11" placeholder="Enter customer address"/></label></div>

      <div className="p-6 sm:p-8">
        <div className="overflow-x-auto rounded-xl border border-[var(--border)]"><table className="w-full min-w-[820px] text-left"><thead className="bg-[var(--soft)]"><tr>{["S. No.","Products","Quantity","Unit Cost","Discount","Total",""] .map((heading,index)=><th key={index} className="px-5 py-4 font-medium">{heading}</th>)}</tr></thead><tbody>{items.map((item,index)=><tr key={item.id} className="border-t border-[var(--border)]"><td className="muted px-5 py-4">{index+1}</td><td className="px-5 py-4 font-medium">{item.name}</td><td className="muted px-5 py-4">{item.quantity}</td><td className="muted px-5 py-4">${item.price}</td><td className="muted px-5 py-4">{item.discount}%</td><td className="muted px-5 py-4">{money(item.price*item.quantity*(1-item.discount/100))}</td><td className="px-5 py-4"><button className="muted grid h-8 w-8 place-items-center rounded-md hover:bg-red-50 hover:text-red-500" onClick={()=>setItems(current=>current.filter(row=>row.id!==item.id))} aria-label={`Delete ${item.name}`}><Trash2 size={17}/></button></td></tr>)}</tbody></table></div>

        <div className="mt-7 rounded-xl bg-[var(--soft)] p-5"><div className="grid gap-4 md:grid-cols-[1fr_1fr_120px_122px_140px] md:items-end"><label><span className="mb-2 block font-medium">Product Name</span><input className="control h-11" placeholder="Enter product name" value={name} onChange={event=>setName(event.target.value)} onKeyDown={event=>{if(event.key==="Enter"){event.preventDefault();add();}}}/></label><label><span className="mb-2 block font-medium">Price</span><input className="control h-11" type="number" placeholder="Enter product price" value={price} onChange={event=>setPrice(event.target.value)} onKeyDown={event=>{if(event.key==="Enter"){event.preventDefault();add();}}}/></label><label><span className="mb-2 block font-medium">Quantity</span><span className="flex h-11 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--panel)]"><button className="grid w-10 place-items-center border-r border-[var(--border)]" onClick={()=>setQuantity(value=>Math.max(1,value-1))}><Minus size={16}/></button><span className="grid flex-1 place-items-center">{quantity}</span><button className="grid w-10 place-items-center border-l border-[var(--border)]" onClick={()=>setQuantity(value=>value+1)}><Plus size={16}/></button></span></label><label><span className="mb-2 block font-medium">Discount</span><select className="control h-11" value={discount} onChange={event=>setDiscount(Number(event.target.value))}><option value={0}>0%</option><option value={10}>10%</option><option value={25}>25%</option><option value={50}>50%</option></select></label><button className="btn btn-primary h-11" onClick={add}>Save Product</button></div><p className="muted mt-4 flex items-center gap-2"><Info size={17}/>After filling in the product details, press Enter/Return or click &apos;Save Product&apos; to add it to the list.</p></div>

        <div className="ml-auto mt-7 w-full max-w-[280px]"><h3 className="mb-5 font-semibold">Order summary</h3><div className="space-y-3"><p className="flex justify-between"><span className="muted">Sub Total</span><b>{money(subtotal)}</b></p><p className="flex justify-between"><span className="muted">Vat (10%):</span><b>{money(vat)}</b></p><p className="flex justify-between text-lg"><span>Total</span><b>{money(total)}</b></p></div></div>
      </div>
      <div className="flex flex-col justify-end gap-3 border-t border-[var(--border)] px-6 py-6 sm:flex-row"><button className="btn h-12 px-5" onClick={()=>setMessage("Invoice preview is ready.")}><Eye size={18}/>Preview Invoice</button><button className="btn btn-primary h-12 px-6" onClick={()=>setMessage("Invoice saved successfully.")}><Save size={18}/>Save Invoice</button></div>
    </section>
  </div>;
}
