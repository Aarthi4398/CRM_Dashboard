import { ChevronRight, Plus, Search } from "lucide-react";
import { Charts } from "./catalog-charts";
import { BasicTables, DataTables } from "./catalog-tables";
import { AlertsPage, CardsPage, CarouselPage, DropdownsPage, PaginationPage, PopoversPage, TabsPage } from "./catalog-showcases";
import { AdvancedGenerator, Generator } from "./catalog-generators";
import { Layouts, Maps } from "./catalog-layouts-maps";
import { Elements } from "./catalog-elements";

const generators=new Set(["text-generator","image-generator","code-generator","video-generator"]);
const layouts=new Set(["layout-one","layout-two","layout-three","layout-four","layout-five","layout-six"]);
const chartRoutes=new Set(["line-chart","bar-chart","pie-chart","radar-chart","radial-chart"]);
const uiRoutes=new Set(["alerts","avatar","avatars","badge","breadcrumb","buttons","buttons-group","cards","carousel","dropdowns","images","links","list","modals","notification","notifications","pagination","popovers","progress-bar","ribbons","spinners","tabs","tooltips","videos"]);

export function CatalogPage({slug,title}:{slug:string;title:string}){
 if(slug==="basic-tables")return <BasicTables/>;
 if(slug==="data-tables")return <DataTables/>;
 if(slug==="alerts")return <AlertsPage/>;
 if(slug==="cards")return <CardsPage/>;
 if(slug==="carousel")return <CarouselPage/>;
 if(slug==="dropdowns")return <DropdownsPage/>;
 if(slug==="pagination")return <PaginationPage/>;
 if(slug==="popovers")return <PopoversPage/>;
 if(slug==="tabs")return <TabsPage/>;
 if(slug==="video-generator"||slug==="code-generator")return <AdvancedGenerator kind={slug.split("-")[0] as "video"|"code"}/>;
 if(generators.has(slug))return <Generator kind={slug.split("-")[0]}/>;
 if(layouts.has(slug))return <Layouts title={title} n={["one","two","three","four","five","six"].indexOf(slug.split("-")[1])+1}/>;
 if(chartRoutes.has(slug))return <Charts title={title} type={slug.split("-")[0]}/>;
 if(slug==="maps"||slug==="vector-map")return <Maps vector={slug==="vector-map"}/>;
 if(uiRoutes.has(slug))return <Elements slug={slug} title={title}/>;
 return <><Head title={title}/><Card title={`${title} Overview`}><div className="catalog-empty"><Search/><h3>Manage {title}</h3><p>Search, review and manage your latest records.</p><button className="catalog-primary"><Plus/>Create New</button></div></Card></>;
}
function Head({title}:{title:string}){return <header className="catalog-head"><h1>{title}</h1><div>Home <ChevronRight/> <b>{title}</b></div></header>}
function Card({title,children,className=""}:{title:string;children:React.ReactNode;className?:string}){return <section className={`catalog-card ${className}`}><h2>{title}</h2><div>{children}</div></section>}
