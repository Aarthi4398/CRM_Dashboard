import type {
  CalendarEvent,
  Company,
  Contact,
  CRMState,
  CRMTask,
  Deal,
  Profile,
} from "./types";
import { normalizeCRMRelationships } from "./crm/relationships";

export {
  contactLinkedToCompany,
  dealLinkedToCompany,
  eventLinkedToCompany,
  findUniqueCompanyIdByName,
  findUniqueContactIdByName,
  normalizeCRMRelationships,
  normalizeEntityName,
  propagateCompanyRename,
  resolveContactCompany,
  taskLinkedToCompany,
} from "./crm/relationships";

const object = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);
const text = (value: unknown) => typeof value === "string";
const number = (value: unknown) => typeof value === "number" && Number.isFinite(value);
const strings = (value: unknown) => Array.isArray(value) && value.every(text);
const oneOf =
  <T extends string>(values: readonly T[]) =>
  (value: unknown): value is T =>
    typeof value === "string" && values.includes(value as T);

export function isContact(value: unknown): value is Contact {
  if (!object(value)) return false;
  const hasCompanyId = value.companyId === undefined || text(value.companyId);
  return (
    hasCompanyId
    && [value.id, value.name, value.role, value.company, value.email, value.phone, value.initials, value.createdAt].every(text)
    && oneOf(["Active", "Lead", "Inactive"] as const)(value.status)
    && strings(value.tags)
  );
}

export function isCompany(value: unknown): value is Company {
  if (!object(value)) return false;
  return (
    [value.id, value.name, value.industry, value.website, value.location].every(text)
    && number(value.value)
    && number(value.contactCount)
    && oneOf(["Customer", "Prospect"] as const)(value.status)
  );
}

export function isDeal(value: unknown): value is Deal {
  if (!object(value)) return false;
  return (
    [value.id, value.title, value.company, value.contact, value.owner, value.closeDate].every(text)
    && number(value.value)
    && number(value.probability)
    && oneOf(["Lead", "Qualified", "Proposal", "Negotiation", "Won", "Lost"] as const)(value.stage)
  );
}

export function isCRMTask(value: unknown): value is CRMTask {
  if (!object(value)) return false;
  return (
    [value.id, value.title, value.description, value.dueDate, value.relatedTo].every(text)
    && oneOf(["Low", "Medium", "High"] as const)(value.priority)
    && oneOf(["To do", "In progress", "Done"] as const)(value.status)
  );
}

export function isCalendarEvent(value: unknown): value is CalendarEvent {
  if (!object(value)) return false;
  return (
    [value.id, value.title, value.date, value.time, value.relatedTo].every(text)
    && number(value.attendees)
    && oneOf(["Meeting", "Deadline", "Call"] as const)(value.category)
  );
}

export function isProfile(value: unknown): value is Profile {
  if (!object(value)) return false;
  return [value.name, value.role, value.email, value.phone, value.location, value.bio].every(text);
}

export function isCRMState(value: unknown): value is CRMState {
  if (!object(value)) return false;
  const contacts = Array.isArray(value.contacts) && value.contacts.every(isContact);
  const companies = Array.isArray(value.companies) && value.companies.every(isCompany);
  const deals = Array.isArray(value.deals) && value.deals.every(isDeal);
  const tasks = Array.isArray(value.tasks) && value.tasks.every(isCRMTask);
  const events = Array.isArray(value.events) && value.events.every(isCalendarEvent);
  const profile = isProfile(value.profile);
  return contacts && companies && deals && tasks && events && profile;
}

export type SanitizeReport = {
  contacts: number;
  companies: number;
  deals: number;
  tasks: number;
  events: number;
  profileReplaced: boolean;
};

export function sanitizeCRMState(
  input: unknown,
  fallbackProfile: Profile,
): { state: CRMState; dropped: SanitizeReport } {
  const raw = object(input) ? input : {};
  const contactSource = Array.isArray(raw.contacts) ? raw.contacts : [];
  const companySource = Array.isArray(raw.companies) ? raw.companies : [];
  const dealSource = Array.isArray(raw.deals) ? raw.deals : [];
  const taskSource = Array.isArray(raw.tasks) ? raw.tasks : [];
  const eventSource = Array.isArray(raw.events) ? raw.events : [];

  const contacts = contactSource.filter(isContact);
  const companies = companySource.filter(isCompany);
  const deals = dealSource.filter(isDeal);
  const tasks = taskSource.filter(isCRMTask);
  const events = eventSource.filter(isCalendarEvent);
  const profile = isProfile(raw.profile) ? raw.profile : fallbackProfile;

  const dropped: SanitizeReport = {
    contacts: contactSource.length - contacts.length,
    companies: companySource.length - companies.length,
    deals: dealSource.length - deals.length,
    tasks: taskSource.length - tasks.length,
    events: eventSource.length - events.length,
    profileReplaced: !isProfile(raw.profile),
  };

  return {
    state: normalizeCRMRelationships({
      contacts,
      companies,
      deals,
      tasks,
      events,
      profile,
    }),
    dropped,
  };
}

const DEFAULT_FALLBACK_PROFILE: Profile = {
  name: "Aarthi Raman",
  role: "CRM Product Specialist",
  email: "aarthi@example.demo",
  phone: "+91 98765 43210",
  location: "Chennai, India",
  bio: "I design thoughtful CRM experiences that turn customer signals into clear actions.",
};

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
