"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { seedState } from "./seed";
import type { CRMState } from "./types";

const STORAGE_KEY = "aarthi-crm:v1";
type Store = { state:CRMState; setState:React.Dispatch<React.SetStateAction<CRMState>>; reset:()=>void; hydrated:boolean };
type Actions = Pick<Store, "setState" | "reset">;
const StoreContext = createContext<Store | null>(null);
const ActionsContext = createContext<Actions | null>(null);

type SelectorStore = {
  getState: () => CRMState;
  subscribe: (listener: () => void) => () => void;
  update: (state: CRMState) => void;
};

const SelectorStoreContext = createContext<SelectorStore | null>(null);

function isState(value:unknown): value is CRMState {
  if (!value || typeof value !== "object") return false;
  const v=value as Partial<CRMState>;
  return Array.isArray(v.contacts)&&Array.isArray(v.companies)&&Array.isArray(v.deals)&&Array.isArray(v.tasks)&&Array.isArray(v.events)&&!!v.profile;
}

export function StoreProvider({children}:{children:React.ReactNode}) {
  const [state,setState]=useState<CRMState>(seedState);
  const [hydrated,setHydrated]=useState(false);
  const currentState = useRef(seedState);
  const selectorListeners = useRef(new Set<() => void>());
  const selectorStore = useMemo<SelectorStore>(() => {
    return {
      getState: () => currentState.current,
      subscribe: (listener) => { selectorListeners.current.add(listener); return () => selectorListeners.current.delete(listener); },
      update: (value) => { if (Object.is(currentState.current, value)) return; currentState.current = value; selectorListeners.current.forEach((listener) => listener()); },
    };
  }, []);
  useLayoutEffect(() => selectorStore.update(state), [selectorStore, state]);
  // Hydration is the one deliberate effect-to-state synchronization point.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(()=>{ try { const raw=localStorage.getItem(STORAGE_KEY); if(raw){const parsed:unknown=JSON.parse(raw); if(isState(parsed)) setState(parsed);} } catch { localStorage.removeItem(STORAGE_KEY); } setHydrated(true); },[]);
  useEffect(()=>{ if(hydrated) localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); },[state,hydrated]);
  const reset=useCallback(()=>{setState(seedState);localStorage.removeItem(STORAGE_KEY);},[]);
  const value=useMemo(()=>({state,setState,reset,hydrated}),[state,reset,hydrated]);
  const actions=useMemo(()=>({setState,reset}),[reset]);
  return <SelectorStoreContext.Provider value={selectorStore}><ActionsContext.Provider value={actions}><StoreContext.Provider value={value}>{children}</StoreContext.Provider></ActionsContext.Provider></SelectorStoreContext.Provider>;
}
export function useCRM(){const value=useContext(StoreContext);if(!value)throw new Error("useCRM must be used within StoreProvider");return value;}

export function useCRMSelector<T>(selector: (state: CRMState) => T): T {
  const store = useContext(SelectorStoreContext);
  if (!store) throw new Error("useCRMSelector must be used within StoreProvider");
  return useSyncExternalStore(store.subscribe, () => selector(store.getState()), () => selector(seedState));
}

export function useCRMActions() {
  const value = useContext(ActionsContext);
  if (!value) throw new Error("useCRMActions must be used within StoreProvider");
  return value;
}
