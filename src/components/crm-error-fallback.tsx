"use client";

import { useEffect, useRef } from "react";

type CRMErrorFallbackProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export function CRMErrorFallback({ error, reset }: CRMErrorFallbackProps) {
  const retryRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    console.error("[crm-error-boundary]", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  useEffect(() => {
    retryRef.current?.focus();
  }, []);

  return (
    <main
      className="grid min-h-[60vh] place-items-center p-6"
      role="alert"
      aria-labelledby="crm-error-title"
      aria-describedby="crm-error-description"
    >
      <section className="panel max-w-lg p-10 text-center">
        <p className="text-7xl font-bold text-[#465fff]" aria-hidden="true">500</p>
        <h1 id="crm-error-title" className="mt-5 text-2xl font-bold">
          Something went wrong
        </h1>
        <p id="crm-error-description" className="muted mt-3">
          This page could not be displayed. Your stored CRM data has not been changed.
        </p>
        <button
          ref={retryRef}
          type="button"
          className="btn btn-primary mt-7"
          onClick={() => reset()}
        >
          Try again
        </button>
      </section>
    </main>
  );
}
