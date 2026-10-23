import assert from "node:assert/strict";
import { test } from "node:test";
import { add, list } from "../src/notes.js";

test("add gives each note the next id", () => {
  const notes = add(add([], "first"), "second");
  assert.deepEqual(notes.map((note) => note.id), [1, 2]);
});

test("list shows id, date and text", () => {
  const notes = add([], "hello", new Date("2026-01-02T10:00:00Z"));
  assert.deepEqual(list(notes), ["1  2026-01-02  hello"]);
});
