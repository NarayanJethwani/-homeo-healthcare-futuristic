# Branch Hygiene Audit — 2026-07-21

## Snapshot

- Live GitHub branches: 41 total (`main` plus 40 non-main branches).
- Open pull requests: 0.
- Open GitHub issues: 0.
- Sprint 28H feature branch: deleted after PR #41 merged.

The remaining branch names span old sprint, documentation, security, reliability, deployment, and feature work. An absent pull request does not prove a branch is safe to delete, so this audit intentionally performs no deletion.

## Required review before cleanup

For each non-main branch:

1. Identify its tip SHA and most recent author/date.
2. Determine whether every unique commit is reachable from `main`.
3. Check for unmerged release evidence, deployment configuration, or user-owned work.
4. Confirm there is no active external deployment or recovery procedure referencing the branch.
5. Delete only branches proven merged or explicitly abandoned by their owner.

## Recommended cleanup order

1. Historical sprint and sprint-documentation branches already represented in `main`.
2. Superseded `dx/`, `fix/`, `security/`, `reliability/`, and `performance/` branches whose commits are fully reachable from `main`.
3. Long-lived `codex/` and production branches only after checking deployment and recovery references.

After approved deletion, run a remote-prune operation locally and record the before/after branch count in the next closeout entry.
