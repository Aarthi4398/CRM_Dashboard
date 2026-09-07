import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { FeedbackProvider } from "@/components/ui/app-feedback";
import { WebVitalsReporter } from "@/components/web-vitals-reporter";

const outfit=Outfit({subsets:["latin"],variable:"--font-outfit",display:"swap"});
export const metadata:Metadata={title:{default:"Aarthi CRM",template:"%s | Aarthi CRM"},description:"An original CRM dashboard portfolio built with Next.js and TypeScript."};
const themeScript=`(()=>{try{const t=localStorage.getItem('aarthi-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch{}})()`;
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><body className={outfit.variable}><script dangerouslySetInnerHTML={{__html:themeScript}}/><FeedbackProvider><WebVitalsReporter/>{children}</FeedbackProvider></body></html>}
