import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const lines = readFileSync(join(import.meta.dirname, "..", "plan-template.md"), "utf8").split(/\r?\n/);
const open = lines.indexOf("````markdown");
const close = lines.lastIndexOf("````");
// The plan itself is the text inside the template's ````markdown fence.
const plan = lines.slice(open + 1, close);

function taskSection(headingStart: string): string {
  const start = plan.findIndex((line) => line.startsWith(headingStart));
  expect(start, headingStart).toBeGreaterThan(-1);
  const rest = plan.slice(start + 1);
  const end = rest.findIndex((line) => /^#{2,4} /.test(line));
  return (end === -1 ? rest : rest.slice(0, end)).join("\n");
}

const taskKinds = [
  { kind: "work task", heading: "#### [ ] T1.1:", fields: ["Start branch", "Verify", "Commit message"] },
  { kind: "user step", heading: "#### [ ] T1.<n>: User step:", fields: ["Start branch", "Instructions", "Done when"] },
  { kind: "group-ending task", heading: "#### [ ] T1.<last>:", fields: ["Start branch", "Manual check", "Commit message"] },
  { kind: "Detail task", heading: "#### [ ] T3.0:", fields: ["Start branch", "Do", "Commit message"] },
];

describe("plan-template.md", () => {
  it("holds the plan in one markdown fence", () => {
    expect(open).toBeGreaterThan(-1);
    expect(close).toBeGreaterThan(open);
  });

  it("starts the plan with the title pattern", () => {
    expect(plan[0]).toBe("# Plan: <goal> (from <source>, <YYYY-MM-DD>)");
  });

  it("has exactly the three top-level sections", () => {
    expect(plan.filter((line) => line.startsWith("## "))).toEqual([
      "## How to use this plan (read first, every session)",
      "## Context",
      "## Tasks",
    ]);
  });

  for (const { kind, heading, fields } of taskKinds) {
    it(`shows the required fields of a ${kind}`, () => {
      const section = taskSection(heading);
      for (const field of fields) {
        expect(section, field).toContain(`- **${field}:**`);
      }
    });
  }
});
