import { register } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const hookPath = pathToFileURL(
  path.join(path.dirname(fileURLToPath(import.meta.url)), "ts-unit-resolve-hook.mjs"),
).href;

register(hookPath, import.meta.url);
