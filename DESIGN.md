---
version: alpha
name: A Brazileira · Boutique Hotel
description: >-
  A coming-soon page for a boutique hotel in Torres Vedras, Portugal, and step 1 of its design system.
  The canvas is warm paper (papel #F9F0E9), never white, and by night a walnut dark (noite #1C120B), never
  black. The voice is the client's original logo: a crowned B in a laurel wreath over A BRAZILEIRA /
  BOUTIQUE HOTEL / TORRES VEDRAS in Cinzel roman capitals; everything else is Cormorant Garamond in sentence
  case. Brass (latão) is ornament and logo by day and light by night. Two surface worlds, Dia and Noite,
  switch the whole page, including the drawing. The signature is a line drawing of a generic Portuguese stone
  doorway: its walnut doors ease ajar once on load, and scrolling opens them, walks in through the doorway
  and arrives in the lit hall, where the waiting list is. Shapes are square-cut; depth comes only from the
  drawing and its light. The rule is restraint: one message, one action, no ornament.

colors:
  # primitives (tokens.css, layer 1)
  papel: "#F9F0E9"          # canvas by day; lime plaster; form fields
  areia: "#F0DFCF"          # lit stone, glass by day, skip-link surface
  pedra: "#DECDBD"          # limestone face
  oliva: "#72692E"          # olive leaves (illustration only)
  azulejo: "#6F7A4A"        # silvery leaf mix (illustration only)
  castanho: "#804F1E"       # walnut doors by day; muted text 6.11:1 on papel
  nogueira: "#5F3819"       # text, focus, floor line, drawing ink, field borders; 9.03:1 on papel
  tinta: "#2E1E14"          # strongest text (wordmark), the button; 14.23:1 on papel
  latao: "#DB9E42"          # brass; 2.08:1 on papel = ornament only by day; 7.87:1 on noite
  latao-marca: "#A57638"    # emblem by day (graphic, 3.56:1), close to the original logo gold
  latao-texto: "#83602C"    # brass-hued small text by day, 5.08:1 on papel
  noite: "#1C120B"          # canvas by night
  linho: "#F3E6D6"          # text by night, 14.99:1 on noite
  linho-escuro: "#C2AE96"   # muted text by night, 8.58:1 on noite
  luz-nucleo: "#FFF2D6"     # lamplight core (illustration, night)
  luz: "#F4C978"            # lamplight body
  luz-borda: "#B9782C"      # lamplight falloff
  barro: "#9E3B1E"          # terracotta (handmade ceramics): form errors only; 5.17:1 / 5.58:1 on the hall
  sala-dia: "#F2DEC4"       # the lit hall by day (= latao 22% in papel, stored as exact sRGB hex)
  sala-noite: "#FCE7BC"     # the lit hall by night (= luz-nucleo 72% in luz, stored as exact sRGB hex)
  # semantic roles (tokens.css, layer 2): Dia / Noite
  color-bg: "papel / noite"
  color-text-strong: "tinta / linho"
  color-text: "nogueira / linho"
  color-text-muted: "castanho / linho-escuro"
  color-accent-text: "latao-texto / latao"
  color-mark: "latao-marca / latao"
  color-ground: "nogueira / pedra 46% in noite (#75685D, 3.41:1)"
  color-focus: "nogueira / latao"
  color-selection: "areia / latao 28% in noite"
  color-surface: "areia / pedra 10% in noite"
  color-hall: "sala-dia / sala-noite"   # ONE token per theme: the doorway's last light, the flood AND the waiting list
  # the hall surface re-points the roles for its subtree (.surface-hall), the same in both themes
  hall-text-strong: tinta
  hall-text: nogueira
  hall-text-muted: castanho
  hall-field: "papel / luz-nucleo"   # --color-field-hall: the night field is lit by the same lamp
  hall-field-line: nogueira
  hall-error: barro
  hall-on-strong: papel     # text on the tinta button

typography:
  wordmark:
    fontFamily: "Cinzel, 'Cinzel fallback', 'Trajan Pro', 'Times New Roman', serif"
    fontSize: "clamp(1.75rem, min(1.05rem + 2.75vw, 6.4svh), 3.5rem)"   # 28 -> 56px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: 0.045em
    textTransform: uppercase
  kind:                       # BOUTIQUE HOTEL
    fontFamily: Cinzel
    fontSize: 0.5em           # of the wordmark
    fontWeight: 700
    letterSpacing: 0.12em
    textTransform: uppercase
  place:                      # TORRES VEDRAS
    fontFamily: Cinzel
    fontSize: 0.4em
    fontWeight: 400
    letterSpacing: 0.3em
    textTransform: uppercase
  title:                      # «Lista de espera», «Nota de privacidade»
    fontFamily: "'Cormorant Garamond', 'Cormorant fallback', 'EB Garamond', Garamond, 'Times New Roman', serif"
    fontSize: "clamp(1.75rem, 1.35rem + 1.6vw, 2.5rem)"   # 28 -> 40px
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: 0
  lede:
    fontFamily: "'Cormorant Garamond', 'Cormorant fallback', 'EB Garamond', Garamond, 'Times New Roman', serif"
    fontSize: "clamp(1.25rem, min(1.02rem + 0.95vw, 3.4svh), 1.75rem)"  # 20 -> 28px
    fontWeight: 500
    lineHeight: 1.32
    letterSpacing: 0
  cta:                        # the one action, field labels, inputs, consent, button
    fontFamily: "Cormorant Garamond"
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: 0
  read:                       # privacy notice body
    fontFamily: "Cormorant Garamond"
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0
  ui:                         # Dia · Noite, PT · EN, status
    fontFamily: "Cormorant Garamond"
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: 0
  small:                      # footer, inline form messages
    fontFamily: "Cormorant Garamond"
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: 0

rounded:
  none: 0px                   # everything, fields and button included
  focus: 2px                  # focus-ring corners only

spacing:
  space-1: 4px
  space-2: 8px
  space-3: 12px
  space-4: 16px
  space-5: 24px
  space-6: 32px
  space-7: 48px
  space-8: 64px
  space-9: 96px
  gutter: "clamp(1.5rem, 0.75rem + 3.2vw, 4.5rem)"   # 24 -> 72px
  container: 86rem
  target: 44px
  field: 48px
  measure-form: 26rem

components:
  lockup:
    textColor: "{colors.color-text-strong}"
    markColor: "{colors.color-mark}"
    placeColor: "{colors.color-accent-text}"
    typography: "{typography.wordmark}"
  control:                    # theme buttons and language links share one recipe
    textColor: "{colors.color-text-muted}"
    activeTextColor: "{colors.color-text-strong}"
    activeDecoration: "underline 1px, offset 0.3em"
    typography: "{typography.ui}"
    minSize: 44px
  cta:                        # «Entrar na lista de espera»: a text link-button
    textColor: "{colors.color-text-strong}"
    decoration: "underline 1px, offset 0.3em"
    typography: "{typography.cta}"
    minHeight: 44px
    pressed: "scale(0.97), 160ms"
  lede:
    textColor: "{colors.color-text}"
    typography: "{typography.lede}"
    maxWidth: 21em
  status:
    textColor: "{colors.color-accent-text}"
    typography: "{typography.ui}"
  footer:
    textColor: "{colors.color-text-muted}"
    typography: "{typography.small}"
  floor-line:
    borderColor: "{colors.color-ground}"
    height: 1px
  entrance:                   # the caderno drawing (src/scene.py + src/hand.py)
    pen: "1.15px contour, 0.82px detail, 0.52px hatching, 0.48px cross-hatching, 0.55px fine (x --ink-k: 1 / 0.86 / 0.74 by container width); scales with the camera"
    washes: "filled paths at glaze opacity (--wo-*), the same colour on a 1.1px rim at 55% (pigment pooling at the edge)"
  surface-hall:
    backgroundColor: "{colors.color-hall}"
    textColor: "{colors.hall-text}"
  text-input:
    backgroundColor: "{colors.hall-field}"
    borderColor: "{colors.hall-field-line}"
    textColor: "{colors.hall-text-strong}"
    typography: "{typography.cta}"
    height: 48px
    rounded: "{rounded.none}"
  text-input-invalid:
    borderColor: "{colors.hall-error}"
    border: "2px (1px border + 1px inset)"
  checkbox:
    size: 24px
    borderColor: "{colors.hall-field-line}"
    checkedBackground: "{colors.hall-text-strong}"
    tickColor: "{colors.hall-on-strong}"
    hitArea: 44px
  button-primary:
    backgroundColor: "{colors.hall-text-strong}"
    textColor: "{colors.hall-on-strong}"
    hoverBackground: "{colors.hall-text}"
    typography: "{typography.cta}"
    height: 48px
    width: 100%
    rounded: "{rounded.none}"
    pressed: "scale(0.97), 160ms"
  form-message:
    textColor: "{colors.hall-text-strong}"
    errorColor: "{colors.hall-error}"
    typography: "{typography.cta}"
---

# A Brazileira · DESIGN.md

## Overview

A Brazileira reads like the hotel's own card left on a stone step: warm paper, the gold crest of the original
logo in roman capitals, one sentence, one action, and a doorway drawn in ink that opens a little. The doorway
is a page of an architect's travel sketchbook (the "caderno" style the client chose): a quick, sure pen line,
economical hatching for shade and loose watercolour washes, all baked into vector geometry.

**Dia** is paper and limestone in sunlight: flat papel ground, walnut doors, brass knobs, a faint cast
shadow on the plaster. **Noite** is the same drawing after dark: walnut-black ground, the doors and stone
gone dark, and lamplight coming through the gap, the fanlight and the wall lantern. The page follows the
visitor's system theme; the Dia · Noite control overrides it and remembers the choice.

Scrolling is the one journey on the page, short and fluid (about 1.4 screens): the doors swing open from the
first pixel, the hall lights up, the view walks in through the doorway, and the hall's light becomes the
ground of the waiting list, whose title is already rising while the walk-in ends. The hall surface is light
in both themes (daylight by day, lamplight by night), so the form always reads dark ink on a light ground.

Colour discipline: nogueira is the workhorse (text, focus ring, the drawing's ink, the floor line, field
borders). Latão is ceremonial: the emblem and TORRES VEDRAS, and the light at night. Oliva and azulejo exist
only inside the drawing. Barro (terracotta) exists only for form errors. The interface itself is 95% neutral.

**Key characteristics**
- Canvas `{colors.papel}` by day, `{colors.noite}` by night; the hall `{colors.color-hall}`; all flat.
- The original logo, unchanged: emblem.svg inline + Cinzel 600 / 700 / 400 lockup at the logo's ratios.
- One reading face: Cormorant Garamond 500, roman, sentence case. Tracked capitals exist only in the logo.
- One accent: brass, `{colors.latao-texto}` by day (5.08:1), `{colors.latao}` by night (7.87:1).
- One action on the first screen: «Entrar na lista de espera» / «Join the waiting list».
- Square corners everywhere; the only radius is the 2px corner of the focus ring.
- Depth comes from the drawing alone (perspective, light), never from interface shadows.
- Motion: the doors ease ajar once on load (1.1s); one scroll-linked sequence (144svh, one plain-JS driver)
  opens them into the waiting list; the hero action jumps straight to the list; Dia ↔ Noite cross-fades in 400ms.

## Logo usage

- **Source**: `src/assets/img/emblem.svg` (vector rebuild of the original: crown with cross, dense laurel,
  bow, Trajan-style B). It is inlined in the h1 with `currentColor`, `aria-hidden`; the accessible name is the
  live text "A Brazileira, Boutique Hotel, Torres Vedras".
- **Lockup** (exactly as the original): emblem 2.9em wide (of the wordmark size) · A BRAZILEIRA Cinzel 600,
  tracking 0.045em · BOUTIQUE HOTEL Cinzel 700, 0.5em, tracking 0.12em · TORRES VEDRAS Cinzel 400, 0.4em,
  tracking 0.3em, brass. Trailing tracking is compensated with a negative end margin so each line is
  optically centred.
- **Colour**: Dia: emblem `latao-marca`, wordmark and kind `tinta`, place `latao-texto`. Noite: emblem and
  place `latao`, wordmark and kind `linho`. Forced colours: CanvasText.
- **Clear space**: at least 0.75em of the wordmark size on every side (about the cap height of
  A BRAZILEIRA). The page keeps 24px or more (0.86em at the smallest size).
- **Minimum size**: wordmark 24px (lockup about 220px wide; used at exactly this size as the home link on
  the privacy notice). Below that, use the emblem alone (favicon.svg, app icons), which holds at 16px.
- **Don't**: redraw, outline, recolour outside the two schemes, add a background plate, set the words in
  another face, change the tracking, put the lockup on the drawing, animate the emblem.

## Colors

### Brand & accent
- **Papel** (`--papel` #F9F0E9): day canvas; the fill of form fields on the hall by day. Never pure white.
- **Areia** (`--areia` #F0DFCF): lit stone and glass in the drawing; skip-link surface. Not a text colour.
- **Pedra** (`--pedra` #DECDBD): limestone face in the drawing; base of the night line colours.
- **Castanho** (`--castanho` #804F1E): walnut door face by day; muted text (6.11:1 on papel).
- **Nogueira** (`--nogueira` #5F3819): text, focus ring, floor line, drawing ink and field borders (9.03:1).
- **Tinta** (`--tinta` #2E1E14): the wordmark, the strongest text and the button (14.23:1).
- **Latão** (`--latao` #DB9E42): brass hardware by day (ornament only, 2.08:1 on papel); text, emblem and focus
  by night (7.87:1).
- **Oliva / Azulejo**: olive leaves only. Never text, never interface.
- **Barro** (`--barro` #9E3B1E): form errors on the hall surface only (text and the invalid field edge).
- **Sala** (`--sala-dia` #F2DEC4, `--sala-noite` #FCE7BC): the lit hall. Stored as exact sRGB hex (not a
  `color-mix`), so every layer that paints it resolves to the same pixel.

### Surface
Three surfaces: `--color-bg` (papel / noite), `--color-hall` (the lit hall: `--sala-dia` #F2DEC4 by day,
`--sala-noite` #FCE7BC by night) and `--color-surface` (areia / dark stone), which appears only under the
focused skip link. `--color-hall` is ONE token per theme and the only colour of the hand-off: the flat layer
that dissolves the hall inside the doorway (`.hall__flat`), the stage flood and the waiting list (and the
home footer) all paint it, so the colour never changes between the door and the form. Measured by pixel
sampling: ΔRGB = 0 over the whole frame at p = 0.86, 0.92 and 1 and across the seam where the stage
releases, on 11 viewports from 320 × 640 to 3440 × 1440 (portrait, landscape, ultra-wide), both themes.
No gradient ends on another stop: the Noite lamplight gradient in the hall is covered by the flat token
before the hand-off. `.surface-hall` re-points the semantic roles for its subtree so components inside it
need no special colours. No cards, no panels, no glass.

### Hairlines
The floor line (`--color-ground`), 1px, full width, where the steps stand. It is the ground of the drawing,
not a divider, and it belongs to the drawing (it travels with the camera in the sequence): nogueira by day
(9.03:1), pedra 46% in noite by night (3.41:1). Field and checkbox borders: nogueira 1px on the hall (7.75:1).

### Text
`--color-text-strong`, `--color-text`, `--color-text-muted`, `--color-accent-text` (see the matrix).

### Semantic
`--color-focus` nogueira / latão (nogueira on the hall). `--color-error` barro, on the hall only. There is no
success colour: success is a sentence («Obrigado. Avisamos quando abrirmos.»), not a colour.

### Contrast matrix (measured on the rendered pages with Playwright, WCAG 2.x)

| Theme | Element | Foreground | Background | Ratio | Rule |
|---|---|---|---|---|---|
| Dia | Wordmark, kind, active control, CTA | tinta #2E1E14 | papel #F9F0E9 | 14.23:1 | text |
| Dia | Lede, privacy body | nogueira #5F3819 | papel | 9.03:1 | text |
| Dia | Inactive control, separators, footer, scroll cue | castanho #804F1E | papel | 6.11:1 | text / graphic |
| Dia | TORRES VEDRAS (11.2–22px), status | latao-texto #83602C | papel | 5.08:1 | text |
| Dia | Emblem | latao-marca #A57638 | papel | 3.56:1 | graphic ≥ 3:1 (logo) |
| Dia | Focus ring, floor line | nogueira | papel | 9.03:1 | non-text ≥ 3:1 |
| Noite | Wordmark, kind, lede, active control, CTA | linho #F3E6D6 | noite #1C120B | 14.99:1 | text |
| Noite | Inactive control, separators, footer, scroll cue | linho-escuro #C2AE96 | noite | 8.58:1 | text / graphic |
| Noite | TORRES VEDRAS, status, emblem, focus ring | latao #DB9E42 | noite | 7.87:1 | text |
| Noite | Floor line | #75685D (pedra 46%) | noite | 3.41:1 | non-text ≥ 3:1 |
| Hall (Dia / Noite) | List title, labels, consent link | tinta | hall #F2DEC4 / #FCE7BC | 12.21 / 13.18:1 | text |
| Hall | List sentence, consent text | nogueira | hall | 7.75 / 8.37:1 | text |
| Hall | Footer (home), muted | castanho | hall | 5.24 / 5.66:1 | text |
| Hall | Error message, invalid field edge | barro #9E3B1E | hall | 5.17 / 5.58:1 | text |
| Hall | Field and checkbox borders, focus ring | nogueira | hall | 7.75 / 8.37:1 | non-text ≥ 3:1 |
| Hall | Typed text | tinta | papel / luz-nucleo #FFF2D6 (field) | 14.23 / 14.42:1 | text |
| Hall (Noite) | Field border on the field | nogueira | luz-nucleo | 9.16:1 | non-text ≥ 3:1 |
| Hall | Button label | papel | tinta (button) | 14.23:1 | text |
| either | Brass hardware in the drawing | latao | papel | 2.08:1 | ornament only, never meaning |

`latao-texto` on the hall would be 4.36:1, so `--color-accent-text` points to castanho inside `.surface-hall`.

## Typography

### Font family
- **Cinzel** 400 / 600 / 700, latin subset, self-hosted woff2 (12.5 / 13.6 / 13.6 KB). Logo lockup only.
- **Cormorant Garamond** variable (wght 300–700), roman only, latin subset (27.9 KB). All reading text and UI.
- No italic is shipped. Licences: `assets/fonts/OFL-*.txt`.

### Hierarchy

| Token | Family | 320–375px | 1440px | Weight | Line height | Tracking | Case | Use |
|---|---|---|---|---|---|---|---|---|
| wordmark | Cinzel | 28px | 55px | 600 | 1.05 | 0.045em | caps | A BRAZILEIRA |
| kind | Cinzel | 14px | 27.5px | 700 | 1.05 | 0.12em | caps | BOUTIQUE HOTEL |
| place | Cinzel | 11.2px | 22px | 400 | 1.05 | 0.3em | caps | TORRES VEDRAS |
| title | Cormorant | 28px | 40px | 500 | 1.1 | 0 | sentence | Lista de espera, Nota de privacidade |
| lede | Cormorant | 20px | 28px | 500 | 1.32 | 0 | sentence | the one sentence; the list sentence |
| cta | Cormorant | 18px | 18px | 500 | 1.25–1.35 | 0 | sentence | the action, labels, fields, consent, button |
| read | Cormorant | 18px | 18px | 500 | 1.5 | 0 | sentence | privacy notice |
| ui | Cormorant | 16px | 16px | 500 | 1.25 | 0 | sentence | Dia · Noite, PT · EN, status |
| small | Cormorant | 15px | 15px | 500 | 1.25 | 0 | sentence | footer, inline form messages |

Above 1920px the root size grows to 112.5% (131.25% from 2560px): more scale, never more content. Inputs are
18px, never below 16px, so iOS Safari does not zoom on focus.

### Principles
- Tracked capitals live only inside the logo. Everything else is sentence case with no letter-spacing.
- Roman only; no decorative italic. `text-wrap: balance` on the ledes.
- Height-aware sizes (`svh` inside `min()`) keep the lockup and lede in one screen on short laptops.

### Font loading and fallbacks
`font-display: swap`; Cinzel 600 and Cormorant are preloaded. Metric-matched local fallbacks were measured
with fontTools on the exact strings against Times / Liberation Serif:
Cinzel 400 `size-adjust 100.19%`, 600 `97.12%`, 700 `105.16%`; Cormorant `97.1%`, ascent 95.16%, descent 29.56%.

## Layout

### Spacing system
4px base: 4, 8, 12, 16, 24, 32, 48, 64, 96 (`--space-1` … `--space-9`). Gutter 24 → 72px. Touch target 44px,
field and button 48px, form column 26rem.

### Grid and container
- **Stacked** (portrait below 900px): lockup · lede · status · action, then the entrance standing on the floor
  line, then a band with the scroll cue. The door's axis sits on the page axis (the drawing is scaled
  symmetrically around it: `--scene-axis` is generated from the model, `--scene-reach` 0.85886 lets the
  outermost olive leaves reach into the gutter).
- **Split** (from 900px wide, or any landscape screen from 600px): 5fr text | 6fr entrance, 64px apart,
  container 86rem; the text column is a centred crest; the entrance stands on the floor line.
- **Waiting list**: a full-height hall section (`min-height: 100svh`), one centred column of 26rem whose title
  starts 22svh from the top of the section (a little above the optical centre, and where the hero action
  lands). With the sequence on, the section is pulled up over the end of the pinned run (`--porta-lap` =
  22svh + 18% of the run); its first stretch is transparent and its colour starts exactly at the bottom of
  the stage. Home page document: 3.05 screens at 390 × 844, 3.04 at 1440 × 900, 3.46 at 844 × 390.
- **Privacy notice**: top bar, the lockup at 24px as a home link, a 40rem reading column, footer.

### Whitespace philosophy
Empty paper is structure. The first screen has four things (crest, sentence, action, doorway) and space
between them; the hall has a title, a sentence and the form.

### Page anatomy (home)
1. Skip link · top bar (Dia · Noite left, PT · EN right), laid over the first screen; it scrolls away.
2. `main`: the door sequence (`.porta`: a sticky stage with the first screen inside) and `#lista`.
3. Footer on the hall: «© 2026 A Brazileira · Torres Vedras, Portugal · Privacidade».
Nothing else: no address, date, rooms, people, prices or social links.

## Elevation & depth
| Level | Treatment | Use |
|---|---|---|
| 0 | flat ground | everything in the interface |
| line | 1px floor line | ground of the drawing |
| drawing | one-point perspective, ink hatching and watercolour washes, lamplight gradients at night | the entrance only |
| hall | flat light colour | the waiting list (the end of the walk-in) |

Interface shadows: none. The invalid field's second pixel of edge is an inset line, not a shadow.

## Shapes
| Token | Value | Use |
|---|---|---|
| none | 0 | everything, fields, checkbox and button included |
| `--radius-focus` | 2px | focus-ring corners |
The arch is architecture, not a UI radius.

## Components

**`lockup`** (h1 on the home page; a 24px home link on the privacy notice): see Logo usage. States: none.

**`control`** (`.ctl`, buttons and links): Cormorant 500 16px, sentence case, muted colour, 44 × 44px minimum.
- Default: `--color-text-muted`. Hover (fine pointer only): `--color-text-strong`, 160ms.
- Focus-visible: 2px solid `--color-focus`, offset 3px, 2px corners; never animated.
- Active / current: `--color-text-strong` + 1px underline 0.3em below (state is never colour alone);
  `aria-pressed="true"` for the theme, `aria-current="page"` for the language.

**`theme switch`** (Dia · Noite / Day · Night): two real buttons in `role="group"`; hidden without JS.
A head script reads `localStorage["ab-tema"]` and sets `data-theme` before the first paint (no flash);
`meta[name=theme-color]` follows. Storage is wrapped in try/catch.

**`language switch`**: two links (`hreflang`, `lang`, `aria-current`); on the privacy notice they point to the
other language's notice.

**`cta`** (`.cta`, «Entrar na lista de espera» / «Join the waiting list» → `#lista`): the only action on the
first screen, a text link-button under the status. 18px tinta / linho, 1px underline 0.3em below, 44px tall.
Hover (fine pointer): `--color-text`. Pressed: `scale(0.97)`, 160ms. Click, tap or Enter: an instant jump to the
list (no smooth scroll, so the door sequence never plays as a flash; the scroll cue does the same) and the
focus moves to the email field (`preventScroll`). There is no `scroll-behavior: smooth` anywhere. Tab from
the action also lands on the email field with the list in view.

**`porta`** (the door sequence): `.porta` > `.porta__stage` (sticky) > `.porta__frame` (the first screen,
100svh) + `.porta__flood`. Without JS or with reduced motion it is just the first screen. Every moving layer
carries a `data-motion` hook (wrapper, stage, copy, cue, camera, opening, light, handoff, spill, leaf-l,
leaf-r, flood, list), attributes only, for tests. See Motion.

**`entrance`** (the drawing, "caderno"): an original generic Portuguese doorway drawn as a page of an
architect's travel sketchbook. The construction is a true one-point perspective in metres (eye 1.55m high,
6m away): two limestone steps, a moulded jamb surround with plinths and impost blocks, voussoirs and a
keystone, the wall thickness as a reveal and soffit, a walnut double door (two raised-and-fielded panels per
leaf, brass knobs, hinge knuckles) under a transom and a radial fanlight, a square iron wall lantern on a
scrolled arm, a young olive tree in a terracotta pot, and through the doorway a quiet hall (chequered floor,
a tiled dado, a pendant lamp, an arched passage to a window). Generated by `src/scene.py`; colours only
through `--i-*` / `--w-*` tokens, so Dia and Noite are the same drawing.

*The hand* (`src/hand.py`): every edge goes through a seeded `Pen`, so the irregularity is baked into the
path coordinates (identical on every build and device; no SVG filters, no rasters, crisp at any zoom):
- `line()`: a straight line ruled by eye: a slight bow or S, ends that overshoot at corners or stop short,
  a pen lift on long runs, an optional second pass on the main silhouettes;
- `curve()`: a freehand stroke through a dense polyline (arcs, profiles) with the same habits;
- `hatch()`: economical parallel hatching clipped loosely to a polygon, uneven spacing, a drifting angle and
  a tone function that lets strokes die out towards the light (58° for shade, -28° to -32° for cross-hatching);
- `tick()`, `qc()`: short fast marks (tile motifs, leaf ribs);
- `wash()` / `blob()`: watercolour washes with a wet irregular edge (fractal displacement along the normal,
  smooth spline), allowed to spill over the line a little.
*Line system* (site.css `.k*`): ink 1.15px contour, 0.82px detail, 0.52px hatching, 0.48px cross-hatching,
0.55px fine, round caps and joins, multiplied by `--ink-k` (1 / 0.86 / 0.74 as the drawing's container
grows past 30rem / 44rem) so a large drawing keeps a fine pen. Strokes scale with the camera: walking in
reads like leaning into the sketchbook. Washes (`.w-*`) are filled paths at a glaze opacity with the same
colour on a 1.1px rim at 55% (pigment pooling at the edge). Night: the same drawing in light ink on the
walnut paper with glazes of lamplight (radial gradients, content of the drawing, not decoration).

Layers, back to front (the choreography needs them separate):
1. back svg: the hall in shadow behind the door plane (seen in the gap while the doors are ajar; hidden from
   p = 0.42, when the lit hall covers it);
2. `.hall` (the opening): `.hall__light` (the lit hall and its drawing: flat `--color-hall` by day, a
   lamplight gradient at night), `.hall__lamp` (the pendant lamp), `.hall__flat` (the hand-off: flat
   `--color-hall`, inside the doorway only);
3. front svg: wall, stone arch, reveal, frame, fanlight, steps, lantern, olive tree;
4. `.spill`: lamplight on the threshold and steps (Noite), clipped to the steps' silhouette;
5. `.door`: the two leaves, HTML layers rotated with CSS 3D in the drawing's own perspective (`perspective`
   and `perspective-origin` generated from the model). Each leaf is a hinge (`.leaf`, the scroll swing)
   holding a face (`.leaf__face`, the ajar angle and the load animation); the two rotations add up.
Only HTML layers move (transform / opacity); the drawing is never repainted while the page scrolls.

**`waiting list`** (`#lista`, `.lista.surface-hall`): the room you walked into. h2 «Lista de espera» /
«Waiting list» (title), one sentence (lede), the form, and a `<noscript>` line. It rises in once, in two
beats, as soon as its title enters the screen (which happens at p ≈ 0.82, while the walk-in ends): title +
sentence opacity 0 → 1 and 12px, 560ms; the form +100ms, 8px, 480ms; `--ease-out`. The panel itself has no
entrance (its colour is the light the camera carried in). If focus or a jump gets there first, the content
is shown at once.

**`form`** (`[data-waitlist]`, `novalidate`; states on `data-state`):
- Fields: «Email» label above a 48px input (`type=email`, `autocomplete=email`, `inputmode=email`,
  `required`, papel fill, 1px nogueira border, square); the consent checkbox (required): a real
  `<input type=checkbox>` laid invisibly over a drawn 24px box, so it keeps native semantics, focus and a
  44px hit area; the label links to the privacy notice. A honeypot field (`website`) sits off-screen,
  `aria-hidden`, `tabindex=-1`, `autocomplete=off`. The field fill is `--color-field-hall`: papel by day,
  luz-nucleo by night (the pink day paper clashed with the lamplight).
- Button: full width, 48px, tinta fill, papel text, square. Hover (fine pointer): nogueira. Pressed:
  `scale(0.97)`, 160ms, never while sending (`:active:not([aria-disabled=true])`). Its two labels share one
  grid cell, so «A enviar…» never changes its size.
- **idle**: as above. **invalid** (client check, or the server's 400 `invalid_email` / `consent_required`):
  the field gets `aria-invalid="true"`, a 2px barro edge and an inline message in barro 15px below it, tied
  with `aria-describedby`; focus moves to the first invalid field; the message clears as soon as the value is
  fixed. **sending**: `aria-busy` on the form, `aria-disabled` on the button (focus stays on it), label
  «A enviar…» / «Sending…», further submits ignored. **success**: the fields give way to «Obrigado. Avisamos
  quando abrirmos.» in the form's own height (nothing around it moves): the controls fade out in 160ms while
  the sentence rises in over 240ms, in a `role="status"` region that receives focus. **error** (network, timeout after 10s, any other status): «Não foi possível enviar. Tente de
  novo dentro de momentos.» in barro in the status region, fields kept. **honeypot filled**: success shown,
  nothing sent. **no JS**: the fieldset is disabled and drawn as unavailable with tokens (transparent fields and an outline
  button in castanho, 5.24:1; no opacity dimming) and the `<noscript>` line reads «Para se
  inscrever, ative o JavaScript ou escreva para inn@abrazileira.com.»
- Messages animate in with opacity + 4px (200ms, `--ease-out`); the success sentence with opacity + 8px (240ms).
  Under reduced motion they only fade.
- Brand name in running text is `A&nbsp;Brazileira` (consent, footer, privacy notice): it never breaks.
- Backend: `POST https://hxwdnhprhjlqehgvmvct.supabase.co/rest/v1/rpc/join_waitlist` with the publishable key in
  `apikey` and `{"p_email", "p_lang": "pt-PT" | "en", "p_consent": true}`; 2xx is success (duplicates too).
  `credentials: omit`, `referrerPolicy: no-referrer`, `cache: no-store`. The key is public by design: the
  table is not readable, only this function is callable. Nothing is sent before submit.

**`footer`**: «© 2026 A Brazileira · Torres Vedras, Portugal · Privacidade» (EN «Privacy»), 15px muted; the
link is 44px tall. Below 480px the link takes its own line (no dangling separator).

**`privacy notice`** (`privacidade/`, `en/privacy/`): same top bar and tokens; the lockup (24px) as home
link; h1 title; a short intro in lede size; eight short sections (h2 18px 600 + one paragraph at 18px / 1.5):
controller and contact, data, purpose, legal basis (consent, art. 6(1)(a) GDPR, withdrawable), retention
(until withdrawal, at most 24 months), processor (Supabase, EU servers in Paris), rights (incl. complaint to
the CNPD), cookies (none; no analytics; the only third-party request is the form). «Última atualização:
novembro de 2026.» and a link home. Linked from the consent label and every footer.

**`404`**: same tokens and lockup, two sentences (PT and EN) and one link home in each language; footer with
the privacy link. A head script resolves the site root and writes `<base>` and the stylesheets.

## Motion

### The door sequence (scroll-linked)
The first screen sits in a tall wrapper: the stage is `position: sticky` and stays pinned for `--porta-run`
(144svh) of scroll; the waiting list is pulled up over the end of it, so the whole home page is about 3.1
screens. Scroll progress p (0 → 1 across the pinned stretch) drives every layer, each over its own sub-range
and curve; scrolling back reverses everything. There are no dead zones: every 0.02 of p changes the frame
(measured by frame differencing at 390 and 1440, both themes). Curves are tokens (`--curve-*` in tokens.css);
site.js reads them once and evaluates them per frame.

| Element (hook) | Role | p range | Motion | Curve |
|---|---|---|---|---|
| Text column: lockup, lede, status, action (`copy`) | Support, exits | 0 → 0.16 | opacity 1 → 0, rises 16px | `--curve-copy` (0.33, 1, 0.68, 1) |
| Scroll cue (`cue`) | Decoration | 0 → 0.05 | opacity 1 → 0 | `--curve-copy` |
| Left / right leaf (`leaf-l`, `leaf-r`) | Lead, from the first pixel | 0 → 0.42 | +47° (41° → 88°) / +61° (27° → 88°) | `--curve-door` (0.3, 0.55, 0.35, 1) |
| Lit hall, light on the steps (`light`, `spill`) | Support, carried by the leaves | 0 → 0.42 | opacity 0 → 1 = the leaves' eased value | `--curve-door` |
| Hall in shadow (back svg) | — | from 0.42 | hidden (covered by the lit hall) | — |
| Camera: pan (`camera`) | Lead | 0 → 0.36 | the doorway's centre travels on a straight line to the screen's centre | `--curve-pan` (0.35, 0.4, 0.3, 1) |
| Camera: walk-in (`camera`) | Lead | 0.04 → 0.90 | scale 1 → S around the doorway, geometric (s = S^eased) | `--curve-zoom` (0.5, 0.05, 0.3, 1) |
| Hand-off (`handoff`, `.hall__flat`) | Support | 0.60 → 0.86 | flat `--color-hall` inside the doorway, opacity 0 → 1 (the hall drawing and the pendant dissolve into the list colour) | `--curve-fade` (0.45, 0, 0.55, 1) |
| Flood (`flood`) | Support | 0.86 → 0.92 | `--color-hall` over the whole stage, opacity 0 → 1 (colour over the same colour; a safety net for the edge-on leaves) | `--curve-fade` |
| Waiting list (`list`) | Arrival | title enters at p ≈ 0.82 | native scroll; two beats: title + sentence (12px, 560ms), form (+100ms, 8px, 480ms) | `--ease-out` |

Relationships: the doors are the lead from the first pixel (about 11° in the first 5% of p, while the text is
already leaving); the camera starts with them on a soft curve and has the doorway near the centre by the time
the text is gone (p ≈ 0.2); the walk-in overlaps the end of the swing, so it reads as one gesture; the light
is carried by the leaves (no curve of its own); the hall dissolves into the list colour inside the doorway
while the camera lands, and the list title rises over that light (overlap ≈ 18% of the run). Nothing else
moves: the top bar scrolls away, the lockup is never animated on its own, the stone, lantern and tree only
travel with the camera.

S (the final zoom) is computed from the layout so that the door opening covers the whole large viewport on
every aspect ratio, with the open leaves (edge-on, about 7% of the opening each in the drawing's perspective)
pushed out of frame: S = max(vw / (0.86 · opening width), 2 · max(svh / 2, lvh − svh / 2) / opening height)
× 1.04 (≈ 5.0 at 390 × 844, ≈ 8.3 at 1440 × 900). The camera reaches cover before the hand-off, so the flood
only ever fades the hall colour over the hall colour, never over the stone.

### Driver (why one plain-JS driver)
- One driver for every browser: a passive `scroll` listener (and `resize`, `visualViewport` resize,
  `orientationchange`, `load`, `pageshow`, `document.fonts.ready`) wakes one `requestAnimationFrame` loop.
  Each frame reads `pageYOffset` only (no layout reads), turns it into p **clamped to [0, 1]** (iOS
  rubber-band overscroll above the top or past the end never pushes a layer beyond its rest or end state),
  and moves the rendered progress r towards it: `r += (p − r) · (1 − e^(−dt/τ))`, τ = `--scroll-tau` 90ms,
  frame-rate independent (dt is clamped to 64ms). It snaps when |p − r| < 0.0005, snaps at once on a jump of
  more than 0.35 (a link, a focus move, a restored position: the sequence is never replayed as a flash), and
  stops when settled (it keeps reading `pageYOffset` for 8 more frames so a late momentum frame is never
  missed). This is smoothing of what is drawn only: native scrolling is never prevented, delayed or
  animated, and the stage pins with plain `position: sticky`.
- At p = 0 every inline style is removed, so the hero is exactly its CSS rest state (opacity 1, transform
  none). This, the clamp and the removal of the former ViewTimeline / WAAPI path fix the iOS Safari report
  «quando se faz o scroll back, o título do site desaparece»: the timeline path could resolve the text's
  exit at the end state during rubber-band overscroll and drifted with the collapsing toolbar. Regression
  test: `tools/integ/reverse.js` (wheel, touch drags, programmatic jumps, emulated scrollY < 0 and > max,
  viewport height −84px / +60px mid-sequence) asserts `.intro` opacity 1, transform none and no inline style
  after every scenario; a mutated driver without the clamp fails it.
- Geometry is cached: the doorway centre and size (untransformed `offset*`), the small-viewport height (a
  100svh probe), the pin offset for short screens, the pin start and the run (`wrapper − stage`, stable while
  mobile toolbars come and go). It is re-measured on the events above, keeping the same progress.
- Writes are `transform` and `opacity` on the moving elements only, never a custom property on a parent.

### Layers and performance budget
- Budget: under 4× CPU throttle, at 390 × 844 (DPR 3) and 1440 × 900 (DPR 1), Dia and Noite: no frame over
  50ms and p95 ≤ 20ms while the page moves.
- Promotion: nothing has `will-change` in CSS. When the sequence starts (or on a `wheel` / `touchstart` at the
  top, just before it starts) site.js sets `will-change` on the camera (`transform`), the lit hall and the
  spill (`transform, opacity`: their raster scale is frozen while the camera zooms), the text column, and the
  layers whose opacity changes per frame (cue, hand-off, flood). Without the opacity layers every change
  repainted the doorway inside the zooming camera layer and the browser re-rastered it at the new scale every
  frame: 2.7s of raster per pass and frames up to 230ms at 1440 × 900. Hiding the hall in shadow once it is
  covered (p ≥ 0.42) removed the other big raster cost (its dense hatching at full zoom).
- Crisp at rest: 250ms after the scroll rests mid-sequence, the two drawn layers (camera, lit hall) are handed
  back for one frame (they re-raster crisp at the current zoom) and promoted again at that scale, so the next
  scroll starts without raster work. Back at the top (p = 0) all hints are dropped after 400ms. Once the flood
  covers the drawing (p ≥ 0.92) the hints are kept: there is nothing to re-raster.
- During fast motion at high zoom the drawing is shown from the raster made when it was promoted (soft at
  5–8× on DPR 1 for a moment); the hand-off to the flat hall colour happens before the extreme zoom matters.

### Other motion
| Token | Duration | Easing | Use |
|---|---|---|---|
| `--dur-door` | 1100ms (+200ms delay) | `--ease-door` cubic-bezier(.3,.1,.2,1) | leaves rotate 0 → 41° / 27° once on load |
| (light) | 1100ms | `--ease-out` | hall glow, light pool, lit leaf edges fade in with the doors (Noite) |
| `--dur-theme` | 400ms | `--ease-out` (0.23, 1, 0.32, 1) | Dia ↔ Noite: View Transitions cross-fade; colour transitions as fallback (never on `[data-motion]` layers; no snapshot while the sequence is under way) |
| `--dur-reveal` / `--dur-reveal-2` | 560ms / 480ms, +100ms | `--ease-out` | the waiting list rises in, once, in two beats |
| `--dur-state` | 200ms | `--ease-out` | form messages, checkbox tick (opacity + scale 0.8 → 1) |
| `--dur-out` / `--dur-success` | 160ms / 240ms | `--ease-out` | success: the controls give way, the sentence takes their place |
| `--dur-press` | 160ms | `--ease-out` | action and button: `scale(0.97)` while pressed |
| `--dur-ui` | 150ms | `ease` | control and link colour on hover |

### Fallbacks
- `prefers-reduced-motion: reduce`: no pinning and no scroll-linked motion, no load animation, no list
  rise; the doors stand open and the hall is lit (the final state, without the travel); the action jumps to
  the list and focuses the email. No global kill switch: each component drops its movement (press scale,
  message rise, tick scale) and keeps short opacity / colour changes. A live change of the preference tears
  the sequence down (inline styles and hints removed).
- No JS: no pinning (the tall wrapper exists only with `.porta-on`, which site.js adds), doors ajar, theme
  follows the system, the list is visible with a disabled form and the `<noscript>` line.
- Keyboard: Tab from the action lands on the email field with the list in view; focusing anything in the
  pinned first screen mid-sequence rewinds to the rest state, so focus is never on an invisible element.

### Measured
Playwright (headless Chromium, software raster), 4× CPU throttle via CDP, traced with CDP tracing
(devtools.timeline); frame intervals are `requestAnimationFrame` intervals counted while the page moves.
390 × 844 at DPR 3, 1440 × 900 at DPR 1, Dia and Noite:

| Scenario | Viewport | p95 frame | Worst frame | Long tasks (> 50ms) | Raster per pass |
|---|---|---|---|---|---|
| Wheel gesture down through the sequence into the list and back up (3 runs per case) | 390 | 16.7–16.8ms | 16.8ms (one run: one 33ms frame) | 0 | 9–12ms |
| same | 1440 | 16.7–16.8ms | 33ms; once 50.1ms (the first frame, when the layers are created) | 0 | 29–49ms |
| Four legs down and four up with 600ms rests (the crisp re-raster at rest, then resume) | 390 | 16.7–16.8ms | 16.8ms | 0 | 9–12ms |
| same | 1440 | 16.7–16.8ms | 33–50ms (the first frame) | 0 | 35–65ms |
| Finger drags (touch events, 18px per frame) | 390 | 16.7–16.8ms | 16.8–33ms | 0 | 10–15ms |

Before this pass (the former build with the ViewTimeline driver, same harness, all frames): p95 33ms and
frames up to 67ms at 1440, with 1.1–1.2s of raster per pass; the first version of the plain-JS driver,
before the opacity layers were promoted, reached 2.7s of raster and frames of 200–230ms. The rest state at p = 0 is pixel-identical to the
drawing the client approved (only the pendant's antialiasing differs, it moved into its own layer).
Real devices are still to be checked (see Roadmap).

## Dia & Noite (extension)
`[data-theme]` on any element scopes a theme to that subtree (the styleguide shows both side by side); the
semantic block for Noite is written once in `src/noite.css` and emitted twice by the build (system preference
unless Dia was chosen, and the manual choice). Illustration roles that change: ink colours and opacities (`--i-ink*`,
`--ink-o*`), every wash (`--w-*` colour, `--wo-*` glaze opacity), `--i-hall-light` (flat hall by day,
lamplight gradient at night), `--i-room-base`, `--o-night` (lamplight layers), `--o-day` (sun shadows),
`--o-turn` (a turned leaf darkens by day). `--color-hall` changes too (`--sala-dia` / `--sala-noite`), and
`--color-field-hall` (papel / luz-nucleo).

## Voice & content (extension)
pt-PT first, EN second. Facts only.

| Key | PT | EN |
|---|---|---|
| title | A Brazileira · Boutique Hotel · Torres Vedras | A Brazileira · Boutique Hotel · Torres Vedras |
| description | A Brazileira, hotel em Torres Vedras. Uma casa antiga em restauro. Abre brevemente. | A Brazileira, a hotel in Torres Vedras, Portugal. An old house under restoration. Opening soon. |
| lede | Uma casa antiga de Torres Vedras está a ser restaurada para receber hóspedes. | An old house in Torres Vedras is being restored to welcome guests. |
| status | Abre brevemente. | Opening soon. |
| action | Entrar na lista de espera | Join the waiting list |
| list title | Lista de espera | Waiting list |
| list sentence | Deixe-nos o seu email e avisamos quando abrirmos. | Leave your email and we will let you know when we open. |
| consent | Aceito receber emails de A Brazileira sobre a abertura. Ler a nota de privacidade. | I agree to receive emails from A Brazileira about the opening. Read the privacy notice. |
| button | Entrar na lista · A enviar… | Join the list · Sending… |
| success | Obrigado. Avisamos quando abrirmos. | Thank you. We will let you know when we open. |
| invalid email | Verifique o email. | Please check the email address. |
| consent missing | Confirme que aceita receber emails. | Please confirm you agree to receive emails. |
| send error | Não foi possível enviar. Tente de novo dentro de momentos. | We could not send it. Please try again in a moment. |
| no JS | Para se inscrever, ative o JavaScript ou escreva para inn@abrazileira.com. | To sign up, please enable JavaScript or write to inn@abrazileira.com. |
| drawing | Desenho de uma entrada em arco de pedra, com portas duplas de madeira. | Drawing of an arched stone entrance with double wooden doors. |
| footer | © 2026 A Brazileira · Torres Vedras, Portugal · Privacidade | … · Privacy |
| 404 | Esta página não existe. · Voltar ao início | This page does not exist. · Back to home |

The only contact on the site is inn@abrazileira.com (privacy notice and the no-JS line).
Open Graph: `assets/img/og.png`, 1200 × 630, Noite (lockup + lit entrance, doors ajar); kept as shipped,
`src/og.py` can redraw it from the real components.

## Accessibility (extension)
WCAG 2.2 AA (see the contrast matrix; reading text 7:1 and above). One h1 per page. Landmarks: header, main,
footer, nav (language), group (theme), section (waiting list, labelled by its h2). Skip link is the first Tab
stop. Tab order (home): skip, Dia, Noite, PT, EN, action, email, consent, privacy link, button, footer link;
the scroll cue and the honeypot are out of the order. Focus ring visible on every ground (also on the drawn
checkbox). Drawing: `role="img"` with a short description; its parts are presentational. Form: real labels,
`aria-invalid` + `aria-describedby` inline messages, focus to the first invalid field, `role="status"` for
sending outcomes, `aria-busy` while sending, 44px targets. `prefers-contrast: more` lifts muted text and
detail lines; forced colours turn the drawing into a clean CanvasText line drawing and hide the light
layers; print drops the pinning, the top bar, the scroll cue and the form. Keyboard and the sequence: the
action and Tab land on the email field with the list in view (no replay of the sequence); focusing anything
in the first screen mid-sequence rewinds to the rest state, so focus is never on an invisible element.

## Implementation notes (extension)
- Source: `src/` (build.py, scene.py, hand.py, site.css, site.js, tokens.tpl.css, noite.css, styleguide.py,
  og.py, `assets/` with the emblem, fonts, icons, favicon and og.png, `tests/`). `python3 src/build.py`
  rebuilds `docs/` completely; every path is relative to `build.py`, nothing is read from outside `src/`.
  `scene.py` models the doorway in metres and projects it; `hand.py` turns every edge into seeded pen and
  brush geometry (see Components › entrance). The build is deterministic.
- Tests (Playwright + Chromium, never touching the real endpoint): `node src/tests/reverse-scroll.test.js docs`
  (the reverse-scroll / overscroll / toolbar regression, 40 checks) and `node src/tests/cta.test.js docs`
  (the action jumps without replaying the sequence and focuses the email; click, Enter, Tab, reduced motion).
- Output: `docs/index.html`, `docs/en/index.html`, `docs/privacidade/index.html`, `docs/en/privacy/index.html`,
  `docs/404.html`, `docs/design/index.html` (noindex, unlinked styleguide), `assets/css/tokens.css`,
  `assets/css/site.css`, `assets/js/site.js`, fonts, images, `favicon.svg`, `robots.txt`, `sitemap.xml` (home
  and privacy, with hreflang), `site.webmanifest`, `.nojekyll`.
- Cache busting: the build stamps every local CSS/JS URL with `?v=<sha256 prefix>` (GitHub Pages caches for
  10 minutes; this keeps HTML and CSS/JS in step).
- Internal URLs are relative (served under `/abrazileira/` now, `/` later); canonical, hreflang and OG are
  absolute `https://abrazileira.com/…`. No cookies, no analytics; the only third-party request is the form
  submit to Supabase (EU).
- Raw hex appears only in tokens.css, plus what cannot read CSS: the two `theme-color` metas, the manifest and
  favicon.svg.
- Budget, measured on the home page with gzip -9 (fonts as shipped): 147.0 KB — HTML 57.9, CSS 13.9 (tokens 5.6, site 8.3), JS 7.5, fonts 67.7 (woff2 as shipped); limit 170 KB (og and
  icons excluded). The drawing is inline SVG (the caderno line work is most of the HTML). CLS 0 on every page
  (the wrapper grows below the fold). LCP is text.

## Iteration guide
1. Change one component at a time and name its token.
2. New values go into tokens.css first (primitive, then role); components read roles only.
3. Re-measure the contrast matrix after any colour change (the hall surface too).
4. Keep the logo untouched; new pages reuse `.lockup`.
5. Keep tracked capitals inside the logo and sentence case everywhere else.
6. Change the drawing in `src/scene.py` (metres, one-point perspective), never by hand in the HTML.
7. Change the sequence in the table in `src/site.js` (element, p range, curve, values) and the curves in
   tokens.css (`--curve-*`); keep it transform and opacity only, re-record it (frame by frame) at 390 and
   1440, both themes, and re-run `src/tests/` and the 4× CPU trace (no frame over 50ms, p95 ≤ 20ms).
8. Any new layer whose opacity changes per frame joins the promotion list in site.js (`LAYERS`).
9. Re-run the copy check (banned words, privacy) after any text change.
10. Prefer more space over more ornament.

## Agent prompt guide
- Canvas papel #F9F0E9 / noite #1C120B · hall #F2DEC4 / #FCE7BC · text nogueira #5F3819 / linho #F3E6D6 ·
  strongest tinta #2E1E14 · muted castanho #804F1E / linho-escuro #C2AE96 · brass text latao-texto #83602C
  by day, latao #DB9E42 by night · errors barro #9E3B1E on the hall only.
- "A control in the A Brazileira system: Cormorant Garamond 500, 16px, sentence case, colour
  `--color-text-muted`, 44px target, current state = `--color-text-strong` with a 1px underline 0.3em below,
  focus = 2px solid `--color-focus`, offset 3px."
- "A form on the hall: `.surface-hall`, 26rem column, 18px labels above 48px square fields (papel by day,
  luz-nucleo by night, 1px nogueira), a full-width 48px tinta button with papel text, errors in barro 15px under the field with
  aria-invalid/aria-describedby, outcomes in a role=status line."

## Roadmap and known gaps
- Real-device pass on iOS Safari (17–26) and Android Chrome for the single driver, rubber-band overscroll and
  the collapsing toolbar: the headless runs above use Chromium only (WebKit was not available here), and the
  iOS overscroll is emulated in the regression test, not reproduced.
- Raster figures above come from headless Chromium with software raster; real GPUs raster faster, phones
  with little GPU memory may need the promotion list trimmed (it is 7 layers plus the two leaves).
- Real photography of the house once restored (not before; the drawing must not become the façade).
- Content pages (rooms, ground floor, contacts) reuse these tokens and the hall surface.
- Cinzel could be subset further to capitals only (about 30 KB saved).
- A double opt-in email and an unsubscribe link belong to the sending tool, not this page.
- Domain: canonical points to abrazileira.com; the .pt redirect is outside this repository.
