---
version: alpha
name: A Brazileira · Boutique Hotel
description: >-
  A coming-soon page for a boutique hotel in Torres Vedras, Portugal, and step 1 of its design system.
  The canvas is warm paper (papel #F9F0E9), never white, and by night a walnut dark (noite #1C120B), never
  black. The voice is the client's original logo: a crowned B in a laurel wreath over A BRAZILEIRA /
  BOUTIQUE HOTEL / TORRES VEDRAS in Cinzel roman capitals; what the house says is set in Alegreya and the
  interface in Alegreya Sans, both in sentence case. Brass (latão) is ornament and logo by day and light by night. Two surface worlds, Dia and Noite,
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
    fontFamily: "Alegreya, 'Alegreya title fallback', 'Times New Roman', serif"
    fontSize: "clamp(1.625rem, 1.4rem + 0.9vw, 2.125rem)"   # 26 -> 34px
    fontWeight: 400
    lineHeight: 1.18
    letterSpacing: -0.01em
  lede:                       # the sentence; the list sentence; the privacy intro; the 404 lines; the thank-you
    fontFamily: "Alegreya, 'Alegreya lede fallback', 'Times New Roman', serif"
    fontSize: "clamp(1.125rem, min(0.84rem + 1.43vw, 3.2svh), 1.625rem)"   # 18 (320) -> 19 (390) -> 26px
    fontWeight: 400
    lineHeight: "calc(1em + 0.45rem)"   # 19/26, 26/33
    letterSpacing: -0.005em
  read:                       # privacy notice body; the email the guest types; the no-JS line
    fontFamily: "Alegreya, 'Alegreya fallback', 'Times New Roman', serif"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.5556        # 18/28
    letterSpacing: 0
  consent:
    fontFamily: "Alegreya, 'Alegreya consent fallback', 'Times New Roman', serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  cta:                        # the one action and the button
    fontFamily: "'Alegreya Sans', 'Alegreya Sans cta fallback', Arial, sans-serif"
    fontSize: "16px below 900px, 18px from 900px"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "0.018em / 0.015em"
  ui:                         # Dia · Noite, PT · EN (0.06em), status, labels, messages, section names, footer
    fontFamily: "'Alegreya Sans', 'Alegreya Sans fallback', Arial, sans-serif"
    fontSize: 16px
    fontWeight: 500
    lineHeight: "1.25 one line, 1.5 multi-line"
    letterSpacing: 0.018em
    fontVariantNumeric: lining-nums

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
    decoration: "underline 1px, offset 0.28em"
    typography: "{typography.cta}"
    minHeight: 44px
    pressed: "scale(0.97), 160ms"
  lede:
    textColor: "{colors.color-text}"
    typography: "{typography.lede}"
    maxWidth: 20em
  status:
    textColor: "{colors.color-accent-text}"
    typography: "{typography.ui}"
  footer:
    textColor: "{colors.color-text-muted}"
    typography: "{typography.ui}"
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
    typography: "{typography.read}"   # Alegreya 400, lining figures
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
    typography: "{typography.ui}"
---

# A Brazileira · DESIGN.md

## Overview

A Brazileira reads like the hotel's own card left on a stone step: warm paper, the gold crest of the original
logo in roman capitals, one sentence, one action, and a doorway drawn in ink that opens a little. The doorway
is a page of an architect's travel sketchbook (the "caderno" style the client chose): a quick, sure pen line,
economical hatching for shade and loose watercolour washes, all baked into vector geometry.

**Dia** is paper and limestone in sunlight: flat papel ground, walnut doors, brass knobs, a faint cast
shadow on the plaster. **Noite** is the same drawing after dark: walnut-black ground, the doors and stone
gone dark, and lamplight coming through the gap, the fanlight and the wall lantern. Until the visitor chooses,
the page keeps the hour of the house: Dia while the sun is up over Torres Vedras, Noite after sunset, so the
lantern is lit when it really is (without JavaScript it follows the system theme). The Dia · Noite control
overrides it and remembers the choice.

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
- One voice in two cuts: Alegreya 400 for what the house says, Alegreya Sans 500 for the interface (same
  designers, same skeleton), roman, sentence case. Tracked capitals exist only in the logo.
- One accent: brass, `{colors.latao-texto}` by day (5.08:1), `{colors.latao}` by night (7.87:1).
- One action on the first screen: «Entrar na lista de espera» / «Join the waiting list».
- Square corners everywhere; the only radius is the 2px corner of the focus ring.
- Depth comes from the drawing alone (perspective, light), never from interface shadows.
- Motion: the doors ease ajar once on load (1.1s); one scroll-linked sequence (144svh, one plain-JS driver)
  opens them into the waiting list; the hero action plays the same walk-in on its own (1.5s, any input stops
  it) and lands in the email field; Dia ↔ Noite cross-fades in 400ms.

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
- **Cinzel** 400 / 600 / 700, latin subset, self-hosted woff2 (12.5 / 13.6 / 13.6 KB), byte-identical to the
  original logo files. Logo lockup only.
- **Alegreya** 400 (Huerta Tipográfica), roman only: every sentence the house says (lede, titles, the list
  sentence, the consent, the privacy notice) and the email a guest types. 12.5 KB.
- **Alegreya Sans** 500, roman only: the interface (Dia · Noite, PT · EN, status, the action, labels, messages,
  the button, section names, the footer). 9.0 KB. The sans is the serif without its serifs, so the page speaks
  with one voice; it was chosen over the Garamond because it is calligraphic and humane, not a template face.
- Subset to Latin + Portuguese (ASCII, nbsp, © ª « ° · º », À-Ã Ç-Ê Í Ñ Ó-Õ Ú Ü and lower case, – — ‘ ’ “ ” • … €),
  layout features `kern`, `liga` (fi, fl, Th only) and `lnum`, unhinted. No italic, no bold: one file per
  family, `font-synthesis: none`. Licences: `assets/fonts/OFL-*.txt` (neither name is reserved, so subsetting
  is allowed).

### Hierarchy (computed, Chromium)

Four text sizes outside the logo, nothing under 16px. Squint order on every width: lockup > lede > action >
status and controls.

| Token | Family | 320px | 390px | 1440px | Weight | Line height | Tracking | Use |
|---|---|---|---|---|---|---|---|---|
| wordmark | Cinzel | 28px | 28px | 55px | 600 | 1.05 | 0.045em | A BRAZILEIRA |
| kind | Cinzel | 14px | 14px | 27.5px | 700 | 1.05 | 0.12em | BOUTIQUE HOTEL |
| place | Cinzel | 11.2px | 11.2px | 22px | 400 | 1.05 | 0.3em | TORRES VEDRAS |
| title | Alegreya | 26px | 26px | 34px | 400 | 1.18 | −0.01em | Lista de espera, Nota de privacidade |
| lede | Alegreya | 18px | 19px | 26px | 400 | 1em + 7.2px (25.2 / 26.2 / 33.2px) | −0.005em | the sentence, the list sentence, the privacy intro, 404, thank-you |
| read | Alegreya | 18px | 18px | 18px | 400 | 28px | 0 | privacy notice; the email field (lining figures) |
| consent | Alegreya | 16px | 16px | 16px | 400 | 24px | 0 | the consent line |
| cta | Alegreya Sans | 16px | 16px | 18px | 500 | 1.25 | 0.018em / 0.015em | the action, the button, «Voltar ao início» |
| ui | Alegreya Sans | 16px | 16px | 16px | 500 | 20px / 24px | 0.018em (PT · EN 0.06em) | Dia · Noite, PT · EN, status, labels, messages, section names, footer |

From 1920px the root size grows to 112.5% (131.25% from 2560px): everything scales together, never more
content. The field is 18px, never below 16px, so iOS Safari does not zoom on focus.

### Principles
- What the house says is serif; what you operate is sans. Never Alegreya for controls, labels or buttons.
- The status is quieter than the action by colour (brass, not ink, no underline) and space (8px under the
  sentence, 16px / 24px before the action), never by weight. The lede leads by size: 19px over a 16px action
  on phones, 26px over 18px from 900px.
- Figures: old-style in the serif (art. 6.º, 24 meses), lining in the interface and the field (© 2026).
- Tracked capitals live only inside the logo; PT and EN get 0.06em because capitals need air.
- Line breaks by rule, not by luck: `text-wrap: balance` on the ledes and titles; on 320–359px phones the
  Portuguese lede is set one phrase a line («Uma casa antiga de Torres Vedras / está a ser restaurada / para
  receber hóspedes.»: a plain wrap at 14.4em, with «para receber hóspedes» tied); `text-wrap: pretty` on
  reading text; no hyphenation anywhere (the privacy notice is read word by word). Ties at build time
  (`nb()` in build.py): «A Brazileira», «Torres Vedras», «© 2026», and every one-letter word holds to the next
  («e avisamos», «a ser»). «nota de privacidade» never splits and sits on its own line under the consent.
- Below 480px the footer sets «© 2026 A Brazileira» / «Torres Vedras, Portugal» / «Privacidade» on three lines.
- Quotes: «» in Portuguese, “” in English (`q:lang()`). Noite text uses grayscale smoothing on macOS.
- Height-aware sizes (`svh` inside `min()`) keep the lockup and lede in one screen on short laptops.

### Font loading and fallbacks
All five files are `font-display: swap`; Cinzel 600, Alegreya and Alegreya Sans are preloaded. Cinzel's
fallbacks are unchanged (Times / Liberation Serif: 400 `size-adjust 100.19%`, 600 `97.12%`, 700 `105.16%`).
Alegreya and Alegreya Sans have one local fallback per role (Times New Roman / Arial, or the metric-compatible
Liberation and Tinos / Arimo), sized so each role's own strings set to the web font's width in Chromium, with
English variants where the sentence differs (`[lang|=en]` swaps the stacks): lede 101.8 / 99.6%, list 100.4 /
97.0%, intro 101.15 / 101.0%, title 101.3%, consent 100.2%, reading 100.9 / 100.71%; sans: interface 85.25%,
action 86.0 / 90.0%, status 88.5 / 87.05%, back link 88.6 / 86.75%, footer name 87.62%, place 86.2%,
separators 63.8%, footer link 88.05 / 86.06%. Ascent and descent overrides carry Alegreya's 1.016 / 0.345 and
Alegreya Sans' typo 0.8 / 0.2 through the size-adjust. The privacy notice body uses the same Alegreya file
under a second name with `font-display: optional` («Alegreya Text»): preloaded, so it is there on a normal
load, and on a slow first visit the long paragraphs stay in their fallback for that view instead of
re-wrapping around their links. Checked with every woff2 held back 2s: CLS 0 on home PT/EN, privacy PT/EN and
404 at 320×568, 360, 375, 390, 430, 844×390, 768, 1024, 1280, 1440 and 1920, motion on and off; and the fallback
layout matches the web font (no line-count change, no text start moving 3px or more) at about 200 widths from
320 to 2560px. Regenerate the values after any copy change (they follow the strings).

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

**`control`** (`.ctl`, buttons and links): Alegreya Sans 500 16px, tracking 0.018em (PT · EN 0.06em), sentence
case, muted colour, 44 × 44px minimum.
- Default: `--color-text-muted`. Hover (fine pointer only): `--color-text-strong`, 150ms `ease`. Pressed:
  `scale(0.97)`, 160ms `--ease-out` (the same press as the action and the button; none under reduced motion).
- Focus-visible: 2px solid `--color-focus`, offset 3px, 2px corners; never animated.
- Active / current: `--color-text-strong` + 1px underline 0.3em below (state is never colour alone);
  `aria-pressed="true"` for the theme, `aria-current="page"` for the language.

**`theme switch`** (Dia · Noite / Day · Night): two real buttons in `role="group"`; hidden without JS.
A head script sets `data-theme` before the first paint (no flash): the stored choice
(`localStorage["ab-tema"]`) if there is one, otherwise the sky over Torres Vedras now (Torres Vedras time,
see A distinctive touch), marked `data-sol` and never stored. A click stores the choice, which wins from then
on (choosing the theme already shown counts too). `meta[name=theme-color]` follows. Storage is wrapped in
try/catch.

**`language switch`**: two links (`hreflang`, `lang`, `aria-current`); on the privacy notice they point to the
other language's notice.

**`cta`** (`.cta`, «Entrar na lista de espera» / «Join the waiting list» → `#lista`): the only action on the
first screen, a text link-button under the status. Alegreya Sans 500, 16px on phones and 18px from 900px,
tinta / linho, 1px underline 0.28em below, 44px tall.
Hover (fine pointer): see `link`. Pressed: `scale(0.97)`, 160ms `--ease-out`. Click, tap, Enter or Space (it
is drawn as a button, so it answers Space too): the walk-in through the door, 1.5s, then the focus moves to
the email field (`preventScroll`); the scroll cue does the same (see Motion › The walk-in on request). Any
wheel, touch, key or pointer input during the flight stops it where it is. Reduced motion: the same landing
at once. There is no `scroll-behavior: smooth` anywhere. Tab from the action lands on the email field with
the list in view (a jump: keyboard focus never waits for an animation).

**`link`** (`.cta`, `.link`, `.foot__link`, `.link-inline`): the underline is the affordance, 1px, never
removed. Where a pointer can hover, the underline rests in the link's own ink at 45% (`--color-link-line`,
`color-mix` with `currentColor`) and takes the full ink on hover, with the text at `--color-text-strong`:
150ms `ease`, colour only, nothing moves. Touch screens keep the full underline (they never see the hover).
(Before: hover lightened the text, which read as dimming by day and did nothing by night, where text and
strong text are both linho.) The scroll cue darkens to strong ink on hover the same way.

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
is shown at once; during the walk-in on request the entrance plays and finishes as the flight lands (the focus
arriving in the field never cuts it short).

**`form`** (`[data-waitlist]`, `novalidate`; states on `data-state`):
- Fields: «Email» label above a 48px input (`type=email`, `autocomplete=email`, `inputmode=email`,
  `required`, papel fill, 1px nogueira border, square); the consent checkbox (required): a real
  `<input type=checkbox>` laid invisibly over a drawn 24px box, so it keeps native semantics, focus and a
  44px hit area; the label links to the privacy notice. A honeypot field (`website`) sits off-screen,
  `aria-hidden`, `tabindex=-1`, `autocomplete=off`. The field fill is `--color-field-hall`: papel by day,
  luz-nucleo by night (the pink day paper clashed with the lamplight).
- Field and checkbox hover (fine pointer): the 1px line darkens to `--color-text-strong`, 150ms `ease` (not on
  an invalid field, whose barro edge stays); the focus ring stays the focus state.
- Button: full width, 48px, tinta fill, papel text, square. Hover (fine pointer): nogueira. Pressed:
  `scale(0.97)`, 160ms, never while sending (`:active:not([aria-disabled=true])`). Its two labels share one
  grid cell, so «A enviar…» never changes its size.
- **idle**: as above. **invalid** (client check, or the server's 400 `invalid_email` / `consent_required`):
  the field gets `aria-invalid="true"`, a 2px barro edge and an inline message in barro 16px below it, tied
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

**`footer`**: «© 2026 A Brazileira · Torres Vedras, Portugal · Privacidade» (EN «Privacy»), Alegreya Sans
16/24px muted, lining figures; the link is 44px tall. Below 480px name, place and link take a line each (no
dangling separator).

**`privacy notice`** (`privacidade/`, `en/privacy/`): same top bar and tokens; the lockup (24px) as home
link; h1 title (Alegreya 26–34px); a short intro in lede size; eight short sections (section name in Alegreya
Sans 500 16px + one Alegreya paragraph at 18/28px, measure 26.5em, no hyphenation):
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

### The walk-in on request (the hero action and the scroll cue)
The client: «mesmo quando carregas só em entrar na waiting list, esse flow tem de ser fluido e para se notar
que se entra pela porta, mas não muito demorado nem muito rápido». This replaces the former instant jump.

- **Still one driver.** The same rAF loop writes the scroll position itself (`window.scrollTo` per frame, never
  native smooth scroll) and the scene follows it through the same smoothing as a hand scroll, so the doors
  swing, the hall lights and the camera walks in exactly as under the finger. The first frame moves nothing
  (the layers are promoted in it), the travel starts on the next.
- **It eases the visual journey, not the distance.** Each pixel of the way weighs 1 + `--flight-weight` (2) ×
  the walk-in's change of (log) scale over it; the time curve `--curve-flight` (0.45, 0, 0.3, 1: soft start,
  long gentle settle) runs over that weighted way (a 96-step table built once per flight). Easing the plain
  distance was tried first and failed by eye: the peak speed fell in the doorway, the walk-in took 250ms and
  the list's plain rise took half the flight. Weighted, the time splits into thirds that read as one gesture:

  | Beat (from the click) | 390 × 844 | 1440 × 900 |
  |---|---|---|
  | Text leaves (intro opacity → 0.1) | 0–340ms | 0–330ms |
  | Doors open, doorway centred | 0–620ms | 0–600ms |
  | Walk-in: scale 1.6 → 4.9 (390) / 1.6 → 7.6 (1440) | 640–1040ms | 590–990ms |
  | List title enters, rises and settles; form follows | 1040–1530ms | 1040–1500ms |
  | Focus in the email field (`preventScroll`) | 1500ms | 1500ms |

- **Duration** `--dur-flight` 1500ms for the whole way from the rest state; a shorter way is shorter
  (× √share, never under 35%). The way is the same share of the sequence at every size (about 2 screens), so
  390 and 1440 both fly 1.48–1.50s; tuned by eye on recorded video at 390 × 844 and 1440 × 900, Dia and Noite.
- **Interruptible.** `wheel`, `touchstart`, `pointerdown` or `keydown` (capture, passive), or a scroll that is
  not the flight's own (more than 4px from what it wrote), ends it at once: the page stays where it is, in the
  visitor's hands, the focus is not moved.
- **Lands** on the list's rest position (`#lista` top, the same place as the anchor and Tab), with the title and
  the email field in view; the list content's entrance plays during the flight and has finished by then. The
  focus moves to the email field with `preventScroll`; the field sits in the region named «Lista de espera»,
  so a screen reader announces where it arrived, politely, without a live region.
- **Never animated:** `prefers-reduced-motion: reduce` (the same landing at once, focus in the field), a
  `#lista` link on load (a jump), Tab into the form (a jump), no JS (a plain anchor). Scrolling back up after
  a flight returns the hero to its exact rest state (tested).

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
| `--dur-flight` | 1500ms (whole way) | `--curve-flight` (0.45, 0, 0.3, 1) over the weighted way (`--flight-weight` 2) | the hero action and the scroll cue walk in through the door to the list |
| `--dur-press` | 160ms | `--ease-out` | action and button: `scale(0.97)` while pressed |
| `--dur-ui` | 150ms | `ease` | control and link colour on hover; a link's underline 45% → full ink; field and checkbox line darkens |

### Fallbacks
- `prefers-reduced-motion: reduce`: no pinning and no scroll-linked motion, no load animation, no list
  rise; the doors stand open and the hall is lit (the final state, without the travel); the action jumps to
  the list and focuses the email. No global kill switch: each component drops its movement (press scale,
  message rise, tick scale) and keeps short opacity / colour changes. A live change of the preference tears
  the sequence down (inline styles and hints removed).
- No JS: no pinning (the tall wrapper exists only with `.porta-on`, which site.js adds), doors ajar, theme
  follows the system, the list is visible with a disabled form and the `<noscript>` line.
- Keyboard: Enter or Space on the action plays the walk-in and lands in the email field; Tab from the action
  lands on the email field with the list in view at once; focusing anything in the pinned first screen
  mid-sequence rewinds to the rest state, so focus is never on an invisible element.

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

The walk-in on request (same harness: a click, then every rAF interval from the first moving frame to the
frame after the landing, traced; 3 runs per case, no harness polling while it flies):

| Case | Viewport | Flight | Frames | p95 frame | Worst frame | Frames > 17.5ms |
|---|---|---|---|---|---|---|
| Action, Dia / Noite | 390 × 844, DPR 3 | 1483ms | 90 | 16.7–16.8ms | 16.8ms | 0 |
| Action, Dia / Noite | 1440 × 900, DPR 1 | 1483–1500ms | 90–91 | 16.7–16.8ms | 16.8ms | 0 |
| Scroll cue, Noite | 390 × 844, DPR 3 | 1483ms | 90 | 16.7ms | 16.8ms | 0 |

The hand-scroll case was re-measured after the change and is as before (p95 16.7–16.8ms, worst 33ms, 0 over 50ms).

Before this pass (the former build with the ViewTimeline driver, same harness, all frames): p95 33ms and
frames up to 67ms at 1440, with 1.1–1.2s of raster per pass; the first version of the plain-JS driver,
before the opacity layers were promoted, reached 2.7s of raster and frames of 200–230ms. The rest state at p = 0 is pixel-identical to the
drawing the client approved (only the pendant's antialiasing differs, it moved into its own layer).
Real devices are still to be checked (see Roadmap).

## Dia & Noite (extension)
Which one shows: the visitor's stored choice; otherwise Torres Vedras time (Dia while the sun's altitude over
39.09 N, 9.26 W is above −0.833°, the standard sunrise and sunset; Noite otherwise), decided by the head
script before the first paint, so there is no flash. If the sun rises or sets while the page is open, the
theme changes once, at that minute, with the 400ms cross-fade (a tab back from the background catches up at
once); never while the visitor has chosen. Without JavaScript the system theme decides, as before.
`[data-theme]` on any element scopes a theme to that subtree (the styleguide shows both side by side); the
semantic block for Noite is written once in `src/noite.css` and emitted twice by the build (system preference
unless Dia was chosen, and the manual choice). Illustration roles that change: ink colours and opacities (`--i-ink*`,
`--ink-o*`), every wash (`--w-*` colour, `--wo-*` glaze opacity), `--i-hall-light` (flat hall by day,
lamplight gradient at night), `--i-room-base`, `--o-night` (lamplight layers), `--o-day` (sun shadows),
`--o-turn` (a turned leaf darkens by day). `--color-hall` changes too (`--sala-dia` / `--sala-noite`), and
`--color-field-hall` (papel / luz-nucleo).

## A distinctive touch (extension)
The client asked whether something should be added for «ar e feeling», beyond extra-premium UI. Four
candidates from the brief were prototyped on the built page (injected, outside the build), recorded and judged
against the motion budget (taste-skill: one hero motion per page, the door), Emil's first question (should
this animate at all: purpose, frequency, what it costs the next action) and the Jobs filter (does it say
something only this house can say, or is it decoration). One is kept.

| Candidate | Prototype and measurement | Verdict |
|---|---|---|
| **Torres Vedras time**: the default Dia / Noite follows sunrise and sunset over the house | the sun's altitude at 39.09 N, 9.26 W from a low-precision solar ephemeris in the head script (about 600 bytes): sunrise/sunset within 1–2 minutes of published times for 2026 (8 Nov 07:13 / 17:29 UTC, 21 Jun 05:12 / 20:07, 21 Dec 07:53 / 17:18); 18 checks (both system schemes, stored choice, manual toggle, every page, a sunset while the page is open) | **Kept.** No motion, no pixel, no request: the page becomes a window onto the house at this hour. A visitor in São Paulo at 19:00 sees the lantern lit, because it is night in Torres Vedras. It says something only this house can say. |
| **Ink draws itself** on first visit (contours, then washes bloom) | stroke-dash draw of the ink paths (top to bottom, 0.5s stagger, 0.9s each), washes fade in at 1.0s; holds 60fps under 4× throttle but rasters 133ms (390, DPR 3) / 316ms (1440) during the load window | **Removed.** It spends the page's one load gesture twice (the doors already ease ajar), withholds the drawing the client approved for 1.5s on the visit that matters most (the first), shows a grey wireframe on the way, and the line-draw reveal is a common template trope. |
| **Living lantern** at night (irregular warm flicker of the lantern and the doorway light, opacity 0.86–1) | WAAPI opacity on the six lamplight layers, 4.2s irregular loop; cheap here, invisible in stills and only noticed as "something moves" beside the text | **Removed.** An endless ambient loop has no purpose a visitor can name (no feedback, no state, no space), pulls the eye from the sentence beside it, keeps the compositor busy on phones, and a flickering electric lantern reads as a failing bulb. The lamp is already alive where it counts: it is lit only at night, and the light swings open with the doors. |
| **Sketchbook signature** «Torres Vedras, 2026» in the drawing's corner | single-stroke script lettering (Hershey script cuts) with a hand wobble, in the drawing's ink | **Removed.** It reads as a script font, not a hand (the brief's own condition), it sits on the steps and crowds the drawing, and it repeats what the lockup already says. |

Evidence: frame strips, videos and the prototype measurements are kept with the review notes, not in the
repository.

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
layers; print drops the pinning, the top bar, the scroll cue and the form. Keyboard and the sequence: Enter or
Space on the action plays the walk-in (any key stops it) and lands in the email field; Tab from the action
lands on the email field with the list in view (a jump, no replay of the sequence); focusing anything
in the first screen mid-sequence rewinds to the rest state, so focus is never on an invisible element.

## Implementation notes (extension)
- Source: `src/` (build.py, scene.py, hand.py, site.css, site.js, tokens.tpl.css, noite.css, styleguide.py,
  og.py, `assets/` with the emblem, fonts, icons, favicon and og.png, `tests/`). `python3 src/build.py`
  rebuilds `docs/` completely; every path is relative to `build.py`, nothing is read from outside `src/`.
  `scene.py` models the doorway in metres and projects it; `hand.py` turns every edge into seeded pen and
  brush geometry (see Components › entrance). The build is deterministic.
- Tests (Playwright + Chromium, never touching the real endpoint): `node src/tests/reverse-scroll.test.js docs`
  (the reverse-scroll / overscroll / toolbar regression, 40 checks; it chooses Dia or Noite explicitly, since
  the default now follows the sky) and `node src/tests/cta.test.js docs` (the walk-in on request, 23 checks at
  390 and 1440: click, Enter, Space and the scroll cue fly forwards only, 1.2–1.7s, with the scene playing,
  and land with the title and the email in view and the focus in the email; a wheel, a key, a pointer press or
  a touch stops it and nothing moves afterwards; Tab, reduced motion and `#lista` on load jump without a
  replay; after a flight, wheeling back up restores the exact rest state).
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
- Budget, measured on the home page with gzip -9 (fonts as shipped): 149.9 kB (146.4 KiB) — HTML 59.4, CSS 18.7
  (tokens 8.4, site 10.3), JS 9.7 (the walk-in on request and Torres Vedras time added 2.0), fonts 62.2 (Cinzel
  40.7, Alegreya 12.5, Alegreya Sans 9.0); target 150 kB, ceiling 170 kB (og and icons excluded). The privacy
  notice is 96.9 kB. The drawing is inline SVG (the caderno line work is most of the HTML). CLS 0 on every page
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
- "A control in the A Brazileira system: Alegreya Sans 500, 16px, tracking 0.018em, sentence case, colour
  `--color-text-muted`, 44px target, current state = `--color-text-strong` with a 1px underline 0.3em below,
  focus = 2px solid `--color-focus`, offset 3px."
- "A form on the hall: `.surface-hall`, 26rem column, Alegreya Sans 500 16px labels above 48px square fields
  (Alegreya 400 18px text; papel by day, luz-nucleo by night, 1px nogueira), a full-width 48px tinta button with
  papel text in Alegreya Sans 16/18px, the consent in Alegreya 16/24px, errors in barro 16px under the field with
  aria-invalid/aria-describedby, outcomes in a role=status line."

## Roadmap and known gaps
- Real devices for the walk-in on request: iOS Safari (programmatic scroll per frame while the toolbar
  collapses) and Android Chrome (the focus at the landing may raise the keyboard, since the click's user
  activation is still valid 1.5s later).
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
