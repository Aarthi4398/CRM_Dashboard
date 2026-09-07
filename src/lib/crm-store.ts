import { normalizeCRMRelationships } from "./crm/relationships";
import type { CRMState } from "./types";

export type CRMStoreListener = () => void;

export type CRMStore = {
  getState: () => CRMState;
  setState: (update: CRMState | ((previous: CRMState) => CRMState)) => void;
  subscribe: (listener: CRMStoreListener) => () => void;
};

export function createCRMStore(initial: CRMState): CRMStore {
  let state = normalizeCRMRelationships(initial);
  const listeners = new Set<CRMStoreListener>();

  const notify = () => {
    listeners.forEach((listener) => listener());
  };

  return {
    getState: () => state,
    setState: (update) => {
      const next = normalizeCRMRelationships(
        typeof update === "function" ? update(state) : update,
      );
      if (Object.is(next, state)) return;
      state = next;
      notify();
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
