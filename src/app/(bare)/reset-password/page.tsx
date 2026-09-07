"use client";

import { ArrowLeft, CheckCircle2, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [dark, setDark] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);

  const toggleTheme = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("aarthi-theme", next ? "dark" : "light");
    setDark(next);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <main className="grid min-h-[100dvh] bg-[var(--panel)] lg:grid-cols-2">
      <section className="relative flex min-h-[100dvh] justify-center px-5 pb-24 pt-24 sm:px-10 sm:pb-16 lg:pt-32">
        <Link href="/dashboard" className="muted absolute left-5 top-7 flex items-center gap-1 text-sm hover:text-[var(--text)] sm:left-[max(40px,calc(50%-224px))] sm:top-10">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>

        <div className="my-auto w-full max-w-md lg:-mt-8">
          <h1 className="text-[32px] font-semibold leading-10 tracking-[-.02em] sm:text-[36px] sm:leading-[44px]">Forgot Your Password?</h1>
          <p className="muted mt-3 text-sm leading-6">Enter the email address linked to your account, and we&apos;ll send you a link to reset your password.</p>

          <form className="mt-8 space-y-6" onSubmit={submit}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Email <b className="text-red-500">*</b></span>
              <input className="control h-11" type="email" placeholder="Enter your email" required value={email} onChange={(event) => { setEmail(event.target.value); setSent(false); }} />
            </label>
            {sent && <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300" role="status"><CheckCircle2 className="mt-0.5 shrink-0" size={17} /><span>A reset link has been sent to {email}.</span></div>}
            <button className="btn btn-primary h-11 w-full" type="submit">Send Reset Link</button>
          </form>

          <p className="muted mt-5 text-sm">Wait, I remember my password... <Link href="/signin" className="text-[#465fff] hover:underline">Click here</Link></p>
        </div>
      </section>

      <aside className="auth-grid relative hidden min-h-screen items-center justify-center overflow-hidden bg-[#171a57] text-white lg:flex">
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-4"><span className="relative h-12 w-12"><i className="absolute left-0 top-0 h-7 w-7 rounded-[7px] bg-[#465fff]" /><i className="absolute bottom-0 right-0 h-7 w-7 rounded-[7px] border-[5px] border-white" /></span><span className="text-[38px] font-semibold">Aarthi CRM</span></div>
          <p className="mx-auto mt-4 max-w-sm text-lg leading-6 text-indigo-100">Free and original Next.js CRM Dashboard Portfolio</p>
        </div>
      </aside>

      <button className="fixed bottom-4 right-4 z-20 grid h-12 w-12 place-items-center rounded-full bg-[#465fff] text-white shadow-lg sm:bottom-6 sm:right-6 sm:h-14 sm:w-14" onClick={toggleTheme} aria-label={`Switch to ${dark ? "light" : "dark"} theme`}>{dark ? <Sun size={22} /> : <Moon size={22} />}</button>
    </main>
  );
}
