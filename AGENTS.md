# AGENTS.md

Guidance for any AI coding agent working in this repository (tool-agnostic). Tool-specific files (e.g. `CLAUDE.md`) import this and add only what's specific to that tool.

## Project status

This is a CS320 course project. As of now the repo is an empty scaffold: `backend/`, `frontend/`, and `database/` each contain only a `.gitkeep`, and `.github/workflows/ci.yml` is the unmodified GitHub Actions starter workflow (no real build/lint/test steps yet). There are no build, lint, or test commands to run yet — this section should be filled in with real commands as soon as each part of the stack is scaffolded.

Planned stack (not yet implemented):
- **Backend:** Express.js (Node.js)
- **Auth:** Supabase
- **Database:** PostgreSQL

## AI use rules for this course (CS320)

These rules apply to all AI-assisted work in this repo:

- **No AI for designing code or architecture.** Design and architecture decisions must come from the user. Do not propose or make these decisions — implement what the user has already decided.
- **No AI for writing tests.** Do not write test code, even if asked — flag it back to the user instead.
- **AI is allowed for:** writing non-test code, setting up infrastructure, and other dev-ops tasks.
- **Commits are done manually by the user.** Do not run `git commit` (or `git push`) on the user's behalf — stage/prepare changes if asked, but leave the actual commit to them.

## End-of-session report

End-of-session report files go in the `ai_logs/` directory at the project root.

Produce markdown in exactly this format:

```markdown
# Task Title

## Main takeaways

* (leave this section as a placeholder — the user fills it in manually, without AI assistance)

## Resource Usage

Tool and Model(s) Used:
Tokens Used & Dollar Equivalent (if using a free tier, specify how much of your allocation was used):

## Chat Log

(full chat history from the session)
```

Never auto-populate "Main takeaways" — that section is for the user to write themselves. Do fill in the Chat Log (full transcript) and make a best effort at Resource Usage, asking the user to confirm figures you can't determine directly.
