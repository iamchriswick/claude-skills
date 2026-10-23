import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { checkSkill } from "../scripts/check-benchmarks.mjs";
import { skillHash } from "../scripts/skill-hash.mjs";

const benchmark = (withSkill: number, withoutSkill: number) => ({
  run_summary: {
    with_skill: { pass_rate: { mean: withSkill } },
    without_skill: { pass_rate: { mean: withoutSkill } },
  },
});

describe("checkSkill", () => {
  let dir: string;
  let tmp: string;

  const writeJson = (name: string, data: unknown) =>
    writeFileSync(join(dir, "evals", name), JSON.stringify(data, null, 2) + "\n");
  const writeMeta = (sha = skillHash(dir)) =>
    writeJson("benchmark.meta.json", { skill_sha256: sha, evaluated_at: "2026-10-23", iteration: 1, threshold: 0.9 });

  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), "skill-"));
    dir = join(tmp, "sample");
    mkdirSync(join(dir, "evals"), { recursive: true });
    writeFileSync(join(dir, "SKILL.md"), "---\nname: sample\n---\n\nDo the thing.\n");
  });

  afterEach(() => rmSync(tmp, { recursive: true, force: true }));

  it("passes a skill with a matching meta and pass rates 1.0 vs 0.5", () => {
    writeJson("benchmark.json", benchmark(1.0, 0.5));
    writeMeta();
    expect(checkSkill(dir)).toEqual([]);
  });

  it("reports a missing meta", () => {
    writeJson("benchmark.json", benchmark(1.0, 0.5));
    expect(checkSkill(dir).join("\n")).toMatch(/no evals\/benchmark.meta.json/);
  });

  it("reports a stale hash", () => {
    writeJson("benchmark.json", benchmark(1.0, 0.5));
    writeMeta("0".repeat(64));
    expect(checkSkill(dir).join("\n")).toMatch(/changed since the last evaluation/);
  });

  it("reports a pass rate below the threshold", () => {
    writeJson("benchmark.json", benchmark(0.8, 0.5));
    writeMeta();
    expect(checkSkill(dir).join("\n")).toMatch(/below 0.9/);
  });

  it("reports a pass rate that does not beat the without-skill run", () => {
    writeJson("benchmark.json", benchmark(0.95, 0.95));
    writeMeta();
    expect(checkSkill(dir).join("\n")).toMatch(/does not beat/);
  });

  it("reports a benchmark without run_summary", () => {
    writeJson("benchmark.json", {});
    writeMeta();
    expect(checkSkill(dir).join("\n")).toMatch(/unrecognised benchmark.json format/);
  });
});
