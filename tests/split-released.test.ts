import { describe, expect, it } from "vitest";
import { releasedSkills } from "../scripts/split-released.mjs";

describe("releasedSkills", () => {
  it("reads each released path's name, version and tag", () => {
    expect(
      releasedSkills({
        paths_released: '["skills/create-plan"]',
        "skills/create-plan--version": "0.1.0",
        "skills/create-plan--tag_name": "create-plan-v0.1.0",
      }),
    ).toEqual([{ path: "skills/create-plan", name: "create-plan", version: "0.1.0", tag: "create-plan-v0.1.0" }]);
  });

  it("returns nothing when no path was released", () => {
    expect(releasedSkills({ paths_released: "[]" })).toEqual([]);
  });
});
