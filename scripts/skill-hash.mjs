import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

// Top-level entries that don't change what the skill does.
const EXCLUDED = new Set(["evals", "tests", "CHANGELOG.md"]);

export function skillFiles(skillDir) {
  const files = [];
  const walk = (relDir) => {
    for (const entry of readdirSync(join(skillDir, relDir), { withFileTypes: true })) {
      if (relDir === "" && EXCLUDED.has(entry.name)) continue;
      const relPath = relDir === "" ? entry.name : `${relDir}/${entry.name}`;
      if (entry.isDirectory()) walk(relPath);
      else if (entry.isFile()) files.push(relPath);
    }
  };
  walk("");
  return files.sort();
}

export function skillHash(skillDir) {
  const hash = createHash("sha256");
  for (const relPath of skillFiles(skillDir)) {
    let content = readFileSync(join(skillDir, relPath));
    if (relPath === "SKILL.md") {
      // The version line changes on every release; leaving it out keeps a release from invalidating the benchmark.
      content = Buffer.from(content.toString("utf8").replace(/^.*x-release-please-version.*$\n?/gm, ""), "utf8");
    }
    hash.update(relPath);
    hash.update("\0");
    hash.update(content);
    hash.update("\0");
  }
  return hash.digest("hex");
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  console.log(skillHash(process.argv[2]));
}
