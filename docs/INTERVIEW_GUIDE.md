# Interview Guide — Aarthi CRM

## 90-second introduction

“I built Aarthi CRM as a seven-page customer relationship dashboard using Next.js, React, TypeScript, and Tailwind CSS. I worked from a public visual reference but implemented the design system and interactions from scratch. The dashboard shares typed browser-persisted data across contacts, companies, deals, tasks, calendar events, and profile settings. A key example is the deals pipeline: moving an opportunity changes its stage and the dashboard derives updated revenue and active-pipeline metrics from the same source of truth.”

## Architecture walkthrough

1. App Router route groups share one responsive dashboard shell.
2. TypeScript interfaces model the CRM domain and prevent invalid state transitions.
3. A custom context hook exposes one versioned repository boundary over localStorage.
4. Components derive dashboard metrics instead of storing duplicate totals.
5. Design tokens and Outfit typography produce consistent light/dark themes.
6. Recharts handles responsive data visualization; native drag events keep the pipeline lightweight.

## Challenges and answers

**Why localStorage?** It makes the deployed portfolio immediately interactive without accounts or a paid backend. The repository boundary makes Supabase a contained future change.

**Why Next.js instead of plain React?** Next.js adds file-based routing, shared layouts, optimized fonts, metadata, production bundling, and a simple Vercel deployment path.

**How did you avoid unnecessary re-renders?** Derived lists use memoization where filtering is meaningful, state updates are immutable, event handlers perform mutations directly, and static metadata stays server-side.

**How is accessibility addressed?** Controls have labels, dialogs close with Escape, navigation is semantic, focus rings are visible, responsive overlays have explicit dismiss actions, and motion respects user preferences.

**What would you build next?** Supabase authentication/PostgreSQL, server actions, role-based access, audit logs, optimistic updates, and real analytics ingestion.

## Demo sequence

1. Toggle dark mode and collapse the sidebar.
2. Add and edit a contact, then search globally.
3. Drag a deal between pipeline stages and return to the dashboard.
4. Change task status and create a calendar event.
5. Refresh to demonstrate browser persistence.
6. Show the Git commit history, automated checks, and Vercel deployment.
