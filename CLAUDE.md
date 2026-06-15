# CLAUDE.md — DHARMA Swan Station ARG Project

## Project Overview

This is a single-file HTML/CSS/JS website that replicates the look of the Swan Station computer from the TV show *LOST*. It functions as a deprecated DHARMA Initiative intranet terminal used by station staff, and contains a layered ARG (Alternate Reality Game) with hidden puzzles, lore, and a secret clearance system.

The current deliverable is **`swan-station.html`** — one self-contained file with no build step, no dependencies except a Google Fonts CDN call, and no framework.

See `docs/` for detailed reference documents.

-----

## Project Structure (current)

```
swan-station.html       ← The entire site. Single file, no build needed.
CLAUDE.md               ← This file
docs/
  ARG-PUZZLE-MAP.md     ← All hidden features, triggers, and puzzle state
  LORE-BIBLE.md         ← DHARMA universe canon used in the site
  DESIGN-SYSTEM.md      ← Colors, typography, layout conventions
  TERMINAL-COMMANDS.md  ← Full terminal command/file reference
  KNOWN-ISSUES.md       ← Bugs fixed and things to watch out for
```

-----

## Core Constraints — Read Before Touching Anything

1. **Single file only.** All HTML, CSS, and JS live in `swan-station.html`. Do not split into separate files unless the user explicitly asks to restructure into a proper project.
1. **No framework, no build step.** Vanilla HTML/CSS/JS. The only external resource is `https://fonts.googleapis.com/css2?family=VT323&display=swap`.
1. **No numbers revealed on screen.** The sequence `4 8 15 16 23 42` must never appear as plaintext anywhere visible in the UI. It is discoverable only through the ARG (terminal commands, clearance 5 files, morse decode, etc.). The input fields accept any numbers — correctness is validated in JS against `THE_NUMBERS = [4, 8, 15, 16, 23, 42]`.
1. **Aesthetic rules are strict.** See `docs/DESIGN-SYSTEM.md`. The CRT/phosphor-green look must be preserved. No white backgrounds, no sans-serif fonts outside the VT323 family, no bright colours except the defined palette.
1. **The `#mainContent` div is hidden at load time.** It becomes visible only after the splash screen is dismissed. All DOM queries for elements inside `#mainContent` must be deferred — run inside `dismissSplash()` or later (e.g. `bindInputs()` pattern). This was the source of a real bug.
1. **Template literals in object methods:** Arrow functions that use block bodies (`() => { return \`…`; }`) must NOT have a trailing comma after the return value's closing backtick. Arrow functions that directly return a template literal (`() => `…``) can have a trailing comma after the backtick. Mixing these up caused the original script error.
1. **`onKonami` and any function called from an event listener must be declared BEFORE the `addEventListener` call.** Hoisting works for `function` declarations but not for `const`/`let` arrow functions. Stick to `function` declarations for anything called from event listeners.

-----

## What Has Been Built

### Splash Screen

- Swan Station SVG logo (from `Logo.tsx` provided by user — see `docs/DESIGN-SYSTEM.md` for SVG spec)
- Animated boot log sequence (6 lines, timed with `setTimeout`)
- Click or keypress to dismiss
- Fade-out transition into main content

### Countdown Timer (top-right, fixed position)

- 108-minute countdown (6480 seconds), resets on correct sequence entry
- Show-accurate dark bezel with individual digit cells
- Three colour states:
  - **Normal:** `#b8ff00` yellow-green digits
  - **Warning** (≤5 min): `#ff8c00` amber
  - **Critical** (≤1 min): `#ff1a00` red, digits flash
- Timer is hidden during splash, shown after dismiss

### Hieroglyph Failure Screen

- Triggered when timer reaches zero without correct input
- Full-screen black overlay with red-tinted scrolling Egyptian hieroglyphs (𓆣 𓂀 𓇳 𓅓 𓆙)
- Two-column drum that animates with `steps(1)` keyframes
- “EMERGENCY RESET” button restarts timer and dismisses overlay
- Brief red screen-flash sequence before overlay appears

### Number Input Panel

- Six individual `<input type="number">` fields (IDs: `n1`–`n6`)
- Auto-advances focus on 2-digit entry; backspace returns to previous field
- Enter key submits
- Green border flash on correct field; red on incorrect
- Row shakes on wrong submission
- Special log messages for specific wrong sequences (all-zeros, inverted sequence)

### Terminal Modal

- Triggered by “OPEN TERMINAL ▶” button or `openTerminal()` call
- Prompt displays as `>: ` (show-accurate)
- Arrow-up/down for command history
- Escape to close
- All lore and ARG content is accessible through terminal commands
- See `docs/TERMINAL-COMMANDS.md` for full reference

### Activity Log Panel

- Timestamped entries, auto-scrolls
- Four log levels: normal (dim green), hi (bright green), am (amber), er (red)
- Inactivity monitor: warns at 2 min idle, alerts at 5 min idle

### ARG Puzzle Layer

- See `docs/ARG-PUZZLE-MAP.md` for complete map of all hidden features

-----

## Key JavaScript Architecture

```
Global state variables:
  secsLeft      — countdown in seconds (starts at 6480)
  timerRunning  — bool, controls interval
  timerTick     — setInterval handle
  execCount     — how many correct sequences entered this session
  konamiIdx     — progress through Konami sequence
  morseClicks   — click count on morse strip
  cipherClicks  — click count on cipher bar
  eyeHit        — bool, whether hidden eye has been clicked
  termReady     — bool, whether terminal has been initialised
  logoClicks    — click count on Swan logo
  window.cl5    — bool, Clearance Level 5 unlocked (set by Konami)

Key functions:
  runBoot()         — starts splash boot sequence
  dismissSplash()   — transitions from splash to main content
  startTimer()      — begins the 108-min countdown interval
  renderTimer()     — updates digit elements and bezel colour state
  triggerFailure()  — shows hieroglyph screen when timer expires
  resetFailure()    — resets after hieroglyph screen
  execNums()        — validates number input and calls onSuccess/onWrong
  onSuccess(vals)   — handles correct sequence: resets timer, updates UI
  onWrong(vals, n)  — handles wrong sequence: shake, highlight fields
  bindInputs()      — attaches input event listeners (called post-splash)
  addLog(msg, cls)  — appends timestamped entry to activity log
  openTerminal()    — shows terminal modal
  termKey(e)        — handles terminal keyboard input
  termPrint(html)   — appends HTML to terminal output
  showBanner(msg)   — shows the ARG secret banner (amber strip, 7s)
  onKonami()        — Konami code handler, grants window.cl5
  morseClick()      — click counter on morse strip
  cipherClick()     — click counter on cipher bar
  eyeClick()        — hidden eye click handler

Data objects:
  THE_NUMBERS = [4, 8, 15, 16, 23, 42]
  BOOT_LINES  — splash boot log lines with timing
  FILES       — object keyed by uppercase file path, returns HTML strings
  CMDS        — documented terminal commands
  SECRETS     — undocumented terminal commands (not in HELP output)
```

-----

## Suggested Next Steps / Potential Enhancements

These were not requested but are natural extensions:

- **Blast door map:** A hidden SVG blast door accessible via terminal command `BLAST DOOR` or a physical click area somewhere on the page
- **Pneumatic tube dispatch:** A mini-UI to “send a message” that logs as sent with no response
- **Pearl station feed:** A fake CCTV feed (canvas animation) accessible via terminal
- **Save state:** Use `localStorage` to persist `execCount`, unlock state, and decoded puzzles across sessions
- **Sound design:** Subtle CRT hum ambient audio, beep on keypress, alarm klaxon during critical phase
- **Mobile improvements:** The timer widget overlaps header on very small screens; could be moved inline
- **Additional ARG depth:** A `/files/blast-door-map.txt` accessible at Clearance 5, more Kelvin/Radzinsky journal entries
- **Refactor to multi-file:** If the project grows, split into `index.html`, `style.css`, `main.js`, `terminal.js`, `arg.js`

-----

## Gotchas Encountered (Do Not Repeat)

1. **`getElementById` on hidden content at parse time** — always defer to `bindInputs()` or a post-splash callback
1. **Trailing comma after `return \`template``in block-body arrow function** —`return `string`,` is a comma expression; drop the comma
1. **Function declarations before their event listener callers** — `onKonami` must be declared before the `keydown` listener
1. **Box-drawing characters (═, ━) in template literals** — fine in the browser, but caused issues with `vm.Script` during debugging; replaced BOOT_MSG with string concatenation using `\u2014` escapes
1. **Nested `<span>` tags in innerHTML template literals** — unclosed or mismatched spans in `termPrint()` content will silently corrupt the terminal output DOM