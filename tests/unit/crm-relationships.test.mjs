import assert from "node:assert/strict";
import test from "node:test";
import {
  companyDeleteBlockMessage,
  deleteCompany,
  upsertCompany,
} from "../../src/lib/crm/companies.ts";
import { upsertContact } from "../../src/lib/crm/contacts.ts";
import {
  findUniqueCompanyIdByName,
  normalizeCRMRelationships,
} from "../../src/lib/crm/relationships.ts";
import { seedState } from "../../src/lib/seed.ts";
import {
  CRM_SCHEMA_VERSION,
  migrateParsedValue,
  parsePersistedCRMState,
  serializeCRMState,
} from "../../src/lib/persistence/persisted-crm.ts";

function withDuplicateCompanies(state) {
  return {
    ...state,
    companies: [
      ...state.companies,
      {
        id: "co-dup",
        name: "Nova Labs",
        industry: "Consulting",
        website: "nova-dup.demo",
        location: "Boston, US",
        value: 12000,
        contactCount: 0,
        status: "Prospect",
      },
    ],
  };
}

test("contact create assigns companyId when company name is unique", () => {
  const next = upsertContact(seedState, {
    name: "Linked Person",
    role: "AE",
    company: "Nova Labs",
    email: "linked@example.com",
    phone: "1",
    status: "Lead",
  });
  const contact = next.contacts[0];
  assert.equal(contact?.companyId, "co1");
  assert.equal(contact?.company, "Nova Labs");
});

test("contact reassignment updates companyId and display name", () => {
  const existing = seedState.contacts[0];
  assert.ok(existing);
  const next = upsertContact(
    seedState,
    { ...existing, company: "Cloudly" },
    existing.id,
  );
  const updated = next.contacts.find((contact) => contact.id === existing.id);
  assert.equal(updated?.companyId, "co2");
  assert.equal(updated?.company, "Cloudly");
});

test("company rename keeps ID-linked contact, deal, task, and event relationships", () => {
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

  const contact = renamed.contacts.find((item) => item.id === "c1");
  assert.equal(contact?.companyId, "co1");
  assert.equal(contact?.company, "Nova Labs International");

  const deal = renamed.deals.find((item) => item.id === "d1");
  assert.equal(deal?.companyId, "co1");
  assert.equal(deal?.company, "Nova Labs International");

  const task = renamed.tasks.find((item) => item.id === "t1");
  assert.equal(task?.relatedToId, "co1");
  assert.equal(task?.relatedTo, "Nova Labs International");

  const event = renamed.events.find((item) => item.id === "e1");
  assert.equal(event?.relatedToId, "co1");
  assert.equal(event?.relatedTo, "Nova Labs International");
});

test("legacy name-only relationship resolves when company name is unique", () => {
  const legacy = {
    ...seedState,
    contacts: [
      {
        ...seedState.contacts[0],
        companyId: undefined,
        company: "Nova Labs",
      },
    ],
  };
  const normalized = normalizeCRMRelationships(legacy);
  const contact = normalized.contacts[0];
  assert.equal(contact?.companyId, "co1");
  assert.equal(contact?.company, "Nova Labs");
});

test("duplicate company names do not auto-link by name", () => {
  const ambiguous = withDuplicateCompanies(seedState);
  assert.equal(findUniqueCompanyIdByName(ambiguous.companies, "Nova Labs"), undefined);

  const legacy = {
    ...ambiguous,
    contacts: [
      {
        ...seedState.contacts[0],
        companyId: undefined,
        company: "Nova Labs",
      },
    ],
  };
  const normalized = normalizeCRMRelationships(legacy);
  const contact = normalized.contacts[0];
  assert.equal(contact?.companyId, undefined);
  assert.equal(contact?.company, "Nova Labs");
});

test("company rename does not touch unrelated legacy records with ambiguous names", () => {
  const ambiguous = withDuplicateCompanies(seedState);
  const existing = ambiguous.companies[0];
  assert.ok(existing);

  const renamed = upsertCompany(
    ambiguous,
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

  const legacyContact = renamed.contacts.find((contact) => contact.id === "c1");
  assert.equal(legacyContact?.companyId, "co1");
  assert.equal(legacyContact?.company, "Nova Labs International");

  const ambiguousContact = {
    id: "c-ambiguous",
    name: "Ambiguous Contact",
    role: "Analyst",
    company: "Nova Labs",
    email: "ambiguous@example.com",
    phone: "2",
    status: "Lead",
    initials: "AC",
    tags: [],
    createdAt: "2026-08-20",
  };
  const withAmbiguous = {
    ...renamed,
    contacts: [...renamed.contacts, ambiguousContact],
  };
  const renamedAgain = upsertCompany(
    withAmbiguous,
    {
      name: "Nova Labs Global",
      industry: existing.industry,
      website: existing.website,
      location: existing.location,
      value: existing.value,
      status: existing.status,
    },
    existing.id,
  );
  const unresolved = renamedAgain.contacts.find((contact) => contact.id === "c-ambiguous");
  assert.equal(unresolved?.companyId, undefined);
  assert.equal(unresolved?.company, "Nova Labs");
});

test("company delete blocking detects relationships through IDs", () => {
  const linked = seedState.companies[0];
  assert.ok(linked);
  const blockMessage = companyDeleteBlockMessage(seedState, linked.id);
  assert.match(blockMessage ?? "", /Cannot delete Nova Labs/);
  assert.throws(() => deleteCompany(seedState, linked.id), /Cannot delete Nova Labs/);

  const idLinkedOnly = {
    ...seedState,
    contacts: seedState.contacts.map((contact) =>
      contact.id === "c1"
        ? { ...contact, company: "Stale Label", companyId: "co1" }
        : contact,
    ),
  };
  assert.match(companyDeleteBlockMessage(idLinkedOnly, linked.id) ?? "", /contact\(s\)/);
});

test("persist and reload retain normalized relationships without schema bump", () => {
  const serialized = serializeCRMState(seedState);
  const parsed = JSON.parse(serialized);
  assert.equal(parsed.schemaVersion, CRM_SCHEMA_VERSION);
  const restored = parsePersistedCRMState(serialized);
  assert.ok(restored);
  assert.equal(restored.contacts.find((contact) => contact.id === "c1")?.companyId, "co1");
  assert.equal(restored.deals.find((deal) => deal.id === "d1")?.companyId, "co1");
});

test("existing v2 persisted data still loads when companyId is absent", () => {
  const legacyContact = {
    ...seedState.contacts[4],
    companyId: undefined,
  };
  const legacyEnvelope = {
    schemaVersion: CRM_SCHEMA_VERSION,
    state: {
      ...seedState,
      contacts: [legacyContact],
    },
  };
  const result = migrateParsedValue(legacyEnvelope);
  assert.equal(result.status, "ok");
  if (result.status !== "ok") return;
  assert.equal(result.migratedFrom, undefined);
  assert.equal(result.state.contacts[0]?.company, "Metric AI");
  assert.equal(result.state.contacts[0]?.companyId, undefined);
});

test("unsupported future schema behavior remains unchanged", () => {
  const future = { schemaVersion: CRM_SCHEMA_VERSION + 5, state: seedState };
  const result = migrateParsedValue(future);
  assert.equal(result.status, "unsupported_version");
  if (result.status === "unsupported_version") {
    assert.equal(result.version, CRM_SCHEMA_VERSION + 5);
  }
  assert.equal(parsePersistedCRMState(JSON.stringify(future)), null);
});
