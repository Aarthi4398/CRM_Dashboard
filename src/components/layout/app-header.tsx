"use client";

import { useFeedback } from "@/components/ui/app-feedback";
import { getMenuItems, handleMenuKeyDown } from "@/hooks/menu-keyboard";
import { useEscapeKey } from "@/hooks/use-escape-key";
import { Bell, ChevronDown, Menu, Moon, Search, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";

type AppHeaderProps = {
  collapsed: boolean;
  onOpenNavigation: () => void;
  onToggleSidebar: () => void;
};

export function AppHeader({ collapsed, onOpenNavigation, onToggleSidebar }: AppHeaderProps) {
  const router = useRouter();
  const { toast } = useFeedback();
  const [theme, setTheme] = useState("light");
  const [notice, setNotice] = useState(false);
  const [profile, setProfile] = useState(false);
  const [query, setQuery] = useState("");
  const pendingNoticeFocusRef = useRef(false);
  const pendingProfileFocusRef = useRef(false);
  const headerRef = useRef<HTMLElement>(null);
  const noticeTriggerRef = useRef<HTMLButtonElement>(null);
  const profileTriggerRef = useRef<HTMLButtonElement>(null);
  const noticePanelRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const noticePanelId = useId();
  const profileMenuId = useId();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate theme label from document on mount
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setNotice(false);
        setProfile(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const closeNotice = useCallback((returnFocus = false) => {
    setNotice(false);
    if (returnFocus) noticeTriggerRef.current?.focus();
  }, []);

  const closeProfile = useCallback((returnFocus = false) => {
    setProfile(false);
    if (returnFocus) profileTriggerRef.current?.focus();
  }, []);

  useEscapeKey(notice, () => closeNotice(true));
  useEscapeKey(profile, () => closeProfile(true));

  useLayoutEffect(() => {
    if (!notice || !pendingNoticeFocusRef.current) return;
    noticePanelRef.current?.focus();
    pendingNoticeFocusRef.current = false;
  }, [notice]);

  useLayoutEffect(() => {
    if (!profile || !pendingProfileFocusRef.current || !profileMenuRef.current) return;
    getMenuItems(profileMenuRef.current)[0]?.focus();
    pendingProfileFocusRef.current = false;
  }, [profile]);

  const toggleTheme = () => {
    const dark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("aarthi-theme", dark ? "dark" : "light");
    setTheme(dark ? "dark" : "light");
  };

  const search = (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim()) router.push(`/contacts?q=${encodeURIComponent(query.trim())}`);
  };

  const openNotice = (focusPanel = false) => {
    setNotice(true);
    setProfile(false);
    pendingNoticeFocusRef.current = focusPanel;
  };

  const openProfile = (focusMenu = false) => {
    setProfile(true);
    setNotice(false);
    pendingProfileFocusRef.current = focusMenu;
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 flex h-[77px] items-center gap-3 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_94%,transparent)] px-4 backdrop-blur md:px-6"
    >
      <button
        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[var(--border)] hover:bg-[var(--soft)] lg:hidden"
        onClick={onOpenNavigation}
        aria-label="Open navigation"
        type="button"
      >
        <Menu className="muted" size={20} aria-hidden="true" />
      </button>
      <button
        className="hidden h-11 w-11 shrink-0 place-items-center rounded-xl border border-[var(--border)] hover:bg-[var(--soft)] lg:grid"
        onClick={onToggleSidebar}
        aria-label="Toggle Sidebar"
        aria-expanded={!collapsed}
        type="button"
      >
        <Menu className="muted" size={20} aria-hidden="true" />
      </button>
      <form onSubmit={search} className="relative max-w-[430px] flex-1">
        <Search className="muted pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" size={18} aria-hidden="true" />
        <input
          className="field !h-11 !rounded-lg !pl-11 !pr-16 text-[15px]"
          placeholder="Search or type command…"
          aria-label="Global search"
          autoComplete="off"
          name="dashboard-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <span className="muted pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-[var(--border)] px-2 py-1 text-xs sm:block">
          ⌘&nbsp;K
        </span>
      </form>
      <button
        className="ml-auto grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--border)] hover:bg-[var(--soft)]"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        type="button"
      >
        {theme === "dark" ? <Sun className="muted" size={19} aria-hidden="true" /> : <Moon className="muted" size={19} aria-hidden="true" />}
      </button>
      <div className="relative">
        <button
          ref={noticeTriggerRef}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--border)] hover:bg-[var(--soft)]"
          onClick={() => (notice ? closeNotice(false) : openNotice(false))}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" && !notice) {
              event.preventDefault();
              openNotice(true);
            }
          }}
          aria-label="Notifications"
          aria-haspopup="dialog"
          aria-expanded={notice}
          aria-controls={notice ? noticePanelId : undefined}
          type="button"
        >
          <Bell className="muted" size={19} aria-hidden="true" />
          <span className="notification-heartbeat absolute right-[7px] top-[5px] h-2.5 w-2.5 rounded-full border-2 border-[var(--panel)] bg-orange-400" />
        </button>
        {notice ? (
          <div
            ref={noticePanelRef}
            id={noticePanelId}
            className="panel absolute right-0 mt-2 w-80 p-4 shadow-xl"
            role="region"
            aria-label="Notifications"
            tabIndex={-1}
          >
            <b>Notifications</b>
            <p className="muted mt-2 text-sm">Nova Labs proposal is due tomorrow.</p>
            <p className="muted mt-2 text-sm">Cloudly moved to Negotiation.</p>
          </div>
        ) : null}
      </div>
      <div className="relative">
        <button
          ref={profileTriggerRef}
          className="flex min-h-11 items-center gap-3 rounded-xl px-1.5 py-1 hover:bg-[var(--soft)]"
          onClick={() => (profile ? closeProfile(false) : openProfile(false))}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" && !profile) {
              event.preventDefault();
              openProfile(true);
            }
          }}
          aria-label="Open profile menu"
          aria-haspopup="menu"
          aria-expanded={profile}
          aria-controls={profile ? profileMenuId : undefined}
          type="button"
        >
          <Image src="/logistics/courier-avatar.png" alt="Aarthi profile" width={40} height={40} priority className="h-10 w-10 shrink-0 rounded-full object-cover" />
          <span className="hide-mobile whitespace-nowrap text-left text-sm font-semibold text-[#101828] dark:text-[#f2f4f7]">Aarthi</span>
          <ChevronDown className="muted" size={16} aria-hidden="true" />
        </button>
        {profile ? (
          <div
            ref={profileMenuRef}
            id={profileMenuId}
            className="panel absolute right-0 mt-2 w-56 p-2 shadow-xl"
            role="menu"
            aria-label="Profile menu"
            onKeyDown={(event) => handleMenuKeyDown(event, () => closeProfile(true))}
          >
            <Link className="block rounded-lg px-3 py-2 hover:bg-[var(--soft)]" href="/profile" role="menuitem">
              My profile
            </Link>
            <button
              className="w-full rounded-lg px-3 py-2 text-left hover:bg-[var(--soft)]"
              role="menuitem"
              type="button"
              onClick={() => {
                toast("Demo account — no sign out required.");
                closeProfile(false);
              }}
            >
              Sign out
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
