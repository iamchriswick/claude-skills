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
    const sha = git("subtree", "split", `--prefix=${skill.path}`, skill.tag);
    git("push", "--force-with-lease", "origin", `${sha}:refs/heads/split/${skill.name}`);
    console.log(`pushed refs/heads/split/${skill.name}`);
    const splitTag = `split/${skill.name}/v${skill.version}`;
    git("tag", splitTag, sha);
    git("push", "origin", `refs/tags/${splitTag}`);
    console.log(`pushed refs/tags/${splitTag}`);
  }
}
