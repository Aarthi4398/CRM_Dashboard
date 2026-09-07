import assert from "node:assert/strict";
import test from "node:test";
import { seedState } from "../../src/lib/seed.ts";
import {
  CRM_SCHEMA_VERSION,
  migrateParsedValue,
  parsePersistedCRMState,
  parsePersistedCRMStateDetailed,
  serializeCRMState,
} from "../../src/lib/validate-state.ts";
import { normalizeCRMRelationships, sanitizeCRMState } from "../../src/lib/validate-state.ts";

test("valid legacy unversioned state migrates and preserves records", () => {
  const result = migrateParsedValue(seedState);
  assert.equal(result.status, "ok");
  if (result.status !== "ok") return;
  assert.equal(result.migratedFrom, "legacy");
  assert.equal(result.state.contacts.length, seedState.contacts.length);
  assert.equal(result.dropped.contacts, 0);
});

test("legacy state with one malformed contact keeps valid siblings", () => {
  const legacy = {
    ...seedState,
    contacts: [seedState.contacts[0], { id: "broken" }, seedState.contacts[1]],
  };
  const result = migrateParsedValue(legacy);
  assert.equal(result.status, "ok");
  if (result.status !== "ok") return;
  assert.equal(result.state.contacts.length, 2);
  assert.equal(result.dropped.contacts, 1);
  assert.ok(result.state.contacts.some((contact) => contact.id === seedState.contacts[0].id));
});

test("multiple malformed records in different collections are dropped independently", () => {
  const legacy = {
    ...seedState,
    contacts: [{ id: "bad" }],
    companies: [seedState.companies[0]],
    deals: [{ ...seedState.deals[0], probability: "high" }],
    tasks: [seedState.tasks[0]],
    events: [{ ...seedState.events[0], attendees: "many" }],
  };
  const result = migrateParsedValue(legacy);
  assert.equal(result.status, "ok");
  if (result.status !== "ok") return;
  assert.equal(result.state.contacts.length, 0);
  assert.equal(result.state.companies.length, 1);
  assert.equal(result.state.deals.length, 0);
  assert.equal(result.state.tasks.length, 1);
  assert.equal(result.state.events.length, 0);
  assert.equal(result.dropped.contacts, 1);
  assert.equal(result.dropped.deals, 1);
  assert.equal(result.dropped.events, 1);
});

test("current-version round trip preserves envelope and state", () => {
  const serialized = serializeCRMState(seedState);
  const parsed = JSON.parse(serialized);
  assert.equal(parsed.schemaVersion, CRM_SCHEMA_VERSION);
  const restored = parsePersistedCRMState(serialized);
  assert.ok(restored);
  assert.equal(restored?.contacts.length, seedState.contacts.length);
});

test("migration from schema version 1 envelope upgrades to current version on serialize", () => {
  const v1Envelope = { schemaVersion: 1, state: seedState };
  const result = migrateParsedValue(v1Envelope);
  assert.equal(result.status, "ok");
  if (result.status !== "ok") return;
  assert.equal(result.migratedFrom, 1);
  const serialized = serializeCRMState(result.state);
  assert.equal(JSON.parse(serialized).schemaVersion, CRM_SCHEMA_VERSION);
});

test("empty sanitized collections are allowed", () => {
  const empty = {
    contacts: [],
    companies: [],
    deals: [],
    tasks: [],
    events: [],
    profile: seedState.profile,
  };
  const result = migrateParsedValue(empty);
  assert.equal(result.status, "ok");
  if (result.status !== "ok") return;
  assert.deepEqual(result.state.contacts, []);
});

test("non-collection legacy payloads are malformed", () => {
  assert.equal(migrateParsedValue({ contacts: "bad" }).status, "malformed");
  assert.equal(parsePersistedCRMState(JSON.stringify({ contacts: "bad" })), null);
});

test("malformed JSON is reported as malformed", () => {
  assert.equal(parsePersistedCRMStateDetailed("{not-json").status, "malformed");
  assert.equal(parsePersistedCRMState("{not-json"), null);
});

test("unsupported future schemaVersion returns unsupported without data loss signal", () => {
  const future = { schemaVersion: CRM_SCHEMA_VERSION + 5, state: seedState };
  const result = migrateParsedValue(future);
  assert.equal(result.status, "unsupported_version");
  if (result.status === "unsupported_version") {
    assert.equal(result.version, CRM_SCHEMA_VERSION + 5);
  }
  assert.equal(parsePersistedCRMState(JSON.stringify(future)), null);
});

test("relationships normalize after migration", () => {
  const legacy = {
    ...seedState,
    tasks: [
      ...seedState.tasks,
      {
        id: "new-task",
        title: "Link Nova",
        description: "",
        priority: "Low",
        status: "To do",
        dueDate: "2026-09-04",
        relatedTo: "Nova Labs",
      },
    ],
  };
  const result = migrateParsedValue(legacy);
  assert.equal(result.status, "ok");
  if (result.status !== "ok") return;
  const task = result.state.tasks.find((item) => item.id === "new-task");
  assert.equal(task?.relatedToId, "co1");
});

test("sanitizeCRMState replaces invalid profile with fallback", () => {
  const { state, dropped } = sanitizeCRMState(
    { ...seedState, profile: { name: "broken" } },
    seedState.profile,
  );
  assert.equal(dropped.profileReplaced, true);
  assert.deepEqual(state.profile, seedState.profile);
});

test("valid records survive when siblings are invalid", () => {
  const { state, dropped } = sanitizeCRMState(
    {
      ...seedState,
      contacts: [seedState.contacts[0], { id: "x" }, seedState.contacts[2]],
      deals: [seedState.deals[0], { id: "bad-deal" }],
    },
    seedState.profile,
  );
  assert.equal(dropped.contacts, 1);
  assert.equal(dropped.deals, 1);
  assert.equal(state.contacts.length, 2);
  assert.equal(state.deals.length, 1);
  assert.equal(state.deals[0].id, seedState.deals[0].id);
});

test("normalizeCRMRelationships runs after sanitization", () => {
  const { state } = sanitizeCRMState(seedState, seedState.profile);
  assert.equal(state, normalizeCRMRelationships(state));
});
