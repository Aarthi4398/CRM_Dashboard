"use client";

import { ChevronDown, Download, Plus, Search, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type Product = { id: number; name: string; category: string; brand: string; price: string; stock: "In Stock" | "Out of Stock"; created: string; image: string };

const initialProducts: Product[] = [
  { id: 1, name: "ASUS ROG Gaming Laptop", category: "Laptop", brand: "ASUS", price: "$2,199", stock: "Out of Stock", created: "01 Dec, 2027", image: "/products/laptop.png" },
  { id: 2, name: "Airpods Pro 2nd Gen", category: "Accessories", brand: "Apple", price: "$839", stock: "In Stock", created: "29 Jun, 2027", image: "/products/earbuds.png" },
  { id: 3, name: "Apple Watch Ultra", category: "Watch", brand: "Apple", price: "$1,579", stock: "Out of Stock", created: "13 Mar, 2027", image: "/products/watch.png" },
  { id: 4, name: "Bose QuietComfort Earbuds", category: "Audio", brand: "Bose", price: "$279", stock: "In Stock", created: "18 Nov, 2027", image: "/products/earbuds.png" },
  { id: 5, name: "Canon EOS R5 Camera", category: "Camera", brand: "Canon", price: "$3,899", stock: "In Stock", created: "28 Sep, 2027", image: "/products/tablet.png" },
  { id: 6, name: "Dell XPS 13 Laptop", category: "Laptop", brand: "Dell", price: "$1,299", stock: "In Stock", created: "18 Aug, 2027", image: "/products/laptop.png" },
  { id: 7, name: "Google Pixel 8 Pro", category: "Phone", brand: "Google", price: "$899", stock: "Out of Stock", created: "02 Sep, 2027", image: "/products/phone.png" },
  { id: 8, name: "Logitech MX Master 3S", category: "Accessories", brand: "Logitech", price: "$99", stock: "In Stock", created: "12 Jul, 2027", image: "/products/tablet.png" },
  { id: 9, name: "Samsung Galaxy S24", category: "Phone", brand: "Samsung", price: "$1,099", stock: "In Stock", created: "30 Jun, 2027", image: "/products/phone.png" },
];

export default function ProductsListPage() {
  const products = initialProducts;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const pageSize = 7;

  const filtered = useMemo(() => products.filter((product) => (category === "All" || product.category === category) && `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(query.toLowerCase())), [products, query, category]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const allVisibleSelected = visible.length > 0 && visible.every((product) => selected.includes(product.id));

  const toggleAll = () => setSelected((current) => allVisibleSelected ? current.filter((id) => !visible.some((product) => product.id === id)) : Array.from(new Set([...current, ...visible.map((product) => product.id)])));
  const exportProducts = () => {
    const rows = ["Product,Category,Brand,Price,Stock,Created At", ...filtered.map((product) => [product.name, product.category, product.brand, product.price, product.stock, product.created].join(","))];
    const url = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv" }));
    const link = document.createElement("a"); link.href = url; link.download = "products.csv"; link.click(); URL.revokeObjectURL(url);
  };

  return <div className="space-y-4">
    <div className="muted flex items-center justify-end gap-2 text-sm"><Link href="/ecommerce" className="hover:text-[#465fff]">Home</Link><span>/</span><span>Products</span></div>
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-[0_1px_2px_rgb(16_24_40/.04)]">
    <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div><h1 className="text-2xl font-semibold">Products List</h1><p className="muted mt-1 text-sm">Track your store&apos;s progress to boost your sales.</p></div>
      <div className="flex gap-3"><button className="btn products-list-action h-11 border border-[var(--border)] bg-[var(--panel)] px-4 !font-normal" onClick={exportProducts}><Download size={17}/>Export</button><Link href="/add-product" className="btn btn-primary products-list-action h-11 px-4"><Plus size={17}/>Add Product</Link></div>
    </div>

    <section className="overflow-hidden border-t border-[var(--border)]">
      <div className="flex flex-col gap-3 border-b border-[var(--border)] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-[320px]"><Search className="muted pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" size={18}/><input className="control h-11 !pl-12 !pr-4" placeholder="Search..." value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }}/></div>
        <div className="relative"><button className="btn products-list-action h-11 w-full border border-[var(--border)] bg-[var(--panel)] px-4 !font-normal sm:w-auto" onClick={() => setFilterOpen((value) => !value)} aria-expanded={filterOpen}><SlidersHorizontal size={17}/>Filter<ChevronDown size={16}/></button>{filterOpen && <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-[var(--border)] bg-[var(--panel)] p-2 shadow-lg">{["All", "Laptop", "Accessories", "Watch", "Audio", "Camera", "Phone"].map((item) => <button key={item} className={`block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-[var(--soft)] ${category === item ? "text-[#465fff]" : ""}`} onClick={() => { setCategory(item); setPage(1); setFilterOpen(false); }}>{item}</button>)}</div>}</div>
      </div>

      <div className="overflow-x-auto"><table className="w-full min-w-[880px] text-left text-sm font-normal"><thead className="bg-[var(--soft)] text-xs font-normal uppercase tracking-wide text-[var(--muted)]"><tr><th className="w-14 px-5 py-4"><input type="checkbox" aria-label="Select all visible products" checked={allVisibleSelected} onChange={toggleAll}/></th><th className="px-3 py-4">Products</th><th className="px-3 py-4">Category</th><th className="px-3 py-4">Brand</th><th className="px-3 py-4">Price</th><th className="px-3 py-4">Stock</th><th className="px-5 py-4">Created At</th></tr></thead><tbody>{visible.map((product) => <tr key={product.id} className="border-t border-[var(--border)] bg-white font-normal text-[#344054]"><td className="px-5 py-3.5"><input type="checkbox" aria-label={`Select ${product.name}`} checked={selected.includes(product.id)} onChange={() => setSelected((current) => current.includes(product.id) ? current.filter((id) => id !== product.id) : [...current, product.id])}/></td><td className="px-3 py-3.5"><div className="flex items-center gap-3"><span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[var(--border)] bg-white"><Image src={product.image} alt="" fill sizes="48px" className="object-contain p-1"/></span><span className="font-normal">{product.name}</span></div></td><td className="muted px-3 py-3.5 font-normal">{product.category}</td><td className="muted px-3 py-3.5 font-normal">{product.brand}</td><td className="px-3 py-3.5 font-normal">{product.price}</td><td className="px-3 py-3.5"><span className={`rounded-full px-2.5 py-1 text-xs font-normal ${product.stock === "In Stock" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>{product.stock}</span></td><td className="muted px-5 py-3.5 font-normal">{product.created}</td></tr>)}</tbody></table>{visible.length === 0 && <div className="muted p-12 text-center">No products found.</div>}</div>

      <div className="flex flex-col gap-4 border-t border-[var(--border)] px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="muted">Showing {filtered.length ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filtered.length)} of {filtered.length}</p><div className="flex items-center gap-3"><button className="btn h-9 border border-[var(--border)] bg-[var(--panel)] px-3 disabled:opacity-40" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Previous</button><span className="muted">Page <b className="text-[var(--text)]">{page}</b> of {totalPages}</span><button className="btn h-9 border border-[var(--border)] bg-[var(--panel)] px-3 disabled:opacity-40" disabled={page === totalPages} onClick={() => setPage((value) => value + 1)}>Next</button></div></div>
    </section>
    </div>
  </div>;
}
