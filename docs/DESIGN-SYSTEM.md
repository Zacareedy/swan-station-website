# Design System

Visual and layout conventions for `swan-station.html`. All design decisions must be consistent with this document.

-----

## Concept

The site simulates a **1970s–80s DHARMA Initiative intranet terminal** viewed on a CRT monitor. The aesthetic is:

- Phosphor green on near-black — a real P31 phosphor CRT palette
- Everything feels slightly degraded, old, almost deprecated
- Monospace font throughout — no proportional type anywhere
- Grid-based panel layout with hairline borders — like old terminal UIs
- No decorative elements; all structure is functional

-----

## Colour Palette

All colours defined as CSS custom properties on `:root`:

```css
:root {
  /* Phosphor green — primary UI colour */
  --ph:        #4dff7c;   /* bright phosphor — active text, highlights */
  --ph-mid:    #25b84a;   /* mid phosphor — secondary interactive */
  --ph-dim:    #0f5a25;   /* dim phosphor — borders, inactive elements */
  --ph-faint:  #071a0d;   /* faint phosphor — hover fills, deep bg */

  /* Amber — warnings, lore highlights, ARG reveals */
  --am:        #e0a818;
  --am-dim:    #6b4e09;

  /* Red — critical state, errors, redacted content */
  --red:       #ff2200;

  /* Backgrounds */
  --bg:        #010a02;   /* page background */
  --panel:     #020e04;   /* main content panels */
  --panel2:    #030b04;   /* sidebar panels (slightly different) */

  /* Borders */
  --bd:        #0f2e16;   /* standard border */
  --bd2:       #1a4a24;   /* brighter border (box highlights) */

  /* Dim text */
  --dim:       #1a4028;   /* labels, keys, inactive metadata */

  /* Timer-specific — show-accurate colours */
  --td-green:  #b8ff00;   /* normal digit colour (yellow-green, not pure green) */
  --td-warn:   #ff8c00;   /* warning digit colour (orange) */
  --td-crit:   #ff1a00;   /* critical digit colour (red) */
}
```

**Do not** introduce new colour values. All new UI must use these variables.

-----

## Typography

**Single font family:** `VT323` (Google Fonts), fallback `'Courier New', monospace`

```css
font-family: 'VT323', 'Courier New', monospace;
```

- Base body font-size: `18px`
- Panel labels: `9px`, `letter-spacing: 5px`, uppercase
- Header station name: `12px`, `letter-spacing: 5px`
- Status table keys: `10px`, `letter-spacing: 2px`
- Log entries: `12px`, `line-height: 1.95`
- Terminal output: `13px`, `line-height: 1.8`
- Countdown digits: `54px` (individual digit cells)
- Splash title: `30px`, `letter-spacing: 10px`

**Rule:** Never use a different font. Never use bold (VT323 has no bold variant). Use colour and letter-spacing for hierarchy instead.

-----

## CRT Effects

### Static scanlines

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent, transparent 2px,
    rgba(0,0,0,0.13) 2px, rgba(0,0,0,0.13) 4px
  );
  pointer-events: none;
  z-index: 9998;
}
```

### Moving scanline

```css
.scanline {
  position: fixed;
  top: -80px; left: 0; right: 0;
  height: 80px;
  background: linear-gradient(transparent, rgba(77,255,124,0.022), transparent);
  animation: scan 12s linear infinite;
}
```

### Splash flicker

```css
animation: flicker 0.25s infinite;
/* @keyframes flicker: opacity dips to .91 and .96 */
```

These effects must be preserved. They are not cosmetic extras — they define the aesthetic.

-----

## Layout System

### Page structure

```
body
├── .scanline                    (fixed, z 9997)
├── body::before                 (fixed scanlines, z 9998)
├── #splash                      (fixed fullscreen, z 99999)
├── #hieroScreen                 (fixed fullscreen, z 60000)
├── #cdWidget                    (fixed top-right, z 1000)
├── #secBanner                   (fixed top, z 99997)
├── .overlay#termOverlay         (fixed fullscreen modal, z 10000)
├── .overlay#manifestOverlay     (fixed fullscreen modal, z 10000)
├── #eye                         (fixed bottom-right, z 500)
├── #flashOK / #flashERR         (fixed fullscreen overlays, z 9000/9001)
└── #mainContent
    └── .wrap (max-width: 1020px, centered)
        ├── .s-hdr               (header)
        ├── .ticker              (broadcast bar)
        ├── .morse               (morse strip)
        ├── .cipher              (cipher bar)
        ├── .body-grid           (2-col: 2fr 1fr)
        │   ├── .col-main        (left: input, status, log, incidents)
        │   └── .col-side        (right: EM readings, roster, terminal btn, comms)
        └── .s-footer
```

### Border convention

All panels use `border: 1px solid var(--bd)`. No border-radius anywhere. No box-shadows except on the timer bezel and modal window.

### Spacing

Panels use `padding: 16px 20px` (main) or `padding: 13px 15px` (sidebar).
No margin between adjacent panels — borders touch.

-----

## Countdown Timer Specification

This is the most visually precise element, replicating the show prop.

```
┌─────────────────────────────────────┐  ← 2px solid #111 outer border
│  ┌────┐ ┌────┐ ┌────┐   ┌────┐ ┌────┐ │
│  │ 1  │ │ 0  │ │ 8  │ : │ 0  │ │ 0  │ │
│  └────┘ └────┘ └────┘   └────┘ └────┘ │
└─────────────────────────────────────┘
   3 digit cells     2 digit cells
   (minutes)         (seconds)
```

- Outer bezel: `background: #000`, `border: 2px solid #111`, `box-shadow: 0 0 0 3px #050505, inset 0 0 30px #000`
- Each digit cell: `width: 38px`, `height: 62px`, `background: #020200`, `border: 1px solid #0d0d00`
- Horizontal centre line on each cell: `::after` pseudo, `1px rgba(0,0,0,.55)`
- Digit font-size: `54px`
- Colon: `50px`, blinks 1s

**Colour states (applied to `.cd-bezel`):**

- Normal: class none — digits `#b8ff00`
- Warning: class `warn` — digits `#ff8c00`
- Critical: class `crit` — digits `#ff1a00`, digits flash at 0.4s

-----

## Swan Station SVG Logo

Derived from `Logo.tsx` provided by user. Two versions used:

### Splash version (200×200, class `sp-logo`)

```svg
<svg viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="47" fill="#000" stroke="#4dff7c" stroke-width="1.2"/>
  <!-- 12 tick marks at cardinal and intercardinal points -->
  <g stroke="#4dff7c" stroke-width=".8" opacity=".45"> ... </g>
  <!-- Inner guide ring -->
  <circle cx="50" cy="50" r="38" fill="none" stroke="#4dff7c" stroke-width=".5" opacity=".25"/>
  <!-- Swan body — elongated teardrop -->
  <path d="M50 15 C60 26, 66 40, 64 55 C62 68, 57 76, 50 86 C43 76, 38 68, 36 55 C34 40, 40 26, 50 15Z"
        fill="#4dff7c" opacity=".92"/>
  <!-- Neck shadow -->
  <path d="M50 15 C54 23, 58 33, 57 44 C56 53, 53 57, 50 62"
        fill="none" stroke="#000" stroke-width="3" opacity=".55"/>
  <!-- Body void (ellipse) -->
  <ellipse cx="50" cy="56" rx="8" ry="12" fill="#000"/>
  <!-- Text ring simulation -->
  <circle cx="50" cy="50" r="30" fill="none" stroke="#4dff7c" stroke-width=".3" opacity=".18"/>
</svg>
```

### Header version (44×44, class `swan-logo-sm`)

Simplified — same elements but without tick marks:

```svg
<circle cx="50" cy="50" r="47" fill="#000" stroke="#4dff7c" stroke-width="1.5"/>
<path d="M50 15 ... Z" fill="#4dff7c" opacity=".88"/>
<ellipse cx="50" cy="56" rx="8" ry="12" fill="#000"/>
<circle cx="50" cy="50" r="38" fill="none" stroke="#4dff7c" stroke-width=".5" opacity=".25"/>
```

-----

## Terminal Window Styling

```css
.term-win {
  width: 760px;
  max-width: 97vw;
  border: 1px solid var(--ph-dim);
  background: #010a02;
  box-shadow: 0 0 60px rgba(77,255,124,.18), 0 0 120px rgba(77,255,124,.05);
}
.term-tbar {
  background: var(--ph-dim);
  color: #000;
  font-size: 10px;
  letter-spacing: 4px;
}
.term-prompt-str {
  content: '>: ';   /* show-accurate prompt format */
}
```

Terminal output HTML colour classes:

- `.td` — dim (`var(--dim)`) — metadata, timestamps
- `.tm` — mid (`var(--ph-dim)`) — secondary text
- `.tb` — bright (`var(--ph)`) — important/active
- `.ta` — amber (`var(--am)`) — lore highlights, warnings
- `.tr` — red (`var(--red)`) — redacted, errors, denied
- `.th` — heading — bright + underline, `letter-spacing: 2px`

-----

## Responsive Breakpoint

Single breakpoint at `680px`:

```css
@media(max-width:680px){
  .body-grid { grid-template-columns: 1fr; }
  .col-side { border-left:none; border-top:1px solid var(--bd); }
}
```

Timer widget scales down slightly but stays fixed top-right.

-----

## Hieroglyph Screen Styling

```css
#hieroScreen {
  background: #000;
  animation: screen-flash 0.6s infinite; /* alternates #000 and #0a0000 */
}
.hiero-box {
  width: 340px;
  border: 3px solid #300;
  background: #050000;
  box-shadow: 0 0 100px rgba(255,0,0,.35);
}
.h-glyph {
  font-size: 72px;
  color: #cc2200;
  text-shadow: 0 0 24px #ff0000, 0 0 48px #660000;
  filter: sepia(1) saturate(8) hue-rotate(315deg);
}
```

The two columns animate with `glyph-spin` at different speeds (1.6s and 1.1s) using `steps(1)` — creating a slot-machine effect.
