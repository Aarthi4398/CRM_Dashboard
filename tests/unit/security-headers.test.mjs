import assert from "node:assert/strict";
import test from "node:test";
import {
  buildContentSecurityPolicy,
  productionContentSecurityPolicy,
} from "../../src/lib/security-headers.ts";

test("production CSP scopes connect-src to self", () => {
  assert.match(productionContentSecurityPolicy, /connect-src 'self'(;|$)/);
  assert.doesNotMatch(productionContentSecurityPolicy, /connect-src[^;]*\bws:/);
  assert.doesNotMatch(productionContentSecurityPolicy, /connect-src[^;]*\bwss:/);
});

test("development CSP allows localhost HMR connections", () => {
  const developmentPolicy = buildContentSecurityPolicy({ development: true });
  assert.match(developmentPolicy, /connect-src[^;]*ws:\/\/localhost:\*/);
  assert.match(developmentPolicy, /connect-src[^;]*wss:\/\/localhost:\*/);
});

test("production CSP tightens style-src without removing inline attribute styles", () => {
  assert.match(productionContentSecurityPolicy, /style-src 'self'/);
  assert.match(productionContentSecurityPolicy, /style-src-attr 'unsafe-inline'/);
  assert.match(productionContentSecurityPolicy, /style-src-elem 'self'/);
  assert.doesNotMatch(productionContentSecurityPolicy, /style-src 'self' 'unsafe-inline'/);
});

test("production CSP preserves required media and frame sources", () => {
  assert.match(productionContentSecurityPolicy, /nextjs-demo\.tailadmin\.com/);
  assert.match(productionContentSecurityPolicy, /openstreetmap\.org/);
  assert.match(productionContentSecurityPolicy, /youtube\.com/);
  assert.match(productionContentSecurityPolicy, /blob:/);
  assert.match(productionContentSecurityPolicy, /data:/);
});

test("production CSP preserves unrelated security directives", () => {
  assert.match(productionContentSecurityPolicy, /object-src 'none'/);
  assert.match(productionContentSecurityPolicy, /base-uri 'self'/);
  assert.match(productionContentSecurityPolicy, /form-action 'self'/);
  assert.match(productionContentSecurityPolicy, /frame-ancestors 'self'/);
  assert.match(productionContentSecurityPolicy, /script-src 'self'/);
});
