import assert from "node:assert/strict";
import test from "node:test";
import { deleteContact, upsertContact } from "../../src/lib/crm/contacts.ts";
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

test("deleteContact removes only that record", () => {
  const id = seedState.contacts[0]?.id;
  assert.ok(id);
  const next = deleteContact(seedState, id);
  assert.equal(next.contacts.some((contact) => contact.id === id), false);
  assert.equal(next.contacts.length, seedState.contacts.length - 1);
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
