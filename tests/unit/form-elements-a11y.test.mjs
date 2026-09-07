import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const source = readFileSync(
  join(process.cwd(), "src/app/(crm)/form-elements/page.tsx"),
  "utf8",
);

test("form-elements Field helper wires htmlFor and assigns control ids", () => {
  assert.match(source, /function Field\(/);
  assert.match(source, /<label htmlFor=\{fieldId\}/);
  assert.match(source, /assignFirstControlId/);
  assert.doesNotMatch(source, /<span className="mb-2 block text-sm font-medium">\{label\}<\/span>/);
});

test("form-elements Select forwards id to native select", () => {
  assert.match(source, /function Select\(\{ name, placeholder = "Select an option", id \}/);
  assert.match(source, /<select id=\{id\}/);
});
