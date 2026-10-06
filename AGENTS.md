# Madaar Implementation Instructions

## Primary source of truth

Before modifying this project, read this file completely:

`references/Madaar-project-specification.txt`

It is the main product specification dated 5 October 2026.

The specification takes priority over:
- older comments in the code,
- old prototype behavior,
- old UI logic,
- assumptions made by the coding agent.

If the specification itself distinguishes between an approved rule and a proposed implementation decision, preserve that distinction.

Do not silently convert a proposal into a permanent product rule.

---

## Existing website

This is an existing Madaar website implementation.

The CURRENT visual design is important.

Before changing code:

1. Inspect all HTML, CSS, JavaScript and assets.
2. Identify the actual page flow.
3. Run the website locally.
4. Record reproducible functional errors.
5. Understand the existing game-engine and shared runtime code.

Do NOT rebuild the website using another framework merely because it is easier.

Do NOT replace the existing design with a new template.

Preserve:
- colors,
- visual identity,
- page structure,
- cards,
- board appearance,
- Falk character,
- existing animations,
- button style,
- spacing,
- Arabic RTL behavior.

New screens must reuse the existing design language.

---
## UI reference screens

The approved visual reference screens are stored in:

`screens/`

These HTML files are VISUAL REFERENCES.

Use them to understand:
- layout,
- spacing,
- typography,
- component appearance,
- buttons,
- cards,
- dialogs,
- screen hierarchy.

Do not modify files inside `screens/` unless explicitly requested.

The actual application files outside `screens/` are the implementation to be edited.

When the current application differs visually from the approved reference, prefer the appearance in `screens/` unless it conflicts with the main product specification.

## Architecture rule

Keep these responsibilities separate:

- UI/pages
- game rules
- AI service
- online multiplayer service
- authentication/database service

Do not place external AI/API calls directly inside many HTML pages.

Use shared service modules.

The AI must never freely decide:
- player scores,
- board movement,
- current turn,
- winner,
- room state,
- special-cell rewards.

Those belong to deterministic game rules.

---

## Current phase

First make the existing website fully playable using MOCK services.

Then prepare replaceable adapters for:

- AI
- online rooms
- authentication
- database

The website must continue to run without external keys in mock mode.

Never expose server secrets or AI secret keys in browser JavaScript.

## Integration references

External-service integration information is organized under:

`integration/`

Subfolders:

- `integration/ai/`
  Contains AI API/service contracts and integration notes.

- `integration/firebase/`
  Contains Firebase project configuration guidance, authentication/database setup, schema, and security-rule notes.

- `integration/firebase/firebase-web-config.md`
  Contains the Firebase Web App configuration already created for this project.
  
- `integration/online/`
  Contains online multiplayer room flow and realtime synchronization requirements.

Before implementing an external integration, inspect the relevant integration folder.

Do not place real secret keys in repository files.

For behavior and game rules, the main product specification still has priority over integration notes.

For visual changes, use `screens/` as the UI reference and `images/` for project assets.
---
## Token-efficient agent behavior

After the first full audit, do not re-read the entire repository or all reference files for every small task.

For each implementation task:
1. Read `AGENTS.md`.
2. Read only the specification sections and integration files relevant to that task.
3. Inspect only the affected HTML/CSS/JS files and shared modules.
4. Reuse prior findings from this session when still valid.
5. Avoid repeating large summaries unless explicitly requested.

Prefer small, testable implementation phases over one massive rewrite.

## Working method

Before implementation, report:

1. the existing project structure,
2. the current user flow,
3. what is already working,
4. what is broken,
5. conflicts with the specification,
6. which files you plan to modify.

Do not modify files during this first audit.

After the audit, wait for approval before implementing major changes.
