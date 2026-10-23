import { describe, expect, it } from "vitest";
import { releasedSkills, splitSkill } from "../scripts/split-released.mjs";

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

describe("splitSkill", () => {
  it("fetches the release tag before splitting, then pushes the split branch and tag", () => {
    const calls: string[][] = [];
    const git = (...args: string[]) => {
      calls.push(args);
      return args[0] === "subtree" ? "abc123" : "";
    };
    const refs = splitSkill(
      { path: "skills/create-plan", name: "create-plan", version: "0.1.0", tag: "create-plan-v0.1.0" },
      git,
    );
    expect(calls).toEqual([
      ["fetch", "origin", "refs/tags/create-plan-v0.1.0:refs/tags/create-plan-v0.1.0"],
      ["subtree", "split", "--prefix=skills/create-plan", "create-plan-v0.1.0"],
      ["push", "--force-with-lease", "origin", "abc123:refs/heads/split/create-plan"],
      ["tag", "split/create-plan/v0.1.0", "abc123"],
      ["push", "origin", "refs/tags/split/create-plan/v0.1.0"],
    ]);
    expect(refs).toEqual(["refs/heads/split/create-plan", "refs/tags/split/create-plan/v0.1.0"]);
  });
});
