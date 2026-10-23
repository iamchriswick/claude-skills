import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { THRESHOLD, benchmarkErrors } from "./check-benchmarks.mjs";
import { skillHash } from "./skill-hash.mjs";

export function recordEvaluation(repoRoot, skillName, iterationDir) {
  const source = join(iterationDir, "benchmark.json");
  if (!existsSync(source)) throw new Error(`no benchmark.json in ${iterationDir}`);
  const match = basename(resolve(iterationDir)).match(/iteration-(\d+)$/);
  if (!match) throw new Error(`${iterationDir} is not an iteration-<n> folder`);
  const skillDir = join(repoRoot, "skills", skillName);
  if (!existsSync(join(skillDir, "SKILL.md"))) throw new Error(`no skills/${skillName}/SKILL.md`);
  const errors = benchmarkErrors(skillName, JSON.parse(readFileSync(source, "utf8")));
  if (errors.length > 0) throw new Error(errors.join("\n"));

  const evalsDir = join(skillDir, "evals");
  mkdirSync(evalsDir, { recursive: true });
  copyFileSync(source, join(evalsDir, "benchmark.json"));
  const meta = {
    skill_sha256: skillHash(skillDir),
    evaluated_at: new Date().toISOString().slice(0, 10),
    iteration: Number(match[1]),
    threshold: THRESHOLD,
  };
  writeFileSync(join(evalsDir, "benchmark.meta.json"), JSON.stringify(meta, null, 2) + "\n");
  return meta;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const repoRoot = fileURLToPath(new URL("..", import.meta.url));
    const meta = recordEvaluation(repoRoot, process.argv[2], process.argv[3]);
    console.log(`recorded ${process.argv[2]} iteration ${meta.iteration}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
