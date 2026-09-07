"use client";

import { Modal } from "@/components/modal";
import { useFeedback } from "@/components/ui/app-feedback";
import { PageHeader as Header } from "@/components/ui/page-header";
import { SearchField } from "@/components/ui/search-field";
import { StatusBadge as Status } from "@/components/ui/status-badge";
import { TextInputField as Input } from "@/components/ui/text-input-field";
import { useEntityModal } from "@/hooks/use-entity-modal";
import { deleteContact, upsertContact } from "@/lib/crm";
import { useCRMActions, useCRMSelector } from "@/lib/store";
import type { Contact, ContactStatus } from "@/lib/types";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

type ContactDraft = {
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  status: ContactStatus;
};

const blankDraft: ContactDraft = {
  name: "",
  role: "",
  company: "",
  email: "",
  phone: "",
  status: "Lead",
};

function contactToDraft(contact: Contact): ContactDraft {
  return {
    name: contact.name,
    role: contact.role,
    company: contact.company,
    email: contact.email,
    phone: contact.phone,
    status: contact.status,
  };
}

export default function ContactsPage() {
  return (
    <Suspense>
      <Contacts />
    </Suspense>
  );
}

function Contacts() {
  const contacts = useCRMSelector((state) => state.contacts);
  const { setState } = useCRMActions();
  const { confirmAction } = useFeedback();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const modal = useEntityModal<Contact, ContactDraft>({ blankDraft, toDraft: contactToDraft });

  const list = useMemo(
    () =>
      contacts.filter((contact) =>
        [contact.name, contact.company, contact.email].some((value) =>
          value.toLowerCase().includes(query.toLowerCase()),
        ),
      ),
    [contacts, query],
  );

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    if (!modal.draft.name || !modal.draft.email) return;
    setState((state) => upsertContact(state, modal.draft, modal.selected?.id));
    modal.close();
  };

  const modalTitle =
    modal.mode === "create" ? "Add contact" : modal.mode === "edit" ? "Edit contact" : "Contact details";

  return (
    <div className="space-y-6">
      <Header
        title="Contacts"
        subtitle={`${contacts.length} people in your CRM`}
        action={
          <button className="btn btn-primary" type="button" onClick={modal.openCreate}>
            <Plus size={17} />
            Add contact
          </button>
        }
      />

      <div className="panel p-4">
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search name, company, or email"
          aria-label="Search contacts"
        />
      </div>

      <section className="panel overflow-hidden">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Contact</th>
                <th>Company</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((contact) => (
                <tr key={contact.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                        {contact.initials}
                      </span>
                      <div>
                        <b>{contact.name}</b>
                        <div className="muted text-xs">{contact.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <b>{contact.company}</b>
                    <div className="muted text-xs">{contact.role}</div>
                  </td>
                  <td>{contact.phone}</td>
                  <td>
                    <Status value={contact.status} />
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <IconButton label="View" onClick={() => modal.openView(contact)}>
                        <Eye size={16} />
                      </IconButton>
                      <IconButton label="Edit" onClick={() => modal.openEdit(contact)}>
                        <Pencil size={16} />
                      </IconButton>
                      <IconButton
                        label="Delete"
                        onClick={async () => {
                          if (
                            await confirmAction({
                              title: "Delete contact",
                              message: `Delete ${contact.name}?`,
                              confirmLabel: "Delete",
                            })
                          ) {
                            setState((state) => deleteContact(state, contact.id));
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
              {!list.length && (
                <tr>
                  <td colSpan={5} className="muted !py-12 text-center">No contacts match your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Modal open={modal.isOpen} title={modalTitle} onClose={modal.close}>
        {modal.mode === "view" && modal.selected ? (
          <div className="space-y-3">
            <p><b>Name:</b> {modal.selected.name}</p>
            <p><b>Role:</b> {modal.selected.role}</p>
            <p><b>Company:</b> {modal.selected.company}</p>
            <p><b>Email:</b> {modal.selected.email}</p>
            <p><b>Phone:</b> {modal.selected.phone}</p>
          </div>
        ) : (
          <form className="grid gap-4" onSubmit={save}>
            <Input label="Full name" value={modal.draft.name} onChange={(value) => modal.setDraft((current) => ({ ...current, name: value }))} />
            <Input label="Role" value={modal.draft.role} onChange={(value) => modal.setDraft((current) => ({ ...current, role: value }))} />
            <Input label="Company" value={modal.draft.company} onChange={(value) => modal.setDraft((current) => ({ ...current, company: value }))} />
            <Input label="Email" type="email" value={modal.draft.email} onChange={(value) => modal.setDraft((current) => ({ ...current, email: value }))} />
            <Input label="Phone" value={modal.draft.phone} onChange={(value) => modal.setDraft((current) => ({ ...current, phone: value }))} />
            <label>
              <span className="mb-1 block text-sm font-semibold">Status</span>
              <select
                className="field"
                value={modal.draft.status}
                onChange={(event) => modal.setDraft((current) => ({ ...current, status: event.target.value as ContactStatus }))}
              >
                <option>Active</option>
                <option>Lead</option>
                <option>Inactive</option>
              </select>
            </label>
            <button className="btn btn-primary" type="submit">Save contact</button>
          </form>
        )}
      </Modal>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void | Promise<void>;
  children: React.ReactNode;
}) {
  return (
    <button className="btn !p-2" type="button" aria-label={label} title={label} onClick={onClick}>
      {children}
    </button>
  );
}
