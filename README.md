# Aarthi CRM Dashboard

An original, responsive CRM portfolio built with Next.js, React, TypeScript, Tailwind CSS, Recharts, and browser persistence. Its visual direction is inspired by the public TailAdmin CRM demo, but all implementation, sample data, branding, and composition are original.

## Features

- CRM overview with live pipeline KPIs and responsive charts
- Contacts CRUD, company directory, drag-and-drop deals pipeline
- Task list/Kanban, calendar event creation, and editable profile
- Collapsible responsive navigation, search, notifications, dropdowns, and dark mode
- Versioned localStorage persistence with a safe reset option
- Accessible controls, keyboard focus, reduced-motion support, and a branded 404

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Use `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` to verify the project.

## Architecture

The Next.js App Router supplies shared layouts and route-level composition. `StoreProvider` owns a typed `CRMState`, validates the persisted versioned payload, and exposes immutable updates through a custom hook. Pages consume the same state, so moving a deal immediately changes dashboard totals. This repository boundary can later be replaced by Supabase without rewriting the page components.

## Portfolio talking points

- React composition and custom hooks keep UI behavior reusable.
- Strict TypeScript models describe CRM domain relationships.
- Client boundaries are limited to interactive views; fonts and metadata use Next.js platform features.
- CSS variables provide consistent design tokens across both themes.
- Automated linting, type checks, unit tests, browser tests, and production builds provide evidence of quality.

## Deployment

Push this repository to GitHub, import it in Vercel, and accept the detected Next.js defaults. Add the production URL here after deployment.

Live URL: _pending Vercel deployment_

## License and attribution

This project is an original educational portfolio. TailAdmin is referenced only as visual inspiration; TailAdmin trademarks, Pro code, and restricted assets are not included.
