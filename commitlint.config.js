import { existsSync, readdirSync } from "node:fs";

const skillsDir = new URL("./skills/", import.meta.url);
const skillScopes = existsSync(skillsDir)
  ? readdirSync(skillsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && !entry.name.endsWith("-workspace"))
      .map((entry) => entry.name)
  : [];

export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [2, "always", [...skillScopes, "repo", "ci", "deps", "release", "main"]],
  },
};
