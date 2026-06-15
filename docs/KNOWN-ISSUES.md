# Known Issues & Bug History

A record of bugs encountered during development and how they were resolved. Read this before debugging JS issues.

-----

## Fixed Bugs

### BUG-01: `getElementById` on hidden content at page load

**Symptom:** `Uncaught TypeError: Cannot read properties of null (reading 'addEventListener')`
**Root cause:** The input binding code ran immediately at script parse time, but `#n1`–`#n6` live inside `#mainContent` which has `display: none` at load. `getElementById` returned `null`.
**Fix:** Wrapped all input listener attachment in a `bindInputs()` function. This function is called inside `dismissSplash()`, after `#mainContent` becomes visible.
**Pattern to follow:** Any code that queries elements inside `#mainContent` must be deferred to `dismissSplash()` or a function called from it.

-----

### BUG-02: `Uncaught SyntaxError: Unexpected token '}'`

**Symptom:** Script error on page load, nothing renders.
**Root cause:** In the `FILES` object, two entries used block-body arrow functions with `return`:

```javascript
'/FILES/VK-108.TXT': () => {
  return `...long string...`,  // ← WRONG: trailing comma after backtick
},
```

The ``` closes the template literal, then `,` creates a comma expression, then `}` is unexpected.
**Fix:** Remove the trailing comma — it should be `return \`…`;` (semicolon, not comma).

```javascript
'/FILES/VK-108.TXT': () => {
  return `...long string...`;  // ← CORRECT
},
```

**Note:** Arrow functions that directly return (no block body) are fine with a trailing comma: `() => `string`,` — the comma is the object property separator, not inside the function.

-----

### BUG-03: `onKonami` called before declaration

**Symptom:** `ReferenceError: Cannot access 'onKonami' before initialization` (if written as `const onKonami = ...`)
**Root cause:** The `keydown` event listener called `onKonami()` but the function was defined after the `addEventListener` call using a `function` declaration — which is hoistable, so this actually worked. However if ever rewritten as `const onKonami = () => {...}` it would break.
**Fix:** Kept as `function onKonami()` declaration and moved it explicitly BEFORE the `addEventListener` call to make the order clear.
**Rule:** Functions called from event listeners should be `function` declarations, not `const`/`let` arrow functions, to benefit from hoisting. And declare them before the listener regardless.

-----

### BUG-04: Nested/unclosed `<span>` tags in terminal output strings

**Symptom:** Terminal output appears correct but DOM is corrupted; subsequent entries may not render.
**Root cause:** Template literals used as terminal output are injected via `innerHTML`. An unclosed or mismatched `<span>` will cause the browser’s HTML parser to produce unexpected DOM structure.
**Examples that caused issues:**

```javascript
// WRONG — outer span closed before inner span closes
`<span class="ta">text <span class="tr">REDACTED</span>`  // missing closing </span>

// WRONG — backtick inside single-quoted string used as innerHTML
`<span class="tm">"Not Penny's Boat."
<span class="td">note</span>`  // missing closing </span> for .tm
```

**Fix:** Carefully balance all span tags. For strings containing single quotes, use string concatenation or escape the quotes.

-----

### BUG-05: Box-drawing characters in JS comments breaking `vm.Script` during debugging

**Symptom:** `SyntaxError` when using Node’s `vm.Script` to check syntax during development.
**Root cause:** Characters like `═`, `━` in `/* comments */` caused issues with Node’s `new Function()` wrapper (but NOT with browser execution or `node --check`).
**Fix:** Replaced `BOOT_MSG` template literal with string concatenation using `\u2014` Unicode escapes. Regular `/* ═══ */` section comments in the main code were left as-is since browsers handle them fine.
**Note:** This bug only affects Node.js development tooling, not the browser. The site works correctly with these characters in browsers.

-----

## Known Limitations (Not Bugs — By Design)

### No state persistence

Session state (execCount, ARG unlock progress, decoded puzzles) is lost on page refresh. `localStorage` was deliberately not implemented to keep the file simple. If persistence is needed, see “Suggested Next Steps” in `CLAUDE.md`.

### Timer continues in background tabs

`setInterval` is throttled by browsers in background tabs (typically to 1-second minimum intervals). This means the timer may drift slightly if the tab is hidden. This is acceptable and actually lore-appropriate (“the clock is always running”).

### Hieroglyph font rendering varies by OS

The Egyptian hieroglyph characters (𓆣 𓂀 𓇳 𓅓 𓆙) render differently across operating systems depending on available fonts. The font stack is:

```css
font-family: 'Segoe UI Historic', 'Noto Sans Egyptian Hieroglyphs', 'Apple Symbols', serif;
```

On systems without these fonts, Unicode fallback boxes may appear. This is acceptable — it adds to the degraded-system feel.

### `type="number"` input inconsistencies

The six number fields use `<input type="number">`. On mobile, this shows a numeric keypad (good). However, some browsers add increment/decrement spinners. These are hidden via:

```css
.nf::-webkit-inner-spin-button,
.nf::-webkit-outer-spin-button { -webkit-appearance: none; }
.nf { -moz-appearance: textfield; }
```

The `placeholder="—"` attribute renders inconsistently in number inputs across browsers but is acceptable for aesthetic purposes.

-----

## Things to Watch Out For

1. **Template literals spanning multiple lines** — if you add content to terminal command strings, be careful with line breaks inside template literals. They are literal newlines in the output, which is usually what you want but can create unexpected whitespace.
1. **`addLog` vs `termPrint`** — these go to different places. `addLog` → main page activity log (`#logOut`). `termPrint` → terminal modal output (`#termOut`). Don’t mix them up.
1. **`window.cl5` is a global** — it’s set by `onKonami()` and checked by the FILES handlers. If you add other clearance mechanisms, check and set this same flag.
1. **The splash dismisses on ANY keydown** — including arrow keys, which are also used by the Konami code listener. The Konami listener is always active. If a player happens to be pressing arrow keys while the splash is showing, the splash will dismiss but the Konami progress may also advance. This is an edge case and considered acceptable.
1. **The `#cdWidget` is `display: none` initially** — it’s set to `display: flex` inside `dismissSplash()`. If you add anything that depends on the timer being visible, ensure it also waits for splash dismissal.
