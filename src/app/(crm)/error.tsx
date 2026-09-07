"use client";

import { CRMErrorFallback } from "@/components/crm-error-fallback";

export default function CRMError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <CRMErrorFallback error={error} reset={reset} />;
}
