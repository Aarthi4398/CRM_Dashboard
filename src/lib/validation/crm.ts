import { normalizeCRMRelationships } from "../crm/relationships";
import type {
  CalendarEvent,
  Company,
  Contact,
  CRMState,
  CRMTask,
  Deal,
  Profile,
} from "../types";

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

export const DEFAULT_FALLBACK_PROFILE: Profile = {
  name: "Aarthi Raman",
  role: "CRM Product Specialist",
  email: "aarthi@example.demo",
  phone: "+91 98765 43210",
  location: "Chennai, India",
  bio: "I design thoughtful CRM experiences that turn customer signals into clear actions.",
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
