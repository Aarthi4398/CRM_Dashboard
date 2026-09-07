import type { CRMState } from "../types";
import { isCRMState, normalizeCRMRelationships } from "../validate-state";

export const CRM_STORAGE_KEY = "aarthi-crm:v1";

export type CRMRepository = {
  load(): CRMState | null;
  save(state: CRMState): void;
  clear(): void;
};

export function createLocalStorageRepository(key = CRM_STORAGE_KEY): CRMRepository {
  return {
    load() {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const parsed: unknown = JSON.parse(raw);
        if (!isCRMState(parsed)) {
          console.warn("Ignoring invalid persisted CRM data.");
          localStorage.removeItem(key);
          return null;
        }
        return normalizeCRMRelationships(parsed);
      } catch (error) {
        console.warn("Unable to restore persisted CRM data.", error);
        localStorage.removeItem(key);
        return null;
      }
    },
    save(state) {
      localStorage.setItem(key, JSON.stringify(state));
    },
    clear() {
      localStorage.removeItem(key);
    },
  };
}

export function createMemoryRepository(initial: CRMState | null = null): CRMRepository {
  let value = initial;
  return {
    load: () => (value ? normalizeCRMRelationships(value) : null),
    save: (state) => {
      value = state;
    },
    clear: () => {
      value = null;
    },
  };
}
