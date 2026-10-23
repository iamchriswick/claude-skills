# Tags for notes

## Goal

Let users group notes with tags and list the notes that have a tag.

## Commands

- `notes add <text> --tag <tag>`: adds a note with one or more tags (`--tag` can repeat).
- `notes list --tag <tag>`: lists only the notes with that tag.
- `notes tags`: lists every tag with its number of notes.

## Storage

Tags are stored in a new `tags` table in the SQLite database `notes.db`, next to the `notes` table.

## Limits

- Tags are lowercase letters, digits and hyphens.
- TODO: decide the maximum number of tags per note.

## Optional

- Tag colours in `notes list` output, if the terminal supports colour.
