"use client";

import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Clipboard, Clock3, CloudUpload, CreditCard, Eye, EyeOff, Mail, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";

const options = ["Option 1", "Option 2", "Option 3", "Option 4"];

export default function FormElementsPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [selected, setSelected] = useState(["Option 1", "Option 3"]);
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState("No file chosen");
  const [dropName, setDropName] = useState("");
  const [defaultChecked, setDefaultChecked] = useState(false);
  const [checked, setChecked] = useState(true);
  const [radio, setRadio] = useState("Selected");
  const [toggles, setToggles] = useState([false, false, true, true]);
  const fileRef = useRef<HTMLInputElement>(null);

  const copy = async () => {
    await navigator.clipboard?.writeText("www.tailadmin.com");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };
  const updateToggle = (index: number, value: boolean) => setToggles((items) => items.map((item, i) => i === index ? value : item));

  return <div className="form-elements-page space-y-6">
    <header className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-xl font-semibold leading-6">Form Elements</h1><nav className="muted flex items-center gap-2 text-sm" aria-label="Breadcrumb"><span>Home</span><ChevronRight size={15}/><span className="text-[var(--text)]">Form Elements</span></nav></header>
    <div className="grid items-start gap-6 xl:grid-cols-2">
      <div className="space-y-6">
        <FormCard title="Default Inputs">
          <Field label="Input"><input className="control" name="default-input"/></Field>
          <Field label="Input with Placeholder"><input className="control" name="email-placeholder" type="email" autoComplete="email" placeholder="info@gmail.com"/></Field>
          <Field label="Select Input"><Select name="default-select"/></Field>
          <Field label="Password Input"><div className="relative"><input className="control pr-12" name="password" autoComplete="current-password" type={showPassword ? "text" : "password"} placeholder="Enter your password"/><button type="button" className="muted absolute right-4 top-1/2 -translate-y-1/2 rounded p-1 hover:text-[var(--text)]" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <Eye size={19}/> : <EyeOff size={19}/>}</button></div></Field>
          <Field label="Date Picker Input"><PremiumDatePicker/></Field>
          <Field label="Time Picker Input"><IconControl icon={<Clock3 size={19}/>}><input className="h-full min-w-0 flex-1 bg-transparent outline-none" name="time" type="time" aria-label="Select a time"/></IconControl></Field>
          <Field label="Input with Payment"><IconControl icon={<CreditCard size={19}/>}><input className="h-full min-w-0 flex-1 bg-transparent outline-none" name="card-number" inputMode="numeric" autoComplete="cc-number" placeholder="Card number"/></IconControl></Field>
        </FormCard>
        <FormCard title="Select Inputs" bodyClassName="!space-y-4 !py-[14px]">
          <Field label="Select Input"><Select name="select-input" placeholder="Select Option"/></Field>
          <Field label="Multiple Select Options"><div className="control !flex min-h-11 items-center gap-2 py-2">{selected.map((item) => <span className="flex shrink-0 items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-xs text-[#465fff] dark:bg-indigo-500/10" key={item}>{item}<button type="button" onClick={() => setSelected((values) => values.filter((value) => value !== item))} aria-label={`Remove ${item}`}><X size={13}/></button></span>)}<div className="relative ml-auto h-7 w-7 shrink-0"><select className="absolute inset-0 h-full w-full cursor-pointer opacity-0" name="multi-select" aria-label="Add select option" value="" onChange={(event) => { if (event.target.value && !selected.includes(event.target.value)) setSelected((values) => [...values, event.target.value]); }}><option value="">Select option</option>{options.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown className="muted pointer-events-none absolute inset-1" size={18}/></div></div><p className="muted mt-2 text-sm">Selected Values: {selected.join(", ")}</p></Field>
        </FormCard>
        <FormCard title="Textarea input field" bodyClassName="!space-y-7">
          <Field label="Description"><textarea className="control h-[142px] resize-y" name="description" placeholder="Description"/></Field>
          <Field label="Disabled"><textarea className="control h-[142px] cursor-not-allowed resize-none bg-[var(--soft)]" name="disabled-description" value="Description" disabled readOnly/></Field>
          <Field label="Description"><textarea className="control h-[142px] resize-y !border-red-400" name="error-description" defaultValue="Description" aria-invalid="true" aria-describedby="description-error"/><p id="description-error" className="mt-2 text-sm text-red-500">Please enter a valid message.</p></Field>
        </FormCard>
        <FormCard title="Input States">
          <Field label="Email"><input className="control !border-emerald-400" name="success-email" type="email" defaultValue="info@gmail.com"/><p className="mt-2 text-sm text-emerald-600">This is a success message.</p></Field>
          <Field label="Email"><input className="control !border-red-400" name="error-email" type="email" defaultValue="info@gmail.com" aria-invalid="true" aria-describedby="email-error"/><p id="email-error" className="mt-2 text-sm text-red-500">Please enter a valid email address.</p></Field>
          <Field label="Email"><input className="control cursor-not-allowed bg-[var(--soft)]" name="disabled-email" type="email" value="info@gmail.com" disabled readOnly/></Field>
        </FormCard>
      </div>
      <div className="space-y-6">
        <FormCard title="Input Group">
          <Field label="Email"><IconControl icon={<Mail size={18}/>}><input className="h-full min-w-0 flex-1 bg-transparent outline-none" name="group-email" type="email" autoComplete="email" placeholder="info@gmail.com"/></IconControl></Field>
          <Field label="Phone"><InputAddon side="left" addon="US"><input className="group-input" name="phone-us" type="tel" autoComplete="tel" placeholder="+1"/></InputAddon></Field>
          <Field label="Website"><InputAddon side="right" addon="US"><input className="group-input" name="phone-country" type="tel" autoComplete="tel" placeholder="+1"/></InputAddon></Field>
          <Field label="URL"><InputAddon side="left" addon="http://"><input className="group-input" name="url" type="url" placeholder="www.tailadmin.com"/></InputAddon></Field>
          <Field label="Website"><div className="control !flex items-center !p-0"><input className="min-w-0 flex-1 bg-transparent px-4 outline-none" name="website" value="www.tailadmin.com" readOnly/><button type="button" className="flex h-11 shrink-0 items-center gap-2 border-l border-[var(--border)] px-4 font-normal hover:bg-[var(--soft)]" onClick={copy}><Clipboard size={17}/>{copied ? "Copied" : "Copy"}</button></div></Field>
        </FormCard>
        <FormCard title="File Input"><Field label="Upload file"><button type="button" className="control !flex items-center !p-0 text-left" onClick={() => fileRef.current?.click()}><span className="h-11 shrink-0 border-r border-[var(--border)] px-4 leading-[44px]">Choose File</span><span className="muted truncate px-4">{fileName}</span></button><input ref={fileRef} className="sr-only" name="file-upload" type="file" onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "No file chosen")}/></Field></FormCard>
        <FormCard title="Checkbox"><div className="grid gap-5 sm:grid-cols-3"><CheckControl label="Default" checked={defaultChecked} onChange={setDefaultChecked}/><CheckControl label="Checked" checked={checked} onChange={setChecked}/><CheckControl label="Disabled" checked={false} disabled/></div></FormCard>
        <FormCard title="Radio Buttons"><div className="grid gap-5 sm:grid-cols-3">{["Default", "Selected", "Disabled"].map((item) => <label className={`flex items-center gap-3 text-sm ${item === "Disabled" ? "muted" : ""}`} key={item}><input className="h-5 w-5 accent-[#465fff]" name="radio-example" type="radio" disabled={item === "Disabled"} checked={radio === item} onChange={() => setRadio(item)}/>{item}</label>)}</div></FormCard>
        <FormCard title="Toggle switch input" bodyClassName="!py-3"><div className="grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2"><Toggle label="Default" checked={toggles[0]} onChange={(value) => updateToggle(0, value)}/><Toggle label="Default" checked={toggles[1]} onChange={(value) => updateToggle(1, value)} square/><Toggle label="Checked" checked={toggles[2]} onChange={(value) => updateToggle(2, value)}/><Toggle label="Checked" checked={toggles[3]} onChange={(value) => updateToggle(3, value)} square/><Toggle label="Disabled" checked={false} disabled/><Toggle label="Disabled" checked={false} disabled square/></div></FormCard>
        <FormCard title="Dropzone"><div className={`grid min-h-64 place-items-center rounded-xl border border-dashed p-8 text-center transition-colors ${dropName ? "border-[#465fff] bg-indigo-50/40 dark:bg-indigo-500/5" : "border-[var(--border)] bg-[var(--soft)]"}`} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); setDropName(event.dataTransfer.files[0]?.name ?? ""); }}><div><span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--panel)] text-[#465fff]"><CloudUpload size={26}/></span><h3 className="mt-4 font-semibold">Drag &amp; Drop Files Here</h3><p className="muted mx-auto mt-2 max-w-sm text-sm">{dropName || "Drag and drop your PNG, JPG, WebP, SVG images here or browse"}</p><label className="mt-4 inline-block cursor-pointer text-sm font-medium text-[#465fff] underline underline-offset-4">Browse File<input className="sr-only" name="dropzone-file" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={(event) => setDropName(event.target.files?.[0]?.name ?? "")}/></label></div></div></FormCard>
      </div>
    </div>
  </div>;
}

function FormCard({ title, children, bodyClassName = "" }: { title: string; children: React.ReactNode; bodyClassName?: string }) { return <section className="panel overflow-hidden"><header className="border-b border-[var(--border)] px-5 py-4 sm:px-6 sm:py-5"><h2 className="text-base font-semibold">{title}</h2></header><div className={`space-y-[21px] p-5 sm:p-6 ${bodyClassName}`}>{children}</div></section>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div><span className="mb-2 block text-sm font-medium">{label}</span>{children}</div>; }
function PremiumDatePicker() {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(viewDate);
  const valueLabel = selectedDate ? new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" }).format(selectedDate) : "Select a date";
  const days = useMemo(() => {
    const year = viewDate.getFullYear(), month = viewDate.getMonth();
    const leading = new Date(year, month, 1).getDay();
    const total = new Date(year, month + 1, 0).getDate();
    return [...Array(leading).fill(null), ...Array.from({ length: total }, (_, index) => new Date(year, month, index + 1))];
  }, [viewDate]);
  const sameDay = (a: Date | null, b: Date) => Boolean(a && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate());
  return <div className="relative">
    <input type="hidden" name="date" value={selectedDate ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}` : ""}/>
    <button type="button" className="control !flex h-11 items-center justify-between py-0 text-left" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen((value) => !value)}><span className={`truncate ${selectedDate ? "" : "muted"}`}>{valueLabel}</span><CalendarDays className="muted shrink-0" size={19}/></button>
    {open ? <div className="panel absolute left-0 z-40 mt-2 w-[min(20rem,calc(100vw-3rem))] p-4 shadow-[0_12px_32px_rgb(16_24_40/.16)]" role="dialog" aria-label="Choose a date">
      <div className="mb-4 flex items-center justify-between"><button type="button" className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)] hover:bg-[var(--soft)]" aria-label="Previous month" onClick={() => setViewDate((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1))}><ChevronLeft size={17}/></button><p className="text-sm font-semibold">{monthLabel}</p><button type="button" className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)] hover:bg-[var(--soft)]" aria-label="Next month" onClick={() => setViewDate((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1))}><ChevronRight size={17}/></button></div>
      <div className="grid grid-cols-7 text-center text-xs font-medium text-[var(--muted)]">{["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => <span className="py-2" key={day}>{day}</span>)}</div>
      <div className="grid grid-cols-7 gap-1">{days.map((date, index) => date ? <button type="button" className={`grid aspect-square place-items-center rounded-lg text-sm hover:bg-indigo-50 hover:text-[#465fff] dark:hover:bg-indigo-500/10 ${sameDay(selectedDate, date) ? "bg-[#465fff] text-white hover:bg-[#465fff] hover:text-white" : sameDay(today, date) ? "border border-[#465fff] text-[#465fff]" : ""}`} key={date.toISOString()} onClick={() => { setSelectedDate(date); setOpen(false); }}>{date.getDate()}</button> : <span key={`empty-${index}`}/>)}</div>
      <div className="mt-3 flex justify-between border-t border-[var(--border)] pt-3"><button type="button" className="text-sm text-[var(--muted)] hover:text-[var(--text)]" onClick={() => setSelectedDate(null)}>Clear</button><button type="button" className="text-sm font-medium text-[#465fff]" onClick={() => { setSelectedDate(today); setViewDate(new Date(today.getFullYear(), today.getMonth(), 1)); setOpen(false); }}>Today</button></div>
    </div> : null}
  </div>;
}
function Select({ name, placeholder = "Select an option" }: { name: string; placeholder?: string }) { return <div className="relative"><select className="control appearance-none pr-10" name={name} defaultValue=""><option value="" disabled>{placeholder}</option><option>Marketing</option><option>Template</option><option>Development</option></select><ChevronDown className="muted pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" size={18}/></div>; }
function IconControl({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) { return <div className="control !flex h-11 items-center gap-3 py-0">{icon}<span className="h-5 border-l border-[var(--border)]"/>{children}</div>; }
function InputAddon({ side, addon, children }: { side: "left" | "right"; addon: string; children: React.ReactNode }) { return <div className="control !flex items-center !p-0">{side === "left" && <span className="h-11 shrink-0 border-r border-[var(--border)] px-4 leading-[44px]">{addon}</span>}{children}{side === "right" && <span className="h-11 shrink-0 border-l border-[var(--border)] px-4 leading-[44px]">{addon}</span>}</div>; }
function CheckControl({ label, checked, disabled, onChange }: { label: string; checked: boolean; disabled?: boolean; onChange?: (value: boolean) => void }) { return <label className={`flex items-center gap-3 text-sm ${disabled ? "muted" : ""}`}><input className="h-5 w-5 rounded accent-[#465fff]" type="checkbox" checked={checked} disabled={disabled} onChange={(event) => onChange?.(event.target.checked)}/>{label}</label>; }
function Toggle({ label, checked, disabled, square, onChange }: { label: string; checked: boolean; disabled?: boolean; square?: boolean; onChange?: (value: boolean) => void }) { return <label className={`flex items-center gap-3 text-sm ${disabled ? "muted" : ""}`}><button type="button" disabled={disabled} role="switch" aria-checked={checked} onClick={() => onChange?.(!checked)} className={`relative h-6 w-11 shrink-0 ${square ? "rounded-md" : "rounded-full"} ${checked ? "bg-[#465fff]" : "bg-[#d0d5dd]"}`}><span className={`absolute left-1 top-1 h-4 w-4 bg-white transition-transform ${square ? "rounded-[3px]" : "rounded-full"} ${checked ? "translate-x-5" : "translate-x-0"}`}/></button>{label}</label>; }
