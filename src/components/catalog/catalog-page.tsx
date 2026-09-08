"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { ChevronRight, Plus, Search } from "lucide-react";
import { TabsPage } from "./catalog-showcases";

const CatalogVisualLoading = ({ label }: { label: string }) => (
  <div className="grid gap-6" role="status" aria-label={label}>
    <span className="sr-only">{label}</span>
    <div className="catalog-card h-[430px] animate-pulse bg-[var(--soft)]" aria-hidden="true" />
  </div>
);

const BasicTables = dynamic(() => import("./catalog-tables").then((module) => module.BasicTables), {
  loading: () => <CatalogVisualLoading label="Loading tables" />,
});
const DataTables = dynamic(() => import("./catalog-tables").then((module) => module.DataTables), {
  loading: () => <CatalogVisualLoading label="Loading tables" />,
});
const AlertsPage = dynamic(() => import("./catalog-showcases").then((module) => module.AlertsPage), {
  loading: () => <CatalogVisualLoading label="Loading UI examples" />,
});
const CardsPage = dynamic(() => import("./catalog-showcases").then((module) => module.CardsPage), {
  loading: () => <CatalogVisualLoading label="Loading UI examples" />,
});
const CarouselPage = dynamic(() => import("./catalog-showcases").then((module) => module.CarouselPage), {
  loading: () => <CatalogVisualLoading label="Loading UI examples" />,
});
const DropdownsPage = dynamic(() => import("./catalog-showcases").then((module) => module.DropdownsPage), {
  loading: () => <CatalogVisualLoading label="Loading UI examples" />,
});
const PaginationPage = dynamic(() => import("./catalog-showcases").then((module) => module.PaginationPage), {
  loading: () => <CatalogVisualLoading label="Loading UI examples" />,
});
const PopoversPage = dynamic(() => import("./catalog-showcases").then((module) => module.PopoversPage), {
  loading: () => <CatalogVisualLoading label="Loading UI examples" />,
});
const AdvancedGenerator = dynamic(() => import("./catalog-generators").then((module) => module.AdvancedGenerator), {
  loading: () => <CatalogVisualLoading label="Loading generator" />,
});
const Generator = dynamic(() => import("./catalog-generators").then((module) => module.Generator), {
  loading: () => <CatalogVisualLoading label="Loading generator" />,
});
const Layouts = dynamic(() => import("./catalog-layouts-maps").then((module) => module.Layouts), {
  loading: () => <CatalogVisualLoading label="Loading layout demo" />,
});
const Elements = dynamic(() => import("./catalog-elements").then((module) => module.Elements), {
  loading: () => <CatalogVisualLoading label="Loading UI examples" />,
});
const Charts = dynamic(() => import("./catalog-charts").then((module) => module.Charts), {
  loading: () => <CatalogVisualLoading label="Loading chart examples" />,
});
const Maps = dynamic(() => import("./catalog-maps").then((module) => module.Maps), {
  loading: () => <CatalogVisualLoading label="Loading maps" />,
});

const LAYOUT_SLUGS = ["one", "two", "three", "four", "five", "six"] as const;

type CatalogView = (title: string) => ReactNode;

const catalogViews: Record<string, CatalogView> = {
  "basic-tables": () => <BasicTables />,
  "data-tables": () => <DataTables />,
  alerts: () => <AlertsPage />,
  cards: () => <CardsPage />,
  carousel: () => <CarouselPage />,
  dropdowns: () => <DropdownsPage />,
  pagination: () => <PaginationPage />,
  popovers: () => <PopoversPage />,
  tabs: () => <TabsPage />,
  "video-generator": () => <AdvancedGenerator kind="video" />,
  "code-generator": () => <AdvancedGenerator kind="code" />,
  "text-generator": () => <Generator kind="text" />,
  "image-generator": () => <Generator kind="image" />,
  maps: () => <Maps vector={false} />,
  "vector-map": () => <Maps vector />,
  "line-chart": (title) => <Charts title={title} type="line" />,
  "bar-chart": (title) => <Charts title={title} type="bar" />,
  "pie-chart": (title) => <Charts title={title} type="pie" />,
  "radar-chart": (title) => <Charts title={title} type="radar" />,
  "radial-chart": (title) => <Charts title={title} type="radial" />,
};

for (const [index, token] of LAYOUT_SLUGS.entries()) {
  catalogViews[`layout-${token}`] = (title) => <Layouts title={title} n={index + 1} />;
}

const uiRoutes = [
  "avatars", "badge", "breadcrumb", "buttons", "buttons-group", "images", "links", "list",
  "modals", "notifications", "progress-bar", "ribbons", "spinners", "tooltips", "videos",
] as const;

for (const slug of uiRoutes) {
  catalogViews[slug] = (title) => <Elements slug={slug} title={title} />;
}

function Fallback({ title }: { title: string }) {
  return (
    <>
      <header className="catalog-head">
        <h1>{title}</h1>
        <div>Home <ChevronRight /> <b>{title}</b></div>
      </header>
      <section className="catalog-card">
        <h2>{title} Overview</h2>
        <div>
          <div className="catalog-empty">
            <Search />
            <h3>Manage {title}</h3>
            <p>Search, review and manage your latest records.</p>
            <button className="catalog-primary"><Plus />Create New</button>
          </div>
        </div>
      </section>
    </>
  );
}

export function CatalogPage({ slug, title }: { slug: string; title: string }) {
  const view = catalogViews[slug];
  return view ? view(title) : <Fallback title={title} />;
}
