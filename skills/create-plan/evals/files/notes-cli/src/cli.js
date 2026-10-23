#!/usr/bin/env node
import { add, list, load, remove, save } from "./notes.js";

const file = "notes.json";
const [command, ...args] = process.argv.slice(2);
const notes = load(file);

switch (command) {
  case "add":
    save(file, add(notes, args.join(" ")));
    break;
  case "list":
    console.log(list(notes).join("\n"));
    break;
  case "delete":
    save(file, remove(notes, Number(args[0])));
    break;
  default:
    console.error("usage: notes add <text> | list | delete <id>");
    process.exitCode = 1;
}
