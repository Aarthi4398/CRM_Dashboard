import type { CalendarEvent, Company, Contact, CRMState, CRMTask, Deal } from "../types";

export function normalizeEntityName(name: string): string {
  return name.trim().toLowerCase();
}

function buildUniqueNameIdMap(items: Array<{ id: string; name: string }>): Map<string, string> {
  const idsByName = new Map<string, string[]>();
  for (const item of items) {
    const key = normalizeEntityName(item.name);
    if (!key) continue;
    const ids = idsByName.get(key) ?? [];
    ids.push(item.id);
    idsByName.set(key, ids);
  }
  const unique = new Map<string, string>();
  for (const [key, ids] of idsByName) {
    if (ids.length === 1) unique.set(key, ids[0]);
  }
  return unique;
}

export function findUniqueCompanyIdByName(companies: Company[], name: string): string | undefined {
  return buildUniqueNameIdMap(companies).get(normalizeEntityName(name));
}

export function findUniqueContactIdByName(contacts: Contact[], name: string): string | undefined {
  return buildUniqueNameIdMap(contacts).get(normalizeEntityName(name));
}

export function resolveContactCompany(
  state: CRMState,
  companyName: string,
): Pick<Contact, "company" | "companyId"> {
  const trimmed = companyName.trim();
  const companyId = findUniqueCompanyIdByName(state.companies, trimmed);
  if (!companyId) return { company: trimmed };
  const company = state.companies.find((item) => item.id === companyId);
  return { company: company?.name ?? trimmed, companyId };
}

export function contactLinkedToCompany(contact: Contact, company: Company, companies: Company[]): boolean {
  if (contact.companyId === company.id) return true;
  if (contact.companyId) return false;
  return (
    contact.company === company.name
    && findUniqueCompanyIdByName(companies, company.name) === company.id
  );
}

export function dealLinkedToCompany(deal: Deal, company: Company, companies: Company[]): boolean {
  if (deal.companyId === company.id) return true;
  if (deal.companyId) return false;
  return (
    deal.company === company.name
    && findUniqueCompanyIdByName(companies, company.name) === company.id
  );
}

export function taskLinkedToCompany(task: CRMTask, company: Company, companies: Company[]): boolean {
  if (task.relatedToId === company.id) return true;
  if (task.relatedToId) return false;
  return (
    task.relatedTo === company.name
    && findUniqueCompanyIdByName(companies, company.name) === company.id
  );
}

export function eventLinkedToCompany(event: CalendarEvent, company: Company, companies: Company[]): boolean {
  if (event.relatedToId === company.id) return true;
  if (event.relatedToId) return false;
  return (
    event.relatedTo === company.name
    && findUniqueCompanyIdByName(companies, company.name) === company.id
  );
}

export function dealLinkedToContact(deal: Deal, contact: Contact, contacts: Contact[]): boolean {
  if (deal.contactId === contact.id) return true;
  if (deal.contactId) return false;
  return (
    deal.contact === contact.name
    && findUniqueContactIdByName(contacts, contact.name) === contact.id
  );
}

export function taskLinkedToContact(task: CRMTask, contact: Contact, contacts: Contact[]): boolean {
  if (task.relatedToId === contact.id) return true;
  if (task.relatedToId) return false;
  return (
    task.relatedTo === contact.name
    && findUniqueContactIdByName(contacts, contact.name) === contact.id
  );
}

export function eventLinkedToContact(event: CalendarEvent, contact: Contact, contacts: Contact[]): boolean {
  if (event.relatedToId === contact.id) return true;
  if (event.relatedToId) return false;
  return (
    event.relatedTo === contact.name
    && findUniqueContactIdByName(contacts, contact.name) === contact.id
  );
}

function withRelated<T>(items: T[], update: (item: T) => T): T[] {
  let changed = false;
  const next = items.map((item) => {
    const updated = update(item);
    if (updated === item) return item;
    changed = true;
    return updated;
  });
  return changed ? next : items;
}

function resolveCompanyReference(
  companies: Company[],
  companyId?: string,
  companyName?: string,
): { companyId?: string; company: string } {
  const byId = new Map(companies.map((company) => [company.id, company]));
  if (companyId && byId.has(companyId)) {
    return { companyId, company: byId.get(companyId)!.name };
  }
  const resolvedId = companyName ? findUniqueCompanyIdByName(companies, companyName) : undefined;
  if (resolvedId) {
    return { companyId: resolvedId, company: byId.get(resolvedId)!.name };
  }
  return { companyId, company: companyName ?? "" };
}

function resolveContactReference(
  contacts: Contact[],
  contactId?: string,
  contactName?: string,
): { contactId?: string; contact: string } {
  const byId = new Map(contacts.map((contact) => [contact.id, contact]));
  if (contactId && byId.has(contactId)) {
    return { contactId, contact: byId.get(contactId)!.name };
  }
  const resolvedId = contactName ? findUniqueContactIdByName(contacts, contactName) : undefined;
  if (resolvedId) {
    return { contactId: resolvedId, contact: byId.get(resolvedId)!.name };
  }
  return { contactId, contact: contactName ?? "" };
}

function resolveRelatedReference(
  companies: Company[],
  contacts: Contact[],
  relatedToId?: string,
  relatedTo?: string,
): { relatedToId?: string; relatedTo: string } {
  const companyById = new Map(companies.map((company) => [company.id, company]));
  const contactById = new Map(contacts.map((contact) => [contact.id, contact]));

  if (relatedToId) {
    const company = companyById.get(relatedToId);
    if (company) return { relatedToId, relatedTo: company.name };
    const contact = contactById.get(relatedToId);
    if (contact) return { relatedToId, relatedTo: contact.name };
    return { relatedToId, relatedTo: relatedTo ?? "" };
  }

  if (!relatedTo) return { relatedTo: "" };
  const companyId = findUniqueCompanyIdByName(companies, relatedTo);
  if (companyId) return { relatedToId: companyId, relatedTo: companyById.get(companyId)!.name };
  const contactId = findUniqueContactIdByName(contacts, relatedTo);
  if (contactId) return { relatedToId: contactId, relatedTo: contactById.get(contactId)!.name };
  return { relatedTo };
}

export function normalizeCRMRelationships(state: CRMState): CRMState {
  const contacts = withRelated(state.contacts, (contact) => {
    const companyRef = resolveCompanyReference(state.companies, contact.companyId, contact.company);
    if (companyRef.companyId === contact.companyId && companyRef.company === contact.company) return contact;
    return { ...contact, ...companyRef };
  });

  const contactState = { ...state, contacts };
  const deals = withRelated(contactState.deals, (deal) => {
    const companyRef = resolveCompanyReference(contactState.companies, deal.companyId, deal.company);
    const contactRef = resolveContactReference(contactState.contacts, deal.contactId, deal.contact);
    if (
      companyRef.companyId === deal.companyId
      && companyRef.company === deal.company
      && contactRef.contactId === deal.contactId
      && contactRef.contact === deal.contact
    ) {
      return deal;
    }
    return { ...deal, ...companyRef, ...contactRef };
  });

  const dealState = { ...contactState, deals };
  const tasks = withRelated(dealState.tasks, (task) => {
    const related = resolveRelatedReference(dealState.companies, dealState.contacts, task.relatedToId, task.relatedTo);
    if (related.relatedToId === task.relatedToId && related.relatedTo === task.relatedTo) return task;
    return { ...task, ...related };
  });

  const taskState = { ...dealState, tasks };
  const events = withRelated(taskState.events, (event) => {
    const related = resolveRelatedReference(taskState.companies, taskState.contacts, event.relatedToId, event.relatedTo);
    if (related.relatedToId === event.relatedToId && related.relatedTo === event.relatedTo) return event;
    return { ...event, ...related };
  });

  if (contacts === state.contacts && deals === state.deals && tasks === state.tasks && events === state.events) {
    return state;
  }
  return { ...state, contacts, deals, tasks, events };
}

export function propagateCompanyRename(
  state: CRMState,
  companyId: string,
  previousName: string,
  nextName: string,
): CRMState {
  if (previousName === nextName) return state;

  const previousUniqueId = findUniqueCompanyIdByName(state.companies, previousName);
  const canMatchLegacyByName = previousUniqueId === companyId;

  return {
    ...state,
    contacts: state.contacts.map((contact) => {
      if (contact.companyId === companyId) return { ...contact, company: nextName, companyId };
      if (!contact.companyId && canMatchLegacyByName && contact.company === previousName) {
        return { ...contact, company: nextName, companyId };
      }
      return contact;
    }),
    deals: state.deals.map((deal) => {
      if (deal.companyId === companyId) return { ...deal, company: nextName, companyId };
      if (!deal.companyId && canMatchLegacyByName && deal.company === previousName) {
        return { ...deal, company: nextName, companyId };
      }
      return deal;
    }),
    tasks: state.tasks.map((task) => {
      if (task.relatedToId === companyId) return { ...task, relatedTo: nextName, relatedToId: companyId };
      if (!task.relatedToId && canMatchLegacyByName && task.relatedTo === previousName) {
        return { ...task, relatedTo: nextName, relatedToId: companyId };
      }
      return task;
    }),
    events: state.events.map((event) => {
      if (event.relatedToId === companyId) return { ...event, relatedTo: nextName, relatedToId: companyId };
      if (!event.relatedToId && canMatchLegacyByName && event.relatedTo === previousName) {
        return { ...event, relatedTo: nextName, relatedToId: companyId };
      }
      return event;
    }),
  };
}
