---
version: alpha
name: A Brazileira · Boutique Hotel
description: >-
  A coming-soon page for a boutique hotel in Torres Vedras, Portugal, and step 1 of its design system.
  The canvas is warm paper (papel #F9F0E9), never white, and by night a walnut dark (noite #1C120B), never
  black. The voice is the hotel's original logo: a crowned B in a laurel wreath over A BRAZILEIRA /
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
  # semantic roles (tokens.css, layer 2). Keys are the CSS custom properties without "--"; the plain key is the
  # Dia value, "-on-night" the Noite value ([data-theme="noite"], or the system's dark mode when nothing was chosen)
  color-bg: "#F9F0E9"                  # papel
  color-bg-on-night: "#1C120B"         # noite
  color-text-strong: "#2E1E14"         # tinta: wordmark, active control, the action
  color-text-strong-on-night: "#F3E6D6"   # linho
  color-text: "#5F3819"                # nogueira: the lede, reading text
  color-text-on-night: "#F3E6D6"       # linho
  color-text-muted: "#804F1E"          # castanho: inactive controls, separators, footer, scroll cue
  color-text-muted-on-night: "#C2AE96" # linho-escuro
  color-accent-text: "#83602C"         # latao-texto: TORRES VEDRAS, the status, the sun note, the control tick
  color-accent-text-on-night: "#DB9E42"   # latao
  color-mark: "#A57638"                # latao-marca: the emblem (graphic)
  color-mark-on-night: "#DB9E42"       # latao
  color-ground: "#5F3819"              # nogueira: the floor line
  color-ground-on-night: "#75685D"     # pedra 46% in noite (3.41:1)
  color-focus: "#5F3819"               # nogueira
  color-focus-on-night: "#DB9E42"      # latao
  color-selection: "#F0DFCF"           # areia
  color-selection-on-night: "#51391A"  # latao 28% in noite
  color-surface: "#F0DFCF"             # areia: the focused skip link
  color-surface-on-night: "#2F251D"    # pedra 10% in noite
  color-link-line: "color-mix(in srgb, currentColor 45%, transparent)"   # a text link's resting underline (pointer screens)
  color-hall: "#F2DEC4"                # sala-dia. ONE token per theme: the doorway's last light, the flood AND the waiting list
  color-hall-on-night: "#FCE7BC"       # sala-noite
  color-field-hall: "#F9F0E9"          # papel: form fields on the hall
  color-field-hall-on-night: "#FFF2D6" # luz-nucleo: the night field is lit by the same lamp
  # the hall surface (.surface-hall: the waiting list, the home footer) re-points the roles for its subtree; the same
  # in both themes ("-hall" = the value inside .surface-hall)
  color-bg-hall: "{colors.color-hall}"
  color-text-strong-hall: "#2E1E14"    # tinta
  color-text-hall: "#5F3819"           # nogueira
  color-text-muted-hall: "#804F1E"     # castanho
  color-accent-text-hall: "#804F1E"    # castanho (latao-texto would be 4.36:1 on the hall)
  color-focus-hall: "#5F3819"          # nogueira
  color-field: "{colors.color-field-hall}"   # --color-field is set only on the hall
  color-field-line: "#5F3819"          # nogueira
  color-error: "#9E3B1E"               # barro, on the hall only
  color-on-strong: "#F9F0E9"           # papel: text and tick on the tinta button / checked box

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
  lede:                       # the sentence; the list sentence; the privacy intro (never under 21px); the 404 lines; the thank-you
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
  cta:                        # the one action, the button, the back link
    fontFamily: "'Alegreya Sans', 'Alegreya Sans cta fallback', Arial, sans-serif"
    fontSize: "16px below 900px, 18px from 900px, 20px from 1200px"
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
    minSize: "24px wordmark (--size-lockup-min)"
  control:                    # theme buttons and language links share one recipe
    textColor: "{colors.color-text-muted}"
    typography: "{typography.ui}"
    minSize: 44px
  control-hover:              # fine pointers only
    textColor: "{colors.color-text-strong}"
  control-active:             # aria-pressed="true" / aria-current="page": a mark, not an underline
    textColor: "{colors.color-text-strong}"
    tickColor: "{colors.color-accent-text}"
    tick: "0.75em x 2px, centred, 0.7em below the line's centre (--tick-w, --tick-h)"
  control-pressed:
    transform: "scale(0.97), 160ms --ease-out (colour unchanged)"
  control-focused:
    outline: "2px solid {colors.color-focus}, offset 3px, 2px corners"
  sun-note:                   # «É noite em Torres Vedras.»: only while the sky chose the theme (html[data-sol])
    textColor: "{colors.color-text-muted}"
    typography: "Alegreya 400, 16px / 20px, tracking 0 (the house speaking, not a control)"
    placement: "its own line under Dia · Noite, aligned with the control text, on every width; also the buttons' description"
  cta:                        # «Entrar na lista de espera»: a text link-button
    textColor: "{colors.color-text-strong}"
    decoration: "underline 1.5px full ink, offset 0.3em (--underline-cta, --underline-offset)"
    typography: "{typography.cta}"
    minHeight: 44px
    spaceAbove: "16px stacked, 48px split (from 900px)"
  cta-hover:                  # fine pointers only
    decoration: "underline 2px (--underline-cta-hover), 150ms"
  cta-pressed:
    transform: "scale(0.97), 160ms --ease-out"
  link:                       # .link, .foot__link, .link-inline
    textColor: "{colors.color-text-strong}"
    decoration: "underline 1px, offset 0.3em (inline: 0.2em); rests at {colors.color-link-line} on pointer screens"
  link-hover:
    textColor: "{colors.color-text-strong}"
    decoration: "underline 1px currentColor"
  link-inline-focused:
    outline: "2px solid {colors.color-focus}, offset 1px (--focus-offset-inline)"
  link-back:                  # «Voltar ao início» (privacy notice, 404)
    textColor: "{colors.color-text-strong}"
    typography: "{typography.cta}"
    minHeight: 44px
  skip-link:
    backgroundColor: "{colors.color-surface}"
    textColor: "{colors.color-text-strong}"
    decoration: "underline 1px, offset 0.3em"
    shownOn: "focus-visible"
  scroll-cue:                 # the pen-drawn chevron under the floor line (aria-hidden, out of the Tab order)
    color: "{colors.color-text-muted}"
    hoverColor: "{colors.color-text-strong}"
    size: "14px chevron in a 44px target: two bowed strokes that cross where they meet, at --pen-contour (1.15px)"
    hiddenWhen: "sliced by the small viewport's edge; absent on portrait screens up to 600px tall"
  lede:
    textColor: "{colors.color-text}"
    typography: "{typography.lede}"
    maxWidth: 20em
  status:
    textColor: "{colors.color-accent-text}; on phones (below 900px) in Noite {colors.color-text-muted} (--color-status-small)"
    typography: "{typography.ui}"
  footer:
    textColor: "{colors.color-text-muted}"
    typography: "{typography.ui}"
  floor-line:
    borderColor: "{colors.color-ground}"
    height: 1px
  entrance:                   # the caderno drawing (src/scene.py + src/hand.py)
    pen: "--pen-contour 1.15px, --pen-detail 0.82px, --pen-hatch 0.52px, --pen-cross 0.48px, --pen-fine 0.55px (x --ink-k: 1 / 0.86 / 0.74 by container width); scales with the camera, re-rastered crisp as it zooms"
    washes: "filled paths at glaze opacity (--wo-*), the same colour on a 1.1px rim at 55% (pigment pooling at the edge)"
  surface-hall:
    backgroundColor: "{colors.color-bg-hall}"
    textColor: "{colors.color-text-hall}"
  text-input:
    backgroundColor: "{colors.color-field}"
    borderColor: "{colors.color-field-line}"
    textColor: "{colors.color-text-strong-hall}"
    typography: "{typography.read}"   # Alegreya 400, lining figures
    height: 48px
    rounded: "{rounded.none}"
  text-input-hover:           # fine pointers, not when invalid or without JS
    borderColor: "{colors.color-text-strong-hall}"
  text-input-focused:
    outline: "2px solid {colors.color-focus-hall}, offset 2px (--focus-offset-field)"
  text-input-invalid:
    borderColor: "{colors.color-error}"
    border: "2px (1px border + 1px inset)"
  checkbox:
    size: 24px
    borderColor: "{colors.color-field-line}"
    backgroundColor: "{colors.color-field}"
    hitArea: 44px
  checkbox-checked:
    backgroundColor: "{colors.color-text-strong-hall}"
    tickColor: "{colors.color-on-strong}"
  checkbox-focused:
    outline: "2px solid {colors.color-focus-hall} around the drawn box, offset 3px"
  checkbox-invalid:
    borderColor: "{colors.color-error}"
    border: "2px (1px border + 1px inset)"
  button-primary:
    backgroundColor: "{colors.color-text-strong-hall}"
    textColor: "{colors.color-on-strong}"
    typography: "{typography.cta}"
    height: 48px
    width: 100%
    rounded: "{rounded.none}"
  button-primary-hover:       # fine pointers only
    backgroundColor: "{colors.color-text-hall}"
  button-primary-pressed:
    transform: "scale(0.97), 160ms (never while sending; reduced motion: the hover colour instead)"
  button-primary-sending:
    label: "A enviar… / Sending… (same size)"
    state: "aria-disabled, cursor progress, further submits ignored"
  button-primary-disabled-nojs:
    backgroundColor: transparent
    textColor: "{colors.color-text-muted-hall}"
    border: "1px inset {colors.color-text-muted-hall}"
  form-message:
    textColor: "{colors.color-text-strong-hall}"
    errorColor: "{colors.color-error}"
    typography: "{typography.ui}"
    liveRegion: "role=status, always rendered (empty: no height)"
---

# A Brazileira · DESIGN.md

## Overview

A Brazileira reads like the hotel's own card left on a stone step: warm paper, the gold crest of the original
logo in roman capitals, one sentence, one action, and a doorway drawn in ink that opens a little. The doorway
is a page of an architect's travel sketchbook (the "caderno" style): a quick, sure pen line,
economical hatching for shade and loose watercolour washes, all baked into vector geometry.

**Dia** is paper and limestone in sunlight: flat papel ground, walnut doors, brass knobs, a faint cast
shadow on the plaster. **Noite** is the same drawing after dark: walnut-black ground, the doors and stone
gone dark, and lamplight coming through the gap, the fanlight and the wall lantern. Until the visitor chooses,
the page keeps the hour of the house: Dia while the sun is up over Torres Vedras, Noite after sunset, so the
lantern is lit when it really is, and one short line under the control says so, on every screen («É noite em
Torres Vedras.»). The system's dark mode does not override the sky (it is not a choice made on this site);
without JavaScript the system theme decides. The Dia · Noite control overrides it and remembers the choice.

Scrolling is the one journey on the page, and it is short: about one screen from the top to a readable form
(one decisive swipe on a phone). The doors swing open from the first pixel, the hall lights up, the view walks
in through the doorway and keeps going until the screen is one flat colour, the hall's light; the waiting list
rises in on that light at once. The hall surface is light in both themes (daylight by day, lamplight by
night), so the form always reads dark ink on a light ground.

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
- Motion: the doors ease ajar once on load (1.1s); one scroll-linked sequence (115svh, one plain-JS driver)
  walks in through them into one flat colour and the waiting list; the hero action plays the same walk-in on its
  own (1.2s, any input stops it) and lands in the email field; Dia ↔ Noite cross-fades in 400ms when chosen,
  1.4s when the sun changes it.
- One lamp: the hall's pendant, which dissolves with the hall into the light it gives. The list has none.

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
- **Minimum size**: wordmark 24px (`--size-lockup-min`; lockup about 220px wide; used at exactly this size as
  the home link on the privacy notice, on landscape phones and on portrait screens up to 600px tall, where
  TORRES VEDRAS is then 9.6px, the logo's own ratio). Below that, use the emblem alone (favicon.svg, app icons),
  which holds at 16px.
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
sampling: ΔRGB = 0 over every pixel of the frame (list words and footer text excepted) from the moment the
screen is one colour (p = 0.76), at the middle of the list's rise, at p = 1 and with the seam where the stage
releases on screen, on 390 × 844, 430 × 932, 375 × 667, 320 × 568, 844 × 390, 768 × 1024, 1440 × 900,
1920 × 1080 and 2560 × 1080, both themes (`src/tests/cta.test.js`). Once the screen is one colour the page behind the stage takes it too
(an inline background on body), so a frame that draws the pinned stage a step behind a fast scroll uncovers
the same light, never the hero's paper.
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
success colour: success is a sentence («Obrigado. Já está na lista.»), not a colour.

### Contrast matrix (measured on the rendered pages with Playwright, WCAG 2.x)

| Theme | Element | Foreground | Background | Ratio | Rule |
|---|---|---|---|---|---|
| Dia | Wordmark, kind, active control, CTA | tinta #2E1E14 | papel #F9F0E9 | 14.23:1 | text |
| Dia | Active-control tick, sun note | latao-texto #83602C | papel | 5.08:1 | text / non-text ≥ 3:1 |
| Dia | Lede, privacy body | nogueira #5F3819 | papel | 9.03:1 | text |
| Dia | Inactive control, separators, footer, scroll cue | castanho #804F1E | papel | 6.11:1 | text / graphic |
| Dia | TORRES VEDRAS (9.6–22.4px; 25.2px at 1920), status | latao-texto #83602C | papel | 5.08:1 | text (part of the logo below 14px) |
| Dia | Emblem | latao-marca #A57638 | papel | 3.56:1 | graphic ≥ 3:1 (logo) |
| Dia | Focus ring, floor line | nogueira | papel | 9.03:1 | non-text ≥ 3:1 |
| Noite | Wordmark, kind, lede, active control, CTA | linho #F3E6D6 | noite #1C120B | 14.99:1 | text |
| Noite | Inactive control, separators, footer, scroll cue | linho-escuro #C2AE96 | noite | 8.58:1 | text / graphic |
| Noite | TORRES VEDRAS, status, emblem, focus ring, active-control tick, sun note | latao #DB9E42 | noite | 7.87:1 | text |
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

Five text roles outside the logo (ui, read, cta, lede, title), nothing under 16px. Squint order on every width:
lockup > lede > action > status and controls. Computed in Chromium (`r1fix-tools/type.js` in the review notes);
320px is 320 × 640, 390px is 390 × 844, 1440px is 1440 × 900.

| Token | Family | 320px | 390px | 1440px | Weight | Line height | Tracking | Use |
|---|---|---|---|---|---|---|---|---|
| wordmark | Cinzel | 28px (24px when the screen is ≤ 600px tall, and on landscape phones) | 28px | 56px | 600 | 1.05 | 0.045em | A BRAZILEIRA |
| kind | Cinzel | 14px (12px) | 14px | 28px | 700 | 1.05 | 0.12em | BOUTIQUE HOTEL |
| place | Cinzel | 11.2px (9.6px) | 11.2px | 22.4px | 400 | 1.05 | 0.3em | TORRES VEDRAS |
| title | Alegreya | 26px | 26px | 34px | 400 | 1.18 | −0.01em | Lista de espera, Nota de privacidade |
| lede | Alegreya | 18px | 19px | 26px | 400 | 1em + 7.2px (25.2 / 26.2 / 33.2px) | −0.005em | the sentence, the list sentence, 404, thank-you |
| intro (`--size-intro`) | Alegreya | 21px | 21px | 26px | 400 | 1em + 7.2px (28.2 / 33.2px) | −0.005em | the privacy intro: the lede, never under 21px (a clear step over the 18px body) |
| read | Alegreya | 18px | 18px | 18px | 400 | 28px | 0 | privacy notice; the email field (lining figures) |
| consent | Alegreya | 16px | 16px | 16px | 400 | 24px | 0 | the consent line |
| cta | Alegreya Sans | 16px | 16px | 20px (18px from 900 to 1199px) | 500 | 1.25 | 0.018em / 0.015em | the action, the button, «Voltar ao início» on every page |
| ui | Alegreya Sans | 16px | 16px | 16px | 500 | 20px / 24px | 0.018em (PT · EN 0.06em) | Dia · Noite, PT · EN, status, labels, messages, section names, footer |
| sun note | Alegreya | 16px | 16px | 16px | 400 | 20px | 0 | «É noite em Torres Vedras.» under the theme control |

From 1920px the root size grows to 112.5% (131.25% from 2560px): everything scales together, never more
content. The field is 18px, never below 16px, so iOS Safari does not zoom on focus.

### Principles
- What the house says is serif; what you operate is sans. Never Alegreya for controls, labels or buttons.
- The status is quieter than the action by colour (brass, not ink, no underline; on phones in Noite, where the
  action is the same 16px and brass is the most saturated text on the screen, the muted linen), size from 900px and space
  (8px under the sentence, 12px from 900px; 16px before the action stacked, 8px on short phones, 48px from
  900px), never by weight. The lede leads by size: 19px over a 16px action on phones, 26px over 18–20px from
  900px. The action carries the only full-ink underline of the first screen (1.5px); the current control is
  marked by a short brass tick, never by an underline.
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
separators 63.8%, footer link 88.05 / 86.06%, theme buttons 93.0% (Dia + Noite and Day + Night as a pair, so the
sun note beside them never moves when the font lands; `--font-theme`). Ascent and descent overrides carry Alegreya's 1.016 / 0.345 and
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
  symmetrically around it: `--scene-axis` is generated from the model, `--scene-reach` 0.8543 lets the
  outermost olive leaves reach into the gutter). The loose plaster wash above the arch paints 7% of the
  drawing's height above its box (`--scene-over`, generated by build.py from the painted paths); stacked, that
  overshoot and 8px more stay inside the entrance (16px on portrait screens up to 680px tall), so the wash is at
  least 28–32px under the action's box at every width (measured 360–899px).
- **Split** (from 900px wide, or any landscape screen from 600px): 5fr text | 6fr entrance, 64px apart,
  container 86rem; the text column is a centred crest; the entrance stands on the floor line.
- **Waiting list**: a full-height hall section (`min-height: 100svh`), one centred column of 26rem whose title
  starts 22svh from the top of the section (a little above the optical centre, and where the hero action
  lands). With the sequence on, the section is pulled up by one large viewport (`margin-top: -100lvh`), so it
  starts exactly where the pinned stage releases (the end of the run) and lies over the stage during the run;
  it is at least one large viewport tall (`min-height: 100lvh`), so the footer always starts below the stage.
  Its first screen is transparent (the stage behind it is the same flat colour) and its own colour starts exactly
  at the bottom of the stage. Its words are held at opacity 0, with no pointer target, until the screen is one
  colour (site.js). Home page document: 2.27 screens at 390 × 844 (was 3.08), 2.23 at 1440 × 900 (3.04), 2.75 at
  844 × 390 (3.53), 2.38 at 320 × 568 (3.19).
- **Privacy notice**: top bar, the lockup at 24px as a home link, a 40rem reading column, footer.
- **Very short portrait screens** (up to 600px tall: 320 × 568, iPhone SE in Safari 375 × 553): the lockup at its
  24px minimum, 12px above the lede, no scroll cue, and the drawing takes the height that is left, so the door
  still stands on the floor line inside the first screen (tested in `src/tests/cta.test.js`).

### Whitespace philosophy
Empty paper is structure. The first screen has four things (crest, sentence, action, doorway) and space
between them; the hall has a title, a sentence and the form.

### Page anatomy (home)
1. Skip link · top bar (Dia · Noite left, with the sun note on its own line under it while the sky decides;
   PT · EN right), laid over the first screen; it scrolls away. The note hangs under the row (absolutely
   positioned, so the bar's layout never changes); on the home page the stage clears it by `--sol-h` (12px,
   none on screens from 900 × 600, where the crest is far below). From 900px its inline padding follows the 86rem container, so on very wide screens
   the controls line up with the composition, not the window's edges.
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
  `scale(0.97)`, 160ms `--ease-out`, the colour unchanged (the same press as the action and the button; none
  under reduced motion).
- Focus-visible: 2px solid `--color-focus`, offset 3px, 2px corners; never animated.
- Active / current: `--color-text-strong` and a short brass tick under the word (`--tick-w` 0.75em × `--tick-h`
  2px, `--color-accent-text`, centred 0.7em below the line's centre), so state is never colour alone. Not an
  underline: on this site an underline always means a link (the action, the footer, inline links), and the
  current control is the one thing you cannot go to. `aria-pressed="true"` for the theme, `aria-current="page"`
  for the language. Forced colours: the tick is a border, so it stays visible.

**`theme switch`** (Dia · Noite / Day · Night): two real buttons in `role="group"`; hidden without JS.
A head script sets `data-theme` before the first paint (no flash): the stored choice
(`localStorage["ab-tema"]`) if there is one; otherwise the sky over Torres Vedras now (Torres Vedras time, see
A distinctive touch), marked `data-sol` and never stored. The system's dark mode is not consulted when
JavaScript runs (see Dia & Noite › The system's dark mode). A click on the other theme stores the choice, which
wins from then on; tapping the theme already shown does nothing (nothing is stored, the sky keeps deciding).
`meta[name=theme-color]` follows. Storage is wrapped in try/catch (a choice still holds for the visit if
storage is blocked). A theme change lands at once on the controls and links (their colour transitions are held
for that frame, `.is-instant`), so nothing catches up after it.

**`sun note`** (`#sol-note`, inside the theme group): while `data-sol` is set, one short sentence on its own
line under the control says why the page looks as it does: «É noite em Torres Vedras.» / «É dia em Torres
Vedras.» («It is night in Torres Vedras.» / «It is daytime in Torres Vedras.»). On every width, phones included
(it used to be screen-reader-only below 600px, so the touch was invisible where most visitors arrive). It is
the house speaking, not a control: Alegreya 400 16/20px, tracking 0, `--color-text-muted`, a verb and a full
stop, aligned with the control's text and tucked 8px under the row, out of the menu row so the menus hold only
Dia · Noite and PT · EN (it used to sit in the row in the control's voice and read as a third, broken menu
item). Both phrases are in the markup and the theme shows one, so it is right from the first paint (no shift:
the head script sets `data-sol` before it). No icon, no motion. It is also the description (`aria-describedby`)
of both theme buttons while the sky decides, and disappears the moment the visitor chooses. Clearance from the
crest, measured: 8px at 320 × 568 and 844 × 390, 16px at 390 × 844, 72px at 1440 × 900 (`src/tests/list.test.js`).

**`language switch`**: two links (`hreflang`, `lang`, `aria-current`); on the privacy notice they point to the
other language's notice.

**`cta`** (`.cta`, «Entrar na lista de espera» / «Join the waiting list» → `#lista`): the only action on the
first screen, a text link-button under the status. Alegreya Sans 500, 16px on phones, 18px from 900px and 20px
from 1200px, tinta / linho, a 1.5px underline 0.3em below in full ink at rest (`--underline-cta`), 44px tall,
48px under the status from 900px (squint test: after a blur it still reads as the next step beside a large
drawing). Hover (fine pointer): the underline firms to 2px, 150ms. Pressed: `scale(0.97)`, 160ms `--ease-out`. Click, tap, Enter or Space (it
is drawn as a button, so it answers Space too): the walk-in through the door, 1.2s, then the focus moves to
the email field (`preventScroll`); the scroll cue does the same (see Motion › The walk-in on request). Any
wheel, touch, key or pointer input during the flight stops it where it is. Reduced motion: the same landing
at once. There is no `scroll-behavior: smooth` anywhere. Tab from the action lands on the email field with
the list in view (a jump: keyboard focus never waits for an animation).

**`link`** (`.link`, `.foot__link`, `.link-inline`; the action above is the one exception): the underline is
the affordance, 1px (`--underline`), 0.3em below in the interface and 0.2em inside a sentence, never removed.
Where a pointer can hover, the underline rests in the link's own ink at 45% (`--color-link-line`, `color-mix`
with `currentColor`) and takes the full ink on hover, with the text at `--color-text-strong`: 150ms `ease`,
colour only, nothing moves. Touch screens keep the full underline (they never see the hover). The privacy link
inside the consent reaches a 44px tap height into the free space under its line (a pseudo-element, never up into
the consent sentence, which toggles the box); its focus ring sits 1px out (`--focus-offset-inline`) so it never
covers the letters beside it.
(Before: hover lightened the text, which read as dimming by day and did nothing by night, where text and
strong text are both linho.) The scroll cue darkens to strong ink on hover the same way. The cue itself is drawn
with the drawing's pen, not set as an icon: two strokes at the contour weight (1.15px, `vector-effect:
non-scaling-stroke`), one a little longer and bowed, that cross where they meet (the pen's overshoot). The even,
template chevron it replaced was the one stock glyph on a pen-drawn page.

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
*Line system* (tokens `--pen-*`, read by the `.k*` rules in site.css): ink 1.15px contour (`--pen-contour`),
0.82px detail (`--pen-detail`), 0.52px hatching (`--pen-hatch`), 0.48px cross-hatching (`--pen-cross`), 0.55px fine
(`--pen-fine`), 0.5px leaves, 0.7px iron; the hall seen through the door 0.62 / 0.45 / 0.4 / 0.35px at 0.9 / 0.7 /
0.6 / 0.55 ink (`--pen-hall*`, `--ink-ohall*`); a wash's rim 1.1px at 55% of its glaze (`--pen-rim`, `--wo-rim`);
round caps and joins, multiplied by `--ink-k` (1 / 0.86 / 0.74 as the drawing's container
grows past 30rem / 44rem) so a large drawing keeps a fine pen. Strokes scale with the camera: walking in
reads like leaning into the sketchbook. Washes (`.w-*`) are filled paths at a glaze opacity with the same
colour on a 1.1px rim at 55% (pigment pooling at the edge). Night: the same drawing in light ink on the
walnut paper with glazes of lamplight (radial gradients, content of the drawing, not decoration).

Lamplight at night is laid as edgeless glazes: each radial glaze is fully transparent from 0.8 of its radius, so
the patch's loose outline always falls on clear paint, and it carries no rim stroke (`lg-flat`). The wall
lantern's glaze has a second, fainter one (`ab-halo-jamb`, its own seeded pen, so nothing else in the drawing
moved) that warms the stone of the left jamb beside it.

Layers, back to front (the choreography needs them separate):
1. back svg: the hall in shadow behind the door plane (seen in the gap while the doors are ajar; hidden from
   p = 0.36, when the lit hall covers it);
2. `.hall` (the opening): `.hall__light` (the lit hall and its drawing: flat `--color-hall` by day, a
   lamplight gradient at night; by day it also carries the pendant, which therefore appears with the light:
   an unlit shade in the dark gap of the ajar doors read as a stray blot), `.hall__lamp` (the pendant lit at
   night, above the lit hall, so it shows in the gap), `.hall__flat` (the hand-off: flat `--color-hall`, inside
   the doorway only). The inner door's window is lit at night too (`--wo-hwin` 0.7 in Noite, 0.9 by day): it
   used to be a flat, dull taupe slab inside the golden hall;
3. front svg: wall, stone arch, reveal, frame, fanlight, steps, lantern, olive tree;
4. `.spill`: lamplight on the threshold and steps (Noite), clipped to the steps' silhouette;
5. `.door`: the two leaves, HTML layers rotated with CSS 3D in the drawing's own perspective (`perspective`
   and `perspective-origin` generated from the model). Each leaf is a hinge (`.leaf`, the scroll swing)
   holding a face (`.leaf__face`, the ajar angle and the load animation); the two rotations add up.
Only HTML layers move (transform / opacity); the drawing is never repainted while the page scrolls.

**`waiting list`** (`#lista`, `.lista.surface-hall`): the room you walked into. h2 «Lista de espera» /
«Waiting list» (title), one sentence (lede), the form, and a `<noscript>` line. With the sequence on, its words
rise in with the scroll itself, as the last part of the run (Motion: p 0.745 → 0.94, driven by the same loop as
the doors, not by an IntersectionObserver), so they are at rest, opaque, wherever the page is once the run is
over: a reload or a restored position at the bottom, a jump, a short landscape screen (the former observer
waited for the title to cross the screen, and on short screens left the form at opacity 0 over the footer).
The panel itself has no entrance (its colour is the light the camera carried in). Without the sequence (reduced
motion, `?semporta`, no JS, the safety net) the words are simply there. The hall's pendant used to be drawn a
second time over the title; it is gone: the hall lamp the visitor walks under dissolves with the hall into its
light, and a second, smaller lamp rising with the title read as the anchor jumping (round 2 review) and was
unlit at night.

**`form`** (`[data-waitlist]`, `novalidate`; states on `data-state`):
- Fields: «Email» label above a 48px input (`type=email`, `autocomplete=email`, `inputmode=email`,
  `required`, papel fill, 1px nogueira border, square); the consent checkbox (required): a real
  `<input type=checkbox>` laid invisibly over a drawn 24px box, so it keeps native semantics, focus and a
  44px hit area; the label links to the privacy notice. A honeypot field (`website`) sits off-screen,
  `aria-hidden`, `tabindex=-1`, `autocomplete=off`. The field fill is `--color-field-hall`: papel by day,
  luz-nucleo by night (the pink day paper clashed with the lamplight).
- Field and checkbox hover (fine pointer): the 1px line darkens to `--color-text-strong`, 150ms `ease` (not on
  an invalid field, whose barro edge stays); the focus ring stays the focus state.
- Button: «Entrar na lista de espera» / «Join the waiting list», word for word the hero action (one label for
  the one action), full width, 48px, tinta fill, papel text, square. Hover (fine pointer): nogueira. Pressed:
  `scale(0.97)`, 160ms, never while sending (`:active:not([aria-disabled=true])`). Its two labels share one
  grid cell, so «A enviar…» never changes its size.
- **idle**: as above; the email field is described by the list sentence (`aria-describedby="lista-lede"`), so
  focus landing in it (Tab, or the walk-in on request) reads what it is for. **invalid** (client check, or the
  server's 400 `invalid_email` / `consent_required`): the field gets `aria-invalid="true"`, a 2px barro edge and
  an inline message in barro 16px below it, which replaces the description; focus moves to the first invalid
  field; the message clears as soon as the value is fixed (and the description returns). **sending**: `aria-busy` on the form, `aria-disabled` on the button (focus stays on it), label
  «A enviar…» / «Sending…», further submits ignored. **success**: the fields give way to «Obrigado. Já está na
  lista.» / «Thank you. You are on the list.» in the form's own height (nothing around it moves), anchored at the
  top of that box, where the field was (48px under the sentence; it used to float 168px down the middle of an
  empty band and repeat the sentence's promise): the controls fade out in 160ms while the sentence rises in
  over 240ms, in a `role="status"` region that receives focus. **error** (network, timeout after 10s, any other
  status): «Não foi possível enviar. Tente de novo dentro de momentos ou escreva para inn@abrazileira.com.» in
  barro in the status region, the address a real `mailto:` link (a way that does not depend on the failing
  service; `{mail}` in the copy, built by site.js), fields kept. The status region is always rendered (empty, it has no height and no margin), so
  a polite live region exists before it speaks; the error is written 60ms after the region was cleared, so the
  same message twice still counts as a change. **honeypot filled**: success shown,
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
16/24px muted, lining figures; the link is 44px tall. Its 4px tap padding is taken back by a −4px margin, so both
« · » separators are spaced alike. Below 480px name, place and link take a line each (no dangling separator).

**`privacy notice`** (`privacidade/`, `en/privacy/`): same top bar and tokens; the lockup (24px) as home
link; h1 title (Alegreya 26–34px); a short intro at `--size-intro` (the lede, never under 21px, so on phones it
is a clear step over the 18px body, not a 1px one); ten short sections (section name in Alegreya Sans 500 16px +
one Alegreya paragraph at 18/28px, measure 26.5em, no hyphenation): controller and contact; data; purpose (to let
you know about the opening: exactly what the consent covers); legal basis (consent, art. 6(1)(a) GDPR; giving the
email is optional; withdrawable without affecting the lawfulness of earlier processing); retention (until
withdrawal, at most 24 months); processor (Supabase, EU servers in Paris, and its short-lived request logs: IP
address and browser); hosting (GitHub Pages, which logs visitors' IP addresses for security); transfers (both are
US companies: GDPR safeguards such as the EU-US Data Privacy Framework or standard contractual clauses); rights
(incl. complaint to the CNPD); cookies (none; no analytics; the Dia / Noite choice is kept only in the browser;
apart from hosting, the only third-party request is the form). «Última atualização: novembro de 2026.» and a
link home. Linked from the consent label and every footer.

**`404`**: the same top bar as every page (Dia · Noite, PT · EN; site.js loaded), tokens and lockup (24–36px,
`--size-lockup-plain`), two sentences (PT and EN) and one link home in each language at the back-link size;
footer with the privacy link. A head script resolves the site root and writes `<base>` and the stylesheets.

## Motion

### The door sequence (scroll-linked)
Client, round 3 (after testing on an iPhone): too many scrolls, the waiting list took too long to appear, and the
background "being removed" read wrong; zoom further in, until it is one colour, and then show the list, all in a
short space. Measured on that iPhone before: the form at y = 1678 with innerHeight 836, about 2.0 screens.

The first screen sits in a tall wrapper: the stage is `position: sticky` and stays pinned for `--porta-run`
(115svh) of scroll. The waiting list starts exactly where the stage releases and lies over the stage during the
run, so the run ends with the list at rest. Scroll progress p (0 → 1 across the pinned stretch) drives every
layer, each over its own sub-range and curve; scrolling back reverses everything (walk back out).

**The run in three overlapping beats.** The doors swing from the first pixel and the camera starts with them;
the camera walks in through the doorway and keeps going: on the way the hall dissolves into its light while the
room still reads as a room, then only the stone jambs and the open leaves are left, passing out of the frame;
at p = 0.76 the screen is one flat colour (`--color-hall`), and the list rises in on that light at once.

**Measured scroll from the top until the list title and the email field are fully in view and readable**
(opacity ≥ 0.99, settled; `rework-tools/reach.js` in the review notes, and `src/tests/list.test.js` C):

| Viewport | Scroll to the form | Screen is one colour at | End of the run |
|---|---|---|---|
| 390 × 844 | 849px = 1.01 screens | 0.87 | 1.15 |
| 430 × 932 | 936px = 1.00 | 0.87 | 1.15 |
| 375 × 667 (stage pins after 24px) | 694px = 1.04 | 0.91 | 1.19 |
| 844 × 390 | 397px = 1.02 | 0.89 | 1.16 |
| 1440 × 900 | 904px = 1.00 | 0.87 | 1.15 |
| 1920 × 1080 | 1085px = 1.00 | 0.87 | 1.15 |

Before: about 2.0 screens (1.99 at 390 × 844). Whole home page: 2.27 screens at 390 × 844 (was 3.08). Real touch
drags (iPhone 13 profile, the `tools/touch2.js` pattern: 350px finger drags, no momentum): the first drag reaches
p ≈ 0.44 (doors open, walking in), the second the list title and field in view (the form at 97% opacity, 100%
a few pixels on); one swipe with momentum on a real phone covers both.

| Element (hook) | Role | p range | Motion | Curve |
|---|---|---|---|---|
| Text column: lockup, lede, status, action (`copy`) | Support, exits | 0 → 0.14 of min(r, p) | opacity 1 → 0, rises 16px; no pointer target below 50% | `--curve-copy` (0.33, 1, 0.68, 1) |
| Scroll cue (`cue`) | Decoration | 0 → 0.05 of min(r, p) | opacity 1 → 0; no pointer target below 50% | `--curve-copy` |
| Left / right leaf (`leaf-l`, `leaf-r`) | Lead, from the first pixel | 0 → 0.36 | +47° (41° → 88°) / +61° (27° → 88°) | `--curve-door` (0.3, 0.55, 0.35, 1) |
| Lit hall, light on the steps (`light`, `spill`) | Support, carried by the leaves | 0 → 0.36 | opacity 0 → 1 = the leaves' eased value | `--curve-door` |
| Hall in shadow (back svg) | — | from 0.36 | hidden (covered by the lit hall) | — |
| Camera: pan (`camera`) | Lead | 0 → 0.30 | the doorway's centre travels on a straight line to the screen's centre. Portrait screens (doorway below the centre): the rise follows the growth, (s − 1) × floor distance / rise, so the floor line holds at the visitor's feet and then leaves through the bottom edge; centred by s ≈ 2.7 at 390 × 844, and by p = 0.66 at the latest | `--curve-pan` (0.35, 0.4, 0.3, 1); portrait: tied to the zoom |
| Camera: walk-in (`camera`) | Lead | 0.01 → 0.76 | scale 1 → S around the doorway, geometric, through four keyframes per screen (below) | monotone cubic on log(scale) |
| The hall dissolves into its light (`handoff`, `.hall__flat`) | Support | 0.50 → 0.66 of max(r, p − 0.1) | flat `--color-hall` inside the doorway, opacity 0 → 1, while the camera keeps walking | `--curve-fade` (0.45, 0, 0.55, 1) |
| One colour (`flood`) | Support | from 0.76 of max(r, p − 0.1) | `--color-hall` over the whole stage, opacity 0 or 1 (a step: colour over the same colour, so no frame is ever a fractional blend one level off the token); the page behind the stage takes the colour too | step |
| Waiting list: title, sentence, form (`list`) | Arrival | 0.745 → 0.88 / 0.75 → 0.90 / 0.755 → 0.94 of r | opacity 0 → 1 and 16px (the form 10px) of rise, on top of the scroll's own; no pointer target below 50% | `--ease-out` (0.23, 1, 0.32, 1) on p |

**The walk-in's keyframes** (`measure()`, per screen): log(scale) passes through 0 at p = 0.01; the scale at
which the opening is 0.8 of the screen's height at p = 0.50 (the hall starts to dissolve); 1.35 of it at
p = 0.66 (all light; never later than S / 1.12); and S at p = 0.76, with a monotone cubic (Fritsch–Carlson)
between them: it never goes back, never overshoots, starts softly (zero slope) and does not land (the screen is
one colour by then, so the camera keeps going into the light). On a phone in portrait S is about 5.0 and the
last stretch is short (the opening covers the width and the height almost together); on landscape screens the
opening covers the height long before the width (S ≈ 8.3 at 1440 × 900, 11.4 at 844 × 390), and that stretch,
3.2 → 8.3 at 1440, is the doorway passing out of frame around a light that is already one colour. The former
single curve spent it on an abstract close-up of the hall's drawing (the inner door's window, oversized hatching
and wide blank wall planes) that a wheel user could rest on (round 2 review), and then faded the drawing out
while the camera had almost stopped, which read as the background being removed.

**The list rises in with the scroll.** Its section starts where the stage releases, so during the run its words
come up with the scroll itself (native, compositor-smooth), hidden; as the screen turns one colour all three
begin together (none is ever an empty field on that light) and settle one after the other, the stagger being in
how long each takes. In scroll terms: from one colour to a readable form about 0.13 of a screen; in the walk-in
on request about 120ms to readable and 280ms to rest. It is never driven by an IntersectionObserver: wherever
the page rests past the end of the run (a reload or a restored position at the bottom, a jump, the end of a
short landscape page) the words are at rest and opaque (`src/tests/list.test.js` B: every rest position from
the flat moment to the end of the page, and a reload at the bottom, on 844 × 390, 932 × 430, 667 × 375, 720 × 450
(1440 × 900 at 200%), 390 × 844 and 1440 × 900).

S (the final zoom) is computed from the layout so that the door opening covers the whole large viewport on
every aspect ratio, with the open leaves (edge-on, about 7% of the opening each in the drawing's perspective)
pushed out of frame: S = max(vw / (0.86 · opening width), 2 · max(svh / 2, lvh − svh / 2) / opening height)
× 1.04 (≈ 5.0 at 390 × 844, ≈ 8.3 at 1440 × 900). The camera reaches cover before the flood, so the flood only
ever switches the hall colour on over the hall colour, never over the stone (ΔRGB 0 on every pixel, nine aspect
ratios, both themes: Colors › Surface).

Which progress each layer reads: r, the rendered (smoothed) progress, except two groups. The text column and the
cue read min(r, p): they leave with the doors, but come back with the scroll itself, so after a fast flick to
the top the title is there as the page arrives (measured: within one frame of scrollY reaching 0 at 3000px/s).
The hand-off layers read max(r, p − 0.1): at hand speed (lag under 0.1) exactly r; after a fast fling the stage
is already one colour when the list panel arrives at p = 1, never a hard panel edge rising over a drawing the
smoothing has not caught up with (0 such frames at 3500px/s). The list reads r, so its words never show before
the flood.

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
  none). This, the clamp and the removal of the former ViewTimeline / WAAPI path fix the regression where the
  site title disappeared after scrolling back up on iPhone Safari: the timeline path could resolve the text's
  exit at the end state during rubber-band overscroll and drifted with the collapsing toolbar. Regression
  test: `src/tests/reverse-scroll.test.js` (wheel, touch drags, programmatic jumps, emulated scrollY < 0 and >
  max, viewport height −84px / +60px mid-sequence, fast flicks) asserts `.intro` opacity 1, transform none and
  no inline style after every scenario; a mutated driver without the clamp fails it.
- Geometry is cached: the doorway centre and size (untransformed `offset*`), the small-viewport height (a
  100svh probe), the pin offset for short screens, the pin start and the run (`wrapper − stage`, stable while
  mobile toolbars come and go). It is re-measured on the events above, keeping the same progress.
- Writes are `transform` and `opacity` on the moving elements only (and `pointer-events: none` on the faded text
  and cue, so a tap on the empty drawing mid-sequence never launches the walk-in, and on the list's words until
  they are half in), never a custom property on a parent; once the screen is one colour, an inline background on
  body (a class on html restyled the whole document: 35ms of style recalculation at the hand-off under 4× CPU
  throttle). Nothing is made inert, so keyboard focus reaches everything.
- **Focus moves the page for the keyboard only.** Two focusin handlers bring what took the focus into view: a
  control in the pinned first screen rewinds to the rest state, and Tab into the form from outside brings the
  whole list into view (the end of the run). Both run only when the last input was a key: `keydown` and
  `pointerdown` / `mousedown` / `touchstart` are recorded in the capture phase, before any focus moves. Round 2
  blocker: the list handler also ran on pointer focus, so the first tap into the field jumped the page by up to
  300px under the finger, and on the button the press landed on another element and the submit never fired (10
  of 10). Measured after: 0px at the page's end, at the end of the run and part-way through the rise, at
  390 × 844 and 375 × 667 (touch) and 1440 × 900 and 1280 × 720 (mouse), and the first press on the button runs
  the validation (`src/tests/list.test.js` A; before: 104px at 390, 68px at 1440, validation never ran).

### The walk-in on request (the hero action and the scroll cue)
Requirement: the walk-in on request must be fluid and read as entering through the door, neither slow nor rushed.
This replaces the former instant jump.

- **Still one driver.** The same rAF loop writes the scroll position itself (`window.scrollTo` per frame, never
  native smooth scroll) and the scene follows it through the same smoothing as a hand scroll, so the doors
  swing, the hall lights and the camera walks in exactly as under the finger. The first frame moves nothing
  (the layers are promoted in it), the travel starts on the next.
- **It eases the visual journey, not the distance.** Each pixel of the way weighs 1 + `--flight-weight` (2) ×
  the walk-in's change of (log) scale over it; the time curve `--curve-flight` (0.45, 0, 0.3, 1: soft start,
  long gentle settle) runs over that weighted way (a 96-step table built once per flight). Easing the plain
  distance was tried first and failed by eye: the peak speed fell in the doorway, the walk-in took 250ms and
  the list's plain rise took half the flight. Weighted, it reads as one gesture (measured per frame, from the
  click; `rework-tools/flight.js`; the travel starts about 90ms after the click, the press frame):

  | Beat (from the click) | 390 × 844 | 1440 × 900 |
  |---|---|---|
  | Text leaves (intro opacity → 0.1) | 0–340ms | 0–310ms |
  | Doors open (p = 0.36) | 0–660ms | 0–525ms |
  | The hall dissolves into its light | 790–910ms | 590–745ms |
  | Jambs and leaves pass out; one colour (the flood) | 910–1010ms | 745–975ms |
  | The list rises in: title in (50%), form readable (99%), at rest | 1025 / 1125 / 1290ms | 990 / 1110 / 1275ms |
  | Focus in the email field (`preventScroll`) | 1290ms | 1300ms |

- **Duration** `--dur-flight` 1200ms for the whole way from the rest state (it was 1500ms over a way twice as
  long); a shorter way is shorter (× √share, never under 35%). Measured travel 1.18–1.20s at 390 × 844 and
  1440 × 900, Dia and Noite (`src/tests/cta.test.js` holds it to 1.1–1.3s); tuned by eye on recorded video at
  both sizes in both themes (evidence: `shots/rework/video/` in the review notes). The list's part is about
  280ms from one colour to rest, inside the 250–350ms the brief asks for.
- **Interruptible.** `wheel`, `touchstart`, `pointerdown` or `keydown` (capture, passive), or a scroll that is
  not the flight's own (more than 4px from what it wrote), ends it at once: the page stays where it is, in the
  visitor's hands, the focus is not moved. Not interruptions: a held key repeating (the press that started it;
  repeated Space / Enter on the action are also prevented, so they neither scroll nor re-press), a second press
  on the action or the cue within 450ms (a double click or tap), and a second activation of the same flight,
  which simply carries on at the speed it has (no stall and restart).
- **Lands** on the list's rest position (`#lista` top = the end of the run, the same place as the anchor and
  Tab), with the title and the email field in view; the list's words rise in during the last 300ms of the flight
  and are at rest when it lands. The
  focus moves to the email field with `preventScroll`; the field is described by the list sentence («Deixe-nos o
  seu email e avisamos quando abrirmos.»), so a screen reader says where it arrived as the focus lands.
- **Never animated:** `prefers-reduced-motion: reduce` (the same landing at once, focus in the field), a
  `#lista` link on load (a jump), Tab into the form (a jump), no JS (a plain anchor). Scrolling back up after
  a flight returns the hero to its exact rest state (tested).

### Layers and performance budget
- Budget: under 4× CPU throttle, at 390 × 844 (DPR 3) and 1440 × 900 (DPR 1), Dia and Noite: no frame over
  50ms and p95 ≤ 17ms while the page moves (the walk-in on request included).
- Promotion: nothing has `will-change` in CSS. When the sequence starts (or on a `wheel` / `touchstart` at the
  top, just before it starts) site.js sets `will-change` on the camera (`transform`), the lit hall and the
  spill (`transform, opacity`: their raster scale is frozen while the camera zooms), the text column, and the
  layers whose opacity changes per frame (cue, hand-off, flood). Without the opacity layers every change
  repainted the doorway inside the zooming camera layer and the browser re-rastered it at the new scale every
  frame: 2.7s of raster per pass and frames up to 230ms at 1440 × 900. Hiding the hall in shadow once it is
  covered (p ≥ 0.36) removed the other big raster cost (its dense hatching at full zoom). A mouse arriving over
  the first screen readies the two drawn layers (camera, lit hall) at their rest scale, never the text: the
  first frame of a wheel scroll then only creates the light layers (it measured 67–83ms at 1440 × 900 under 4×
  throttle in half the runs; 33ms after). The price: when the mouse first moves, the drawing is re-rastered in
  its own layer and 2.5% of its pixels shift by antialiasing (90% of them by 1–3 levels of 255; measured at
  1440 × 900 by day), a change the eye does not see and the same image the first scroll frame shows anyway.
  The list's words are not promoted: their opacity repaints them (cheap), and a promoted text layer can lose
  subpixel antialiasing at rest.
- Crisp at rest: 250ms after the scroll rests mid-sequence, the two drawn layers (camera, lit hall) are handed
  back for one frame (they re-raster crisp at the current zoom) and promoted again at that scale, so the next
  scroll starts without raster work. Back at the top (p = 0) all hints are dropped after 400ms. Once the flood
  covers the drawing (p ≥ 0.76) the hints are kept: there is nothing to re-raster.
- Crisp during the walk-in on request: a promoted layer keeps the raster made when it was promoted, which at
  3–8× zoom was a visibly soft, upscaled bitmap for most of the flight. So during a flight, while the zoom grows
  past 2.2× the scale of the last raster (and the hall has not yet turned to light, p < 0.66), the two drawn
  layers are handed back for one frame each, one after the other, and promoted again: a fresh raster at the
  current zoom, about twice per walk-in. Not after the light: then only the jambs are left, passing out of the
  frame fast, and a raster of their stone and lamplight at 4–8× cost frames of 50–67ms at 1440 × 900. Edge contrast of the hall mid-flight at 1440 × 900, DPR 1 (frame-by-frame screencast,
  same scale): 1.4–5.4× higher than before (e.g. 1192 against 356 at s = 5.5 by day), close to a rest capture.
  A hand scroll keeps the raster it has while it moves (re-rastering under a fast wheel cost frames of 33–50ms at
  1440 in the trace) and turns crisp when it rests (below); that soft-then-crisp step at rest remains.

### Other motion
| Token | Duration | Easing | Use |
|---|---|---|---|
| `--dur-door` | 1100ms (+200ms delay) | `--ease-door` cubic-bezier(.3,.1,.2,1) | leaves rotate 0 → 41° / 27° once on load |
| (light) | 1100ms | `--ease-out` | hall glow, light pool, lit leaf edges fade in with the doors (Noite) |
| `--dur-theme` | 400ms | `--ease-out` (0.23, 1, 0.32, 1) | Dia ↔ Noite chosen by the visitor: View Transitions cross-fade; colour transitions as fallback (never on `[data-motion]` layers; no snapshot while the sequence is moving) |
| `--dur-sky` | 1400ms | `--ease-sky` (0.45, 0, 0.55, 1) | Dia ↔ Noite changed by the sun on its own (nobody pressed anything): slower and symmetric, the lamps come on rather than flash. While the sequence is moving it waits until the page rests; parked anywhere (the list included) it cross-fades |
| `--dur-state` | 200ms | `--ease-out` | form messages, checkbox tick (opacity + scale 0.8 → 1) |
| `--dur-out` / `--dur-success` | 160ms / 240ms | `--ease-out` | success: the controls give way, the sentence takes their place |
| `--dur-flight` | 1200ms (whole way) | `--curve-flight` (0.45, 0, 0.3, 1) over the weighted way (`--flight-weight` 2) | the hero action and the scroll cue walk in through the door to the list |
| `--rise-list` | 16px of rise (the form 10px), on p 0.745 → 0.94 | `--ease-out` on p | the waiting list rises in on the light, with the scroll (no time-based entrance any more) |
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
- Reduced motion and the theme: the change is instant, and the controls and links change with it (their colour
  transitions are held for that frame), so the control just pressed never flickers through a low-contrast mix.
- Keyboard: Enter or Space on the action plays the walk-in and lands in the email field; Tab from the action
  lands on the email field with the list in view at once; focusing anything in the pinned first screen
  mid-sequence rewinds to the rest state, so focus is never on an invisible element. A tap or a click never
  moves the page (Driver › Focus moves the page for the keyboard only).

### Measured
Playwright (headless Chromium, software raster), 4× CPU throttle via CDP, traced with CDP tracing
(devtools.timeline); frame intervals are `requestAnimationFrame` intervals counted while the page moves.
390 × 844 at DPR 3, 1440 × 900 at DPR 1, Dia and Noite.

**Round 3 (the short run; this build)**, harness `tools/integ/perf.js` (wheel gesture down into the list and back
up, and finger drags) and `rework-tools/perfflight.js` (the walk-in on request, from the click to the frame after
the landing), all under 4× CPU throttle. The machine was shared with other jobs (load average about 2 on 4
cores), so single long frames vary between runs:

| Scenario | Viewport | Runs | p95 frame | Worst frame | Frames > 50ms | Raster per pass |
|---|---|---|---|---|---|---|
| Wheel down + up | 390, DPR 3 | 6 | 16.7–16.8ms | 33.3ms (once 50.0ms, the first frame) | 0 | 16–20ms |
| Wheel down + up, the mouse arriving first (as a visitor does) | 1440, DPR 1 | 8 | 16.7–16.8ms | 33.3ms (once 50.0ms, the first frame) | 0 | 31–43ms |
| Wheel down + up, no mouse movement at all before the wheel | 1440, DPR 1 | 6 | 16.7–16.8ms | 50ms; 67–83ms in 3 runs (the first frame: the layers are created) | 0–1 (first frame) | 31–43ms |
| Finger drags (touch events) | 390, DPR 3 | 4 | 16.7ms | 16.8ms (once 33ms) | 0 | 36–38ms |
| The walk-in on request | 390, DPR 3 | 8 | 16.7–16.8ms | 16.8–33.4ms during the travel; once 67ms in the press frame before it moves | 0 during the travel | — |
| The walk-in on request | 1440, DPR 1 | 8 | 16.7–16.8ms | 16.8–33.4ms; twice 50.0ms | 0 | — |

Two costs found and removed this round: a class toggled on `html` at the hand-off restyled the whole document
(frames of 50–67ms at the moment the screen turns one colour; now an inline style on body, 0 such frames), and
the flight's re-raster during the jambs' exit (50–67ms at 1440; now it stops when the hall is light). The
previous build under the same harness the same day: 83ms in 1 of 6 wheel runs at 1440 (the first frame).

Before round 3 (the former 144svh run):

| Scenario | Viewport | p95 frame | Worst frame | Long tasks (> 50ms) | Raster per pass |
|---|---|---|---|---|---|
| Wheel gesture down through the sequence into the list and back up (3 runs per case) | 390 | 16.7–16.8ms | 16.8ms (one run: one 33ms frame) | 0 | 9–12ms |
| same | 1440 | 16.7–16.8ms | 33ms; once 50.1ms (the first frame, when the layers are created) | 0 | 29–49ms |
| Four legs down and four up with 600ms rests (the crisp re-raster at rest, then resume) | 390 | 16.7–16.8ms | 16.8ms | 0 | 9–12ms |
| same | 1440 | 16.7–16.8ms | 33–50ms (the first frame) | 0 | 35–65ms |
| Finger drags (touch events, 18px per frame) | 390 | 16.7–16.8ms | 16.8–33ms | 0 | 10–15ms |

After this round (crisp walk-in, edgeless lamplight, the list lamp; reviewer harness `perf.js`, 4× CPU throttle,
traced, one run per case): the walk-in on request at 390 × 844 (DPR 3) and 1440 × 900 (DPR 1), Dia and Noite,
p95 16.7–16.8ms, worst frame 16.8–33.3ms (at most one frame over 17.5ms), none over 50ms, raster 76–87ms per
flight at 390 and 218–228ms at 1440 (it was 11–32ms: the price of the fresh rasters); the wheel gesture as
before (p95 16.7–16.8ms, worst 33.4ms, raster 18–90ms). The two main-thread tasks of about 50ms at the click at
1440 (Dia) were there before this round (53ms).

The walk-in on request before this round (same harness: a click, then every rAF interval from the first moving
frame to the frame after the landing, traced; 3 runs per case, no harness polling while it flies):

| Case | Viewport | Flight | Frames | p95 frame | Worst frame | Frames > 17.5ms |
|---|---|---|---|---|---|---|
| Action, Dia / Noite | 390 × 844, DPR 3 | 1483ms | 90 | 16.7–16.8ms | 16.8ms | 0 |
| Action, Dia / Noite | 1440 × 900, DPR 1 | 1483–1500ms | 90–91 | 16.7–16.8ms | 16.8ms | 0 |
| Scroll cue, Noite | 390 × 844, DPR 3 | 1483ms | 90 | 16.7ms | 16.8ms | 0 |

The hand-scroll case was re-measured after the change and is as before (p95 16.7–16.8ms, worst 33ms, 0 over 50ms).

Before this pass (the former build with the ViewTimeline driver, same harness, all frames): p95 33ms and
frames up to 67ms at 1440, with 1.1–1.2s of raster per pass; the first version of the plain-JS driver,
before the opacity layers were promoted, reached 2.7s of raster and frames of 200–230ms. The rest state at p = 0 is pixel-identical to the
approved drawing (only the pendant's antialiasing differs, it moved into its own layer).
Real devices are still to be checked (see Roadmap).

## Dia & Noite (extension)
Which one shows: the visitor's stored choice; otherwise Torres Vedras time (Dia while the sun's altitude over
39.09 N, 9.26 W is above −0.833°, the standard sunrise and sunset; Noite otherwise), decided by the head script
before the first paint, so there is no flash, and said by the sun note.

**The system's dark mode** (decided in round 3, review round 2 #1): it does not override the sky. The brief asks
for the default to follow the sun «when the visitor has not chosen», and a system setting is not a choice made
on this site; the live site (which the client tested) already behaves so, and the previous local build had let
an always-dark phone skip both the sun and the approved Dia caderno hero (at Lisbon midday it got Noite). One
press on Noite is remembered from then on. Without JavaScript the system theme still decides (CSS
`prefers-color-scheme`), so nobody who asks for dark gets a theme flash. The rule was lopsided before too (dark
always won, light at night still got Noite).
If the sun rises or sets while the page is open, the theme changes once, at that minute, with the slow 1.4s
cross-fade (`--dur-sky`; it waits while the sequence is moving; a tab back from the background catches up at
once); never while the visitor has chosen. Without JavaScript the system theme decides, as before. Noite is the
house at night, not a low-light mode: the waiting list is lamplight (#FCE7BC) in both themes, by design (the hall
you walk into is lit).
`[data-theme]` on any element scopes a theme to that subtree (the styleguide shows both side by side); the
semantic block for Noite is written once in `src/noite.css` and emitted twice by the build (system preference
unless Dia was chosen, and the manual choice). Illustration roles that change: ink colours and opacities (`--i-ink*`,
`--ink-o*`), every wash (`--w-*` colour, `--wo-*` glaze opacity), `--i-hall-light` (flat hall by day,
lamplight gradient at night), `--i-room-base`, `--o-night` (lamplight layers), `--o-day` (sun shadows),
`--o-turn` (a turned leaf darkens by day). `--color-hall` changes too (`--sala-dia` / `--sala-noite`), and
`--color-field-hall` (papel / luz-nucleo).

## A distinctive touch (extension)
The brief asked whether one distinctive touch should be added for atmosphere, beyond a premium interface. Four
candidates from the brief were prototyped on the built page (injected, outside the build), recorded and judged
against the motion budget (taste-skill: one hero motion per page, the door), Emil's first question (should
this animate at all: purpose, frequency, what it costs the next action) and the Jobs filter (does it say
something only this house can say, or is it decoration). One is kept.

| Candidate | Prototype and measurement | Verdict |
|---|---|---|
| **Torres Vedras time**: the default Dia / Noite follows sunrise and sunset over the house | the sun's altitude at 39.09 N, 9.26 W from a low-precision solar ephemeris in the head script (about 600 bytes): sunrise/sunset within 1–2 minutes of published times for 2026 (8 Nov 07:13 / 17:29 UTC, 21 Jun 05:12 / 20:07, 21 Dec 07:53 / 17:18); 18 checks (both system schemes, stored choice, manual toggle, every page, a sunset while the page is open) | **Kept**, and made perceptible on every screen (round 3): one short sentence under the control, «É noite em Torres Vedras.», in the house's serif, only while the sky decides (also the buttons' description for screen readers). A visitor in São Paulo at 19:00 sees the lantern lit and reads why: it is night in Torres Vedras. It says something only this house can say. Before round 3 it was screen-reader-only on phones and, on desktop, sat in the menu row in the control's voice, where it read as a third menu item. |
| **Ink draws itself** on first visit (contours, then washes bloom) | stroke-dash draw of the ink paths (top to bottom, 0.5s stagger, 0.9s each), washes fade in at 1.0s; holds 60fps under 4× throttle but rasters 133ms (390, DPR 3) / 316ms (1440) during the load window | **Removed.** It spends the page's one load gesture twice (the doors already ease ajar), withholds the approved drawing for 1.5s on the visit that matters most (the first), shows a grey wireframe on the way, and the line-draw reveal is a common template trope. |
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
| button | Entrar na lista de espera · A enviar… (the action's words, one label for the one action) | Join the waiting list · Sending… |
| success | Obrigado. Já está na lista. (round 3: no longer repeats the sentence above it) | Thank you. You are on the list. |
| invalid email | Verifique o email. | Please check the email address. |
| consent missing | Confirme que aceita receber emails. | Please confirm you agree to receive emails. |
| send error | Não foi possível enviar. Tente de novo dentro de momentos ou escreva para inn@abrazileira.com. (a mailto link) | We could not send it. Please try again in a moment or write to inn@abrazileira.com. |
| no JS | Para se inscrever, ative o JavaScript ou escreva para inn@abrazileira.com. | To sign up, please enable JavaScript or write to inn@abrazileira.com. |
| drawing | Desenho de uma entrada em arco de pedra, com portas duplas de madeira. | Drawing of an arched stone entrance with double wooden doors. |
| footer | © 2026 A Brazileira · Torres Vedras, Portugal · Privacidade | … · Privacy |
| sun note | É dia em Torres Vedras. · É noite em Torres Vedras. | It is daytime in Torres Vedras. · It is night in Torres Vedras. |
| 404 | Esta página não existe. · Voltar ao início | This page does not exist. · Back to home |

The only contact on the site is inn@abrazileira.com (privacy notice, the no-JS line and the send error).
The round 3 copy changes (sun note, success, send error, button label) are new pt-PT lines: they need the client's
sign-off.
Open Graph: `assets/img/og.png`, 1200 × 630, Noite (lockup + lit entrance, doors ajar); kept as shipped,
`src/og.py` can redraw it from the real components.

## Accessibility (extension)
WCAG 2.2 AA (see the contrast matrix; reading text 7:1 and above). One h1 per page. Landmarks: header, main,
footer, nav (language), group (theme), section (waiting list, labelled by its h2). Skip link is the first Tab
stop. Tab order (home): skip, Dia, Noite, PT, EN, action, email, consent, privacy link, button, footer link;
the scroll cue and the honeypot are out of the order. Focus ring visible on every ground (also on the drawn
checkbox). Drawing: `role="img"` with a short description; its parts are presentational. Form: real labels,
`aria-invalid` + `aria-describedby` inline messages, focus to the first invalid field, `role="status"` for
sending outcomes (always rendered, so it is announced), `aria-busy` while sending, 44px targets (the inline
privacy link reaches 44px into the free space below its line). The email field is described by the list
sentence. The sun note describes both theme buttons while the sky decides. `prefers-contrast: more` lifts muted
text to the strong ink (on the hall too) and draws the drawing's fine lines, hatching and cross-hatching at
(nearly) full ink (`--ink-of` 1, `--ink-oh` 0.9, `--ink-ox` 0.8); forced colours turn the drawing into a clean
CanvasText line drawing and hide the light layers; print drops the pinning, the top bar, the scroll cue and the form. Keyboard and the sequence: Enter or
Space on the action plays the walk-in (any key stops it) and lands in the email field; Tab from the action
lands on the email field with the list in view (a jump, no replay of the sequence); focusing anything
in the first screen mid-sequence rewinds to the rest state, so focus is never on an invisible element. Only
keyboard focus moves the page: a tap or a click into the form (or anywhere) never scrolls it under the pointer.
Before the run brings it in, the list's content has no pointer target but stays in the Tab order and the
accessibility tree (nothing is made inert or hidden).

## Implementation notes (extension)
- Source: `src/` (build.py, scene.py, hand.py, site.css, site.js, tokens.tpl.css, noite.css, styleguide.py,
  og.py, `assets/` with the emblem, fonts, icons, favicon and og.png, `tests/`). `python3 src/build.py`
  rebuilds `docs/` completely; every path is relative to `build.py`, nothing is read from outside `src/`.
  `scene.py` models the doorway in metres and projects it; `hand.py` turns every edge into seeded pen and
  brush geometry (see Components › entrance). The build is deterministic.
- Tests (Playwright + Chromium, never touching the real endpoint; they need `require("playwright")` to resolve:
  `npm i -D playwright && npx playwright install chromium` in the repository, or a global install on
  `NODE_PATH`): `node src/tests/reverse-scroll.test.js docs` (the reverse-scroll / overscroll / toolbar
  regression plus fast flicks, 56 checks; it chooses Dia or Noite explicitly, since the default follows the sky)
  and `node src/tests/cta.test.js docs` (63 checks: the walk-in on request at 390 and 1440, from PT and EN, in
  both themes and the default sky theme with a pinned clock: click, Enter, Space, the scroll cue, a held Space or
  Enter and a double click fly forwards only, 1.1–1.3s, without a stall, with the scene playing, and land with
  the title and the email in view and the focus in the email; a wheel, a key, a pointer press or a touch stops
  it and nothing moves afterwards; a tap where the faded action was does nothing; Tab, reduced motion and
  `#lista` on load jump without a replay; after a flight, wheeling back up restores the exact rest state; the
  colour hand-off is ΔRGB 0 on every pixel of the frame (list words and footer text excepted) from the moment the
  screen is one colour, mid-rise, at p = 1 and with the seam on screen, Dia and Noite, at 390 × 844, 430 × 932,
  375 × 667, 320 × 568, 844 × 390, 768 × 1024, 1440 × 900, 1920 × 1080 and 2560 × 1080; on 320 × 568, 375 × 553, 375 × 667 and 390 × 664
  the door stands on the floor line in the first screen and the cue is never sliced) and `node
  src/tests/list.test.js docs` (50 checks: a tap or a click on the email field or the button never moves the
  page, at three rest positions on 390 × 844 and 375 × 667 by touch and 1440 × 900 and 1280 × 720 by mouse, and the
  button's first press runs the validation; the list's words are never invisible on the flat colour and are at
  rest after a reload at the bottom, on six screens including 844 × 390 and 1440 × 900 at 200%; the scroll to the
  readable form is 0.9–1.2 screens on six viewports; the send error carries the mailto link and the success line
  sits where the field was, PT and EN; the sun note shows on phones, in Alegreya, with dark mode not overriding
  the sky, clear of the crest at five sizes). `src/tests/png.js` decodes the screenshots (Node's zlib only).
- Output: `docs/index.html`, `docs/en/index.html`, `docs/privacidade/index.html`, `docs/en/privacy/index.html`,
  `docs/404.html`, `docs/design/index.html` (noindex, unlinked styleguide), `assets/css/tokens.css`,
  `assets/css/site.css`, `assets/js/site.js`, fonts, images, `favicon.svg`, `robots.txt`, `sitemap.xml` (home
  and privacy, with hreflang), `site.webmanifest`, `.nojekyll`.
- Cache busting: the build stamps every local CSS/JS URL with `?v=<sha256 prefix>` (GitHub Pages caches for
  10 minutes; this keeps HTML and CSS/JS in step).
- Shipped CSS and JS are stripped of comments and indentation by build.py (`min_css`, `min_js`; the build asserts
  the CSS is unchanged once whitespace is ignored and that no `//` comment exists); `src/` keeps every comment.
- Internal URLs are relative (the tests serve the site under `/abrazileira/`; production is `/`); canonical,
  hreflang and OG are absolute `https://abrazileira.com/…`. No cookies, no analytics; apart from the host (GitHub
  Pages), the only third-party request is the form submit to Supabase (EU).
- Raw hex appears only in tokens.css, plus what cannot read CSS: the two `theme-color` metas, the manifest and
  favicon.svg.
- Budget, measured on the home page with gzip -9 (fonts as shipped): 140.6 kB — HTML 60.1 (round 3: the list
  lamp removed, −0.5), CSS 9.9 (tokens 3.6, site 6.4; comments stripped), JS 8.4 (round 3: +1.5, the camera's
  keyframes, the input modality, the list's rise, the mailto in the error), fonts 62.2 (Cinzel 40.7, Alegreya 12.5,
  Alegreya Sans 9.0); target 150 kB, ceiling 170 kB (og and icons
  excluded). The privacy notice is about 92 kB. The drawing is inline SVG (the caderno line work is most of the HTML). CLS 0 on every page
  (the wrapper grows below the fold). LCP is text.

## Responsive behavior

| Name | Query | Key changes |
|---|---|---|
| Stacked (default) | portrait, below 900px | lockup · lede · status · action, then the entrance on the floor line (door axis on the page axis), then the cue band; the wash overshoot stays clear of the action |
| Tight portrait | `(orientation: portrait) and (max-height: 42.5em)` (≤ 680px tall) | top bar inset 4px, lede 16px above, action 8px under the status, 16px between the action and the wash, compact cue band |
| Very short portrait | `(orientation: portrait) and (max-height: 37.5em)` (≤ 600px tall) | lockup at its 24px minimum, lede 12px above, no cue band, the drawing takes the height that is left (the door stands on the floor line in the first screen) |
| Split | `(min-width: 56.25em), (orientation: landscape) and (min-width: 37.5em)` | 5fr text \| 6fr entrance, 64px apart, container 86rem; lede 48px under the lockup; action 48px under the status; top bar inset follows the container |
| Short landscape | `(orientation: landscape) and (max-height: 31.25em)` | compact split: lockup 24–28px, lede 18px, status 4px under it, action right under it, entrance min 16rem |
| Action steps | `(min-width: 56.25em)`; `(min-width: 75em)` | the action and the button 18px; then 20px |
| Footer lines | `(max-width: 29.99em)` | name, place and link on three lines, no separators |
| Narrow PT lede | `(min-width: 20em) and (max-width: 22.49em)` (and small landscape phones) | the Portuguese lede one phrase a line (a plain wrap at 14.4em) |
| Sun note | every width; `(min-width: 56.25em) and (min-height: 37.5em)` | its own line under Dia · Noite; the stage clears it by 12px (`--sol-h`) except on screens from 900 × 600, where the crest is far below |
| Wide | `(min-width: 120em)`; `(min-width: 160em)` | root 112.5%; 131.25% (everything scales together) |
| Large text | any width, browser text size 150–200% | the top bar wraps instead of overflowing; the list column shrinks to the screen (minmax(0, 1fr)) and long words wrap |

Touch targets: 44px for every control and link (the inline privacy link reaches 44px into the space below its
line); the field and the button are 48px. Nothing collapses into a menu: there are only two controls.

## Do's and Don'ts

Do:
- Use the original logo exactly (emblem.svg + Cinzel lockup files, byte-identical), at 24px or more.
- Read colours through the semantic roles (`--color-*`) and the drawing's roles (`--i-*`, `--w-*`); add new
  values to tokens.css first.
- Keep one action per screen and give it the only full-ink underline there.
- Mark a current control with ink and the brass tick; keep underlines for links.
- Keep `--color-hall` the one colour of the door's last light, the flood and the waiting list (ΔRGB 0).
- Move only `transform` and `opacity`; promote layers only while they move.
- Give every interruption back to the visitor at once (wheel, touch, key, pointer).
- Respect the visitor: a stored choice, then the sky over the house (the system's dark mode decides only
  without JavaScript).
- Move the page on focus for the keyboard only; a tap or a click never moves it.
- Re-run the CLS fallback tuning after any copy change, and the contrast matrix after any colour change.
- Write pt-PT first, plain and factual.

Don't:
- Recolour, redraw, outline or animate the logo; set its words in another face or tracking.
- Add tracked capitals, italics, bold, exclamation marks, emoji or virtue words outside the logo.
- Add shadows, glass, gradients in the interface, cards, panels, dividers or rounded corners (the focus ring's
  2px is the only radius).
- Add ornament that says nothing, or a second copy of something the visitor has just seen (the list's own lamp
  was removed in round 3).
- Add a second gesture on load, ambient loops, parallax, cursors, counters or sound.
- Use `scroll-behavior: smooth` or hijack native scrolling; the walk-in is the only programmatic scroll.
- Fade a flat colour over the stone or the tree; the hand-off is colour over the same colour.
- Put raw hex outside tokens.css (except the theme-color metas, the manifest and favicon.svg).
- Quote private correspondence or name people in the repository.
- Store anything about the visitor other than the Dia / Noite choice.

## Iteration guide
1. Change one component at a time and name its token.
2. New values go into tokens.css first (primitive, then role); components read roles only.
3. Re-measure the contrast matrix after any colour change (the hall surface too).
4. Keep the logo untouched; new pages reuse `.lockup`.
5. Keep tracked capitals inside the logo and sentence case everywhere else.
6. Change the drawing in `src/scene.py` (metres, one-point perspective), never by hand in the HTML.
7. Change the sequence in the table in `src/site.js` (element, p range, curve, values) and the curves in
   tokens.css (`--curve-*`); keep it transform and opacity only, re-record it (frame by frame) at 390 and
   1440, both themes, and re-run `src/tests/` and the 4× CPU trace (no frame over 50ms, p95 ≤ 17ms).
8. Any new layer whose opacity changes per frame joins the promotion list in site.js (`LAYERS`).
9. Re-run the copy check (banned words, privacy) after any text change.
10. Prefer more space over more ornament.

## Agent prompt guide
- Canvas papel #F9F0E9 / noite #1C120B · hall #F2DEC4 / #FCE7BC · text nogueira #5F3819 / linho #F3E6D6 ·
  strongest tinta #2E1E14 · muted castanho #804F1E / linho-escuro #C2AE96 · brass text latao-texto #83602C
  by day, latao #DB9E42 by night · errors barro #9E3B1E on the hall only.
- "A control in the A Brazileira system: Alegreya Sans 500, 16px, tracking 0.018em, sentence case, colour
  `--color-text-muted`, 44px target, current state = `--color-text-strong` with a short 2px brass tick
  (`--color-accent-text`) centred under the word (never an underline: underlines are links), focus = 2px solid
  `--color-focus`, offset 3px."
- "A form on the hall: `.surface-hall`, 26rem column, Alegreya Sans 500 16px labels above 48px square fields
  (Alegreya 400 18px text; papel by day, luz-nucleo by night, 1px nogueira), a full-width 48px tinta button with
  papel text in Alegreya Sans 16/18px, the consent in Alegreya 16/24px, errors in barro 16px under the field with
  aria-invalid/aria-describedby, outcomes in a role=status line."

## Roadmap and known gaps
- Real devices for the walk-in on request: iOS Safari (programmatic scroll per frame while the toolbar
  collapses) and Android Chrome (the focus at the landing may raise the keyboard, since the click's user
  activation is still valid 1.2s later). And the round 3 run on the client's iPhone: the short run is tuned on
  headless Chromium (touch drags emulated through CDP, no real momentum); one swipe should now reach the form.
- Deploy: the live site lags this build (review round 2 #7: cache-busting hashes and the head theme script
  differ). Publish once this round lands, then re-check the live index, en/, privacidade/ and 404 against the
  build. The repository has since moved to fingerprinted file names (its last commit); keep that when merging.
- The first frame of a wheel scroll at 1440 × 900 with no mouse movement before it (a scripted or a touchpad
  scroll that does not move the pointer) still creates the drawn layers: 67–83ms in 3 of 6 runs under 4×
  CPU throttle with software raster (the previous build: 83ms in 1 of 6). A visitor's mouse arriving first
  readies them (33ms worst after).
- Real-device pass on iOS Safari (17–26) and Android Chrome for the single driver, rubber-band overscroll and
  the collapsing toolbar: the headless runs above use Chromium only (WebKit was not available here), and the
  iOS overscroll is emulated in the regression test, not reproduced.
- Raster figures above come from headless Chromium with software raster; real GPUs raster faster, phones
  with little GPU memory may need the promotion list trimmed (it is 7 layers plus the two leaves).
- Real photography of the house once restored (not before; the drawing must not become the façade).
- Content pages (rooms, ground floor, contacts) reuse these tokens and the hall surface.
- Cinzel could be subset further to capitals only (about 30 KB saved).
- A double opt-in email and an unsubscribe link belong to the sending tool, not this page.
- Mail: inn@abrazileira.com is the only contact the site publishes (rights, withdrawal, the no-JS sign-up). The
  domain has no MX record yet; Email Routing for inn@ must be set up and tested from an outside mailbox
  (DEPLOY.md §4) before the address can receive anything.
- Retention: the notice promises at most 24 months; the database has no scheduled purge yet (a pg_cron delete of
  rows older than 24 months, or a dated manual task).
- The controller is named by its trade name only («A Brazileira»); the legal identity is the client's to add.
- Domain: canonical points to abrazileira.com; the .pt redirect is outside this repository.
