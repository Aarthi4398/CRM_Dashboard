"use client";

import { useState } from "react";
import { CheckCircle2, Github, Linkedin, LogOut, Pencil, Trash2, Twitter } from "lucide-react";
import { Modal } from "@/components/modal";
import { useCRM } from "@/lib/store";
import { Input } from "../contacts/page";

type Editor = "personal" | "address" | null;

export default function ProfilePage() {
  const { state, setState } = useCRM();
  const [form, setForm] = useState(state.profile);
  const [editor, setEditor] = useState<Editor>(null);
  const [saved, setSaved] = useState(false);
  const [country, setCountry] = useState("India");
  const [postalCode, setPostalCode] = useState("600 001");
  const [taxId, setTaxId] = useState("IN-AAR-2489");
  const [twoFactor, setTwoFactor] = useState(true);
  const names = form.name.trim().split(/\s+/);
  const firstName = names[0] || "Aarthi";
  const lastName = names.slice(1).join(" ") || "Raman";

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    setState((current) => ({ ...current, profile: form }));
    setEditor(null);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="space-y-6">
      <p className="muted text-sm">Home / User Profile</p>
      <section className="panel p-5 sm:p-6">
        <div className="flex flex-col items-center gap-6 xl:flex-row">
          <span className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-indigo-100 text-2xl font-bold text-[#465fff] ring-4 ring-[var(--panel)] shadow-sm">AR</span>
          <div className="min-w-0 flex-1 text-center xl:text-left">
            <h1 className="text-xl font-semibold">{form.name}</h1>
            <div className="muted mt-1 flex flex-wrap justify-center gap-x-3 text-sm xl:justify-start"><span>{form.role}</span><span aria-hidden="true">|</span><span>{form.location}</span></div>
          </div>
          <div className="flex items-center gap-3"><SocialButton label="Twitter"><Twitter size={18}/></SocialButton><SocialButton label="LinkedIn"><Linkedin size={18}/></SocialButton><SocialButton label="GitHub"><Github size={18}/></SocialButton></div>
        </div>
      </section>

      <InfoCard title="Personal Information" onEdit={() => setEditor("personal")}>
        <Info label="First Name" value={firstName}/><Info label="Last Name" value={lastName}/><Info label="Email Address" value={form.email}/><Info label="Phone" value={form.phone}/><Info label="Bio" value={form.bio} wide/>
      </InfoCard>
      <InfoCard title="Address" onEdit={() => setEditor("address")}>
        <Info label="Country" value={country}/><Info label="City/State" value={form.location}/><Info label="Postal Code" value={postalCode}/><Info label="Tax ID" value={taxId}/>
      </InfoCard>

      <section className="panel p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Security</h2>
        <div className="mt-6 divide-y divide-[var(--border)]">
          <div className="flex flex-wrap items-center justify-between gap-4 py-5 first:pt-0"><div><h3 className="font-medium">Change Password</h3><p className="muted mt-1 text-sm">Update your password regularly to protect your account.</p></div><button className="btn" onClick={() => alert("Password settings are disabled in this portfolio demo.")}>Change Password</button></div>
          <div className="flex flex-wrap items-center justify-between gap-4 py-5 last:pb-0"><div><h3 className="font-medium">Two-Factor Authentication (2FA)</h3><p className="muted mt-1 text-sm">Keep your account secure by enabling 2FA.</p></div><button type="button" role="switch" aria-checked={twoFactor} aria-label="Two-factor authentication" onClick={() => setTwoFactor((value) => !value)} className={`relative h-6 w-11 rounded-full transition-colors ${twoFactor ? "bg-[#465fff]" : "bg-slate-300"}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${twoFactor ? "translate-x-6" : "translate-x-1"}`}/></button></div>
        </div>
      </section>

      <section className="panel border-red-200 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
        <div className="mt-5 divide-y divide-[var(--border)]"><DangerAction icon={<LogOut size={18}/>} title="Log Out All Devices" description="Sign out from every active session." button="Log Out"/><DangerAction icon={<Trash2 size={18}/>} title="Delete Account" description="Once you delete your account, there is no going back." button="Delete Account"/></div>
      </section>

      {saved ? <div className="fixed bottom-6 right-6 flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg" aria-live="polite"><CheckCircle2 size={18}/>Profile Saved</div> : null}

      <Modal open={editor === "personal"} title="Edit Personal Information" onClose={() => setEditor(null)}><form className="grid gap-4" onSubmit={save}><Input label="Full Name" value={form.name} onChange={(name) => setForm((value) => ({ ...value, name }))}/><Input label="Role" value={form.role} onChange={(role) => setForm((value) => ({ ...value, role }))}/><Input label="Email Address" type="email" value={form.email} onChange={(email) => setForm((value) => ({ ...value, email }))}/><Input label="Phone" value={form.phone} onChange={(phone) => setForm((value) => ({ ...value, phone }))}/><label><span className="mb-1 block text-sm font-semibold">Bio</span><textarea className="field min-h-28" value={form.bio} onChange={(event) => setForm((value) => ({ ...value, bio: event.target.value }))}/></label><button className="btn btn-primary justify-center">Save Changes</button></form></Modal>
      <Modal open={editor === "address"} title="Edit Address" onClose={() => setEditor(null)}><form className="grid gap-4" onSubmit={save}><Input label="Country" value={country} onChange={setCountry}/><Input label="City/State" value={form.location} onChange={(location) => setForm((value) => ({ ...value, location }))}/><Input label="Postal Code" value={postalCode} onChange={setPostalCode}/><Input label="Tax ID" value={taxId} onChange={setTaxId}/><button className="btn btn-primary justify-center">Save Changes</button></form></Modal>
    </div>
  );
}

function SocialButton({ label, children }: { label: string; children: React.ReactNode }) { return <button className="btn !rounded-full !p-2.5" aria-label={label}>{children}</button> }
function InfoCard({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) { return <section className="panel p-5 sm:p-6"><div className="flex items-center justify-between gap-4"><h2 className="text-lg font-semibold">{title}</h2><button className="btn !px-4 !py-2" onClick={onEdit}><Pencil size={16}/>Edit</button></div><div className="mt-7 grid gap-x-8 gap-y-6 sm:grid-cols-2">{children}</div></section> }
function Info({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) { return <div className={wide ? "sm:col-span-2" : ""}><p className="muted text-xs">{label}</p><p className="mt-2 break-words text-sm font-medium">{value}</p></div> }
function DangerAction({ icon, title, description, button }: { icon: React.ReactNode; title: string; description: string; button: string }) { return <div className="flex flex-wrap items-center justify-between gap-4 py-5 first:pt-0 last:pb-0"><div className="flex gap-3"><span className="mt-0.5 text-red-500">{icon}</span><div><h3 className="font-medium">{title}</h3><p className="muted mt-1 text-sm">{description}</p></div></div><button className="btn border-red-200 text-red-600 hover:bg-red-50" onClick={() => alert(`${button} is disabled in this portfolio demo.`)}>{button}</button></div> }
