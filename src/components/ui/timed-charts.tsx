"use client";

import { Bar as RechartsBar, RadialBar as RechartsRadialBar } from "recharts";
import type { BarProps, RadialBarProps } from "recharts";

export function TimedBar(props: Omit<BarProps, "ref">) {
  return <RechartsBar animationDuration={1200} animationEasing="ease-in-out" {...props} />;
}

export function TimedRadialBar(props: Omit<RadialBarProps, "ref">) {
  return <RechartsRadialBar animationDuration={1800} animationEasing="ease-in-out" {...props} />;
}
