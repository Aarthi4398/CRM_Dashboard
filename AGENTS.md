# Aarthi CRM Agent Guide

## Purpose
Build and maintain an original CRM portfolio inspired by contemporary admin dashboards. Never copy TailAdmin Pro source code, branding, or restricted assets.

## Engineering rules
- Use strict TypeScript and direct imports.
- Keep browser-only behavior in small client components; prefer server components for static route shells.
- Preserve the versioned localStorage boundary in `src/lib/store.tsx`.
- Reuse CSS tokens and shared UI patterns from `globals.css`.
- Every interactive control needs an accessible label and keyboard focus state.
- Respect `prefers-reduced-motion` and verify light/dark themes.

## Verification
Run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `npm run test:e2e` before completion.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
