import type { Contact, ContactStatus, CRMState } from "../types";
import {
  dealLinkedToContact,
  eventLinkedToContact,
  resolveContactCompany,
  taskLinkedToContact,
} from "./relationships";

export type ContactDraft = {
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  status: ContactStatus;
};

export function contactInitials(name: string): string {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

export function upsertContact(state: CRMState, draft: ContactDraft, existingId?: string): CRMState {
  const initials = contactInitials(draft.name);
  const companyRef = resolveContactCompany(state, draft.company);
  const contactFields = { ...draft, ...companyRef, initials };
  if (existingId) {
    return {
      ...state,
      contacts: state.contacts.map((contact) => contact.id === existingId ? { ...contact, ...contactFields } : contact),
      deals: state.deals.map((deal) => deal.contactId === existingId ? { ...deal, contact: draft.name } : deal),
    };
  }
  const contact: Contact = {
    id: crypto.randomUUID(),
    ...contactFields,
    tags: ["New"],
    createdAt: new Date().toISOString().slice(0, 10),
  };
  return { ...state, contacts: [contact, ...state.contacts] };
}

export function contactDeleteBlockMessage(state: CRMState, id: string): string | null {
  const contact = state.contacts.find((item) => item.id === id);
  if (!contact) return "Contact not found";

  const linkedDeals = state.deals.filter((deal) => dealLinkedToContact(deal, contact, state.contacts));
  const linkedTasks = state.tasks.filter((task) => taskLinkedToContact(task, contact, state.contacts));
  const linkedEvents = state.events.filter((event) => eventLinkedToContact(event, contact, state.contacts));

  if (!linkedDeals.length && !linkedTasks.length && !linkedEvents.length) {
    return null;
  }

  const parts = [
    linkedDeals.length ? `${linkedDeals.length} deal(s)` : "",
    linkedTasks.length ? `${linkedTasks.length} task(s)` : "",
    linkedEvents.length ? `${linkedEvents.length} event(s)` : "",
  ].filter(Boolean);

  return `Cannot delete ${contact.name} while linked to ${parts.join(", ")}.`;
}

export function deleteContact(state: CRMState, id: string): CRMState {
  const message = contactDeleteBlockMessage(state, id);
  if (message) throw new Error(message);
  return { ...state, contacts: state.contacts.filter((contact) => contact.id !== id) };
}
