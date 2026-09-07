"use client";
import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";

const FOCUSABLE_SELECTOR = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true",
  );
}

export function Modal({open,title,onClose,children}:{open:boolean;title:string;onClose:()=>void;children:React.ReactNode}){
  const titleId=useId();
  const dialogRef=useRef<HTMLElement>(null);
  const previousFocusRef=useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    const focusables = dialog ? getFocusableElements(dialog) : [];
    (focusables[0] ?? dialog)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const items = getFocusableElements(dialog);
      if (!items.length) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey) {
        if (active === first || !dialog.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !dialog.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previousFocusRef.current?.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  if(!open)return null;
  return <div className="fixed inset-0 z-[80] grid place-items-center bg-black/45 p-4" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><section ref={dialogRef} className="panel max-h-[90vh] w-full max-w-xl overflow-auto p-6" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}><header className="mb-5 flex items-center justify-between"><h2 id={titleId} className="text-xl font-bold">{title}</h2><button type="button" className="btn !p-2" aria-label="Close dialog" onClick={onClose}><X size={18}/></button></header>{children}</section></div>;
}
