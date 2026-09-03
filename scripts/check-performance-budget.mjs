import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const chunkRoot = join(process.cwd(), ".next", "static", "chunks");
const files = await walk(chunkRoot);
const javascript = files.filter(file => file.endsWith(".js"));
const sizes = await Promise.all(javascript.map(async file => ({ file, gzip: gzipSync(await readFile(file)).byteLength })));
const total = sizes.reduce((sum, item) => sum + item.gzip, 0);
const largest = sizes.reduce((max, item) => Math.max(max, item.gzip), 0);
const limits = { total: 2_500_000, largest: 350_000 };

console.log(`Client chunks: ${javascript.length}; gzip total: ${kb(total)}; largest: ${kb(largest)}`);
if (total > limits.total || largest > limits.largest) {
  console.error(`Performance budget exceeded (total ${kb(limits.total)}, individual ${kb(limits.largest)}).`);
  process.exitCode = 1;
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? walk(join(directory, entry.name)) : [join(directory, entry.name)]))).flat();
}
function kb(bytes) { return `${(bytes / 1024).toFixed(1)} kB`; }
