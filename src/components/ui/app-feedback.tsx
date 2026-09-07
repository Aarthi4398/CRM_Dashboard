"use client";

import { Modal } from "@/components/modal";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

type ConfirmRequest = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

type FeedbackContextValue = {
  toast: (message: string) => void;
  confirmAction: (request: ConfirmRequest) => Promise<boolean>;
};

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState("");
  const [confirmRequest, setConfirmRequest] = useState<ConfirmRequest | null>(null);
  const resolver = useRef<((value: boolean) => void) | null>(null);
  const toastTimer = useRef<number>(0);

  const toast = useCallback((next: string) => {
    window.clearTimeout(toastTimer.current);
    setMessage(next);
    toastTimer.current = window.setTimeout(() => setMessage(""), 2200);
  }, []);

  const closeConfirm = useCallback((value: boolean) => {
    resolver.current?.(value);
    resolver.current = null;
    setConfirmRequest(null);
  }, []);

  const confirmAction = useCallback((request: ConfirmRequest) => {
    resolver.current?.(false);
    setConfirmRequest(request);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const value = useMemo(() => ({ toast, confirmAction }), [toast, confirmAction]);

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      {message ? <div className="app-toast" role="status">{message}</div> : null}
      <Modal open={!!confirmRequest} title={confirmRequest?.title ?? "Confirm"} onClose={() => closeConfirm(false)}>
        <p className="text-sm leading-6">{confirmRequest?.message}</p>
        <div className="mt-5 flex justify-end gap-3">
          <button type="button" className="btn" onClick={() => closeConfirm(false)}>{confirmRequest?.cancelLabel ?? "Cancel"}</button>
          <button type="button" className="btn btn-primary" onClick={() => closeConfirm(true)}>{confirmRequest?.confirmLabel ?? "Confirm"}</button>
        </div>
      </Modal>
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const value = useContext(FeedbackContext);
  if (!value) throw new Error("useFeedback must be used within FeedbackProvider");
  return value;
}
