import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registerHook = pathToFileURL(path.join(projectRoot, "scripts", "register-ts-unit-hook.mjs")).href;
const unitTestDir = path.join(projectRoot, "tests", "unit");
const testFiles = readdirSync(unitTestDir)
  .filter((name) => name.endsWith(".test.mjs"))
  .map((name) => path.join("tests", "unit", name));

const result = spawnSync(
  process.execPath,
  ["--import", registerHook, "--experimental-strip-types", "--test", ...testFiles],
  {
    cwd: projectRoot,
    env: process.env,
    stdio: "inherit",
  },
);

process.exit(result.status ?? 1);
