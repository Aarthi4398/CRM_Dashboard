import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { seedState } from "../../src/lib/seed.ts";
import { upsertContact } from "../../src/lib/crm/contacts.ts";
import { isCRMState, normalizeCRMRelationships } from "../../src/lib/validate-state.ts";

const storeSource = readFileSync(join(process.cwd(), "src/lib/store.tsx"), "utf8");

function parsePersistedCRMState(raw) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!isCRMState(parsed)) return null;
    return normalizeCRMRelationships(parsed);
  } catch {
    return null;
  }
}

function serializeCRMState(state) {
  return JSON.stringify(state);
}

function shouldApplyStorageUpdate(current, incomingRaw) {
  if (!incomingRaw) return true;
  return serializeCRMState(current) !== incomingRaw;
}

test("store registers a storage listener for cross-tab sync", () => {
  assert.match(storeSource, /window\.addEventListener\("storage", onStorage\)/);
  assert.match(storeSource, /window\.removeEventListener\("storage", onStorage\)/);
  assert.match(storeSource, /event\.key !== CRM_STORAGE_KEY/);
  assert.match(storeSource, /shouldApplyStorageUpdate/);
  assert.match(storeSource, /parsePersistedCRMState/);
});

test("parsePersistedCRMState accepts valid CRM payloads", () => {
  const serialized = serializeCRMState(seedState);
  const restored = parsePersistedCRMState(serialized);
  assert.ok(restored);
  assert.equal(restored.contacts.length, seedState.contacts.length);
});

test("parsePersistedCRMState rejects malformed payloads", () => {
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
