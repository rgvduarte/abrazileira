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
  color-hall: "latao 22% in papel (#F2DEC4) / luz-nucleo 72% in luz (#FCE7BC)"   # the lit hall: waiting-list surface
  # the hall surface re-points the roles for its subtree (.surface-hall), the same in both themes
  hall-text-strong: tinta
  hall-text: nogueira
  hall-text-muted: castanho
  hall-field: papel
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
  entrance:
    lineWeights: "1.25px contour, 0.75px detail (non-scaling)"
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
logo in roman capitals, one sentence, one action, and a doorway drawn in ink that opens a little.

**Dia** is paper and limestone in sunlight: flat papel ground, walnut doors, brass knobs, a faint cast
shadow on the plaster. **Noite** is the same drawing after dark: walnut-black ground, the doors and stone
gone dark, and lamplight coming through the gap, the fanlight and the wall lantern. The page follows the
visitor's system theme; the Dia · Noite control overrides it and remembers the choice.

Scrolling is the one journey on the page: the doors swing open, the hall lights up, the view walks in
through the doorway, and the hall's light becomes the ground of the waiting list. The hall surface is light
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
- Motion: the doors ease ajar once on load (1.1s); one scroll-linked sequence opens them into the waiting
  list; Dia ↔ Noite cross-fades in 400ms.

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
- **Papel** (`--papel` #F9F0E9): day canvas; the fill of form fields on the hall. Never pure white.
- **Areia** (`--areia` #F0DFCF): lit stone and glass in the drawing; skip-link surface. Not a text colour.
- **Pedra** (`--pedra` #DECDBD): limestone face in the drawing; base of the night line colours.
- **Castanho** (`--castanho` #804F1E): walnut door face by day; muted text (6.11:1 on papel).
- **Nogueira** (`--nogueira` #5F3819): text, focus ring, floor line, drawing ink and field borders (9.03:1).
- **Tinta** (`--tinta` #2E1E14): the wordmark, the strongest text and the button (14.23:1).
- **Latão** (`--latao` #DB9E42): brass hardware by day (ornament only, 2.08:1 on papel); text, emblem and focus
  by night (7.87:1).
- **Oliva / Azulejo**: olive leaves only. Never text, never interface.
- **Barro** (`--barro` #9E3B1E): form errors on the hall surface only (text and the invalid field edge).

### Surface
Three surfaces: `--color-bg` (papel / noite), `--color-hall` (the lit hall: #F2DEC4 by day, #FCE7BC by night)
and `--color-surface` (areia / dark stone), which appears only under the focused skip link. The hall is the
waiting list, the footer of the home page, and the flood that fills the screen at the end of the door
sequence; `.surface-hall` re-points the semantic roles for its subtree so components inside it need no
special colours. No cards, no panels, no glass.

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
| Hall | Typed text | tinta | papel (field) | 14.23:1 | text |
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
- **Waiting list**: a full-height hall section (`min-height: 100svh`), one centred column of 26rem.
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
| drawing | perspective, flat shading by light direction, lamplight gradients at night | the entrance only |
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
Hover (fine pointer): `--color-text`. Pressed: `scale(0.97)`, 160ms. With motion allowed the jump is a smooth
scroll, so the door sequence plays on the way down; with reduced motion it jumps. Either way the next Tab
lands on the email field.

**`porta`** (the door sequence): `.porta` > `.porta__stage` (sticky) > `.porta__frame` (the first screen,
100svh) + `.porta__flood`. Without JS or with reduced motion it is just the first screen. See Motion.

**`entrance`** (the drawing): an original generic Portuguese doorway, modelled in metres and projected in
one-point perspective (eye 1.55m, 6m away): two limestone steps, a moulded jamb surround with plinths, impost
blocks, 11 voussoirs and a keystone, the wall thickness shown as a reveal and soffit, a walnut double door
(two raised-and-fielded panels per leaf, brass knobs, hinge knuckles, escutcheon) under a transom and a radial
fanlight, a square iron wall lantern on a scrolled arm, and a young olive tree in a stone pot. Line system:
1.25px contour, 0.75px detail, round joins, non-scaling. Generated by `src/scene.py`; colours only through
`--i-*` tokens. Layers, back to front:
1. back svg: the hall behind the door plane (room, floor, the night glow);
2. `.hall`: HTML light layers inside the opening (`.hall__dawn`: first warmth by day; `.hall__light`: the lit
   hall, flat by day, a lamplight gradient at night; `.hall__floor`);
3. front svg: everything else, including the pendant lamp, so the light never hides it;
4. `.spill`: lamplight on the threshold and steps (Noite), clipped to the steps' silhouette in the markup;
5. `.door`: the two leaves, HTML layers rotated with CSS 3D in the drawing's own perspective (`perspective`
   and `perspective-origin` generated from the model). Each leaf is a hinge (`.leaf`, the scroll swing) holding
   a face (`.leaf__face`, the ajar angle and the load animation); the two rotations add up.
Only the HTML layers move, so the drawing is never repainted while the page scrolls.

**`waiting list`** (`#lista`, `.lista.surface-hall`): h2 «Lista de espera» / «Waiting list» (title), one
sentence (lede), the form, and a `<noscript>` line. It rises in once (opacity + 24px, 700ms) when it enters
the screen.

**`form`** (`[data-waitlist]`, `novalidate`; states on `data-state`):
- Fields: «Email» label above a 48px input (`type=email`, `autocomplete=email`, `inputmode=email`,
  `required`, papel fill, 1px nogueira border, square); the consent checkbox (required): a real
  `<input type=checkbox>` laid invisibly over a drawn 24px box, so it keeps native semantics, focus and a
  44px hit area; the label links to the privacy notice. A honeypot field (`website`) sits off-screen,
  `aria-hidden`, `tabindex=-1`, `autocomplete=off`.
- Button: full width, 48px, tinta fill, papel text, square. Hover (fine pointer): nogueira. Pressed:
  `scale(0.97)`, 160ms. Its two labels share one grid cell, so «A enviar…» never changes its size.
- **idle**: as above. **invalid** (client check, or the server's 400 `invalid_email` / `consent_required`):
  the field gets `aria-invalid="true"`, a 2px barro edge and an inline message in barro 15px below it, tied
  with `aria-describedby`; focus moves to the first invalid field; the message clears as soon as the value is
  fixed. **sending**: `aria-busy` on the form, `aria-disabled` on the button (focus stays on it), label
  «A enviar…» / «Sending…», further submits ignored. **success**: the fields give way to «Obrigado. Avisamos
  quando abrirmos.» in the form's own height (nothing around it moves), in a `role="status"` region that
  receives focus. **error** (network, timeout after 10s, any other status): «Não foi possível enviar. Tente de
  novo dentro de momentos.» in barro in the status region, fields kept. **honeypot filled**: success shown,
  nothing sent. **no JS**: the fieldset is disabled (55% opacity) and the `<noscript>` line reads «Para se
  inscrever, ative o JavaScript ou escreva para inn@abrazileira.com.»
- Messages animate in with opacity + 4px (200ms, `--ease-out`); the success sentence with opacity + 8px (400ms).
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
The first screen sits in a tall wrapper: the stage is `position: sticky` and stays pinned for
`--porta-run` (140svh) of scroll. Scroll progress p (0 → 1 across that stretch) drives every layer, each over
its own sub-range and curve (curves from easings.net). Scrolling back up reverses everything.

| Element | Role | p range | Motion | Curve |
|---|---|---|---|---|
| Text column (lockup, lede, status, action) | Support, exits | 0 → 0.20 | opacity 1 → 0, rises 24px | easeOutCubic (0.33, 1, 0.68, 1) |
| Scroll cue | Decoration | 0 → 0.06 | opacity 1 → 0, drops 6px | easeOutCubic |
| Left leaf | Lead | 0.04 → 0.50 | +47° (41° → 88°) | easeInOutCubic (0.65, 0, 0.35, 1) |
| Right leaf | Lead | 0.08 → 0.52 | +55° (27° → 82°) | easeInOutCubic |
| Hall, first warmth (Dia) | Support | 0.06 → 0.30 | opacity 0 → 1 (amber: latão 55% in castanho) | easeInOutSine (0.37, 0, 0.63, 1) |
| Hall lit | Support | 0.20 → 0.52 | opacity 0 → 1 | easeInOutSine |
| Light on the steps (Noite) | Support | 0.14 → 0.56 | opacity 0 → 1 | easeInOutSine |
| Camera: pan | Lead | 0.04 → 0.56 | the doorway's centre travels to the screen's centre | easeInOutSine |
| Camera: walk-in | Lead | 0.18 → 1 | scale 1 → S around the doorway, geometric (constant perceived speed) | easeInOutSine on log(scale) |
| Flood | Support | 0.80 → 1 | the hall colour covers the stage, opacity 0 → 1 | easeInOutSine |
| Waiting list | Entrance, once | on entering the screen | opacity 0 → 1, rises 24px, 700ms | `--ease-out` |

Relationships: the text leaves as the doors begin (together: it makes room); the right leaf trails the left
by 0.04 (two leaves, never a metronome); the pan starts with the swing and the walk-in overlaps the last half
of it, so it reads as one gesture; the light follows the leaves; the flood lands with the end of the walk-in;
the list arrives on the same colour. Nothing else moves: the top bar simply scrolls away, the lockup is never
animated, the drawing's stone, lantern and tree only travel with the camera.

S (the final zoom) is computed from the layout: portrait screens end with the opening covering the screen;
landscape screens end with the opening filling the height (between 1.1× and 1.5×), so the hall and its lamp
stay in view and the flood finishes the passage instead of an extreme zoom.

### Drivers (why)
- **Preferred: Web Animations on a `ViewTimeline`** (`rangeStart: contain 0%`, `rangeEnd: contain 100%` of the
  wrapper), one animation per layer, keyframes generated from the table. It runs on the compositor, in step
  with the scroll (no JS per frame): the smoothest option on Chrome Android, and on iOS Safari 26+ where
  the same API exists (not yet checked on a device).
  After setting up, site.js checks that the timeline's progress matches its own; if not, it falls back.
- **Fallback (iOS Safari before 26, Firefox):** one passive scroll listener, one `requestAnimationFrame` per
  frame, which reads `pageYOffset` only and writes `transform` / `opacity` straight onto each element (never
  through inherited custom properties). Geometry (one rect, sizes) is read on resize only.
- **Crisp vectors at any zoom:** no permanent `will-change`. In the fallback the zooming layer gets
  `will-change: transform` only while it moves (dropped 180ms after the last frame). With the timeline, when
  scrolling rests for 220ms past p = 0.3 the camera is handed to an identical static transform, so the browser
  re-rasterises the drawing at its real size; the next scroll hands it back. Verified in screenshots at
  DPR 3 at p = 0.70, 0.85, 0.95 (no softening on lines or edges).
- Mobile toolbars: the stage is `100lvh` tall and the composition lives in its top `100svh`, so a collapsing
  toolbar never uncovers anything; the camera targets the small-viewport centre, so it does not jump when the
  toolbar moves. Screens too short for the first screen (320 × 640, 667 × 375) first scroll it into full view,
  then pin (`--stick`, a negative sticky offset), so nothing is cut off.

### Other motion
| Token | Duration | Easing | Use |
|---|---|---|---|
| `--dur-door` | 1100ms (+200ms delay) | `--ease-door` cubic-bezier(.3,.1,.2,1) | leaves rotate 0 → 41° / 27° once on load |
| (light) | 1100ms | `--ease-out` | hall glow, light pool, lit leaf edges fade in with the doors (Noite) |
| `--dur-theme` | 400ms | `--ease-out` | Dia ↔ Noite: View Transitions cross-fade; colour transitions as fallback |
| `--dur-reveal` | 700ms | `--ease-out` | the waiting list rises in, once |
| `--dur-state` | 200ms | `--ease-out` | form messages, checkbox tick (opacity + scale 0.8 → 1) |
| `--dur-press` | 160ms | `--ease-out` | action and button: `scale(0.97)` while pressed |
| `--dur-ui` | 160ms | `--ease-out` | control and link colour on hover |

### Fallbacks
- `prefers-reduced-motion: reduce`: no pinning and no scroll-linked motion, no load animation, no list
  rise; the doors stand open and the hall is lit (the final state, without the travel); the action jumps to
  the list (`scroll-behavior` stays `auto`). Measured: 0 running animations, page = first screen + list.
- No JS: no pinning (the tall wrapper exists only with `.porta-on`, which site.js adds), doors ajar, theme
  follows the system, the list is visible with a disabled form and the `<noscript>` line.
- Keyboard: Tab from the action lands on the email field with the list in view; focusing anything in the
  pinned first screen mid-sequence rewinds to the rest state, so focus is never on an invisible element.

### Measured
Playwright (Chromium 153), wheel-scrolling the whole sequence down and up (about 380 frames per run) under
CPU throttling, at 390 × 844 (DPR 3) and 1440 × 900, Dia and Noite, both drivers: 4× — 60 fps, p95 frame
16.7–16.8ms, 0 long tasks, 0 long animation frames; at most 1 single dropped frame (33ms) per run. With a
700ms rest at p = 0.7 (the camera hand-back and re-raster): 0–3 single dropped frames, 0 long tasks.
6× — 60 fps, no dropped frames.
Real devices are still to be checked (see Roadmap).

## Dia & Noite (extension)
`[data-theme]` on any element scopes a theme to that subtree (the styleguide shows both side by side); the
semantic block for Noite is written once in `src/noite.css` and emitted twice by the build (system preference
unless Dia was chosen, and the manual choice). Illustration roles that change: stone, wood, glass, hall, iron,
pot, trunk, leaves, line colours, `--i-hall-dawn` (amber by day, none at night), `--i-hall-light` (flat hall by
day, lamplight gradient at night), `--i-hall-floor`, `--i-spill` (none by day); `--o-night` (lamplight layers),
`--o-turn` (a turned leaf darkens by day), `--o-cast` (cast shadow by day only). `--color-hall` changes too
(daylight sand, lamplight cream); the hall's ink does not.

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
layers; print drops the pinning, the top bar, the scroll cue and the form.

## Implementation notes (extension)
- Source: `src/` (build.py, scene.py, site.css, site.js, tokens.tpl.css, noite.css, styleguide.py, og.py,
  `assets/` with the emblem, fonts, icons, favicon and og.png). `python3 src/build.py` rebuilds `docs/`
  completely; every path is relative to `build.py`, nothing is read from outside `src/`.
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
- Budget, measured on the home page with gzip -9 (fonts as shipped): 114.1 KB — HTML 28.7, CSS 11.6
  (tokens 4.5, site 7.1), JS 6.1, fonts 67.6; limit 170 KB (og and icons excluded). CLS 0 on every page
  (the wrapper grows below the fold). LCP is text.

## Iteration guide
1. Change one component at a time and name its token.
2. New values go into tokens.css first (primitive, then role); components read roles only.
3. Re-measure the contrast matrix after any colour change (the hall surface too).
4. Keep the logo untouched; new pages reuse `.lockup`.
5. Keep tracked capitals inside the logo and sentence case everywhere else.
6. Change the drawing in `src/scene.py` (metres, one-point perspective), never by hand in the HTML.
7. Change the sequence in the table in `src/site.js` (element, p range, curve, values); keep it transform and
   opacity only, and re-record it (frame by frame) at 390 and 1440, both themes.
8. Re-run the copy check (banned words, privacy) after any text change.
9. Prefer more space over more ornament.

## Agent prompt guide
- Canvas papel #F9F0E9 / noite #1C120B · hall #F2DEC4 / #FCE7BC · text nogueira #5F3819 / linho #F3E6D6 ·
  strongest tinta #2E1E14 · muted castanho #804F1E / linho-escuro #C2AE96 · brass text latao-texto #83602C
  by day, latao #DB9E42 by night · errors barro #9E3B1E on the hall only.
- "A control in the A Brazileira system: Cormorant Garamond 500, 16px, sentence case, colour
  `--color-text-muted`, 44px target, current state = `--color-text-strong` with a 1px underline 0.3em below,
  focus = 2px solid `--color-focus`, offset 3px."
- "A form on the hall: `.surface-hall`, 26rem column, 18px labels above 48px square fields (papel, 1px
  nogueira), a full-width 48px tinta button with papel text, errors in barro 15px under the field with
  aria-invalid/aria-describedby, outcomes in a role=status line."

## Roadmap and known gaps
- Real-device pass on iOS Safari (26 for the timeline driver, 17–18 for the fallback) and Android Chrome:
  the headless runs above use Chromium only; WebKit was not available here.
- Real photography of the house once restored (not before; the drawing must not become the façade).
- Content pages (rooms, ground floor, contacts) reuse these tokens and the hall surface.
- Cinzel could be subset further to capitals only (about 30 KB saved).
- A double opt-in email and an unsubscribe link belong to the sending tool, not this page.
- Domain: canonical points to abrazileira.com; the .pt redirect is outside this repository.
