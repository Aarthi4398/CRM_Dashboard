"use client";

import { ArrowLeft, CheckCircle2, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function TwoStepVerificationPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [dark, setDark] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resent, setResent] = useState(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);

  const toggleTheme = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("aarthi-theme", next ? "dark" : "light");
    setDark(next);
  };

  const changeDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setCode((current) => current.map((item, position) => position === index ? digit : item));
    setVerified(false);
    if (digit && index < 5) inputs.current[index + 1]?.focus();
  };

  const pasteCode = (event: React.ClipboardEvent) => {
    const digits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
    if (!digits.length) return;
    event.preventDefault();
    setCode(Array.from({ length: 6 }, (_, index) => digits[index] ?? ""));
    inputs.current[Math.min(digits.length, 6) - 1]?.focus();
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (code.every(Boolean)) setVerified(true);
  };

  return (
    <main className="grid min-h-[100dvh] bg-[var(--panel)] lg:grid-cols-2">
      <section className="relative flex min-h-[100dvh] justify-center px-5 pb-24 pt-24 sm:px-10 sm:pb-16 lg:pt-32">
        <Link href="/dashboard" className="muted absolute left-5 top-7 flex items-center gap-1 text-sm hover:text-[var(--text)] sm:left-[max(40px,calc(50%-224px))] sm:top-10"><ArrowLeft size={16} /> Back to dashboard</Link>
        <div className="my-auto w-full max-w-md lg:-mt-8">
          <h1 className="text-[32px] font-semibold leading-10 tracking-[-.02em] sm:text-[36px] sm:leading-[44px]">Two Step Verification</h1>
          <p className="muted mt-3 text-sm leading-6">A verification code has been sent to your mobile. Please enter it in the field below.</p>

          <form className="mt-8" onSubmit={submit}>
            <label className="mb-3 block text-sm font-medium">Type your 6 digits security code</label>
            <div className="grid grid-cols-6 gap-2 sm:gap-3" onPaste={pasteCode}>
              {code.map((digit, index) => <input key={index} ref={(element) => { inputs.current[index] = element; }} className="h-12 min-w-0 rounded-lg border border-[var(--border)] bg-transparent text-center text-xl font-semibold outline-none transition focus:border-[#465fff] focus:ring-2 focus:ring-[#465fff]/15 sm:h-14" inputMode="numeric" autoComplete={index === 0 ? "one-time-code" : "off"} aria-label={`Security code digit ${index + 1}`} maxLength={1} required value={digit} onChange={(event) => changeDigit(index, event.target.value)} onKeyDown={(event) => { if (event.key === "Backspace" && !code[index] && index > 0) inputs.current[index - 1]?.focus(); }} />)}
            </div>
            {verified && <div className="mt-5 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300" role="status"><CheckCircle2 size={17} /> Account verified successfully.</div>}
            <button className="btn btn-primary mt-6 h-11 w-full" type="submit">Verify My Account</button>
          </form>

          <p className="muted mt-5 text-sm">Didn&apos;t get the code? <button type="button" className="text-[#465fff] hover:underline" onClick={() => { setResent(true); setVerified(false); }}>Resend</button></p>
          {resent && <p className="mt-2 text-sm text-emerald-600" role="status">A new verification code has been sent.</p>}
        </div>
      </section>

      <aside className="auth-grid relative hidden min-h-screen items-center justify-center overflow-hidden bg-[#171a57] text-white lg:flex"><div className="relative z-10 text-center"><div className="flex items-center justify-center gap-4"><span className="relative h-12 w-12"><i className="absolute left-0 top-0 h-7 w-7 rounded-[7px] bg-[#465fff]" /><i className="absolute bottom-0 right-0 h-7 w-7 rounded-[7px] border-[5px] border-white" /></span><span className="text-[38px] font-semibold">Aarthi CRM</span></div><p className="mx-auto mt-4 max-w-sm text-lg leading-6 text-indigo-100">Free and original Next.js CRM Dashboard Portfolio</p></div></aside>

      <button className="fixed bottom-4 right-4 z-20 grid h-12 w-12 place-items-center rounded-full bg-[#465fff] text-white shadow-lg sm:bottom-6 sm:right-6 sm:h-14 sm:w-14" onClick={toggleTheme} aria-label={`Switch to ${dark ? "light" : "dark"} theme`}>{dark ? <Sun size={22} /> : <Moon size={22} />}</button>
    </main>
  );
}
