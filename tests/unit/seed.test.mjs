import assert from "node:assert/strict";
import test from "node:test";
import { seedState } from "../../src/lib/seed.ts";

test("CRM seed records remain connected across portfolio pages", () => {
  assert.ok(seedState.contacts.length > 3);
  assert.ok(seedState.deals.every((deal) => deal.company && deal.contact));
  assert.ok(seedState.events.every((event) => /^\d{4}-\d{2}-\d{2}$/.test(event.date)));
  assert.equal(new Set(seedState.deals.map((deal) => deal.id)).size, seedState.deals.length);
});
