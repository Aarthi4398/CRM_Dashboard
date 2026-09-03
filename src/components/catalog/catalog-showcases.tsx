"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { AlertCircle, ArrowLeft, ArrowRight, ArrowUpDown, Bell, Box, ChevronDown, ChevronRight, CircleCheck, Info, Layers3, Link2, RectangleVertical, SlidersHorizontal, User } from "lucide-react";

const asset=(path:string)=>"https://nextjs-demo.tailadmin.com"+path;
function Head({title}:{title:string}){return <header className="catalog-head"><h1>{title}</h1><div>Home <ChevronRight/> <b>{title}</b></div></header>}

const alertGroups=[
 {title:"Success Alert",tone:"success",message:"Success Message",icon:CircleCheck},
 {title:"Warning Alert",tone:"warning",message:"Warning Message",icon:Info},
 {title:"Error Alert",tone:"error",message:"Error Message",icon:AlertCircle},
 {title:"Info Alert",tone:"info",message:"Info Message",icon:Info}
] as const;
export function AlertsPage(){return <><Head title="Alerts"/><div className="alerts-reference-page">{alertGroups.map(group=><AlertSection key={group.title} {...group}/>)}</div></>}
function AlertSection({title,tone,message,icon:Icon}:{title:string;tone:string;message:string;icon:React.ComponentType<{className?:string}>}){return <section className="alert-reference-card"><header><h2>{title}</h2></header><div>{[true,false].map((linked,index)=><div className={`premium-alert ${tone}`} key={index}><Icon className="premium-alert-icon"/><div><h3>{message}</h3><p>Be cautious when performing this action.</p>{linked?<a href="#" onClick={event=>event.preventDefault()}>Learn more</a>:null}</div></div>)}</div></section>}

const cardText="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi architecto aspernatur cum et ipsum";
export function CardsPage(){return <><Head title="Cards"/><div className="cards-reference-page">
 <CardShowcase title="Card with Image"><div className="cards-image-grid"><ReferenceImageCard image={1} appearance="title-button"/><ReferenceImageCard image={2} appearance="button"/><ReferenceImageCard image={3} appearance="title-link"/></div></CardShowcase>
 <CardShowcase title="Horizontal Card with Image"><div className="cards-horizontal-grid"><ReferenceHorizontalCard image={1} appearance="title-button"/><ReferenceHorizontalCard image={3} appearance="title-link"/></div></CardShowcase>
 <CardShowcase title="Card with link"><div className="cards-link-grid"><ReferenceTextCard appearance="title-button"/><ReferenceTextCard appearance="title-link"/></div></CardShowcase>
 <CardShowcase title="Card with Icon"><div className="cards-icon-grid"><ReferenceIconCard/><ReferenceIconCard link/></div></CardShowcase>
 </div></>}
function CardShowcase({title,children}:{title:string;children:React.ReactNode}){return <section className="card-showcase"><header><h2>{title}</h2></header><div>{children}</div></section>}
type CardAppearance="title-button"|"button"|"title-link";
function CardBody({appearance}:{appearance:CardAppearance}){const title=appearance!=="button";const button=appearance.endsWith("button");return <div className="reference-card-body">{title?<h3>Card title</h3>:null}<p>{cardText}</p>{button?<a className="reference-card-button" href="#" onClick={event=>event.preventDefault()}>Read more</a>:<a className="reference-card-link" href="#" onClick={event=>event.preventDefault()}><Link2/>Card link</a>}</div>}
function ReferenceImageCard({image,appearance}:{image:number;appearance:CardAppearance}){return <article className="reference-image-card"><Image width={640} height={360} src={asset(`/images/cards/card-0${image}.png`)} alt="card"/><CardBody appearance={appearance}/></article>}
function ReferenceHorizontalCard({image,appearance}:{image:number;appearance:CardAppearance}){return <article className="reference-horizontal-card"><Image width={640} height={360} src={asset(`/images/cards/card-0${image}.png`)} alt="card"/><CardBody appearance={appearance}/></article>}
function ReferenceTextCard({appearance}:{appearance:CardAppearance}){return <article className="reference-text-card"><CardBody appearance={appearance}/></article>}
function ReferenceIconCard({link=false}:{link?:boolean}){return <article className="reference-icon-card"><span><Box/></span><h3>Card title</h3><p>{cardText}</p>{link?<a href="#" onClick={event=>event.preventDefault()}>Read more <ArrowRight/></a>:null}</article>}

const carouselImages=[1,2,3,4].map(index=>asset(`/images/carousel/carousel-0${index}.png`));
export function CarouselPage(){return <><Head title="Carousel"/><main className="carousel-reference-page">
 <CarouselCard title="Slides Only"><PremiumCarousel features="none"/></CarouselCard>
 <CarouselCard title="With controls"><PremiumCarousel features="controls"/></CarouselCard>
 <CarouselCard title="With indicators"><PremiumCarousel features="indicators"/></CarouselCard>
 <CarouselCard title="With controls and indicators"><PremiumCarousel features="both-compact"/></CarouselCard>
 </main></>}
function CarouselCard({title,children}:{title:string;children:React.ReactNode}){return <section className="carousel-card"><header><h2>{title}</h2></header><div className="carousel-card-body">{children}</div></section>}
function PremiumCarousel({features}:{features:"none"|"controls"|"indicators"|"both-compact"}){
 const controls=features==="controls"||features==="both-compact",indicators=features==="indicators"||features==="both-compact",compactControls=features==="both-compact";
 const [active,setActive]=useState(0);
 useEffect(()=>{const timer=window.setInterval(()=>setActive(value=>(value+1)%carouselImages.length),4500);return()=>window.clearInterval(timer)},[]);
 const move=(amount:number)=>setActive(value=>(value+amount+carouselImages.length)%carouselImages.length);
 return <div className={`premium-carousel ${compactControls?"compact-controls":""}`}>
  <div className="carousel-track" style={{transform:`translate3d(-${active*100}%,0,0)`}}>{carouselImages.map((src,index)=><div className="carousel-slide" key={src} aria-hidden={index!==active}><Image width={640} height={360} src={src} alt={`Carousel slide ${index+1}`}/></div>)}</div>
  {controls?<><button className="carousel-arrow prev" onClick={()=>move(-1)} aria-label="Previous slide"><ArrowLeft/></button><button className="carousel-arrow next" onClick={()=>move(1)} aria-label="Next slide"><ArrowRight/></button></>:null}
  {indicators?<div className="carousel-indicators" aria-label="Choose slide">{carouselImages.map((_,index)=><button key={index} className={index===active?"active":""} onClick={()=>setActive(index)} aria-label={`Go to slide ${index+1}`}/>)}</div>:null}
 </div>
}

type DropdownItem={label:string;icon?:React.ReactNode;dividerBefore?:boolean};
const defaultDropdownItems:DropdownItem[]=[{label:"Edit Profile"},{label:"Account Settings"},{label:"License"},{label:"Support"}];
const dividerDropdownItems:DropdownItem[]=[{label:"Edit"},{label:"Duplicate"},{label:"Archive",dividerBefore:true},{label:"Move"},{label:"Delete",dividerBefore:true}];
const iconDropdownItems:DropdownItem[]=[{label:"Edit profile",icon:<User/>},{label:"Settings",icon:<SlidersHorizontal/>},{label:"Support",icon:<Info/>},{label:"Sign out",icon:<ArrowRight/> ,dividerBefore:true}];
const iconDividerItems:DropdownItem[]=[{label:"Edit profile",icon:<User/>},{label:"Settings",icon:<SlidersHorizontal/>},{label:"Team",icon:<Layers3/>,dividerBefore:true},{label:"Subscription",icon:<RectangleVertical/>},{label:"Sign out",icon:<ArrowRight/>,dividerBefore:true}];
export function DropdownsPage(){return <><Head title="Dropdowns"/><main className="dropdown-reference-page">
 <DropdownCard title="Default Dropdown"><PremiumDropdown label="Account Menu" items={defaultDropdownItems}/></DropdownCard>
 <DropdownCard title="Dropdown With Divider"><PremiumDropdown label="Options" items={dividerDropdownItems}/></DropdownCard>
 <DropdownCard title="Dropdown With Icon"><PremiumDropdown label="Account Menu" items={iconDropdownItems}/></DropdownCard>
 <DropdownCard title="Dropdown With Icon and Divider"><PremiumDropdown label="Account Menu" items={iconDividerItems}/></DropdownCard>
 </main></>}
function DropdownCard({title,children}:{title:string;children:React.ReactNode}){return <section className="dropdown-card"><header><h2>{title}</h2></header><div className="dropdown-card-body">{children}</div></section>}
function PremiumDropdown({label,items}:{label:string;items:DropdownItem[]}){const [open,setOpen]=useState(false);return <div className="premium-dropdown"><button className="dropdown-trigger" onClick={()=>setOpen(value=>!value)} aria-haspopup="menu" aria-expanded={open}>{label}<ChevronDown className={open?"open":""}/></button>{open?<div className="dropdown-menu" role="menu">{items.map(item=><div key={item.label}>{item.dividerBefore?<span className="dropdown-divider"/>:null}<button role="menuitem">{item.icon}<span>{item.label}</span></button></div>)}</div>:null}</div>}

export function PaginationPage(){return <><Head title="Pagination"/><main className="pagination-reference-page">
 <PaginationCard title="Pagination with Text"><PremiumPagination variant="text"/></PaginationCard>
 <PaginationCard title="Pagination with Text and Icon"><PremiumPagination variant="text-icon"/></PaginationCard>
 <PaginationCard title="Pagination with  Icon"><PremiumPagination variant="icon"/></PaginationCard>
 </main></>}
function PaginationCard({title,children}:{title:string;children:React.ReactNode}){return <section className="pagination-card"><header><h2>{title}</h2></header><div className="pagination-card-body">{children}</div></section>}
function PremiumPagination({variant}:{variant:"text"|"text-icon"|"icon"}){const [page,setPage]=useState(1);const pages=[1,2,3,4,5,"…",10] as const;const previous=()=>setPage(value=>Math.max(1,value-1));const next=()=>setPage(value=>Math.min(10,value+1));const showIcons=variant!=="text";const iconOnly=variant==="icon";return <nav className={`premium-pagination ${iconOnly?"icon-only-pagination":""}`} aria-label="Pagination">
 <button className="pagination-nav previous" onClick={previous} disabled={page===1} aria-label="Previous page"><ArrowLeft className={showIcons?"":"mobile-only-arrow"}/>{iconOnly?null:<span>Previous</span>}</button>
 <span className="pagination-mobile-status">Page {page} of 10</span>
 <div className="pagination-pages">{pages.map((item,index)=>item==="…"?<span className="pagination-ellipsis" key={`dots-${index}`}>...</span>:<button key={item} className={page===item?"active":""} onClick={()=>setPage(item)} aria-current={page===item?"page":undefined}>{item}</button>)}</div>
 <button className="pagination-nav next" onClick={next} disabled={page===10} aria-label="Next page">{iconOnly?null:<span>Next</span>}<ArrowRight className={showIcons?"":"mobile-only-arrow"}/></button>
 </nav>}

type PopoverDirection="top"|"bottom"|"right"|"left";
type PopoverVariant="default"|"buttons"|"link";
const popoverDirections:PopoverDirection[]=["top","bottom","right","left"];
export function PopoversPage(){return <><Head title="Popovers"/><main className="popovers-reference-page">
 <PopoverCard title="Default Popover"><PopoverRow variant="default"/></PopoverCard>
 <PopoverCard title="Popover With Button"><PopoverRow variant="buttons"/></PopoverCard>
 <PopoverCard title="Popover With Link"><PopoverRow variant="link"/></PopoverCard>
 </main></>}
function PopoverCard({title,children}:{title:string;children:React.ReactNode}){return <section className="popover-card"><header><h2>{title}</h2></header><div className="popover-card-body"><div className="popover-scroll">{children}</div></div></section>}
function PopoverRow({variant}:{variant:PopoverVariant}){const [open,setOpen]=useState<PopoverDirection|null>(null);return <div className="popover-row">{popoverDirections.map(direction=><div className="popover-anchor" key={direction}><button className="popover-trigger" onClick={()=>setOpen(value=>value===direction?null:direction)} aria-expanded={open===direction} aria-haspopup="dialog">Popover on {direction[0].toUpperCase()+direction.slice(1)}</button>{open===direction?<PopoverPanel direction={direction} variant={variant}/>:null}</div>)}</div>}
function PopoverPanel({direction,variant}:{direction:PopoverDirection;variant:PopoverVariant}){return <div className={`popover-panel ${direction}`} role="dialog"><header><h3>{direction[0].toUpperCase()+direction.slice(1)} Popover</h3></header><div className="popover-content"><p>Lorem ipsum dolor sit amet, consect adipiscing elit. Mauris facilisis congue exclamate justo nec facilisis.</p>{variant==="buttons"?<div className="popover-actions"><button>Yes! got it</button><button>Learn more</button></div>:null}{variant==="link"?<a href="#" onClick={event=>event.preventDefault()}>Learn More <ArrowRight/></a>:null}</div><span className="popover-pointer"/></div>}

type TabVariant="default"|"underline"|"icon"|"badge"|"vertical";
const tabLabels=["Overview","Notification","Analytics","Customers"] as const;
const tabIcons=[<Layers3 key="overview"/>,<Bell key="notification"/>,<ArrowUpDown key="analytics"/>,<User key="customers"/>];
const tabBadges:Record<string,string>={Overview:"8",Analytics:"4",Customers:"12"};
export function TabsPage(){return <main className="tabs-reference-page">
 <TabsCard title="Default Tab" variant="default"/>
 <TabsCard title="Tab With Underline" variant="underline"/>
 <TabsCard title="Tab with line and icon" variant="icon"/>
 <TabsCard title="Tab with badge" variant="badge"/>
 <TabsCard title="Vertical Tab" variant="vertical"/>
 </main>}
function TabsCard({title,variant}:{title:string;variant:TabVariant}){return <section className={`tabs-card tabs-${variant}`}><header><h2>{title}</h2></header><div className="tabs-card-body"><InteractiveTabs variant={variant}/></div></section>}
function InteractiveTabs({variant}:{variant:TabVariant}){const [active,setActive]=useState<(typeof tabLabels)[number]>("Overview");const navigation=<nav className="premium-tabs" role="tablist" aria-label={`${variant} tabs`}>{tabLabels.map((label,index)=><button key={label} className={active===label?"active":""} onClick={()=>setActive(label)} role="tab" aria-selected={active===label}>{variant==="icon"?tabIcons[index]:null}<span>{label}</span>{variant==="badge"&&tabBadges[label]?<small>{tabBadges[label]}</small>:null}</button>)}</nav>;return <div className={`tabs-demo ${variant}`}><div className="tabs-layout">{variant==="underline"?<div className="tabs-nav-frame">{navigation}</div>:navigation}<div className="tab-panel"><h3>{active}</h3><p>{active} ipsum dolor sit amet consectetur. Non vitae facilisis urna tortor placerat egestas donec. Faucibus diam gravida enim elit lacus a. Tincidunt fermentum condimentum quis et a et tempus. Tristique urna nisi nulla elit sit libero scelerisque ante.</p></div></div></div>}
