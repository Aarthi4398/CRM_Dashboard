"use client";
import { useState } from "react";
import { Bell, BriefcaseBusiness, ChevronDown, ChevronRight, House, Menu, Minus, Plus, Search, User } from "lucide-react";

function Head({title}:{title:string}){return <header className="catalog-head"><h1>{title}</h1><div>Home <ChevronRight/> <b>{title}</b></div></header>}

const layoutMenus={
  1:["Dashboard","Ecommerce","Analytics","Marketing","CRM","Stocks","SaaS","Logistics","Sales","AI","AI Assistant","E-commerce","Calendar","User Profile"],
  2:["General","Dashboard","Inventory Management","Product Development","Finance","Human Resources","Supply Chain","Public Profiles","Settings","Notifications","User Analytics","Projects","Design Engineering","Sales & Marketing","SaaS","Customer Support","API Reference"],
  3:["Get Started","Quick Start","Installation Guide","Tutorials","API Reference","Best Practices","FAQ","Components","Accordion","Alert","Alert Dialog","Aspect Ratio","Avatar","Badge","Breadcrumbs","Button","Button Group","Card"],
  4:["Get Started","Quick Start","Installation Guide","Tutorials","Configuration","Best Practices","FAQ","Developer Features","SDK Documentation","API Reference","Integration Guides","Tutorials","Release Notes"],
  5:["Get Started","Introduction","Quick Start","Framework guides","Usage","Javascript","Accessibility","Upgrade Guide","License","Components","Accordion","Alert","Avatar","Badge","Button","Card","Carousel","Chat Bubble","Collapse","Indicator","List Group"],
  6:["Dashboard","Calendar","Profiles","Settings","Design Engineering","Email","Inbox","Customer Support","Analytics","Integrations","Components"]
} as const;
export function Layouts({n}:{title:string;n:number}){
 const [drawer,setDrawer]=useState(false);const [expanded,setExpanded]=useState(n!==6);const menus=layoutMenus[n as keyof typeof layoutMenus];const docs=n>=3&&n<=5;
 return <div className={`reference-layout layout-${n}`}><aside className={`${drawer?"open":""} ${expanded?"expanded":"collapsed"}`}><header><span className="mini-logo"><i/><i/><i/></span>{n!==6&&<b>{docs?"TailAdmin Docs":"TailAdmin"}{docs&&<small>v2.0.8-alpha</small>}</b>}<button onClick={()=>setExpanded(v=>!v)} aria-label="Toggle layout navigation"><ChevronDown/></button></header>{docs&&n!==5?<label><Search/><input placeholder="Search the docs"/></label>:null}<nav>{menus.map((item,i)=>{const heading=(n===2&&[0,11,16].includes(i))||(n===3&&[0,7].includes(i))||(n===5&&[0,9].includes(i));const accordion=n===4&&[0,7,8,9,10,11,12].includes(i);return heading?<h3 key={`${item}-${i}`}>{item}</h3>:<button key={`${item}-${i}`} className={(n===1&&i===0)||(n===3&&i===8)||(n===4&&i===2)||(n===5&&i===3)||(n===6&&i===0)?"active":""} title={item}>{n===6?<LayoutIcon index={i}/>:null}<span>{item}</span>{accordion?<ChevronDown/>:null}</button>})}</nav></aside><div className="layout-stage"><header><button onClick={()=>setDrawer(true)} aria-label="Open layout navigation"><Menu/></button><label><Search/><input placeholder="Search or type command..."/><kbd>⌘ K</kbd></label><span/><button className="theme-dot">◔</button>{docs?<button className="get-started">Get Started</button>:<><button><Bell/></button><button className="layout-user"><User/><b>Musharof</b><ChevronDown/></button></>}</header><main><div className="reference-kpis">{[1,2,3,4].map(x=><i key={x}/>)}</div><div className="reference-grid"><article/><article/></div>{n===5?<div className="reference-kpis bottom">{[1,2,3,4].map(x=><i key={x}/>)}</div>:null}</main></div>{drawer?<button className="layout-overlay" onClick={()=>setDrawer(false)} aria-label="Close layout navigation"/>:null}</div>
}
function LayoutIcon({index}:{index:number}){return <span className="layout-symbol">{["▦","□","◉","⬡","◇","✉","▣","♧","◔","⌘","◆"][index]}</span>}


export function Maps({vector}:{vector:boolean}){return <><Head title={vector?"Vector Map":"Maps"}/>{vector?<div className="vector-map-grid"><VectorMapCard title="Global User Distribution" subtitle="Track active users and customer locations worldwide" mode="points"/><VectorMapCard title="Country Traffic Analytics" subtitle="Visualize traffic volume and engagement by region" mode="traffic"/><VectorMapCard title="US Customer Heatmap" subtitle="Analyze customer density and regional performance" mode="usa"/></div>:<div className="map-grid"><MapCard title="Map View" subtitle="Clear view of locations at a glance"><LocationMap variant="street"/></MapCard><MapCard title="Map 2" subtitle="Clear view of locations at a glance"><LocationMap variant="google"/></MapCard><MapCard title="Washington D.C. Region" subtitle="Interactive map with Home and Office Pinned" className="regional"><LocationMap variant="regional"/></MapCard></div>}</>}
function MapCard({title,subtitle,children,className=""}:{title:string;subtitle:string;children:React.ReactNode;className?:string}){return <section className={`map-reference-card ${className}`}><header><h2>{title}</h2><p>{subtitle}</p></header>{children}</section>}
const washingtonViews=[
 "https://www.openstreetmap.org/export/embed.html?bbox=-77.316%2C38.776%2C-76.758%2C39.055&layer=mapnik",
 "https://www.openstreetmap.org/export/embed.html?bbox=-77.196%2C38.833%2C-76.918%2C38.972&layer=mapnik",
 "https://www.openstreetmap.org/export/embed.html?bbox=-77.126%2C38.868%2C-76.987%2C38.938&layer=mapnik"
];
const googleMap="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.5145053176284!2d90.42105717591272!3d23.800296778636472!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7e9f37a5a3d%3A0x41d7d1d02e1ed0e4!2sPimjo!5e0!3m2!1sen!2sbd!4v1751871078440!5m2!1sen!2sbd";
function LocationMap({variant}:{variant:"street"|"google"|"regional"}){
 const [zoom,setZoom]=useState(1);
 if(variant==="google")return <div className="catalog-map google-map"><iframe src={googleMap} title="Pimjo location map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen/></div>;
 const regional=variant==="regional";
 return <div className={`catalog-map live-map ${regional?"regional-map":"street-map"}`}><iframe key={zoom} src={washingtonViews[zoom]} title={regional?"Washington D.C. regional map":"Washington D.C. metro map"} loading="lazy"/>{regional?<div className="map-pins" aria-label="Pinned locations"><MapPlace label="Home" className="home"><House/></MapPlace><MapPlace label="Office" className="office"><BriefcaseBusiness/></MapPlace></div>:null}<nav className="map-zoom"><button aria-label="Zoom in" disabled={zoom===washingtonViews.length-1} onClick={()=>setZoom(value=>Math.min(washingtonViews.length-1,value+1))}><Plus/></button><button aria-label="Zoom out" disabled={zoom===0} onClick={()=>setZoom(value=>Math.max(0,value-1))}><Minus/></button></nav></div>;
}
function MapPlace({label,className,children}:{label:string;className:string;children:React.ReactNode}){return <span className={`map-place ${className}`}><i>{children}</i><b>{label}</b></span>}
function VectorMapCard({title,subtitle,mode}:{title:string;subtitle:string;mode:string}){return <section className="vector-map-card"><header><h2>{title}</h2><p>{subtitle}</p></header><div className={`vector-world ${mode}`}><span/><i/><b/><em/><nav><button aria-label="Zoom in">+</button><button aria-label="Zoom out">−</button></nav></div></section>}
