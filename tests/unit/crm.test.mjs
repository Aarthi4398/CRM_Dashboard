import assert from "node:assert/strict";
import test from "node:test";
import {
  companyDeleteBlockMessage,
  deleteCompany,
  upsertCompany,
  validateCompanyDraft,
} from "../../src/lib/crm/companies.ts";
import {
  contactDeleteBlockMessage,
  deleteContact,
  upsertContact,
} from "../../src/lib/crm/contacts.ts";
import { moveDeal } from "../../src/lib/crm/deals.ts";
import { addTask } from "../../src/lib/crm/tasks.ts";
import { isBarePath, showsPageSummary } from "../../src/lib/routes/chrome.ts";
import { seedState } from "../../src/lib/seed.ts";

test("upsertContact creates, updates, and syncs related deal names", () => {
  const created = upsertContact(seedState, {
    name: "New Person",
    role: "AE",
    company: "Nova Labs",
    email: "new@example.com",
    phone: "1",
    status: "Lead",
  });
  assert.equal(created.contacts[0]?.name, "New Person");
  assert.equal(created.contacts[0]?.initials, "NP");

  const existing = seedState.contacts[0];
  assert.ok(existing);
  const renamed = upsertContact(seedState, { ...existing, name: "Renamed Contact" }, existing.id);
  assert.ok(renamed.deals.every((deal) => deal.contactId !== existing.id || deal.contact === "Renamed Contact"));
});

test("deleteContact removes only unlinked records", () => {
  const created = upsertContact(seedState, {
    name: "Disposable Person",
    role: "Temp",
    company: "Orphan Co",
    email: "disposable@example.com",
    phone: "1",
    status: "Lead",
  });
  const disposable = created.contacts.find((contact) => contact.name === "Disposable Person");
  assert.ok(disposable);
  const next = deleteContact(created, disposable.id);
  assert.equal(next.contacts.some((contact) => contact.id === disposable.id), false);
  assert.equal(next.contacts.length, created.contacts.length - 1);
});

test("deleteContact blocks contacts linked by deal contactId", () => {
  const linked = seedState.contacts.find((contact) => contact.id === "c1");
  assert.ok(linked);
  const blockMessage = contactDeleteBlockMessage(seedState, linked.id);
  assert.match(blockMessage ?? "", /Cannot delete John Doe/);
  assert.throws(() => deleteContact(seedState, linked.id), /Cannot delete John Doe/);
});

test("blocked contact delete leaves contact and linked deal unchanged", () => {
  const linked = seedState.contacts.find((contact) => contact.id === "c1");
  assert.ok(linked);
  const dealBefore = seedState.deals.find((deal) => deal.contactId === linked.id);
  assert.ok(dealBefore);

  assert.throws(() => deleteContact(seedState, linked.id));

  assert.equal(seedState.contacts.some((contact) => contact.id === linked.id), true);
  const dealAfter = seedState.deals.find((deal) => deal.id === dealBefore.id);
  assert.deepEqual(dealAfter, dealBefore);
});

test("deleteContact blocks legacy unique-name deal references", () => {
  const linked = seedState.contacts.find((contact) => contact.id === "c1");
  assert.ok(linked);
  const legacyDealState = {
    ...seedState,
    deals: seedState.deals.map((deal) =>
      deal.id === "d1"
        ? { ...deal, contactId: undefined, contact: linked.name }
        : deal,
    ),
  };
  assert.match(contactDeleteBlockMessage(legacyDealState, linked.id) ?? "", /deal\(s\)/);
  assert.throws(() => deleteContact(legacyDealState, linked.id), /Cannot delete John Doe/);
});

test("deleteContact ignores ambiguous duplicate-name deal references", () => {
  const linked = seedState.contacts.find((contact) => contact.id === "c1");
  assert.ok(linked);
  const ambiguousState = {
    ...seedState,
    contacts: [
      ...seedState.contacts,
      {
        ...linked,
        id: "c1-dup",
        email: "john.duplicate@example.com",
        initials: "JD",
      },
    ],
    deals: seedState.deals.map((deal) =>
      deal.id === "d1"
        ? { ...deal, contactId: undefined, contact: linked.name }
        : deal,
    ),
  };
  assert.equal(contactDeleteBlockMessage(ambiguousState, linked.id), null);
  const next = deleteContact(ambiguousState, linked.id);
  assert.equal(next.contacts.some((contact) => contact.id === linked.id), false);
});

test("deleteContact blocks task and event references by relatedToId", () => {
  const linked = seedState.contacts.find((contact) => contact.id === "c1");
  assert.ok(linked);
  const relatedState = {
    ...seedState,
    deals: seedState.deals.map((deal) =>
      deal.contactId === linked.id ? { ...deal, contactId: undefined, contact: "Unrelated" } : deal,
    ),
    tasks: [
      ...seedState.tasks,
      {
        id: "t-contact",
        title: "Follow up with John",
        description: "Check in",
        priority: "Low",
        status: "To do",
        dueDate: "2026-09-01",
        relatedTo: linked.name,
        relatedToId: linked.id,
      },
    ],
    events: [
      ...seedState.events,
      {
        id: "e-contact",
        title: "John review",
        date: "2026-09-02",
        time: "09:00",
        category: "Meeting",
        attendees: 2,
        relatedTo: linked.name,
        relatedToId: linked.id,
      },
    ],
  };
  const blockMessage = contactDeleteBlockMessage(relatedState, linked.id);
  assert.match(blockMessage ?? "", /task\(s\)/);
  assert.match(blockMessage ?? "", /event\(s\)/);
  assert.throws(() => deleteContact(relatedState, linked.id), /Cannot delete John Doe/);
});

test("unrelated contact can still be deleted when another contact is linked", () => {
  const withDisposable = upsertContact(seedState, {
    name: "Disposable Person",
    role: "Temp",
    company: "Orphan Co",
    email: "disposable@example.com",
    phone: "1",
    status: "Lead",
  });
  const disposable = withDisposable.contacts.find((contact) => contact.name === "Disposable Person");
  assert.ok(disposable);
  const next = deleteContact(withDisposable, disposable.id);
  assert.equal(next.contacts.some((contact) => contact.id === disposable.id), false);
  assert.equal(next.contacts.some((contact) => contact.id === "c1"), true);
});

test("moveDeal updates stage probability", () => {
  const id = seedState.deals[0]?.id;
  assert.ok(id);
  const won = moveDeal(seedState, id, "Won");
  assert.equal(won.deals.find((deal) => deal.id === id)?.probability, 100);
  const lost = moveDeal(seedState, id, "Lost");
  assert.equal(lost.deals.find((deal) => deal.id === id)?.probability, 0);
});

test("addTask links a matching company id", () => {
  const next = addTask(seedState, "Follow up", "Nova Labs");
  const task = next.tasks.at(-1);
  assert.equal(task?.title, "Follow up");
  assert.equal(task?.relatedToId, "co1");
});

test("chrome policy distinguishes bare routes from CRM summaries", () => {
  assert.equal(isBarePath("/signin"), true);
  assert.equal(isBarePath("/layout-two"), true);
  assert.equal(isBarePath("/dashboard"), false);
  assert.equal(showsPageSummary("/contacts"), true);
  assert.equal(showsPageSummary("/task-list"), false);
});

test("validateCompanyDraft requires a name and non-negative value", () => {
  assert.equal(validateCompanyDraft({ name: "", industry: "", website: "", location: "", value: 0, status: "Prospect" }), "Company name is required");
  assert.equal(
    validateCompanyDraft({ name: "Acme", industry: "", website: "", location: "", value: -1, status: "Prospect" }),
    "Portfolio value must be zero or greater",
  );
  assert.equal(validateCompanyDraft({ name: "Acme", industry: "", website: "", location: "", value: 0, status: "Prospect" }), null);
});

test("upsertCompany creates, updates, and propagates renames", () => {
  const created = upsertCompany(seedState, {
    name: "Orbit Systems",
    industry: "Technology",
    website: "orbit.demo",
    location: "Toronto, CA",
    value: 42000,
    status: "Prospect",
  });
  const newCompany = created.companies[0];
  assert.equal(newCompany?.name, "Orbit Systems");
  assert.equal(newCompany?.contactCount, 0);

  const existing = seedState.companies[0];
  assert.ok(existing);
  const renamed = upsertCompany(
    seedState,
    {
      name: "Nova Labs International",
      industry: existing.industry,
      website: existing.website,
      location: existing.location,
      value: existing.value,
      status: existing.status,
    },
    existing.id,
  );
  assert.equal(renamed.companies.find((company) => company.id === existing.id)?.name, "Nova Labs International");
  assert.ok(renamed.contacts.every((contact) => contact.company !== "Nova Labs" || contact.company === "Nova Labs International"));
  assert.ok(renamed.deals.every((deal) => deal.companyId !== existing.id || deal.company === "Nova Labs International"));
  assert.ok(renamed.tasks.every((task) => task.relatedToId !== existing.id || task.relatedTo === "Nova Labs International"));
  assert.ok(renamed.events.every((event) => event.relatedToId !== existing.id || event.relatedTo === "Nova Labs International"));
  assert.equal(
    renamed.companies.find((company) => company.id === existing.id)?.contactCount,
    renamed.contacts.filter((contact) => contact.company === "Nova Labs International").length,
  );
});

test("deleteCompany blocks linked companies and removes unlinked ones", () => {
  const linked = seedState.companies[0];
  assert.ok(linked);
  const blockMessage = companyDeleteBlockMessage(seedState, linked.id);
  assert.match(blockMessage ?? "", /Cannot delete Nova Labs/);
  assert.throws(() => deleteCompany(seedState, linked.id), /Cannot delete Nova Labs/);

  const created = upsertCompany(seedState, {
    name: "Disposable Co",
    industry: "Testing",
    website: "disposable.demo",
    location: "Remote",
    value: 1000,
    status: "Prospect",
  });
  const disposable = created.companies.find((company) => company.name === "Disposable Co");
  assert.ok(disposable);
  const next = deleteCompany(created, disposable.id);
  assert.equal(next.companies.some((company) => company.id === disposable.id), false);
});
