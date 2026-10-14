#!/usr/bin/env python3
"""Enforce this repository's commit-message policy.

Every commit must have a concise imperative subject and a body carrying a
non-empty ``what:`` field followed by a non-empty ``why:`` field:

    <imperative subject>

    what: Describe the files, behavior, or documentation changed.
    why: Explain the user need, evidence, or design reason for the change.

Usage:
    python3 scripts/check_commit_messages.py [REF ...]
    python3 scripts/check_commit_messages.py --message-file <path>

REF defaults to HEAD. Pass a range or refs to review a batch, for example
``HEAD~3..HEAD``. ``--message-file <path>`` checks a single pending commit
message (as supplied to a ``commit-msg`` hook) instead of a commit. Standard
library only; no third-party dependencies.

Exit codes (tri-state, matching the repository's other local checks):
    0  clean          every checked commit satisfies the policy
    1  findings       at least one commit violates the policy
    2  could-not-run  git failed or a ref was unresolvable (no traceback)
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

# 100, not git's conventional 72: this repo's prescribed subjects reach 82 chars.
SUBJECT_LIMIT = 100


def _git(*args: str) -> str:
    """Run a git command and return its stdout, raising on failure."""
    result = subprocess.run(
        ["git", *args],
        check=True,
        text=True,
        capture_output=True,
    )
    return result.stdout


def commits(ref: str) -> list[str]:
    """Full commit hashes reachable from `ref` (a ref, range, or revision)."""
    return [line for line in _git("log", "--format=%H", ref).splitlines() if line]


def commit_body(commit: str) -> str:
    """The raw, unmodified body of one commit, without its diff."""
    return _git("show", "--quiet", "--format=%B", commit).strip()


def check_message_text(body: str, label: str) -> list[str]:
    """Return the policy violations for one commit message (empty when it passes)."""
    lines = body.splitlines()
    subject = lines[0].strip() if lines else ""
    errors: list[str] = []

    if not subject:
        errors.append(f"{label}: empty subject")
    elif len(subject) > SUBJECT_LIMIT:
        errors.append(f"{label}: subject exceeds {SUBJECT_LIMIT} characters")
    elif subject.endswith("."):
        errors.append(f"{label}: subject must not end with a period")

    lower = body.lower()
    positions: dict[str, int] = {}
    for field in ("what:", "why:"):
        index = lower.find(field)
        if index == -1:
            errors.append(f"{label}: missing {field} field")
            continue
        positions[field] = index
        value = next(
            (line.split(":", 1)[1].strip() for line in lines if line.lower().startswith(field)),
            "",
        )
        if not value:
            errors.append(f"{label}: empty {field} field")

    if "what:" in positions and "why:" in positions and positions["what:"] > positions["why:"]:
        errors.append(f"{label}: `what:` must appear before `why:`")

    return errors


def check_commit(commit: str) -> list[str]:
    """Return the policy violations for one commit (empty when it passes)."""
    body = commit_body(commit).replace("\\n", "\n")
    return check_message_text(body, commit[:12])


def message_file_body(path: str) -> str:
    """Read a pending commit-message file, dropping comment lines git ignores."""
    text = Path(path).read_text(encoding="utf-8")
    kept = [line for line in text.splitlines() if not line.lstrip().startswith("#")]
    return "\n".join(kept).strip()


def main() -> int:
    args = sys.argv[1:]
    if args[:1] == ["--message-file"]:
        if len(args) != 2:
            print(
                "check-commit-messages: could not run: --message-file needs a path",
                file=sys.stderr,
            )
            return 2
        try:
            body = message_file_body(args[1])
        except OSError as err:
            print(
                f"check-commit-messages: could not run: cannot read {args[1]!r}: {err}",
                file=sys.stderr,
            )
            return 2
        errors = check_message_text(body, "message")
        if errors:
            print("Commit message policy failed:", file=sys.stderr)
            print("\n".join(errors), file=sys.stderr)
            return 1
        print("Commit message policy passed for 1 commit(s).")
        return 0

    refs = sys.argv[1:] or ["HEAD"]
    # A bare HEAD is the common, cheap case: inspect the current tip directly.
    hashes: list[str] = ["HEAD"] if refs == ["HEAD"] else []
    resolved_ref = "HEAD"
    try:
        for resolved_ref in refs:
            if resolved_ref != "HEAD" or refs != ["HEAD"]:
                hashes.extend(commits(resolved_ref))
    except (subprocess.CalledProcessError, FileNotFoundError) as err:
        print(
            f"check-commit-messages: could not run: git failed for {resolved_ref!r}: {err}",
            file=sys.stderr,
        )
        return 2

    errors: list[str] = []
    seen: set[str] = set()
    try:
        for commit in hashes:
            if commit in seen:
                continue
            seen.add(commit)
            errors.extend(check_commit(commit))
    except (subprocess.CalledProcessError, FileNotFoundError) as err:
        print(f"check-commit-messages: could not run: git failed: {err}", file=sys.stderr)
        return 2

    if errors:
        print("Commit message policy failed:", file=sys.stderr)
        print("\n".join(errors), file=sys.stderr)
        return 1
    print(f"Commit message policy passed for {len(seen)} commit(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
