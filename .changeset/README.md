# Changesets

This folder is configured by [Changesets](https://github.com/changesets/changesets) — the release tool for `@saasflare/ui`.

## How releases work

1. **Make a change** to `packages/ui` (or its consumers).
2. **Add a changeset** before opening your PR:
   ```bash
   pnpm changeset
   ```
   Pick `@saasflare/ui`, choose `patch` / `minor` / `major`, and write a one-line summary. This creates a markdown file in `.changeset/`.
3. **Open the PR.** Reviewers can see the planned version bump and the changelog entry.
4. **Merge to `main`.** The `release` workflow opens (or updates) a "Version Packages" PR that:
   - bumps `packages/ui/package.json` version
   - regenerates `CHANGELOG.md`
   - deletes the consumed changeset files
5. **Merge the "Version Packages" PR.** The same workflow detects the version bump and runs:
   ```bash
   pnpm -F @saasflare/ui build
   pnpm publish -r --access public --provenance --no-git-checks
   ```
   `@saasflare/ui` is now on the public npm registry with provenance attestation.

## Apps are ignored

`apps/ui` and `apps/demo` are listed in `ignore` — they are not published. Only `@saasflare/ui` is releasable.

## Useful commands

| Command                          | What it does                                  |
| -------------------------------- | --------------------------------------------- |
| `pnpm changeset`                 | Add a new changeset (interactive)             |
| `pnpm changeset status`          | Show pending changesets and the next version  |
| `pnpm changeset version`         | Apply changesets locally (run by CI normally) |
| `pnpm changeset publish`         | Publish to npm (run by CI normally)           |
| `pnpm changeset pre enter next`  | Enter prerelease mode (e.g. `1.2.0-next.0`)   |
| `pnpm changeset pre exit`        | Leave prerelease mode                         |

See <https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md> for the full reference.
