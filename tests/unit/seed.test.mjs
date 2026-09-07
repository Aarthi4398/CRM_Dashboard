import assert from "node:assert/strict";
import test from "node:test";
import { seedState } from "../../src/lib/seed.ts";
import { contentSecurityPolicy } from "../../src/lib/security-headers.ts";
import { isCRMState, normalizeCRMRelationships } from "../../src/lib/validate-state.ts";

test("CRM seed records remain connected across portfolio pages", () => {
  assert.ok(seedState.contacts.length > 3);
  assert.ok(seedState.deals.every((deal) => deal.company && deal.contact));
  assert.ok(seedState.events.every((event) => /^\d{4}-\d{2}-\d{2}$/.test(event.date)));
  assert.equal(new Set(seedState.deals.map((deal) => deal.id)).size, seedState.deals.length);
});

test("persisted CRM state is validated at record level", () => {
  assert.equal(isCRMState(seedState), true);
  assert.equal(isCRMState({ ...seedState, contacts: [{ id: "broken" }] }), false);
  assert.equal(isCRMState({ ...seedState, deals: [{ ...seedState.deals[0], probability: "high" }] }), false);
});

test("seed relationships use stable IDs when matching records exist", () => {
  const companyIds = new Set(seedState.companies.map(company => company.id));
  const contactIds = new Set(seedState.contacts.map(contact => contact.id));
  assert.ok(seedState.contacts.every(contact => !contact.companyId || companyIds.has(contact.companyId)));
  assert.ok(seedState.deals.every(deal => !deal.companyId || companyIds.has(deal.companyId)));
  assert.ok(seedState.deals.every(deal => !deal.contactId || contactIds.has(deal.contactId)));
  assert.ok(seedState.tasks.every(task => !task.relatedToId || companyIds.has(task.relatedToId)));
});

test("new related records receive stable IDs when names match", () => {
  const normalized = normalizeCRMRelationships({
    ...seedState,
    tasks: [...seedState.tasks, { id: "new-task", title: "Link Nova", description: "", priority: "Low", status: "To do", dueDate: "2026-09-04", relatedTo: "Nova Labs" }],
    events: [...seedState.events, { id: "new-event", title: "Link Cloudly", date: "2026-09-04", time: "10:00", category: "Meeting", attendees: 2, relatedTo: "Jane Smith" }],
  });
  const task = normalized.tasks.find(item => item.id === "new-task");
  const event = normalized.events.find(item => item.id === "new-event");
  assert.equal(task?.relatedToId, "co1");
  assert.equal(event?.relatedToId, "c2");
});

test("CSP includes remote image, map, video, and local preview sources", () => {
  assert.match(contentSecurityPolicy, /nextjs-demo\.tailadmin\.com/);
  assert.match(contentSecurityPolicy, /openstreetmap\.org/);
  assert.match(contentSecurityPolicy, /youtube\.com/);
  assert.match(contentSecurityPolicy, /blob:/);
  assert.match(contentSecurityPolicy, /data:/);
});
