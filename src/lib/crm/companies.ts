import type { Company, CRMState } from "../types";

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

function contactCountForCompany(state: CRMState, companyName: string): number {
  return state.contacts.filter((contact) => contact.company === companyName).length;
}

function propagateCompanyRename(
  state: CRMState,
  companyId: string,
  previousName: string,
  nextName: string,
): CRMState {
  if (previousName === nextName) return state;
  return {
    ...state,
    contacts: state.contacts.map((contact) =>
      contact.company === previousName ? { ...contact, company: nextName } : contact,
    ),
    deals: state.deals.map((deal) =>
      deal.companyId === companyId || deal.company === previousName
        ? { ...deal, company: nextName, companyId }
        : deal,
    ),
    tasks: state.tasks.map((task) =>
      task.relatedToId === companyId || task.relatedTo === previousName
        ? { ...task, relatedTo: nextName, relatedToId: companyId }
        : task,
    ),
    events: state.events.map((event) =>
      event.relatedToId === companyId || event.relatedTo === previousName
        ? { ...event, relatedTo: nextName, relatedToId: companyId }
        : event,
    ),
  };
}

export function upsertCompany(state: CRMState, draft: CompanyDraft, existingId?: string): CRMState {
  const normalized = normalizeDraft(draft);

  if (existingId) {
    const existing = state.companies.find((company) => company.id === existingId);
    if (!existing) return state;

    let next = propagateCompanyRename(state, existingId, existing.name, normalized.name);
    next = {
      ...next,
      companies: next.companies.map((company) =>
        company.id === existingId
          ? {
              ...company,
              ...normalized,
              contactCount: contactCountForCompany(next, normalized.name),
            }
          : company,
      ),
    };
    return next;
  }

  const company: Company = {
    id: crypto.randomUUID(),
    ...normalized,
    contactCount: contactCountForCompany(state, normalized.name),
  };
  return { ...state, companies: [company, ...state.companies] };
}

export function companyDeleteBlockMessage(state: CRMState, id: string): string | null {
  const company = state.companies.find((item) => item.id === id);
  if (!company) return "Company not found";

  const linkedContacts = state.contacts.filter((contact) => contact.company === company.name);
  const linkedDeals = state.deals.filter(
    (deal) => deal.companyId === id || deal.company === company.name,
  );
  const linkedTasks = state.tasks.filter((task) => task.relatedToId === id);
  const linkedEvents = state.events.filter((event) => event.relatedToId === id);

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
