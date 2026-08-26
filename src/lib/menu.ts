import type { LucideIcon } from "lucide-react";
import { Bot, Boxes, CalendarDays, ChartNoAxesCombined, CircleUserRound, FileText, FormInput, Headphones, LayoutDashboard, LayoutGrid, LockKeyhole, Mail, Map as MapIcon, MessageCircle, Package, Table2, WandSparkles } from "lucide-react";

export type MenuChild={label:string;href:string;badge?:string};
export type MenuItem={label:string;href?:string;icon:LucideIcon;badge?:string;children?:MenuChild[]};
export type MenuSection={title:string;items:MenuItem[]};

export const menuSections:MenuSection[]=[
 {title:"Menu",items:[
  {label:"Dashboard",icon:LayoutDashboard,children:[{label:"Ecommerce",href:"/ecommerce"},{label:"Analytics",href:"/analytics"},{label:"Marketing",href:"/marketing"},{label:"CRM",href:"/dashboard"},{label:"Stocks",href:"/stocks"},{label:"SaaS",href:"/saas"},{label:"Logistics",href:"/logistics"},{label:"AI",href:"/ai",badge:"new"},{label:"Sales",href:"/sales",badge:"new"},{label:"Finance",href:"/finance",badge:"new"}]},
  {label:"AI Assistant",icon:Bot,badge:"new",children:[{label:"Text Generator",href:"/text-generator"},{label:"Image Generator",href:"/image-generator"},{label:"Code Generator",href:"/code-generator"},{label:"Video Generator",href:"/video-generator"},{label:"AI Settings",href:"/ai-settings"}]},
  {label:"E-commerce",icon:Package,children:[{label:"Products",href:"/products-list"},{label:"Add Product",href:"/add-product"},{label:"Billing",href:"/billing"},{label:"Invoices",href:"/invoices"},{label:"Single Invoice",href:"/single-invoice"},{label:"Create Invoice",href:"/create-invoice"},{label:"Transactions",href:"/transactions"},{label:"Single Transaction",href:"/single-transaction"}]},
  {label:"Calendar",href:"/calendar",icon:CalendarDays},{label:"User Profile",href:"/profile",icon:CircleUserRound},
  {label:"Task",icon:Boxes,children:[{label:"List",href:"/task-list"},{label:"Kanban",href:"/task-kanban"}]},
  {label:"Forms",icon:FormInput,children:[{label:"Form Elements",href:"/form-elements"},{label:"Form Layout",href:"/form-layout"}]},
  {label:"Tables",icon:Table2,children:[{label:"Basic Tables",href:"/basic-tables"},{label:"Data Tables",href:"/data-tables"}]},
  {label:"Pages",icon:FileText,children:[{label:"File Manager",href:"/file-manager"},{label:"Pricing Tables",href:"/pricing-tables"},{label:"FAQ",href:"/faq"},{label:"API Keys",href:"/api-keys",badge:"new"},{label:"Integrations",href:"/integrations",badge:"new"},{label:"Blank Page",href:"/blank"},{label:"404 Error",href:"/error-404"},{label:"500 Error",href:"/error-500"},{label:"503 Error",href:"/error-503"},{label:"Coming Soon",href:"/coming-soon"},{label:"Maintenance",href:"/maintenance"},{label:"Success",href:"/success"}]},
  {label:"Layouts",icon:LayoutGrid,badge:"new",children:[1,2,3,4,5,6].map(n=>({label:`Layout ${["One","Two","Three","Four","Five","Six"][n-1]}`,href:`/layout-${["one","two","three","four","five","six"][n-1]}`}))},
 ]},
 {title:"Support",items:[
  {label:"Chat",href:"/chat",icon:MessageCircle},{label:"Support",icon:Headphones,badge:"new",children:[{label:"Support List",href:"/support-tickets"},{label:"Support Reply",href:"/support-ticket-reply"}]},{label:"Email",icon:Mail,children:[{label:"Inbox",href:"/inbox"},{label:"Details",href:"/inbox-details"}]},
 ]},
 {title:"Others",items:[
  {label:"Charts",icon:ChartNoAxesCombined,children:[{label:"Line Chart",href:"/line-chart"},{label:"Bar Chart",href:"/bar-chart"},{label:"Pie Chart",href:"/pie-chart"},{label:"Radar Chart",href:"/radar-chart"},{label:"Radial Chart",href:"/radial-chart"}]},
  {label:"Maps",icon:MapIcon,children:[{label:"Maps",href:"/maps"},{label:"Vector Map",href:"/vector-map"}]},
  {label:"UI Elements",icon:WandSparkles,children:["Alerts","Avatar","Badge","Breadcrumb","Buttons","Buttons Group","Cards","Carousel","Dropdowns","Images","Links","List","Modals","Notifications","Pagination","Popovers","Progressbar","Ribbons","Spinners","Tabs","Tooltips","Videos"].map(label=>({label,href:label === "Avatar" ? "/avatars" : `/${label.toLowerCase().replaceAll(" ","-").replace("progressbar","progress-bar")}`}))},
  {label:"Authentication",icon:LockKeyhole,children:[{label:"Sign In",href:"/signin"},{label:"Sign Up",href:"/signup"},{label:"Reset Password",href:"/reset-password"},{label:"Two Step Verification",href:"/two-step-verification"}]},
 ]},
];

export const routeTitles=new Map(menuSections.flatMap(section=>section.items.flatMap(item=>item.href?[[item.href.slice(1),item.label] as const]:(item.children??[]).map(child=>[child.href.slice(1),child.label] as const))));
