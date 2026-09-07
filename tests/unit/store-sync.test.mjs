import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { upsertContact } from "../../src/lib/crm/contacts.ts";
import { createCRMStore } from "../../src/lib/validate-state.ts";
import { seedState } from "../../src/lib/seed.ts";
import {
  parsePersistedCRMState,
  serializeCRMState,
  shouldApplyStorageUpdate,
} from "../../src/lib/validate-state.ts";

const storeSource = readFileSync(join(process.cwd(), "src/lib/store.tsx"), "utf8");

test("store registers a storage listener for cross-tab sync", () => {
  assert.match(storeSource, /window\.addEventListener\("storage", onStorage\)/);
  assert.match(storeSource, /window\.removeEventListener\("storage", onStorage\)/);
  assert.match(storeSource, /isCRMStorageKey/);
  assert.match(storeSource, /shouldApplyStorageUpdate/);
  assert.match(storeSource, /parsePersistedCRMState/);
});

test("store uses a single external CRM store abstraction", () => {
  assert.match(storeSource, /createCRMStore/);
  assert.match(storeSource, /useSyncExternalStore/);
  assert.doesNotMatch(storeSource, /useLayoutEffect/);
  assert.doesNotMatch(storeSource, /setRawState/);
  assert.doesNotMatch(storeSource, /currentState/);
});

test("parsePersistedCRMState accepts valid versioned payloads", () => {
  const serialized = serializeCRMState(seedState);
  const restored = parsePersistedCRMState(serialized);
  assert.ok(restored);
  assert.equal(restored.contacts.length, seedState.contacts.length);
  assert.equal(JSON.parse(serialized).schemaVersion, 2);
});

test("parsePersistedCRMState rejects malformed payloads without throwing", () => {
  assert.equal(parsePersistedCRMState("{not-json"), null);
  assert.equal(parsePersistedCRMState(JSON.stringify({ contacts: "bad" })), null);
});

test("shouldApplyStorageUpdate skips identical serialized state", () => {
  const next = upsertContact(seedState, {
    name: "Cross Tab",
    role: "AE",
    company: "Nova Labs",
    email: "cross@example.com",
    phone: "1",
    status: "Lead",
  });
  const serialized = serializeCRMState(next);
  assert.equal(shouldApplyStorageUpdate(next, serialized), false);
  assert.equal(shouldApplyStorageUpdate(seedState, serialized), true);
});

test("createCRMStore starts from seed snapshot", () => {
  const store = createCRMStore(seedState);
  assert.equal(store.getState().contacts.length, seedState.contacts.length);
});

test("createCRMStore notifies subscribers on state changes", () => {
  const store = createCRMStore(seedState);
  let notifications = 0;
  store.subscribe(() => {
    notifications += 1;
  });
  store.setState((current) => upsertContact(current, {
    name: "Store Listener",
    role: "AE",
    company: "Nova Labs",
    email: "listener@example.com",
    phone: "1",
    status: "Lead",
  }));
  assert.equal(notifications, 1);
});

test("createCRMStore skips notifications for no-op updates", () => {
  const store = createCRMStore(seedState);
  let notifications = 0;
  store.subscribe(() => {
    notifications += 1;
  });
  store.setState((current) => current);
  assert.equal(notifications, 0);
});

test("createCRMStore unsubscribe stops listener notifications", () => {
  const store = createCRMStore(seedState);
  let notifications = 0;
  const unsubscribe = store.subscribe(() => {
    notifications += 1;
  });
  unsubscribe();
  store.setState((current) => upsertContact(current, {
    name: "Unsubscribed",
    role: "AE",
    company: "Nova Labs",
    email: "unsub@example.com",
    phone: "1",
    status: "Lead",
  }));
  assert.equal(notifications, 0);
});

test("malformed storage payload parses to null without throwing", () => {
  assert.equal(parsePersistedCRMState("{not-json"), null);
});

test("storage removal is represented by null raw value", () => {
  assert.equal(parsePersistedCRMState(null), null);
  assert.equal(shouldApplyStorageUpdate(seedState, null), true);
});
