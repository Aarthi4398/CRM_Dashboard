import type { Contact, ContactStatus, CRMState } from "../types";

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
  if (existingId) {
    return {
      ...state,
      contacts: state.contacts.map((contact) => contact.id === existingId ? { ...contact, ...draft, initials } : contact),
      deals: state.deals.map((deal) => deal.contactId === existingId ? { ...deal, contact: draft.name } : deal),
    };
  }
  const contact: Contact = {
    id: crypto.randomUUID(),
    ...draft,
    initials,
    tags: ["New"],
    createdAt: new Date().toISOString().slice(0, 10),
  };
  return { ...state, contacts: [contact, ...state.contacts] };
}

export function deleteContact(state: CRMState, id: string): CRMState {
  return { ...state, contacts: state.contacts.filter((contact) => contact.id !== id) };
}
