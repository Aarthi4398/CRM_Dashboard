import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const playwrightCli = path.join(projectRoot, "node_modules", "@playwright", "test", "cli.js");
const browserPath = path.join(projectRoot, ".playwright-browsers");
const result = spawnSync(process.execPath, [playwrightCli, ...process.argv.slice(2)], {
  cwd: projectRoot,
  env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: browserPath },
  stdio: "inherit",
});

process.exit(result.status ?? 1);
