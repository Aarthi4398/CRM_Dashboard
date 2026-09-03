"use client";

import { useEffect } from "react";

export default function CRMError({error,reset}:{error:Error & {digest?:string};reset:()=>void}){
  useEffect(()=>{console.error(error)},[error]);
  return <main className="grid min-h-[60vh] place-items-center p-6"><section className="panel max-w-lg p-10 text-center"><div className="text-7xl font-bold text-[#465fff]">500</div><h1 className="mt-5 text-2xl font-bold">Something went wrong</h1><p className="muted mt-3">The page could not be displayed. Your stored CRM data has not been changed.</p><button className="btn btn-primary mt-7" onClick={reset}>Try again</button></section></main>
}
