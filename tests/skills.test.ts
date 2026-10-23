import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";

const skillsDir = join(import.meta.dirname, "..", "skills");

const skillNames = existsSync(skillsDir)
  ? readdirSync(skillsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && !entry.name.endsWith("-workspace"))
      .map((entry) => entry.name)
  : [];

function readFrontmatter(text: string): unknown {
  const lines = text.split(/\r?\n/);
  const open = lines.indexOf("---");
  const close = lines.indexOf("---", open + 1);
  if (open === -1 || close === -1) throw new Error("no frontmatter between two --- lines");
  return parse(lines.slice(open + 1, close).join("\n"));
}

it("lists the skill folders", () => {
  for (const name of skillNames) {
    expect(name).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  }
});

for (const name of skillNames) {
  describe(name, () => {
    const skillDir = join(skillsDir, name);
    const skillFile = join(skillDir, "SKILL.md");
    const readSkill = () => readFileSync(skillFile, "utf8");
    const frontmatter = () => readFrontmatter(readSkill()) as Record<string, unknown>;

    it("has a SKILL.md", () => {
      expect(existsSync(skillFile)).toBe(true);
    });

    it("has valid frontmatter", () => {
      const parsed = readFrontmatter(readSkill());
      expect(parsed).toBeTypeOf("object");
      expect(parsed).not.toBeNull();
      expect(Array.isArray(parsed)).toBe(false);
    });

    it("names the skill after its folder", () => {
      expect(frontmatter().name).toBe(name);
    });

    it("has a description within 1024 characters", () => {
      const { description } = frontmatter();
      expect(description).toBeTypeOf("string");
      expect((description as string).length).toBeGreaterThanOrEqual(1);
      expect((description as string).length).toBeLessThanOrEqual(1024);
    });

    it("links only to files that exist", () => {
      const targets = [...readSkill().matchAll(/\]\(([^)\s]+)\)/g)]
        .map((match) => match[1])
        .filter((target) => !/^(https?:|mailto:|#)/.test(target))
        .map((target) => target.split("#")[0]);
      for (const target of targets) {
        expect(existsSync(join(skillDir, target)), target).toBe(true);
      }
    });

    it("has a valid evals/evals.json", () => {
      const evalsFile = join(skillDir, "evals", "evals.json");
      expect(existsSync(evalsFile)).toBe(true);
      const data = JSON.parse(readFileSync(evalsFile, "utf8"));
      expect(data.skill_name).toBe(name);
      expect(Array.isArray(data.evals)).toBe(true);
      expect(data.evals.length).toBeGreaterThan(0);
      const ids = new Set<number>();
      for (const entry of data.evals) {
        expect(entry.id).toBeTypeOf("number");
        expect(ids.has(entry.id), `duplicate id ${entry.id}`).toBe(false);
        ids.add(entry.id);
        expect(entry.prompt).toBeTypeOf("string");
        expect(entry.prompt.length).toBeGreaterThan(0);
        expect(entry.expected_output).toBeTypeOf("string");
        if (entry.files !== undefined) {
          expect(Array.isArray(entry.files)).toBe(true);
          for (const file of entry.files) {
            expect(file).toBeTypeOf("string");
            expect(existsSync(join(skillDir, file)), file).toBe(true);
          }
        }
        if (entry.assertions !== undefined) {
          expect(Array.isArray(entry.assertions)).toBe(true);
          for (const assertion of entry.assertions) {
            expect(assertion).toBeTypeOf("string");
            expect(assertion.length).toBeGreaterThan(0);
          }
        }
      }
    });
  });
}
