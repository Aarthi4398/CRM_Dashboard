import { normalizeCRMRelationships } from "../crm/relationships";
import type { CRMState } from "../types";
import {
  DEFAULT_FALLBACK_PROFILE,
  sanitizeCRMState,
  type SanitizeReport,
} from "../validation/crm";

/** Current persisted envelope schema version. */
export const CRM_SCHEMA_VERSION = 2;

export const CRM_STORAGE_KEY = "aarthi-crm:v2";
export const CRM_STORAGE_KEY_LEGACY = "aarthi-crm:v1";

export type PersistedCRMEnvelope = {
  schemaVersion: number;
  state: CRMState;
};

export type ParsePersistedResult =
  | { status: "ok"; state: CRMState; dropped: SanitizeReport; migratedFrom?: number | "legacy" }
  | { status: "unsupported_version"; version: number }
  | { status: "malformed" };

function isLegacyCRMStateShape(value: unknown): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  return ["contacts", "companies", "deals", "tasks", "events"].some(
    (key) => Array.isArray(record[key]),
  );
}

function warnDroppedRecords(dropped: SanitizeReport) {
  const parts = [
    dropped.contacts ? `${dropped.contacts} contact(s)` : "",
    dropped.companies ? `${dropped.companies} company(ies)` : "",
    dropped.deals ? `${dropped.deals} deal(s)` : "",
    dropped.tasks ? `${dropped.tasks} task(s)` : "",
    dropped.events ? `${dropped.events} event(s)` : "",
    dropped.profileReplaced ? "profile" : "",
  ].filter(Boolean);
  if (parts.length) {
    console.warn(`Dropped invalid persisted CRM record(s): ${parts.join(", ")}.`);
  }
}

export function migrateParsedValue(parsed: unknown): ParsePersistedResult {
  if (!parsed || typeof parsed !== "object") return { status: "malformed" };

  if ("schemaVersion" in parsed && typeof (parsed as PersistedCRMEnvelope).schemaVersion === "number") {
    const envelope = parsed as PersistedCRMEnvelope;
    if (envelope.schemaVersion > CRM_SCHEMA_VERSION) {
      return { status: "unsupported_version", version: envelope.schemaVersion };
    }
    if (!("state" in envelope)) return { status: "malformed" };
    const { state, dropped } = sanitizeCRMState(envelope.state, DEFAULT_FALLBACK_PROFILE);
    warnDroppedRecords(dropped);
    const migratedFrom = envelope.schemaVersion < CRM_SCHEMA_VERSION ? envelope.schemaVersion : undefined;
    return { status: "ok", state, dropped, migratedFrom };
  }

  if (isLegacyCRMStateShape(parsed)) {
    const { state, dropped } = sanitizeCRMState(parsed, DEFAULT_FALLBACK_PROFILE);
    warnDroppedRecords(dropped);
    return { status: "ok", state, dropped, migratedFrom: "legacy" };
  }

  return { status: "malformed" };
}

export function parsePersistedCRMStateDetailed(raw: string | null): ParsePersistedResult {
  if (!raw) return { status: "malformed" };
  try {
    return migrateParsedValue(JSON.parse(raw));
  } catch {
    return { status: "malformed" };
  }
}

export function parsePersistedCRMState(raw: string | null): CRMState | null {
  const result = parsePersistedCRMStateDetailed(raw);
  if (result.status === "ok") return result.state;
  if (result.status === "unsupported_version") {
    console.warn(
      `Persisted CRM schema version ${result.version} is newer than supported version ${CRM_SCHEMA_VERSION}. `
      + "Using seed state for this session without modifying stored data.",
    );
  }
  return null;
}

export function serializeCRMState(state: CRMState): string {
  const envelope: PersistedCRMEnvelope = {
    schemaVersion: CRM_SCHEMA_VERSION,
    state: normalizeCRMRelationships(state),
  };
  return JSON.stringify(envelope);
}

export function shouldApplyStorageUpdate(current: CRMState, incomingRaw: string | null): boolean {
  if (!incomingRaw) return true;
  return serializeCRMState(current) !== incomingRaw;
}

export function isCRMStorageKey(key: string | null): boolean {
  return key === CRM_STORAGE_KEY || key === CRM_STORAGE_KEY_LEGACY;
}
