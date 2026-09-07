"use client";

import { createContext, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  CRM_STORAGE_KEY,
  createLocalStorageRepository,
  isCRMStorageKey,
  parsePersistedCRMState,
  serializeCRMState,
  shouldApplyStorageUpdate,
} from "./data/repository";
import { createCRMStore, type CRMStore } from "./crm-store";
import { seedState } from "./seed";
import type { CRMState } from "./types";

const repository = createLocalStorageRepository();

type StoreActions = {
  setState: CRMStore["setState"];
  reset: () => void;
};

const CRMStoreContext = createContext<CRMStore | null>(null);
const ActionsContext = createContext<StoreActions | null>(null);
const HydratedContext = createContext(false);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const store = useMemo(() => createCRMStore(seedState), []);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const restored = repository.load();
    if (restored) store.setState(restored);
    // Hydration is the one deliberate effect-to-state synchronization point.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, [store]);

  useEffect(() => {
    if (!hydrated) return;
    return store.subscribe(() => {
      const serialized = serializeCRMState(store.getState());
      if (localStorage.getItem(CRM_STORAGE_KEY) === serialized) return;
      repository.save(store.getState());
    });
  }, [hydrated, store]);

  useEffect(() => {
    if (!hydrated) return;
    const onStorage = (event: StorageEvent) => {
      if (!isCRMStorageKey(event.key) || event.storageArea !== localStorage) return;
      if (!shouldApplyStorageUpdate(store.getState(), event.newValue)) return;
      const restored = parsePersistedCRMState(event.newValue);
      if (restored) store.setState(restored);
      else if (event.newValue === null) store.setState(seedState);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [hydrated, store]);

  const actions = useMemo<StoreActions>(() => ({
    setState: (update) => store.setState(update),
    reset: () => {
      store.setState(seedState);
      repository.clear();
    },
  }), [store]);

  return (
    <CRMStoreContext.Provider value={store}>
      <HydratedContext.Provider value={hydrated}>
        <ActionsContext.Provider value={actions}>{children}</ActionsContext.Provider>
      </HydratedContext.Provider>
    </CRMStoreContext.Provider>
  );
}

export function useCRMSelector<T>(selector: (state: CRMState) => T): T {
  const store = useContext(CRMStoreContext);
  if (!store) throw new Error("useCRMSelector must be used within StoreProvider");
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(seedState),
  );
}

export function useCRMActions() {
  const value = useContext(ActionsContext);
  if (!value) throw new Error("useCRMActions must be used within StoreProvider");
  return value;
}

export function useCRMHydrated() {
  const hydrated = useContext(HydratedContext);
  if (!useContext(CRMStoreContext)) throw new Error("useCRMHydrated must be used within StoreProvider");
  return hydrated;
}
