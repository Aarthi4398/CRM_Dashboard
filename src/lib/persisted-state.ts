export {
  CRM_SCHEMA_VERSION,
  CRM_STORAGE_KEY,
  CRM_STORAGE_KEY_LEGACY,
  isCRMStorageKey,
  migrateParsedValue,
  parsePersistedCRMState,
  parsePersistedCRMStateDetailed,
  serializeCRMState,
  shouldApplyStorageUpdate,
  type ParsePersistedResult,
  type PersistedCRMEnvelope,
} from "./validate-state";
