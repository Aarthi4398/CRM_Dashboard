"use client";
/* eslint-disable @next/next/no-img-element -- preview uses a temporary browser data URL */

import { ImagePlus, UploadCloud, X } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => <label className="block"><span className="mb-2 block text-sm font-medium">{label}</span>{children}</label>;

export default function AddProductPage() {
  const [image, setImage] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadImage = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  };
  const save = (status: "draft" | "published") => setMessage(status === "draft" ? "Product saved as a draft." : "Product published successfully.");

  return <div className="space-y-5">
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><h1 className="text-2xl font-semibold">Add Products</h1><div className="muted flex items-center gap-2 text-sm"><Link href="/ecommerce" className="hover:text-[#465fff]">Home</Link><span>/</span><span>Add Products</span></div></div>

    <form onSubmit={(event) => { event.preventDefault(); save("published"); }}>
      <div className="grid gap-6">
        <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)]">
          <div className="border-b border-[var(--border)] px-5 py-4 sm:px-6"><h2 className="text-lg font-semibold">Products Description</h2></div>
          <div className="space-y-6 p-5 sm:p-7 lg:p-[30px]">
            <div className="grid gap-6 lg:grid-cols-2"><Field label="Product Name"><input className="control h-12 px-5" placeholder="Enter product name" required /></Field><Field label="Category"><select className="control h-12 px-5" defaultValue=""><option value="" disabled>Select a category</option><option>Laptop</option><option>Accessories</option><option>Watch</option><option>Audio</option><option>Camera</option><option>Phone</option></select></Field></div>
            <div className="grid gap-6 lg:grid-cols-2"><Field label="Brand"><select className="control h-12 px-5" defaultValue=""><option value="" disabled>Select brand</option><option>Apple</option><option>ASUS</option><option>Bose</option><option>Canon</option><option>Dell</option><option>Google</option></select></Field><Field label="Color"><select className="control h-12 px-5" defaultValue=""><option value="" disabled>Select color</option><option>Black</option><option>White</option><option>Blue</option><option>Silver</option><option>Red</option></select></Field></div>
            <div className="grid gap-6 sm:grid-cols-3"><Field label="Weight(KG)"><input className="control h-12 px-5" type="number" defaultValue="15" min="0" /></Field><Field label="Length(CM)"><input className="control h-12 px-5" type="number" defaultValue="120" min="0" /></Field><Field label="Width(CM)"><input className="control h-12 px-5" type="number" defaultValue="23" min="0" /></Field></div>
            <Field label="Description"><textarea className="control min-h-40 resize-y px-5 py-4" placeholder="Receipt Info (optional)" /></Field>
          </div>
        </section>

        <div className="space-y-6">
          <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)]"><div className="border-b border-[var(--border)] px-5 py-4"><h2 className="text-lg font-semibold">Pricing &amp; Availability</h2></div><div className="grid gap-5 p-5 sm:grid-cols-2 xl:grid-cols-1"><Field label="Price"><div className="relative"><span className="muted absolute left-4 top-1/2 -translate-y-1/2">$</span><input className="control h-12 !pl-8" type="number" placeholder="0.00" min="0" step="0.01" required /></div></Field><Field label="Discount Price"><div className="relative"><span className="muted absolute left-4 top-1/2 -translate-y-1/2">$</span><input className="control h-12 !pl-8" type="number" placeholder="0.00" min="0" step="0.01" /></div></Field><Field label="Stock Quantity"><input className="control h-12" type="number" placeholder="Enter stock quantity" min="0" required /></Field><Field label="Availability Status"><select className="control h-12"><option>In Stock</option><option>Out of Stock</option><option>Pre-order</option></select></Field></div></section>

          <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)]"><div className="border-b border-[var(--border)] px-5 py-4"><h2 className="text-lg font-semibold">Products Images</h2></div><div className="p-5">{image ? <div className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--soft)]"><img src={image} alt="Product preview" className="h-52 w-full object-contain"/><button type="button" className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white text-slate-700 shadow" onClick={() => setImage(null)} aria-label="Remove image"><X size={17}/></button></div> : <button type="button" className={`flex min-h-52 w-full flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition ${dragging ? "border-[#465fff] bg-[#465fff]/5" : "border-[var(--border)] bg-[var(--soft)]/60"}`} onClick={() => fileRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); loadImage(event.dataTransfer.files[0]); }}><span className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-[var(--panel)] text-[#465fff] shadow-sm"><UploadCloud size={23}/></span><span className="text-sm font-medium"><span className="text-[#465fff]">Click to upload</span> or drag and drop</span><span className="muted mt-2 text-xs">SVG, PNG, JPG or GIF (MAX. 800x400px)</span></button>}<input ref={fileRef} className="hidden" type="file" accept="image/*" onChange={(event) => loadImage(event.target.files?.[0])}/></div></section>
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end"><button type="button" className="btn h-11 px-6" onClick={() => save("draft")}><ImagePlus size={17}/>Draft</button><button type="submit" className="btn btn-primary h-11 px-6">Publish Product</button></div>
      {message && <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300" role="status">{message}</div>}
    </form>
  </div>;
}
