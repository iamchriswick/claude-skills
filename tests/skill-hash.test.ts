import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { skillHash } from "../scripts/skill-hash.mjs";

const skillMd = (version: string, body = "Do the thing.") =>
  `---\nname: sample\nmetadata:\n  version: "${version}" # x-release-please-version\n---\n\n${body}\n`;

describe("skillHash", () => {
  let dir: string;
  let tmp: string;

  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), "skill-"));
    dir = join(tmp, "sample");
    mkdirSync(join(dir, "evals"), { recursive: true });
    mkdirSync(join(dir, "tests"), { recursive: true });
    writeFileSync(join(dir, "SKILL.md"), skillMd("0.1.0"));
    writeFileSync(join(dir, "evals", "evals.json"), "{}\n");
    writeFileSync(join(dir, "tests", "sample.test.ts"), "// test\n");
    writeFileSync(join(dir, "CHANGELOG.md"), "# Changelog\n");
  });

  afterEach(() => rmSync(tmp, { recursive: true, force: true }));

  it("is unchanged after editing evals/, tests/ and CHANGELOG.md", () => {
    const before = skillHash(dir);
    writeFileSync(join(dir, "evals", "evals.json"), '{"changed": true}\n');
    writeFileSync(join(dir, "tests", "sample.test.ts"), "// changed\n");
    writeFileSync(join(dir, "CHANGELOG.md"), "# Changelog\n\n## 0.2.0\n");
    expect(skillHash(dir)).toBe(before);
  });

  it("is unchanged after changing only the x-release-please-version line", () => {
    const before = skillHash(dir);
    writeFileSync(join(dir, "SKILL.md"), skillMd("0.2.0"));
    expect(skillHash(dir)).toBe(before);
  });

  it("changes after editing another line of SKILL.md", () => {
    const before = skillHash(dir);
    writeFileSync(join(dir, "SKILL.md"), skillMd("0.1.0", "Do another thing."));
    expect(skillHash(dir)).not.toBe(before);
  });

  it("changes after adding plan-template.md", () => {
    const before = skillHash(dir);
    writeFileSync(join(dir, "plan-template.md"), "# Plan\n");
    expect(skillHash(dir)).not.toBe(before);
  });
});
