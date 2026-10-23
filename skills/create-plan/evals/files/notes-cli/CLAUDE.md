# notes-cli

A command-line tool for short notes, stored in `notes.json` in the current directory.

## Git

- **Base branch:** `main`.
- **Branch names:** `<type>/<desc>`, where `<type>` is `feat`, `fix` or `chore`.
- **Commits:** Conventional Commits, `type(scope): summary`.
- **Reaching `main`:** only through a pull request. Push the branch, open the PR with `gh pr create --base main`, then stop. The user merges it.

## Commands

- Install: `npm install`
- Tests: `npm test`
