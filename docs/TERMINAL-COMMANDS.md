# Terminal Commands Reference

Complete reference for all commands in the `swan-station.html` terminal.

The terminal prompt displays as `>: ` (show-accurate format).
All input is converted to uppercase before matching.
Command history: arrow-up/down. Escape closes terminal.

-----

## Documented Commands (appear in HELP output)

### `HELP`

Lists all documented commands. Does NOT list secret commands.

### `STATUS`

System overview:

- EM Containment, Failsafe Key, Intranet Node, Sonar Array, EM Anomaly, Protocol, External Comms, Quarantine

### `WHO`

Active personnel roster:

- WICKMUND, G. (Station Chief)
- CANDLE, M. (Technical Officer)
- [CLASSIFIED] × 2 Operators
- Relief ETA: 540 hours

### `FILES`

Lists accessible files with clearance annotations:

```
/protocol/protocol-23.txt
/logs/incident-4-23-1980.txt        [PARTIAL — REDACTED]
/logs/cycle-log-10894.txt
/dharma/orientation-reel-3.txt
/files/vk-108.txt                   [CLEARANCE 5]
/files/coordinates.txt              [CLEARANCE 5]
```

### `READ [path]`

Opens a file. Path matching is case-insensitive (converted to uppercase internally).

Valid paths:

|Path                            |Clearance|Content                                     |
|--------------------------------|---------|--------------------------------------------|
|`/protocol/protocol-23.txt`     |4        |Protocol 23 procedure (no sequence revealed)|
|`/logs/incident-4-23-1980.txt`  |4        |Partial incident report, heavily redacted   |
|`/logs/cycle-log-10894.txt`     |4        |Current cycle log                           |
|`/dharma/orientation-reel-3.txt`|4        |Transcript of Orientation Film 3            |
|`/files/vk-108.txt`             |**5**    |Full Valenzetti Equation lore               |
|`/files/coordinates.txt`        |**5**    |Island coordinates: `4°48'N 108°42'W`       |

Clearance 5 files return `ACCESS DENIED` until `window.cl5 = true` (set by Konami code).

### `PING`

Tests intranet node connectivity:

```
SWN-7  (self)       OK    [0ms]
SWN-HUB (backbone)  OK    [9ms]
PEARL-3 (obs)       TIMEOUT
FLAME-1 (comms)     NO ROUTE
STAFF-1 (medical)   NO ROUTE
ORCHID  (unknown)   REFUSED
WORLD   (external)  BLOCKED §7-B
```

### `INCIDENT`

Summary of recent incident log entries (Cycles 10881, 10876, 10849, 10801 [REDACTED], 10734, and 1980-04-23).

### `DHARMA`

Station directory — all 6 known DHARMA stations with descriptions. Station 6 (The Orchid) listed as `[EXISTENCE NOT CONFIRMED]`.

### `VALENZETTI`

Summary of the Valenzetti Equation with hints about the six values and the 108-minute window. Does NOT reveal the sequence. Points to `/files/vk-108.txt` for full content.

### `CLEAR`

Clears terminal output (`#termOut`). No return value.

### `EXIT`

Closes the terminal modal. No return value.

-----

## Undocumented Secret Commands

These are in the `SECRETS` object and do NOT appear in `HELP`. Players discover them by guessing lore-appropriate words.

### `HELLO`

> “Hello, Operator. Don’t forget the protocol.”

### `WHY`

> “That question is above your current clearance.”

### `OUTSIDE`

> “DO NOT GO OUTSIDE. The quarantine is active. This instruction is not precautionary.”

### `QUARANTINE`

> “The outside air was last independently tested in 1987. Protocol mandates internal operations only. We have learned there are additional reasons not to go outside. They are not documented here.”

### `FAILSAFE`

> “The failsafe key — Sub-level C, housing F-7. Turning it will trigger uncontrolled discharge. It is the absolute last resort. Do not remove it from the housing. If you are considering using it, you have already failed at everything else.”

### `SMOKE`

Sonar anomaly log showing three large organic entity detections at cycles 10201, 10445, 10778.

> “The anomaly has not breached the station while Protocol 23 is maintained. We do not know if this is causal.”

### `JACOB`

> “!! THAT NAME IS NOT TO BE USED ON THIS INTRANET !! Session has been flagged for security review.”

### `PENNY`

> ‘“Not Penny’s Boat.” Log origin: unknown. Cycle: post-10800. This phrase appears in two other redacted logs. Cross-reference: abandoned.’

### `HURLEY`

Cross-references lottery ticket with the station’s protocol sequence. Flags as “Candidate event.” Access: LEVEL 6 REQUIRED.

### `RADZINSKY`

> Personnel file: S. RADZINSKY — Operator A (former). Status: CLASSIFIED — ORDER V.K. Notes: Co-authored blast door map (Sublevel A).

### `SOS`

> “External comms are permanently blocked. §7-B. No exceptions. You are where you need to be. Execute the protocol.”

### `PUSH THE BUTTON`

> “Yes. That is exactly what you are here for.”

### `MAMA`

> “This is not a record player, Operator.”

### `INMAN`

> Personnel file: J. INMAN — Former operator. Departure circumstances: unclear. Last active cycle: ~10500-range. File: REDACTED — ORDER V.K.

### `BLAST DOOR`

> “The blast door map — Sublevel A. Compiled across many years by two operators. One annotation reads: ‘I AM HERE.’ We do not know who wrote it. We do not know if they still are.”

### `108`

> “108 minutes. We initially believed the interval was chosen for operational convenience. We no longer hold that belief.”

### `WATCH`

> “There are camera positions you have not been told about. The island is always watching. This terminal session is being recorded.”

-----

## File Content Details

### `/PROTOCOL/PROTOCOL-23.TXT`

Describes the input requirement every 108 minutes. The sequence is described as “Six values. Two digits each. Known to all authorised personnel.” — deliberately does NOT state the values. Failure stages listed. Authored by DeGroot & Hanso, 1977; last revised by Candle, Cycle 9100.

### `/LOGS/INCIDENT-4-23-1980.TXT`

April 23, 1980 at 14:23 local time — uncontrolled EM event in Sub-level C during maintenance. Casualties, equipment loss, and root cause all redacted per ORDER V.K. Result: Protocol 23 established.

### `/DHARMA/ORIENTATION-REEL-3.TXT`

Transcript of Marvin Candle’s orientation film. Ends with the famous line: *“Pushing this button is the most important thing you will ever do. It may be the only important thing you will ever do.”*

### `/LOGS/CYCLE-LOG-10894.TXT`

Current cycle log. Input status: PENDING. EM: 73% GAUSS (normal). Previous cycle (10893) input at T-02:14.

### `/FILES/VK-108.TXT` (Clearance 5)

Full Valenzetti Equation exposition. Key facts:

- Enzo Valenzetti, 1962
- Six core factors → the numbers
- Entering the sequence does NOT change the equation — only delays a discharge
- “You are not saving the world. You are keeping the clock running until someone figures out how to stop it.”
- Sum of six values = 108
- Signed: V. Kelvin, Cycle 9341

### `/FILES/COORDINATES.TXT` (Clearance 5)

```
POSITION:  4°48'N  108°42'W
MAGNETIC DECLINATION: 11.3° E (anomalous)
GRID REF: DHARMA INTERNAL MAP NODE 7
```

Note: `4°48'` encodes 4 and 8; `108°42'` encodes 108 (sum) and 42.

-----

## Terminal Implementation Notes

**Command lookup order in `termKey()`:**

1. Check `CMDS[cmd]` — documented commands
1. Check `SECRETS[cmd]` — undocumented commands
1. If cmd starts with `READ ` — extract path, uppercase it, look up in `FILES`
1. If nothing matches — print `COMMAND NOT FOUND`

**Path normalisation:**

```javascript
const path = cmd.replace('READ ', '').trim();
const norm = path.startsWith('/') ? path : '/' + path;
handler = FILES[norm] || FILES['/' + path.replace(/^\/+/,'')];
```

Players can type `READ /protocol/protocol-23.txt` or `READ PROTOCOL/PROTOCOL-23.TXT` — both work.

**Clearance 5 check:**

```javascript
if (!window.cl5) { return 'ACCESS DENIED...'; }
```

`window.cl5` is set to `true` by `onKonami()`.

**`termPrint(html)` vs `addLog(msg, cls)`:**

- `termPrint` — appends to `#termOut` in the terminal modal (innerHTML)
- `addLog` — appends to `#logOut` on the main page (DOM createElement)
