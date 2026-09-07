import type { Company, CRMState } from "../types";
import {
  contactLinkedToCompany,
  dealLinkedToCompany,
  eventLinkedToCompany,
  propagateCompanyRename,
  taskLinkedToCompany,
} from "./relationships";

export type CompanyDraft = {
  name: string;
  industry: string;
  website: string;
  location: string;
  value: number;
  status: Company["status"];
};

export function validateCompanyDraft(draft: CompanyDraft): string | null {
  if (!draft.name.trim()) return "Company name is required";
  if (!Number.isFinite(draft.value) || draft.value < 0) return "Portfolio value must be zero or greater";
  return null;
}

function normalizeDraft(draft: CompanyDraft): CompanyDraft {
  return {
    name: draft.name.trim(),
    industry: draft.industry.trim(),
    website: draft.website.trim(),
    location: draft.location.trim(),
    value: draft.value,
    status: draft.status,
  };
}

function contactCountForCompany(state: CRMState, company: Company): number {
  return state.contacts.filter((contact) => contactLinkedToCompany(contact, company, state.companies)).length;
}

export function upsertCompany(state: CRMState, draft: CompanyDraft, existingId?: string): CRMState {
  const normalized = normalizeDraft(draft);

  if (existingId) {
    const existing = state.companies.find((company) => company.id === existingId);
    if (!existing) return state;

    let next = propagateCompanyRename(state, existingId, existing.name, normalized.name);
    const updatedCompany = { ...existing, ...normalized };
    next = {
      ...next,
      companies: next.companies.map((company) =>
        company.id === existingId
          ? {
              ...company,
              ...normalized,
              contactCount: contactCountForCompany(next, updatedCompany),
            }
          : company,
      ),
    };
    return next;
  }

  const company: Company = {
    id: crypto.randomUUID(),
    ...normalized,
    contactCount: 0,
  };
  const next = { ...state, companies: [company, ...state.companies] };
  return {
    ...next,
    companies: next.companies.map((item) =>
      item.id === company.id
        ? { ...item, contactCount: contactCountForCompany(next, item) }
        : item,
    ),
  };
}

export function companyDeleteBlockMessage(state: CRMState, id: string): string | null {
  const company = state.companies.find((item) => item.id === id);
  if (!company) return "Company not found";

  const linkedContacts = state.contacts.filter((contact) => contactLinkedToCompany(contact, company, state.companies));
  const linkedDeals = state.deals.filter((deal) => dealLinkedToCompany(deal, company, state.companies));
  const linkedTasks = state.tasks.filter((task) => taskLinkedToCompany(task, company, state.companies));
  const linkedEvents = state.events.filter((event) => eventLinkedToCompany(event, company, state.companies));

  if (!linkedContacts.length && !linkedDeals.length && !linkedTasks.length && !linkedEvents.length) {
    return null;
  }

  const parts = [
    linkedContacts.length ? `${linkedContacts.length} contact(s)` : "",
    linkedDeals.length ? `${linkedDeals.length} deal(s)` : "",
    linkedTasks.length ? `${linkedTasks.length} task(s)` : "",
    linkedEvents.length ? `${linkedEvents.length} event(s)` : "",
  ].filter(Boolean);

  return `Cannot delete ${company.name} while it is linked to ${parts.join(", ")}.`;
}

export function deleteCompany(state: CRMState, id: string): CRMState {
  const message = companyDeleteBlockMessage(state, id);
  if (message) throw new Error(message);
  return { ...state, companies: state.companies.filter((company) => company.id !== id) };
}
