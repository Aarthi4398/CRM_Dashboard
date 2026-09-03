"use client";

import { useState } from "react";
import { BriefcaseBusiness, ChevronRight, House, Minus, Plus } from "lucide-react";

function Head({title}:{title:string}){return <header className="catalog-head"><h1>{title}</h1><div>Home <ChevronRight/> <b>{title}</b></div></header>}

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
