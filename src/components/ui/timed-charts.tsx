"use client";

// Recharts relies on the exact component identity of each graphical series to
// register axes and render data. Keep these aliases native and unwrapped.
export {
  Area as TimedArea,
  Bar as TimedBar,
  Line as TimedLine,
  Pie as TimedPie,
  Radar as TimedRadar,
  RadialBar as TimedRadialBar,
} from "recharts";
