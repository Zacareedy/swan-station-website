# ARG Puzzle Map

Complete reference for all hidden features, triggers, unlock conditions, and puzzle state in `swan-station.html`.

-----

## Puzzle Overview

|Puzzle                |Trigger                          |Clicks/Steps |Reward                             |
|----------------------|---------------------------------|-------------|-----------------------------------|
|Morse decode          |Click morse strip                |5 clicks     |Banner + log message               |
|Cipher decode         |Click cipher bar                 |3 clicks     |Decoded ROT13 message              |
|Hidden eye            |Click bottom-right eye           |1 click      |Banner + terminal hint             |
|Konami code           |↑↑↓↓←→←→BA keyboard              |Full sequence|Clearance 5 + terminal auto-opens  |
|Logo 7-click          |Click Swan logo in header        |7 times      |Banner pointing to eye             |
|Cycle tag             |Click “CYCLE: 10894” in header   |1 click      |Amber log entry about prev operator|
|Inactivity warn       |Do nothing                       |120s idle    |Presence check log entry           |
|Inactivity alert      |Do nothing                       |300s idle    |Red alert log entry                |
|Wrong sequence special|Enter `42 · x · x · x · x · 4`   |—            |Anomaly log entry                  |
|Wrong sequence null   |Enter `0 · 0 · 0 · 0 · 0 · 0`    |—            |Red log entry                      |
|Execute ×3            |Enter correct sequence 3 times   |—            |“THE CANDIDATE” banner             |
|Execute ×108          |Enter correct sequence 108 times |—            |“UNWAVERING DUTY” banner           |
|Timer failure         |Let timer reach 0:00             |—            |Hieroglyph screen                  |
|Page source           |Open browser dev tools > Elements|—            |Hidden HTML comments               |
|Browser console       |Open dev tools > Console         |—            |Styled ARG messages                |
|Title flicker         |Wait ~10 seconds                 |—            |Tab title briefly changes          |

-----

## Puzzle 1: Morse Strip

**Element:** `.morse` / `#morseBar` — the narrow strip below the ticker bar

**Content:** Morse code that encodes “THE NUMBERS ARE REAL”

**Trigger:** Click the strip. Counter increments each click.

**At 5 clicks:**

- Strip text changes to: `// DECODED: "THE NUMBERS ARE REAL" — V. KELVIN — CYCLE 9341 //`
- Strip colour changes to amber (`var(--am)`)
- Activity log: `MORSE DECODED: "THE NUMBERS ARE REAL". You are paying attention.`
- Banner: `// MORSE DECODED — "THE NUMBERS ARE REAL" — V.K. — Check the terminal. //`

**Variable:** `morseClicks` (global let)

-----

## Puzzle 2: Cipher Bar

**Element:** `.cipher` / `#cipherBar` — the narrow strip below the morse strip

**Content:** `[ROT13]: RKRPHGR GUR CEBGBPBY · ZNVAGNVA FVYRAPR · QB ABG YRNIR GUR FGNGVBA · -V.C.`

**Decoded:** `EXECUTE THE PROTOCOL · MAINTAIN SILENCE · DO NOT LEAVE THE STATION · -I.P.`
(I.P. = Inman/Patchy — ambiguous, intentional)

**Trigger:** Click the bar. Counter increments each click.

**At 3 clicks:**

- Bar text changes to the decoded message
- Bar colour changes to amber
- Activity log: `CIPHER DECODED: Message from I.P. — "Maintain silence."`

**Variable:** `cipherClicks` (global let)

-----

## Puzzle 3: Hidden Eye

**Element:** `#eye` — fixed position, bottom-right, `opacity: 0.22`, very small font
**ASCII art:**

```
 /|\
(0-0)
 \_/
```

**Trigger:** Click it once. Very difficult to spot intentionally — hover changes opacity to 0.9 and colour to amber.

**On click (first time only):**

- Eye colour → amber, opacity → 0.9 (stays revealed)
- Activity log: `// You found the Eye. The island is always watching. //`
- Banner: `// THE EYE HAS SEEN YOU — Type DHARMA in the terminal. //`

**Variable:** `eyeHit` (global bool, prevents re-triggering)

-----

## Puzzle 4: Konami Code

**Sequence:** `↑ ↑ ↓ ↓ ← → ← → B A` (keyboard keys)

**Trigger:** Enter the full sequence via keyboard.

**Effect:**

- Sets `window.cl5 = true` — unlocks Clearance Level 5 files in terminal
- Activity log: `!!! KONAMI SEQUENCE — CLEARANCE LEVEL 5 GRANTED !!!` (hi/green)
- Banner: `// ↑↑↓↓←→←→BA — CLEARANCE 5 GRANTED — READ /FILES/VK-108.TXT IN TERMINAL //`
- Terminal auto-opens with a message printed inside it
- Unlocks: `READ /FILES/VK-108.TXT` and `READ /FILES/COORDINATES.TXT`

**Variable:** `konamiIdx` (global let, resets to 0 on wrong key)

-----

## Puzzle 5: Clearance 5 Files (Terminal)

Only accessible after Konami code. Both respond with `ACCESS DENIED` before then.

### `/FILES/VK-108.TXT`

- Full Valenzetti Equation lore
- Reveals that the numbers are the equation’s six factors
- States the sum is 108 (the window length)
- Signed: “V. Kelvin, Cycle 9341”

### `/FILES/COORDINATES.TXT`

- Island coordinates: `4°48'N 108°42'W`
- Note: coordinates reference the numbers (4, 8, 15, 16, 23, 42 embedded)
- Warns coordinates are not to be shared

-----

## Puzzle 6: Logo Multi-Click

**Element:** `.swan-logo-sm` in `.hdr-c` — the small Swan SVG in the header centre

**Normal behaviour:** Opens Station Manifest modal (on every click)

**At 7 clicks:**

- Activity log: `NOTICE: Multiple manifest accesses. Operator flagged.`
- Banner: `// Have you checked the bottom-right corner? Something is watching. //`
  (Points player toward the hidden eye)

**Variable:** `logoClicks` (global let)

-----

## Puzzle 7: Cycle Tag Click

**Element:** `#cycleTag` — the “CYCLE: 10894” text in the header right

**On click:**

- Activity log: `CYCLE 10894: If you read this, the previous operator did not complete their rotation.`

-----

## Puzzle 8: Inactivity Monitor

Fires via `setInterval` every 5 seconds, checks `(Date.now() - lastAct) / 1000`.

- **At 120–125 seconds idle:** `PRESENCE CHECK: Are you still there? Window closes in X min.`
- **At 300–305 seconds idle:** `!! OPERATOR ABSENCE — ATTEND TO INPUT TERMINAL IMMEDIATELY !!`

Activity resets on: `mousemove`, `keydown`, `click`

-----

## Puzzle 9: Wrong Sequence Easter Eggs

Two special cases checked in `onWrong()`:

- **All zeros (`0,0,0,0,0,0`):** `NULL SEQUENCE ENTRY: Do not enter zeros. This is not a test.`
- **Inverted first/last (`42,x,x,x,x,4`):** `ANOMALY: Inverted sequence detected. Cross-reference Incident 10801.`

-----

## Puzzle 10: Execution Milestones

Tracked in `execCount` (increments on each correct sequence):

- **3 executions:** Banner: `// ACHIEVEMENT UNLOCKED: THE CANDIDATE — 3 SEQUENCES EXECUTED //`
- **108 executions:** Banner: `// DHARMA COMMENDATION: UNWAVERING DUTY — 108 SEQUENCES COMPLETE //`

-----

## Puzzle 11: Timer Failure / Hieroglyphs

**Trigger:** `secsLeft` reaches 0 without a correct sequence being entered.

**Sequence:**

1. Activity log: `!! CONTAINMENT FAILURE — SEQUENCE NOT EXECUTED — EM DISCHARGE DETECTED !!`
1. Screen flashes red/dark alternating (7 cycles × 180ms)
1. `#hieroScreen` overlay becomes active (class `active` → `display: flex`)
1. Two-column hieroglyph drum scrolls continuously
1. Message: `!! EM CONTAINMENT FAILURE !!`
1. Subtext: `INPUT SEQUENCE WAS NOT EXECUTED IN TIME`
1. Button: `[ EMERGENCY RESET — PROTOCOL 23B ]` → calls `resetFailure()`

**Hieroglyphs used:** 𓆣 (scarab) 𓂀 (eye of Horus) 𓇳 (sun disk) 𓅓 (owl) 𓆙 (snake)
Font stack: `'Segoe UI Historic', 'Noto Sans Egyptian Hieroglyphs', 'Apple Symbols', serif`

-----

## Puzzle 12: Page Source Hidden Comments

```html
<!-- DHARMA INITIATIVE — INTRANET NODE SWN-7 — EYES ONLY -->
<!-- SWAN STATION — SUBLEVEL B — CLEARANCE LEVEL 4 -->
<!-- IF YOU ARE READING THIS PAGE SOURCE: YOU ARE PAYING ATTENTION. GOOD. -->
<!-- THE TERMINAL KNOWS MORE THAN THIS PAGE. -->
<!-- COORDINATES: RESTRICTED — CLEARANCE 5 REQUIRED -->
<!-- NEXT STEP: OPEN THE TERMINAL. TYPE HELP. -->
```

End-of-file comments:

```html
<!-- The island coordinates are in the terminal. You need Clearance 5. -->
<!-- Clearance 5 is closer than you think. The footer has always had a clue. -->
<!-- vk-108.txt: "The equation has 6 factors. The island is the 7th." -->
<!-- NEXT STEP: ↑↑↓↓←→←→ -->
```

-----

## Puzzle 13: Browser Console ARG

Four styled `console.log` messages appear when DevTools is opened:

```
[green border box] DHARMA INITIATIVE — EYES ONLY
[green]  If you are reading this, you have found something you were not meant to find.
[dim green italic]  The protocol must be maintained. Whatever it takes.  — V.K., Cycle 9341
[very dim green]  Next step: Open the terminal. Type DHARMA. Look to the corners.
```

-----

## Puzzle 14: Title Bar Flicker

`document.title` cycles through an array every 10 seconds:

```javascript
const TITLES = [
  'DHARMA INITIATIVE :: SWAN STATION :: INTRANET NODE',  // ×4
  'DO NOT FORGET THE PROTOCOL',                          // 1 flicker
  'DHARMA INITIATIVE :: SWAN STATION :: INTRANET NODE',  // ×1
];
```

-----

## Puzzle 15: Footer Hint

The footer right side shows `[ ↑↑↓↓←→←→ ]` blinking — a direct hint to the Konami code, visible to observant players.

-----

## Puzzle 16: Broadcast Ticker Click

Clicking the broadcast ticker bar logs:
`BROADCAST: External communications remain blocked. No exceptions. §7-B.`

-----

## ARG Progression (Intended Discovery Path)

```
1. Read the page → notice morse strip, cipher bar, footer hint
2. Click morse 5× → decode "THE NUMBERS ARE REAL" → open terminal
3. Terminal: HELP → FILES → READ /protocol/protocol-23.txt
4. Learn the sequence exists but is not shown → explore lore
5. Terminal: DHARMA → VALENZETTI → hints about the equation
6. Notice footer: ↑↑↓↓←→←→ → try Konami → Clearance 5 granted
7. READ /files/vk-108.txt → full Valenzetti lore
8. READ /files/coordinates.txt → island coordinates
9. Notice hidden eye → click it → terminal hint
10. Terminal: secret commands (SMOKE, JACOB, RADZINSKY, etc.)
11. Deduce the correct sequence from lore clues → enter it → success
```

-----

## Secret Terminal Commands (Not in HELP)

Full list — see `docs/TERMINAL-COMMANDS.md` for output details.

`HELLO` · `WHY` · `OUTSIDE` · `QUARANTINE` · `FAILSAFE` · `SMOKE` · `JACOB` · `PENNY` · `HURLEY` · `RADZINSKY` · `SOS` · `PUSH THE BUTTON` · `MAMA` · `INMAN` · `BLAST DOOR` · `108` · `WATCH`
