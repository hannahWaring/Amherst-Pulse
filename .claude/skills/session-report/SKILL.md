---
name: session-report
description: Generate the CS320 end-of-session AI log in ai_logs/. Prompts the user to write their own "Main takeaways" section, then auto-fills resource usage and the full chat log.
---

# End-of-session report

Use this when the user asks to generate the end-of-session report / AI log for this project (see `AGENTS.md`).

## Required format

```markdown
# Task Title

## Main takeaways

* ...

## Resource Usage

Tool and Model(s) Used:
Tokens Used & Dollar Equivalent (if using a free tier, specify how much of your allocation was used):

## Chat Log

(full chat history from the session)
```

## Workflow

1. Ask the user for the **Task Title**, if not already obvious from the session.
2. Ask the user to write the **Main takeaways** themselves — do not draft, suggest, or paraphrase this content on their behalf. Prompt directly, e.g.: "What are your main takeaways from this session? Write them yourself — I won't draft them." Paste back exactly what they give you, verbatim.
3. Fill in **Resource Usage**:
   - Tool and Model(s) Used: Claude Code + the current model.
   - Tokens Used & Dollar Equivalent: use real figures if available in-session; if exact numbers aren't accessible to you, say so plainly and ask the user to fill in the real numbers rather than guessing or fabricating a figure.
4. Fill in **Chat Log** with the full, verbatim transcript of the session (not a summary).
5. Save the file to `ai_logs/<YYYY-MM-DD>-<slugified-task-title>.md` at the project root (create `ai_logs/` if missing).
6. Tell the user the file path. Do not stage or commit it — commits are manual in this project.

## Rules

- Never write the "Main takeaways" section yourself, even partially — it must be the user's own words.
- Never run `git add` / `git commit` on the generated file unless explicitly asked.
- If resource-usage numbers are unknown, say so rather than inventing a number.
