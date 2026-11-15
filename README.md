# Tagwerk


![Tagwerk Screenshot](Tagwerk-Board.png)

Your personal Kanban board. Your data stays on your device. Period.

Tagwerk is a private, local-first Kanban board built entirely with HTML, JavaScript, and CSS — no server, no accounts, no cloud, no build step. Open the files, and it works. Your tasks never leave your machine, which is exactly why it's not built for teams. It's your board, for your work.
Why Tagwerk?

Most Kanban tools want your data. They sync it, analyze it, host it, and monetize it. Tagwerk takes the opposite stance: there is nothing to intercept and nothing to leak, because everything runs and is stored locally in your browser. Private by design, not by policy.

If you work alone — a developer, writer, researcher, planner — you don't need a collaboration platform. You need a fast, beautiful board that respects your privacy. That's Tagwerk.

## Features

 - Multiple boards — create, rename, and delete boards; organize by project or keep an archive board
 - Rich cards — title, Markdown-rendered description with live preview, due date (with weekday display), tags, and an "Affects" field
 - Priorities with color codes — every card carries a high / medium / low priority, rendered as a colored stripe along the card's edge: green for low, amber for medium, red for high. Scan a column and see instantly what deserves your attention first — and pick up exactly where you left off weeks later
 - Traceable per-card history — every card keeps its own change log: what was changed, when, and from what to what — title edits, priority changes, due date moves, tag updates, and column transitions ("Moved: Doing → Done"). The log lives in the card's detail view, newest first, capped at the last 30 entries
 - Multi-select — tick the checkboxes on several cards at once, then push the whole batch to another board with "Move to board" (e.g. your archive, or a dedicated project board). Fresh IDs on arrival prevent collisions; drag & drop keeps working even while filters hide cards
 - Visible connections — linked cards are joined by animated threads ("ropes") drawn across the board; hovering a card makes its ropes glow while the others fade
 - On Hold column — a deliberate parking lane for blocked work, alongside To Do, Doing, and Done
 - Powerful filtering & search — filter by tag, affects, priority, and due date (overdue, due today, next 7 days, no date); instant search over titles and descriptions with highlighted matches. Overdue cards get a red, due-today cards an orange highlight — the board warns you before you even read it
 - Bidirectional links — link cards to each other; both ends stay in sync automatically
 - Undo / redo — Ctrl+Z / Ctrl+Y (or Ctrl+Shift+Z), session-scoped per board
 - WIP limits — configurable per column, with visual warnings when exceeded
 - Statistics view — totals, overdue, due today, completion percentage, priority breakdown, and a bar chart of cards per column
 - Keyboard shortcuts everywhere — / to search, n for a new task, s for stats, ? for help, Ctrl+S to export
 - Deep links — share a URL fragment like index.html?detail-id=c42 to open a specific card directly
 - Drag & drop — smooth card dragging between and within columns, with a drop indicator; arrow buttons are a touch-friendly alternative
 - Light & dark theme — automatically follows your system preference

## Export & Import

 - Ctrl+S or the Export button backs up all boards at once as a single timestamped JSON file — consecutive exports never overwrite each other
 - Import accepts either a full bundle or a classic single-board export; imports always arrive as new boards, so nothing existing is ever overwritten, and one corrupt entry never sinks the rest of the backup
 - The per-card change history travels with every exported and moved card — your audit trail survives the trip
 - Deep-link into archived cards any time — hidden is not gone

## 8 Languages

German, English, French, Italian, Polish, Spanish, Dutch, and Czech — auto-detected from your browser, switchable at any time, persisted locally. Even the weekday abbreviations follow the active language.

## Privacy by Design

 - No server, no telemetry, no analytics — Tagwerk sends nothing anywhere
 - Local storage only — your boards live in your browser's localStorage, on your device
 - Validated imports — imported data is sanitized and schema-checked, not blindly trusted
 - Zero dependencies — four files, plain HTML/CSS/JS; you can read every line

## Getting Started

No installation. No sign-up. No build process.

 - Download or clone this repository
 - Open index.html in any modern browser
 - Create your first card

That's it. Your data is on your device and nowhere else.

### Tech Stack
Layer	Technology
Structure	Semantic HTML with <dialog> modals
Logic	Vanilla JavaScript (ES6+)
Styling	Hand-written CSS, custom properties, prefers-color-scheme
Storage	localStorage (per board, plus board metadata)
Dependencies	None

Works offline, from a local folder, or hosted on any static file server (e.g. GitHub Pages).
Not for Teams — and Proud of It

Tagwerk is deliberately single-user. No avatars, no mentions, no activity feeds, no notifications fighting for your attention. If you need to collaborate, use a team tool with your team. When it's just you and your work, Tagwerk gives you focus without giving away your data.

-> Ships with JetBrains Mono, © The JetBrains Mono Project Authors, SIL Open Font License 1.1 — see fonts/OFL.txt

Simple, local, and yours alone. Try Tagwerk today.