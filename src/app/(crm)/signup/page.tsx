"use client";

import { ArrowLeft, Eye, EyeOff, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [dark, setDark] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    if (agreed) router.push("/dashboard");
  };

  return (
    <main className="grid min-h-[100dvh] bg-[var(--panel)] lg:grid-cols-2">
      <section className="relative flex min-h-[100dvh] justify-center px-5 pb-24 pt-24 sm:px-10 sm:pb-14 lg:pt-24">
        <Link href="/dashboard" className="muted absolute left-5 top-7 flex items-center gap-1 text-sm hover:text-[var(--text)] sm:left-[max(40px,calc(50%-224px))] sm:top-10">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>
        <div className="my-auto w-full max-w-md">
          <h1 className="text-[32px] font-semibold leading-10 tracking-[-.02em] sm:text-[36px] sm:leading-[44px]">Sign Up</h1>
          <p className="muted mt-2 text-sm">Enter your email and password to sign up!</p>

          <div className="mt-7 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-5">
            <button type="button" className="soft flex h-11 items-center justify-center gap-3 rounded-lg text-sm font-medium hover:brightness-95" onClick={() => alert("Google sign-up is a portfolio demo.")}>
              <span className="text-lg font-bold text-red-500">G</span> Sign up with Google
            </button>
            <button type="button" className="soft flex h-11 items-center justify-center gap-3 rounded-lg text-sm font-medium hover:brightness-95" onClick={() => alert("X sign-up is a portfolio demo.")}>
              <span className="text-xl">𝕏</span> Sign up with X
            </button>
          </div>

          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-[var(--border)]" />
            <span className="muted text-sm">Or</span>
            <span className="h-px flex-1 bg-[var(--border)]" />
          </div>

          <form className="space-y-4" onSubmit={submit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block"><span className="mb-2 block text-sm font-medium">First Name <b className="text-red-500">*</b></span><input className="control h-11" placeholder="Enter your first name" required value={firstName} onChange={(event) => setFirstName(event.target.value)} /></label>
              <label className="block"><span className="mb-2 block text-sm font-medium">Last Name <b className="text-red-500">*</b></span><input className="control h-11" placeholder="Enter your last name" required value={lastName} onChange={(event) => setLastName(event.target.value)} /></label>
            </div>
            <label className="block"><span className="mb-2 block text-sm font-medium">Email <b className="text-red-500">*</b></span><input className="control h-11" type="email" placeholder="Enter your email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Password <b className="text-red-500">*</b></span>
              <span className="relative block"><input className="control h-11 pr-12" type={show ? "text" : "password"} placeholder="Enter your password" required value={password} onChange={(event) => setPassword(event.target.value)} /><button type="button" className="muted absolute right-4 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-md" onClick={() => setShow((value) => !value)} aria-label={show ? "Hide password" : "Show password"}>{show ? <Eye size={19} /> : <EyeOff size={19} />}</button></span>
            </label>
            <label className="flex items-start gap-3 text-sm leading-5">
              <input className="mt-0.5 h-5 w-5 shrink-0 rounded accent-[#465fff]" type="checkbox" required checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
              <span className="muted">By creating an account means you agree to the <Link href="/terms" className="text-[var(--text)] hover:text-[#465fff]">Terms and Conditions</Link>, and our <Link href="/privacy" className="text-[var(--text)] hover:text-[#465fff]">Privacy Policy</Link></span>
            </label>
            <button className="btn btn-primary h-11 w-full" type="submit">Sign Up</button>
          </form>
          <p className="mt-5 text-sm">Already have an account? <Link href="/signin" className="text-[#465fff] hover:underline">Sign In</Link></p>
        </div>
      </section>

      <aside className="auth-grid relative hidden min-h-screen items-center justify-center overflow-hidden bg-[#171a57] text-white lg:flex">
        <div className="relative z-10 text-center"><div className="flex items-center justify-center gap-4"><span className="relative h-12 w-12"><i className="absolute left-0 top-0 h-7 w-7 rounded-[7px] bg-[#465fff]" /><i className="absolute bottom-0 right-0 h-7 w-7 rounded-[7px] border-[5px] border-white" /></span><span className="text-[38px] font-semibold">Aarthi CRM</span></div><p className="mx-auto mt-4 max-w-sm text-lg leading-6 text-indigo-100">Free and original Next.js CRM Dashboard Portfolio</p></div>
      </aside>

      <button className="fixed bottom-4 right-4 z-20 grid h-12 w-12 place-items-center rounded-full bg-[#465fff] text-white shadow-lg sm:bottom-6 sm:right-6 sm:h-14 sm:w-14" onClick={toggleTheme} aria-label={`Switch to ${dark ? "light" : "dark"} theme`}>{dark ? <Sun size={22} /> : <Moon size={22} />}</button>
    </main>
  );
}
