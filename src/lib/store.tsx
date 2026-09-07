"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createLocalStorageRepository } from "./data/repository";
import { seedState } from "./seed";
import type { CRMState } from "./types";
import { normalizeCRMRelationships } from "./validate-state";

const repository = createLocalStorageRepository();
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

export function StoreProvider({children}:{children:React.ReactNode}) {
  const [state,setRawState]=useState<CRMState>(seedState);
  const setState = useCallback<React.Dispatch<React.SetStateAction<CRMState>>>((update) => {
    setRawState((current) => normalizeCRMRelationships(typeof update === "function" ? update(current) : update));
  }, []);
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
  useEffect(()=>{ const restored=repository.load(); if(restored) setRawState(restored); setHydrated(true); },[]);
  useEffect(()=>{ if(hydrated) repository.save(state); },[state,hydrated]);
  const reset=useCallback(()=>{setRawState(seedState);repository.clear();},[]);
  const value=useMemo(()=>({state,setState,reset,hydrated}),[state,setState,reset,hydrated]);
  const actions=useMemo(()=>({setState,reset}),[setState,reset]);
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
