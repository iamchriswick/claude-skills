import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export function releasedSkills(outputs) {
  return JSON.parse(outputs.paths_released).map((path) => ({
    path,
    name: path.split("/").at(-1),
    version: outputs[`${path}--version`],
    tag: outputs[`${path}--tag_name`],
  }));
}

export function splitSkill(skill, git) {
  git("fetch", "origin", `refs/tags/${skill.tag}:refs/tags/${skill.tag}`);
  const sha = git("subtree", "split", `--prefix=${skill.path}`, skill.tag);
  const branch = `refs/heads/split/${skill.name}`;
  git("push", "--force-with-lease", "origin", `${sha}:${branch}`);
  const splitTag = `split/${skill.name}/v${skill.version}`;
  git("tag", splitTag, sha);
  git("push", "origin", `refs/tags/${splitTag}`);
  return [branch, `refs/tags/${splitTag}`];
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();
  const outputs = JSON.parse(process.env.RP_OUTPUTS);
  try {
    git("subtree", "--help");
  } catch {
    console.error("git subtree is not available on this runner");
    process.exit(1);
  }
  for (const skill of releasedSkills(outputs)) {
    for (const ref of splitSkill(skill, git)) console.log(`pushed ${ref}`);
  }
}
