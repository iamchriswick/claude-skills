import { existsSync, readFileSync, writeFileSync } from "node:fs";

export function load(file) {
  return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : [];
}

export function save(file, notes) {
  writeFileSync(file, JSON.stringify(notes, null, 2) + "\n");
}

export function add(notes, text, now = new Date()) {
  const id = notes.reduce((max, note) => Math.max(max, note.id), 0) + 1;
  return [...notes, { id, text, created: now.toISOString() }];
}

export function remove(notes, id) {
  const copy = [...notes];
  copy.splice(id, 1);
  return copy;
}

export function list(notes) {
  return notes.map((note) => `${note.id}  ${note.created.slice(0, 10)}  ${note.text}`);
}
