import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { skillHash } from "./skill-hash.mjs";

export const THRESHOLD = 0.9;

// The pass-rate checks, shared with eval-record so a failing benchmark is never recorded.
export function benchmarkErrors(name, benchmark) {
  const withSkill = benchmark?.run_summary?.with_skill?.pass_rate?.mean;
  const withoutSkill = benchmark?.run_summary?.without_skill?.pass_rate?.mean;
  if (typeof withSkill !== "number" || typeof withoutSkill !== "number") {
    return [`${name}: unrecognised benchmark.json format`];
  }
  const errors = [];
  if (withSkill < THRESHOLD) errors.push(`${name}: with-skill pass rate ${withSkill} is below ${THRESHOLD}`);
  if (withSkill <= withoutSkill) {
    errors.push(`${name}: with-skill pass rate ${withSkill} does not beat without-skill ${withoutSkill}`);
  }
  return errors;
}

export function checkSkill(skillDir) {
  const name = basename(skillDir);
  const errors = [];
  const metaFile = join(skillDir, "evals", "benchmark.meta.json");
  const benchmarkFile = join(skillDir, "evals", "benchmark.json");

  if (!existsSync(metaFile)) {
    errors.push(`${name}: no evals/benchmark.meta.json — evaluate the skill with skill-creator, then run pnpm eval:record`);
  } else {
    const meta = JSON.parse(readFileSync(metaFile, "utf8"));
    if (meta.skill_sha256 !== skillHash(skillDir)) errors.push(`${name}: skill files changed since the last evaluation`);
  }

  if (!existsSync(benchmarkFile)) {
    errors.push(`${name}: no evals/benchmark.json`);
  } else {
    errors.push(...benchmarkErrors(name, JSON.parse(readFileSync(benchmarkFile, "utf8"))));
  }
  return errors;
}

export function changedSkills(repoRoot, baseRef) {
  const git = (...args) => execFileSync("git", args, { cwd: repoRoot, encoding: "utf8" }).trim();
  const base = git("merge-base", baseRef, "HEAD");
  const names = git("diff", "--name-only", base, "HEAD", "--", "skills/")
    .split("\n")
    .map((path) => path.split("/")[1])
    .filter((name) => name && !name.endsWith("-workspace"));
  return [...new Set(names)].filter((name) => existsSync(join(repoRoot, "skills", name, "SKILL.md")));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const repoRoot = fileURLToPath(new URL("..", import.meta.url));
  const names = changedSkills(repoRoot, process.env.BASE_REF || "origin/main");
  const errors = names.flatMap((name) => checkSkill(join(repoRoot, "skills", name)));
  if (errors.length > 0) {
    for (const error of errors) console.error(error);
    process.exit(1);
  }
  console.log(names.length > 0 ? `benchmarks ok: ${names.join(", ")}` : "no skill changes");
}
