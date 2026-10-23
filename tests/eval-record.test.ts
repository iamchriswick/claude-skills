import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { recordEvaluation } from "../scripts/eval-record.mjs";
import { skillHash } from "../scripts/skill-hash.mjs";

const benchmark = (withSkill: number, withoutSkill: number) => ({
  run_summary: {
    with_skill: { pass_rate: { mean: withSkill } },
    without_skill: { pass_rate: { mean: withoutSkill } },
  },
});

describe("recordEvaluation", () => {
  let root: string;
  let skillDir: string;

  const writeIteration = (folder: string, data: unknown) => {
    const iterationDir = join(root, "create-plan-workspace", folder);
    mkdirSync(iterationDir, { recursive: true });
    writeFileSync(join(iterationDir, "benchmark.json"), JSON.stringify(data, null, 2) + "\n");
    return iterationDir;
  };

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "skill-"));
    skillDir = join(root, "skills", "create-plan");
    mkdirSync(skillDir, { recursive: true });
    writeFileSync(join(skillDir, "SKILL.md"), "---\nname: create-plan\n---\n\nWrite the plan.\n");
  });

  it("writes the benchmark and its meta", () => {
    const iterationDir = writeIteration("iteration-3", benchmark(1.0, 0.5));
    recordEvaluation(root, "create-plan", iterationDir);
    expect(existsSync(join(skillDir, "evals", "benchmark.json"))).toBe(true);
    const meta = JSON.parse(readFileSync(join(skillDir, "evals", "benchmark.meta.json"), "utf8"));
    expect(meta.iteration).toBe(3);
    expect(meta.threshold).toBe(0.9);
    expect(meta.skill_sha256).toBe(skillHash(skillDir));
  });

  it("throws for a pass rate below 0.9", () => {
    const iterationDir = writeIteration("iteration-3", benchmark(0.8, 0.5));
    expect(() => recordEvaluation(root, "create-plan", iterationDir)).toThrow();
  });

  it("throws for a folder named run-3", () => {
    const iterationDir = writeIteration("run-3", benchmark(1.0, 0.5));
    expect(() => recordEvaluation(root, "create-plan", iterationDir)).toThrow();
  });
});
