"use client";

import { useEffect } from "react";

type VitalName = "LCP" | "CLS" | "INP";

function report(name: VitalName, value: number) {
  const rounded = name === "CLS" ? Number(value.toFixed(4)) : Math.round(value);
  performance.mark(`web-vital:${name}:${rounded}`);
  if (process.env.NODE_ENV !== "production") {
    console.info(`[web-vital] ${name}`, rounded);
  }
}

export function WebVitalsReporter() {
  useEffect(() => {
    if (typeof PerformanceObserver === "undefined") return;
    const observers: PerformanceObserver[] = [];

    try {
      const lcp = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) report("LCP", last.startTime);
      });
      lcp.observe({ type: "largest-contentful-paint", buffered: true });
      observers.push(lcp);
    } catch {
      /* browser without LCP */
    }

    try {
      let cls = 0;
      const layout = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean };
          if (!shift.hadRecentInput) cls += shift.value ?? 0;
        }
        report("CLS", cls);
      });
      layout.observe({ type: "layout-shift", buffered: true });
      observers.push(layout);
    } catch {
      /* browser without CLS */
    }

    try {
      const inp = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1] as PerformanceEntry & { duration?: number };
        if (typeof last?.duration === "number") report("INP", last.duration);
      });
      inp.observe({ type: "event", buffered: true, durationThreshold: 40 } as PerformanceObserverInit);
      observers.push(inp);
    } catch {
      /* browser without INP */
    }

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  return null;
}
