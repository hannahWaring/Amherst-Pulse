# AGENTS.md

Guidance for any AI coding agent working in this repository (tool-agnostic). Tool-specific files (e.g. `CLAUDE.md`) import this and add only what's specific to that tool.

## Project status

This is a CS320 course project. `frontend/` and `database/` are still empty (`.gitkeep` only). CI (`.github/workflows/ci.yml`) installs and builds the backend. Fill in commands below as each part of the stack is scaffolded.

Stack:
- **Backend:** Express 5 + TypeScript (Node.js, ESM) — scaffolded in `backend/`
- **Auth:** Supabase — usernames are mapped to undeliverable `<username>@<AUTH_EMAIL_DOMAIN>` emails; no email confirmation
- **Database:** PostgreSQL (Supabase-hosted). All data access uses the `supabase-js` query builder (`supabaseAdmin.from(...)`); no direct Postgres connection

### Backend commands (run in `backend/`)

- `cp .env.example .env` and fill in Supabase values
- `npm run dev` — dev server with reload (tsx watch)
- `npm run build` / `npm start` — compile to `dist/` and run
- `npm run typecheck` — type-check only
- `npm test` — Jest (@swc/jest, supertest): runs unit then integration tests. No lint setup yet.
  - `npm run test:unit` — `backend/tests/unit/`; no Docker or local Supabase needed
  - `npm run test:integration` — `backend/tests/integration/`; needs Docker running. Starts the local Supabase if needed and resets its database first (both skipped in CI, which starts its own)
- `npm run db:sync` — after a schema change in the hosted dashboard: pulls a new migration, resets the local database, and regenerates `src/lib/database.types.ts`

## AI use rules for this course (CS320)

These rules apply to all AI-assisted work in this repo:

- **No AI for designing code or architecture.** Design and architecture decisions must come from the user. Do not propose or make these decisions — implement what the user has already decided. Specifically:
  - **Do not fill gaps with "reasonable defaults."** If a request leaves a design choice open, stop and ask the user instead of choosing. Design choices include, but are not limited to: API endpoints/routes and their request/response shapes, status codes and error formats, database schemas and tables, validation rules (e.g. username/password requirements), auth/session flows and token handling, folder/module structure beyond what the user specified, and choice of libraries or services.
  - **"Boilerplate" means scaffolding only.** When asked for boilerplate or setup, produce only configuration, tooling, and wiring (project config, env loading, client/connection setup, server startup). Do not add feature logic, endpoints, middleware with behavioral policy, or example routes unless the user explicitly specified them.
  - **Implement only what was specified.** Add dependencies only when the user named them or they are strictly required to set up what the user named; ask before adding anything else.
  - **Surface every unavoidable choice.** If implementing something forces a decision the user did not make, list each such decision explicitly in your response so the user can confirm or change it. Do not bury choices in the code.
  - **Suggestions are not decisions.** You may point out that a decision is needed and explain trade-offs when asked, but do not implement an option until the user picks one.
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
