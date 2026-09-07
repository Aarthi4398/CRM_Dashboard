import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const fallbackSource = readFileSync(
  join(process.cwd(), "src/components/crm-error-fallback.tsx"),
  "utf8",
);
const routeErrorSource = readFileSync(
  join(process.cwd(), "src/app/(crm)/error.tsx"),
  "utf8",
);

test("CRMErrorFallback exposes accessible alert markup without rendering error details", () => {
  assert.match(fallbackSource, /role="alert"/);
  assert.match(fallbackSource, /aria-labelledby="crm-error-title"/);
  assert.match(fallbackSource, /aria-describedby="crm-error-description"/);
  assert.match(fallbackSource, /Something went wrong/);
  assert.match(fallbackSource, /stored CRM data has not been changed/i);
  assert.match(fallbackSource, /Try again/);
  assert.doesNotMatch(fallbackSource, /\{error\.message\}/);
  assert.doesNotMatch(fallbackSource, /\{error\.stack\}/);
  assert.doesNotMatch(fallbackSource, /\{String\(error\)\}/);
});

test("CRMErrorFallback wires retry reset, focus, and console logging in source", () => {
  assert.match(fallbackSource, /onClick=\{\(\) => reset\(\)\}/);
  assert.match(fallbackSource, /retryRef\.current\?\.focus\(\)/);
  assert.match(fallbackSource, /console\.error\("\[crm-error-boundary\]"/);
  assert.match(fallbackSource, /digest: error\.digest/);
});

test("CRM route error boundary delegates to CRMErrorFallback", () => {
  assert.match(routeErrorSource, /"use client"/);
  assert.match(routeErrorSource, /CRMErrorFallback/);
  assert.match(routeErrorSource, /error={error}/);
  assert.match(routeErrorSource, /reset={reset}/);
});
