"use client";

import {
  Bot, ChevronDown, CircleUserRound, CreditCard, Database, FileImage,
  KeyRound, Link2, LogOut, MemoryStick, SlidersHorizontal, Sparkles, Trash2,
} from "lucide-react";
import { useRef, useState } from "react";

const groups = [
  { label: "ACCOUNT", items: [["Account", CircleUserRound], ["General", SlidersHorizontal], ["Credit and Billing", CreditCard], ["Personalization", Sparkles]] },
  { label: "FEATURES", items: [["Memory", MemoryStick], ["File & Media", FileImage], ["Model", Bot]] },
  { label: "SYSTEM", items: [["Connector", Link2], ["Data Control", Database]] },
] as const;

type Tab = (typeof groups)[number]["items"][number][0];

export default function AISettingsPage() {
  const [tab, setTab] = useState<Tab>("Account");
  const [notice, setNotice] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [name, setName] = useState("Musharof Chowdhory");
  const [email, setEmail] = useState("musharof@example.com");
  const [workspace, setWorkspace] = useState("Pimjo");
  const fileRef = useRef<HTMLInputElement>(null);

  const act = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(""), 2200); };

  return <div className="ai-settings-page -m-4 min-h-[calc(100vh-77px)] bg-[var(--panel)] md:-mx-6 md:-mb-6 md:-mt-[23px]">
    <div className="grid min-h-[calc(100vh-77px)] bg-[var(--panel)] lg:grid-cols-[304px_minmax(0,1fr)]">
      <aside className="hidden border-r border-[var(--border)] bg-[var(--panel)] p-3 lg:block">
        <button type="button" onClick={() => setProfileOpen(value => !value)} className="flex h-[62px] w-full items-center gap-3 rounded-xl border border-[var(--border)] px-3 text-left" aria-expanded={profileOpen}>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#7587ff] font-medium text-white">M</span>
          <span className="min-w-0 flex-1"><b className="block truncate text-sm font-medium">Musharof Chy</b><small className="muted block text-xs">Personal</small></span>
          <ChevronDown size={16} className={`muted transition-transform ${profileOpen ? "rotate-180" : ""}`}/>
        </button>
        {profileOpen ? <div className="mt-2 rounded-xl border border-[var(--border)] p-2 text-sm"><button className="w-full rounded-lg px-3 py-2 text-left hover:bg-[var(--soft)]" onClick={() => act("Workspace selector opened.")}>Manage workspace</button></div> : null}
        <nav className="mt-5" aria-label="AI settings navigation">
          {groups.map(group => <section className="mb-5" key={group.label}>
            <p className="muted mb-1.5 px-3 text-[11px] font-medium">{group.label}</p>
            {group.items.map(([label, Icon]) => <button type="button" key={label} onClick={() => setTab(label)} className={`flex h-9 w-full items-center gap-3 rounded-lg px-3 text-sm ${tab === label ? "bg-[var(--soft)] font-medium text-[var(--text)]" : "muted hover:bg-[var(--soft)] hover:text-[var(--text)]"}`} aria-current={tab === label ? "page" : undefined}><Icon size={17}/>{label}</button>)}
          </section>)}
        </nav>
      </aside>

      <main className="min-w-0 px-5 py-7 sm:px-8 lg:px-[39px] lg:py-[34px]">
        <select className="control mb-5 !hidden max-lg:!block" value={tab} onChange={event => setTab(event.target.value as Tab)} aria-label="AI settings section">{groups.flatMap(group => group.items.map(([label]) => <option key={label}>{label}</option>))}</select>
        <h1 className="ai-settings-title mx-auto max-w-[812px] text-2xl font-semibold leading-8">{tab === "Model" ? "Models" : tab}</h1>
        {notice ? <div className="fixed right-6 top-24 z-50 rounded-lg bg-[#101828] px-4 py-3 text-sm text-white shadow-xl" role="status">{notice}</div> : null}
        <div className="ai-settings-content mx-auto mt-[30px] max-w-[812px]">{tab === "Account" ? <AccountPanel name={name} email={email} workspace={workspace} setName={setName} setEmail={setEmail} setWorkspace={setWorkspace} fileRef={fileRef} act={act}/> : <SettingsPanel tab={tab} act={act}/>}</div>
      </main>
    </div>
  </div>;
}

function AccountPanel({name,email,workspace,setName,setEmail,setWorkspace,fileRef,act}:{name:string;email:string;workspace:string;setName:(value:string)=>void;setEmail:(value:string)=>void;setWorkspace:(value:string)=>void;fileRef:React.RefObject<HTMLInputElement|null>;act:(message:string)=>void}) {
  const [twoFactor, setTwoFactor] = useState(true);
  return <div className="space-y-6">
    <SettingsSection label="PROFILE INFO">
      <div className="flex items-center gap-4 border-b border-[var(--border)] px-4 py-[16.5px]">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#7587ff] text-xl font-medium text-white">M</span>
        <div><button type="button" className="btn upload-avatar-btn h-9 px-4" onClick={() => fileRef.current?.click()}>Upload Avatar</button><input ref={fileRef} type="file" accept="image/png,image/jpeg" className="sr-only" onChange={() => act("Avatar selected.")}/><p className="muted mt-1.5 text-xs">Min 400x400px, PNG or JPEG formats.</p></div>
      </div>
      <div className="divide-y divide-[var(--border)]">
        <FieldRow label="Full Name"><input className="control h-11" value={name} onChange={event => setName(event.target.value)}/></FieldRow>
        <FieldRow label="Email"><input className="control h-11" type="email" value={email} onChange={event => setEmail(event.target.value)}/></FieldRow>
        <FieldRow label="Workspace Name"><input className="control h-11" value={workspace} onChange={event => setWorkspace(event.target.value)}/></FieldRow>
      </div>
      <div className="flex justify-end border-t border-[var(--border)] px-4 py-4"><button className="btn btn-primary h-9 w-[120px] px-4 text-sm" onClick={() => act("Account changes saved.")}>Save Changes</button></div>
    </SettingsSection>

    <SettingsSection label="SECURITY">
      <ActionRow title="Change password" note="Last updated 2 months ago"><button className="btn h-9 w-[139px] px-4" onClick={() => act("Password update opened.")}>Update password</button></ActionRow>
      <ActionRow title="Two-Factor Authentication" note="3 devices currently signed in"><Toggle checked={twoFactor} onChange={setTwoFactor} label="Two-factor authentication"/></ActionRow>
      <ActionRow title="Active sessions" note="3 devices currently signed in"><button className="btn h-9 w-[81px] px-4" onClick={() => act("Active sessions opened.")}>Manage</button></ActionRow>
    </SettingsSection>

    <SettingsSection label="DANGER ZONE">
      <ActionRow title="Logout all devices" note="Sign out from every active session."><button className="btn h-9 w-[118px] px-4" onClick={() => act("All other sessions signed out.")}><LogOut size={15}/>Logout All</button></ActionRow>
      <ActionRow title="Delete account" note="Permanently remove this workspace and all saved data."><button className="btn h-9 w-[97px] border-red-200 px-4 text-red-600" onClick={() => act("Demo account deletion requires confirmation.")}><Trash2 size={15}/>Delete</button></ActionRow>
    </SettingsSection>
  </div>;
}

function SettingsPanel({tab,act}:{tab:Tab;act:(message:string)=>void}) {
  if (tab === "General") return <div className="space-y-7"><SettingsSection label="PREFERENCE"><ChoiceRow title="Theme" note="Select your default theme" options={["Light","Dark","Auto"]}/><ChoiceRow title="Language" options={["English"]}/><ChoiceRow title="Time" options={["UTC"]}/></SettingsSection><SettingsSection label="NOTIFICATION"><ToggleRow title="Activity & updates" note="Stay informed about activity and team mentions"/><ToggleRow title="Responses" note="Get notified when AI responds to requests"/><ToggleRow title="Product updates" note="Recent updates at a glance."/></SettingsSection></div>;
  if (tab === "Credit and Billing") return <div className="space-y-7"><SettingsSection label="CURRENT PLAN"><ActionRow title="You’re on Pro plan" note="Upgrade to team anytime"><button className="btn btn-primary" onClick={() => act("Team upgrade opened.")}>Upgrade to Team</button></ActionRow><ValueRow title="Credits remaining" note="Daily credits" value="50"/><ValueRow title="Daily credits" note="Resets to 50 credits in 12 hours" value="50"/></SettingsSection><SettingsSection label="PAYMENT METHOD"><ActionRow title="Card" note="Visa ending in 4242 · Expires 06/28"><button className="btn" onClick={() => act("Payment method opened.")}>Update</button></ActionRow>{["INV-2026-004","INV-2026-005","INV-2026-006"].map((invoice,index)=><ActionRow key={invoice} title={invoice} note={`${index ? "$49" : "$29"} · ${["Nov 12, 2026","May 12, 2026","Feb 12, 2026"][index]}`}><button className="btn invoice-button" onClick={() => act(`${invoice} opened.`)}>View Invoice</button></ActionRow>)}</SettingsSection></div>;
  if (tab === "Personalization") return <div className="space-y-7"><SettingsSection label="AI BEHAVIOR"><ChoiceRow title="Response tone" options={["Concise","Balanced","Expressive"]} inline/><RangeRow title="Creativity" note="Higher values produce more varied output." inline/><ChoiceRow title="Output length" options={["Short","Medium","Long"]} inline/></SettingsSection><SettingsSection label="CUSTOM INTERACTIONS"><TextAreaRow title="Instructions"/></SettingsSection><SettingsSection label="ABOUT YOU"><TextFieldRow title="Nickname"/><TextFieldRow title="Occupation"/><TextAreaRow title="More about you"/></SettingsSection></div>;
  if (tab === "Memory") return <div className="space-y-7"><SettingsSection label="MEMORY"><ToggleRow title="Enable memory" note="Allow the assistant to recall past context"/><ToggleRow title="Save conversations" note="Keep chat history for future reference"/></SettingsSection><SettingsSection label="STORED CONTEXT"><div className="flex flex-wrap gap-3 p-5"><button className="btn" onClick={() => act("Chat import opened.")}>Import Chat Histories</button><button className="btn" onClick={() => act("Memory editor opened.")}>Add Memory</button><button className="btn" onClick={() => act("Chats import opened.")}>Import Chats</button><button className="btn" onClick={() => act("Folder creator opened.")}>Create Folder</button></div><ActionRow title="Clear Memory" note="Permanently delete all stored facts and preferences"><button className="btn text-red-600" onClick={() => act("Demo memory cleared.")}>Delete</button></ActionRow></SettingsSection></div>;
  if (tab === "File & Media") return <div className="file-media-settings space-y-7"><SettingsSection label="UPLOAD SETTINGS"><RangeRow title="Max file size" note="Maximum upload size (50 MB)." value={20} inline/><ChoiceRow title="Allowed formats" options={["PNG","JPG","PDF","MP4","MD","ZIP"]} inline compact/></SettingsSection><SettingsSection label="EXPORT SETTINGS"><ChoiceRow title="Default export format" options={["PNG"]} inline/><RangeRow title="Compression quality" value={60} inline/></SettingsSection></div>;
  if (tab === "Model") return <SettingsSection label="ALL MODELS"><div className="flex gap-2 border-b border-[var(--border)] p-4"><button className="btn btn-primary">All</button><button className="btn">All Generation</button></div>{["ChatGPT 5.5","ChatGPT 4.5","Claude Sonnet 4.6","Gemini 3.1 Pro","Gemini 3 Flash","Grok 3","Grok 2.0"].map((model,index)=><ActionRow key={model} title={model} note={index===0||index===2?"New":"Available model"}><button className="btn" onClick={() => act(`${model} selected.`)}>Select</button></ActionRow>)}</SettingsSection>;
  if (tab === "Connector") return <div className="space-y-7"><SettingsSection label="APPS">{[["Google Drive","Connected","Sync files and collaborate seamlessly with your team."],["Github","Connect","Automate workflows by connecting apps and services."],["Calendar","Connect","Manage events, and optimize your time."],["Slack","Connect","Integrate Slack to simplify communication and enhance teamwork."]].map(([title,status,note])=><ActionRow key={title} title={title} note={note}><button className="btn" onClick={() => act(`${title} ${status === "Connected" ? "disconnected" : "connected"}.`)}>{status === "Connected" ? "Disconnect" : "Connect"}</button></ActionRow>)}</SettingsSection><SettingsSection label="API KEYS"><ActionRow title="Production key" note="lk_live_************42ab"><div className="flex gap-2"><button className="btn">Rotate</button><button className="btn text-red-600">Revoke</button></div></ActionRow><div className="p-5"><button className="btn btn-primary" onClick={() => act("New API key generated.")}><KeyRound size={16}/>New key</button></div></SettingsSection></div>;
  return <div className="space-y-7"><SettingsSection label="PRIVACY"><ChoiceRow title="Data retention" note="How long to keep your conversations" options={["90 Days"]}/><ToggleRow title="Improve models with my data" note="Opt in to training on anonymized chats."/><ToggleRow title="Location" note="When on, AI uses your location for local info."/></SettingsSection><SettingsSection label="EXPORT & DELETE"><ActionRow title="Export user data" note="Download a ZIP of all chats and files."><button className="btn" onClick={() => act("Data export requested.")}>Request Export</button></ActionRow><ActionRow title="Delete all chat" note="Permanently remove the entire chats"><button className="btn text-red-600" onClick={() => act("Demo chats deleted.")}>Delete</button></ActionRow></SettingsSection></div>;
}

function SettingsSection({label,children}:{label:string;children:React.ReactNode}) { return <section><h2 className="muted mb-2 text-xs font-medium leading-4">{label}</h2><div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)]">{children}</div></section>; }
function FieldRow({label,children}:{label:string;children:React.ReactNode}) { return <label className="grid items-center gap-3 px-4 py-4 sm:grid-cols-[minmax(130px,1fr)_300px]"><span className="text-sm">{label}</span>{children}</label>; }
function ActionRow({title,note,children}:{title:string;note?:string;children:React.ReactNode}) { return <div className="flex min-h-[69px] items-center gap-4 border-b border-[var(--border)] px-5 py-3 last:border-b-0"><div className="min-w-0 flex-1"><p className="text-sm font-medium">{title}</p>{note ? <p className="muted mt-0.5 text-xs">{note}</p> : null}</div><div className="shrink-0">{children}</div></div>; }
function Toggle({checked,onChange,label}:{checked:boolean;onChange:(value:boolean)=>void;label:string}) { return <button type="button" className={`relative h-5 w-9 rounded-full ${checked ? "bg-[#465fff]" : "bg-slate-300"}`} onClick={() => onChange(!checked)} role="switch" aria-checked={checked} aria-label={label}><span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${checked ? "left-[18px]" : "left-0.5"}`}/></button>; }
function ToggleRow({title,note,initial=true}:{title:string;note:string;initial?:boolean}) { const [checked,setChecked]=useState(initial); return <ActionRow title={title} note={note}><Toggle checked={checked} onChange={setChecked} label={title}/></ActionRow>; }
function ChoiceRow({title,note,options,inline=false,compact=false}:{title:string;note?:string;options:string[];inline?:boolean;compact?:boolean}) { const [selected,setSelected]=useState(options[0]); return <div className={`${inline?"settings-inline-row ":""}${compact?"compact-choice ":""}choice-row`}><div><p>{title}</p>{note ? <small>{note}</small> : null}</div><div>{options.map(option=><button type="button" className={selected===option?"active":""} onClick={()=>setSelected(option)} key={option}>{option}</button>)}</div></div>; }
function RangeRow({title,note,value=60,inline=false}:{title:string;note?:string;value?:number;inline?:boolean}) { const [current,setCurrent]=useState(value); return <div className={`${inline?"settings-inline-row inline-range":"range-row"}`}><div><p>{title}</p>{note?<small>{note}</small>:null}</div><div className="range-control"><b>{current}%</b><input type="range" value={current} onChange={event=>setCurrent(Number(event.target.value))}/></div></div>; }
function TextFieldRow({title}:{title:string}) { return <label className="block border-b border-[var(--border)] p-5 last:border-b-0"><span className="mb-2 block text-sm font-medium">{title}</span><input className="control"/></label>; }
function TextAreaRow({title}:{title:string}) { return <label className="block border-b border-[var(--border)] p-5 last:border-b-0"><span className="mb-2 block text-sm font-medium">{title}</span><textarea className="control min-h-24"/></label>; }
function ValueRow({title,note,value}:{title:string;note:string;value:string}) { return <ActionRow title={title} note={note}><b className="text-xl">{value}</b></ActionRow>; }
