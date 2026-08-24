"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { seedState } from "./seed";
import type { CRMState } from "./types";

const STORAGE_KEY = "aarthi-crm:v1";
type Store = { state:CRMState; setState:React.Dispatch<React.SetStateAction<CRMState>>; reset:()=>void; hydrated:boolean };
const StoreContext = createContext<Store | null>(null);

function isState(value:unknown): value is CRMState {
  if (!value || typeof value !== "object") return false;
  const v=value as Partial<CRMState>;
  return Array.isArray(v.contacts)&&Array.isArray(v.companies)&&Array.isArray(v.deals)&&Array.isArray(v.tasks)&&Array.isArray(v.events)&&!!v.profile;
}

export function StoreProvider({children}:{children:React.ReactNode}) {
  const [state,setState]=useState<CRMState>(seedState);
  const [hydrated,setHydrated]=useState(false);
  // Hydration is the one deliberate effect-to-state synchronization point.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(()=>{ try { const raw=localStorage.getItem(STORAGE_KEY); if(raw){const parsed:unknown=JSON.parse(raw); if(isState(parsed)) setState(parsed);} } catch { localStorage.removeItem(STORAGE_KEY); } setHydrated(true); },[]);
  useEffect(()=>{ if(hydrated) localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); },[state,hydrated]);
  const reset=useCallback(()=>{setState(seedState);localStorage.removeItem(STORAGE_KEY);},[]);
  const value=useMemo(()=>({state,setState,reset,hydrated}),[state,reset,hydrated]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
export function useCRM(){const value=useContext(StoreContext);if(!value)throw new Error("useCRM must be used within StoreProvider");return value;}
