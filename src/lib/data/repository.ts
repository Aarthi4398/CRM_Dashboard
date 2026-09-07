import { normalizeCRMRelationships } from "../crm/relationships";
import type { CRMState } from "../types";
import {
  CRM_SCHEMA_VERSION,
  CRM_STORAGE_KEY,
  CRM_STORAGE_KEY_LEGACY,
  migrateParsedValue,
  parsePersistedCRMStateDetailed,
  serializeCRMState,
} from "../persistence/persisted-crm";

export type CRMRepository = {
  load(): CRMState | null;
  save(state: CRMState): void;
  clear(): void;
};

export function createLocalStorageRepository(key = CRM_STORAGE_KEY): CRMRepository {
  return {
    load() {
      try {
        const rawV2 = localStorage.getItem(CRM_STORAGE_KEY);
        if (rawV2) {
          const result = parsePersistedCRMStateDetailed(rawV2);
          if (result.status === "unsupported_version") {
            console.warn(
              `Persisted CRM schema version ${result.version} is newer than supported version ${CRM_SCHEMA_VERSION}. `
              + "Using seed state for this session without modifying stored data.",
            );
            return null;
          }
          if (result.status === "ok") {
            if (result.migratedFrom !== undefined) {
              localStorage.setItem(CRM_STORAGE_KEY, serializeCRMState(result.state));
            }
            return result.state;
          }
          console.warn("Unable to parse persisted CRM data in current storage key.");
          return null;
        }

        const rawLegacy = localStorage.getItem(CRM_STORAGE_KEY_LEGACY);
        if (!rawLegacy) return null;

        const legacyResult = migrateParsedValue(JSON.parse(rawLegacy));
        if (legacyResult.status === "unsupported_version") {
          console.warn(
            `Persisted CRM schema version ${legacyResult.version} is newer than supported version ${CRM_SCHEMA_VERSION}. `
            + "Using seed state for this session without modifying stored data.",
          );
          return null;
        }
        if (legacyResult.status !== "ok") {
          console.warn("Unable to parse legacy persisted CRM data.");
          return null;
        }

        localStorage.setItem(CRM_STORAGE_KEY, serializeCRMState(legacyResult.state));
        localStorage.removeItem(CRM_STORAGE_KEY_LEGACY);
        return legacyResult.state;
      } catch (error) {
        console.warn("Unable to restore persisted CRM data.", error);
        return null;
      }
    },
    save(state) {
      localStorage.setItem(key, serializeCRMState(state));
    },
    clear() {
      localStorage.removeItem(CRM_STORAGE_KEY);
      localStorage.removeItem(CRM_STORAGE_KEY_LEGACY);
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
