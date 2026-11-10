---
version: alpha
name: A Brazileira · Boutique Hotel
description: >-
  A coming-soon page for a boutique hotel in Torres Vedras, Portugal, and step 1 of its design system.
  The canvas is the photograph's own wall: its lime plaster (parede #FAECDF) by day, never white, and the dusk
  wall beyond the lantern (parede-noite #1C140F) by night, never black. The voice is the client's identity pitch:
  the original crowned B in a laurel wreath over the pitch's own wordmark A BRAZILEIRA, drawn as a vector in Verde
  Torres (a heavy flared Roman with the ornamental B and kicked R's, the pitch's reading of the façade's
  lettering), and BOUTIQUE HOTEL · TORRES VEDRAS in widely spaced Cinzel capitals; the pitch's shield monogram is on
  hold; everything the house says, and the interface, is
  set in EB Garamond, in sentence case. Brass (latão) is ornament and logo by day and light by night. Two surface worlds, Dia and Noite,
  switch the whole page, including the photograph. The signature is a photograph of an arched limestone doorway
  (walnut double door, fanlight, wall lantern, an olive in a clay pot), cut into layers: scrolling swings the doors
  inwards, walks in through the doorway into a limestone-and-lime hall and on into its light, one flat colour, where
  the waiting list is. The same entrance drawn in real 3D, with the photograph itself as the skin (real thickness,
  raised panels, brass knobs and hinges), is drawn by default wherever the device can draw it, with the photograph in
  layers as its automatic fallback (Motion › The 3D entrance). Shapes are square-cut; depth comes only from the photograph and
  its light. The rule is restraint: one message, one action, no ornament.

colors:
  # primitives (tokens.css, layer 1)
  papel: "#F9F0E9"          # form fields on the hall by day; the button's text
  parede: "#FAECDF"         # the wall in soft daylight = the page by day (sampled from the photograph's plaster)
  parede-noite: "#1C140F"   # the dusk wall beyond the lantern = the page by night
  areia: "#F0DFCF"          # lit stone, glass by day, skip-link surface
  pedra: "#DECDBD"          # limestone face
  oliva: "#72692E"          # olive (reserved: was the drawing's leaves; no use on the page now)
  azulejo: "#6F7A4A"        # glazed tile (reserved; no use on the page now)
  castanho: "#804F1E"       # walnut doors by day; muted text 5.93:1 on parede
  nogueira: "#5F3819"       # text, focus, hairlines, field borders; 8.77:1 on parede
  tinta: "#2E1E14"          # strongest text, the button; 13.82:1 on parede
  verde-torres: "#24281B"   # Verde Torres, the identity pitch's ink (its palette circle): the wordmark and its line by day; 13.00:1 on parede
  latao: "#DB9E42"          # brass; 2.02:1 on parede = ornament only by day; 7.77:1 on parede-noite
  latao-marca: "#A57638"    # emblem by day (graphic, 3.45:1), close to the original logo gold
  latao-texto: "#83602C"    # brass-hued small text by day, 4.93:1 on parede
  noite: "#1C120B"          # walnut night: night surfaces and hairlines are mixed from it
  linho: "#F3E6D6"          # text by night, 14.79:1 on parede-noite
  linho-escuro: "#C2AE96"   # muted text by night, 8.47:1 on parede-noite
  luz-nucleo: "#FFF2D6"     # lamplight core: form fields by night
  luz: "#F4C978"            # lamplight body (sala-noite is derived from it)
  barro: "#9E3B1E"          # terracotta (handmade ceramics): form errors only; 5.17:1 / 5.58:1 on the hall
  sala-dia: "#F2DEC4"       # the lit hall by day (= latao 22% in papel, stored as exact sRGB hex)
  sala-noite: "#FCE7BC"     # the lit hall by night (= luz-nucleo 72% in luz, stored as exact sRGB hex)
  # semantic roles (tokens.css, layer 2). Keys are the CSS custom properties without "--"; the plain key is the
  # Dia value, "-on-night" the Noite value ([data-theme="noite"], or the system's dark mode when nothing was chosen)
  color-bg: "#FAECDF"                  # parede: the page is the photograph's wall
  color-bg-on-night: "#1C140F"         # parede-noite
  color-text-strong: "#2E1E14"         # tinta: active control, the action
  color-text-strong-on-night: "#F3E6D6"   # linho
  color-text: "#5F3819"                # nogueira: the lede, reading text
  color-text-on-night: "#F3E6D6"       # linho
  color-text-muted: "#804F1E"          # castanho: inactive controls, separators, footer, scroll cue
  color-text-muted-on-night: "#C2AE96" # linho-escuro
  color-accent-text: "#83602C"         # latao-texto: the status, the sun note, the control tick
  color-accent-text-on-night: "#DB9E42"   # latao
  color-mark: "#A57638"                # latao-marca: the emblem (graphic)
  color-brand-ink: "#24281B"           # verde-torres: the wordmark and the lockup's line
  color-brand-ink-on-night: "#F3E6D6"  # linho
  color-mark-on-night: "#DB9E42"       # latao
  color-ground: "#5F3819"              # nogueira: hairline rules (styleguide)
  color-ground-on-night: "#75685D"     # pedra 46% in noite (3.37:1 on parede-noite)
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
  wordmark:                   # «A Brazileira»: not a font; the pitch's lettering as a vector (assets/img/wordmark.svg), inline
    drawing: "assets/img/wordmark.svg, 2316.2 x 369, 11 paths, fill currentColor, aria-hidden"
    fontSize: "clamp(min(2.25rem, 16vw), min(1.35rem + 3.5vw, 8.2svh), 4.5rem)"   # the lockup's em: 36 -> 72px
    width: "6.8em of the lockup (--lockup-wordmark): 245px at 36px, 490px at 72px, 204px at the 30px minimum"
  label-lockup:               # BOUTIQUE HOTEL · TORRES VEDRAS
    fontFamily: "Cinzel, 'Cinzel lockup fallback', 'Times New Roman', serif"
    fontSize: "max(0.32em, 11px) of the lockup on two lines (in the split layout never larger than the one line); max(0.0271 of the wordmark's width, 11.2px) on one line (home, from 900 x 500, when it fits the column)"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0.42em
    textTransform: uppercase
  label:                      # «Lista de espera» (19px); the privacy notice's section names (17px)
    fontFamily: "Cinzel, 'Cinzel list fallback', 'Times New Roman', serif"
    fontSize: "19px (list) / 17px (section names)"
    fontWeight: 400
    lineHeight: "1.3 / 1.47"
    letterSpacing: 0.2em
    textTransform: uppercase
  title:                      # «Nota de privacidade»
    fontFamily: "'EB Garamond', 'Garamond title fallback', 'Times New Roman', serif"
    fontSize: "clamp(1.75rem, 1.5rem + 1vw, 2.375rem)"   # 28 -> 38px
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: 0
  lede:                       # the sentence; the list sentence; the privacy intro (never under 22px); the 404 lines; the thank-you
    fontFamily: "'EB Garamond', 'Garamond lede fallback', 'Times New Roman', serif"
    fontSize: "clamp(1.1875rem, min(0.9rem + 1.5vw, 3.4svh), 1.75rem)"   # 19 (320) -> 20 (390) -> 28px
    fontWeight: 400
    lineHeight: "calc(1em + 0.45rem)"   # 20/27, 28/35
    letterSpacing: 0
  read:                       # privacy notice body; the email the guest types; the no-JS line
    fontFamily: "'EB Garamond', 'Garamond fallback', 'Times New Roman', serif"
    fontSize: 19px
    fontWeight: 400
    lineHeight: 1.5789        # 19/30
    letterSpacing: 0
  consent:
    fontFamily: "'EB Garamond', 'Garamond consent fallback', 'Times New Roman', serif"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.47          # 17/25
    letterSpacing: 0
  cta:                        # the one action, the button, the back link
    fontFamily: "'EB Garamond', 'Garamond cta fallback', 'Times New Roman', serif"
    fontSize: "17px below 900px, 19px from 900px, 21px from 1200px"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "0.01em / 0.008em"
  ui:                         # Dia · Noite, PT · EN (0.08em), status, labels, messages, footer
    fontFamily: "'EB Garamond', 'Garamond UI fallback', 'Times New Roman', serif"
    fontSize: 17px
    fontWeight: 500
    lineHeight: "1.25 one line, 1.47 multi-line"
    letterSpacing: 0.01em

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
    textColor: "{colors.color-brand-ink}"
    markColor: "{colors.color-mark}"
    labelColor: "{colors.color-brand-ink}; its « · » {colors.color-mark}"
    typography: "{typography.wordmark}; {typography.label-lockup}"
    minSize: "30px lockup em (--size-lockup-min): the wordmark 204px wide; the wordmark alone 120px"
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
    typography: "EB Garamond 400, 17px / 21px, tracking 0 (the house speaking, not a control)"
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
  scroll-cue:                 # the pen-drawn chevron under the photograph, on the door's axis (aria-hidden, out of the Tab order)
    color: "{colors.color-text-muted}"
    hoverColor: "{colors.color-text-strong}"
    size: "14px chevron in a 44px target: two bowed strokes that cross where they meet, at --stroke-cue (1.15px)"
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
  entrance:                   # the photograph in layers (src/photo.py, src/assets/photo/photo.json)
    layers: "street (the page's wall, paving and night lights, CSS) < placeholder < plate (the hall) < reveal (the doorway's shade) < leaf-l, leaf-r < facade (doorway transparent) < spill (Noite)"
    files: "AVIF + WebP per theme; facade 720/1080/1300/1600/2388 facade px, leaves 720/1080/1600/2388, plate 720/1080/1600, reveal 1080/2388, spill 1080/1600; the street's paving strip one scene width wide (upright phones) or three (wider screens) at 720/1080/1600 per scene width"
    firstPaint: "<= 180 KB on phones (measured with the street's paving strip: 161 KB Dia, 79 KB Noite at 390 x 844, DPR 3; 95 KB Dia at 375 x 667, DPR 2; over the budget at 430 x 932, DPR 3, by day: 193 KB with the 1300 rung, was 223; 440 x 956 @3 212 KB, was 244)"
    walkIn: "after the load, at idle: the larger facade and leaves (2388) for the walk-in, swapped in on the first move"
    edges: "the facade's wall is graded to the page colour (Parede / Parede-noite: the page is the photograph's wall) and its margins are the street; the layer fades out over a wide band whose start and end both wander (0-3% to 7-10% of its width, fix r1): no rectangle, no straight line on the page; the olive's crown is kept out of the feather; the hole overlaps the leaves by 4 master px"
    rest: "doors closed, the hall's light in the gap; also the reduced-motion and no-JS state"
  surface-hall:
    backgroundColor: "{colors.color-bg-hall}"
    textColor: "{colors.color-text-hall}"
  text-input:
    backgroundColor: "{colors.color-field}"
    borderColor: "{colors.color-field-line}"
    textColor: "{colors.color-text-strong-hall}"
    typography: "{typography.read}"   # EB Garamond 400, lining figures
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
logo over the wordmark of the client's identity pitch, one sentence in a Garamond, one action, and the house's door. The door is a photograph: an arched
limestone doorway with a walnut double door and a fanlight, a wall lantern on the left and an olive in a clay
pot on the right, the house number 11 on the keystone. It is graded to the brand (lime plaster, limestone in the
Pedra family, walnut rich but not orange), and the page IS its wall: the page colour was sampled from the
photograph's plaster (Parede by day, Parede-noite at dusk) and the facade's wall was graded to that tone towards its
edges, so the photograph has no edge on the page at any size or zoom, and the 3D entrance (on by default where the device can draw it) continues
the same wall, and since the polish pass the same street (wall, paving and night lights), as an endless plane.

**Polish pass** (POLISH_BRIEF, the client's notes on the live page from an iPhone): the façade now runs edge to
edge. The page draws the wall and the paving round the photograph to the screen's sides and foot (the street: a
paving strip synthesised from the photograph's own cobbles, repeating at one scene width on an upright phone and at
three elsewhere (fix r1), and the wall's gradient,
which fades only upward and only just; by night the lantern's and the doorway's light run on with it), and the
photograph's margins are that same street, so there is no rectangle, no side fade, on any screen, in the CSS and the
3D entrance alike (Layout › The street; Components › entrance). The first screen's spacing is one scale of four
intervals (pair, apart, break, air) so the lockup, the words and the action read as groups; the sentence is
rewritten plainer: «Estamos a restaurar um edifício antigo.» / «Abrimos brevemente.» (Voice › The first screen's
words).

**Dia** is that doorway in daylight on its own plaster. **Noite** is the same photograph relit for the night
(its own files, not a filter): a deep dusk wall that falls away into the night ground, the lantern lit with a warm
pool on the stone, lamplight in the door gap and on the step tops, the fanlight a blue-hour sky. Until the visitor
chooses, the page keeps the hour of the house: Dia while the sun is up over Torres Vedras, Noite after sunset, so the
lantern is lit when it really is, and one short line under the control says so, on every screen («É noite em
Torres Vedras.»). The system's dark mode does not override the sky (it is not a choice made on this site);
without JavaScript the system theme decides. The Dia · Noite control overrides it and remembers the choice.

Scrolling is the one journey on the page, and it is short: about one screen from the top to a readable form
(one decisive swipe on a phone). The doors swing inwards from the first pixel, the camera walks in through the
doorway into a calm, out-of-focus vestibule and on into the arch of light at its end, until the screen is one flat
colour, the hall's light; the waiting list rises in on that light at once. The hall surface is light in both themes (daylight by day, lamplight by
night), so the form always reads dark ink on a light ground.

Colour discipline: nogueira is the workhorse (text, focus ring, field borders). Latão is ceremonial: the emblem
and the « · » of the lockup's line by day, the accent text by night. The photograph carries its own colour (graded to the
palette); the one colour sampled from it is the page itself (the wall), so the two cannot part. Barro (terracotta) exists only for form errors. The interface
itself is 95% neutral.

**Key characteristics**
- Canvas `{colors.parede}` by day, `{colors.parede-noite}` by night (the photograph's wall); the hall
  `{colors.color-hall}`; all flat.
- The pitch's lockup: the original emblem.svg inline over the pitch's own «A Brazileira» (its lettering drawn as a
  vector: a large A, the ornamental B, RAZILEIR in smaller capitals with both R's kicked out on the baseline, a large
  closing A) in Verde Torres and, close under it, BOUTIQUE HOTEL · TORRES VEDRAS in Cinzel capitals, widely spaced.
  The pitch's shield monogram is on hold (the client's call); the crowned laurel stays.
- Three voices, as on the pitch: the wordmark (logo only), Cinzel capitals for labels (the lockup's line and
  section names), EB Garamond for everything said (400) and the interface (500), roman, sentence case.
- One accent: brass, `{colors.latao-texto}` by day (4.93:1), `{colors.latao}` by night (7.77:1).
- One action on the first screen: «Entrar na lista de espera» / «Join the waiting list».
- Square corners everywhere; the only radius is the 2px corner of the focus ring.
- Depth comes from the photograph alone (its perspective, its light), never from interface shadows.
- Motion: nothing moves on load; one scroll-linked sequence (95svh, one plain-JS driver) swings the doors in,
  walks through them into one flat colour and the waiting list; the hero action plays the same walk-in on its
  own (1.25s, any input stops it) and lands in the email field; Dia ↔ Noite cross-fades in 400ms when chosen,
  1.4s when the sun changes it.
- One light at the end of the hall: the arch into the bright room beyond, which the photograph clips to the hall
  colour; the walk-in ends in it. No lamp bokeh, no glow shapes.

## Logo usage

- **Sources**: `src/assets/img/emblem.svg` (vector rebuild of the original: crown with cross, dense laurel, bow,
  Trajan-style B) and `src/assets/img/wordmark.svg` (the identity pitch's lettering of «A Brazileira», vectorised
  from the board: 2316.2 × 369, one path per letter with its counters, 218 nodes, 5.4 KB; checked against the
  pitch's large wordmark at IoU 0.974, mean edge deviation 0.11 px at the board's scale). Both are inlined in the h1
  by `build.py` with `currentColor`, `aria-hidden` and `focusable="false"`; the wordmark carries `width`/`height`
  attributes and CSS `aspect-ratio: 2316.2 / 369`, so it holds its box before anything loads (CLS 0). The
  accessible name is the live text «A Brazileira, Boutique Hotel, Torres Vedras»: a visually hidden «A Brazileira»
  (in mixed case: the lockup no longer uppercases it) reads the name once. The wordmark is not a font: there is no
  wordmark face, preload or fallback any more.
- **Monogram**: the pitch's shield monogram (the B with an F wound into it) is **on hold** by the client's decision
  («temos de pensar melhor nisso»). The lockup keeps the current crowned-laurel emblem; do not use the pitch
  monogram, its gold (Latão Antigo #987245) or its frame until it is redrawn and approved.
- **Lockup** (the pitch's «Interpretação para a marca», measured on the board: wordmark 579 × 92 px, its line
  471 px wide with 11 px capitals). One width drives it: the wordmark is `--lockup-wordmark` 6.8em of the
  lockup's size (`--size-wordmark` 36 → 72px: 245 → 490px wide; 204px at the 30px minimum). Everything else is a
  ratio of that width (W):
  - the emblem's box 0.257 W wide (`--lockup-emblem`; 200 × 228, ink 182 × 228), sized to the area of the
    pitch's monogram (160 × 143 px there), centred on the wordmark; its foot dips 0.0073 W under the B's top
    (`--lockup-emblem-pull`), as the shield's point does on the board, clear of the letters under it;
  - BOUTIQUE HOTEL · TORRES VEDRAS in Cinzel 400 capitals, tracking 0.42em (measured on the board; it was 0.32em),
    its capitals 0.0286 W under the R's kick (`--lockup-under` on the wordmark, `--lockup-cap-top` -0.255em on the
    line, so the gap is measured from the capitals, not the line box);
  - on one line with a brass « · » where the wordmark is large (home, from 900 × 500: the split layout, and the
    stacked layout on portrait tablets that wide; while it fits the column): `max(0.0271 W, 11.2px)`, capitals
    0.019 W, the line 0.80 W wide as on the board (0.86 W where the 11.2px floor binds: 1366 × 657, 1440 × 700,
    1024 × 1366); on two lines (`max(0.32em, 11px)`, 11.5px at 36px) on phones, portrait tablets below 900px and
    short landscape phones. Review r2: the gate was 1024 × 700, so the most common laptop window (1366 × 768, 657px
    tall in Chrome), 1280 × 600 and every split screen from 900 to 1023px wide took the phones' two lines at 0.32em
    of a large lockup: a 17px two-line block 0.68 W wide, competing with the wordmark, and the label jumped from
    11.2px (1440 × 700) to 17.2px (1366 × 657) to 13.3px (1440 × 900). Now 11.2, 11.2, 13.3; where two lines remain
    in the split layout (900 to about 915px wide, enlarged text) they are capped at the one-line size
    (`min(--lockup-label, --lockup-label-line)`).
    Trailing tracking is compensated with a negative end margin so each line is optically centred.
  Checked on a 1440 render with the same ink measure as the board: wordmark height 0.159 W (board 0.159), line
  width 0.80 W (0.81), crest foot 0.005 W under the wordmark's top (0.007).
  Polish pass (the client: «melhores o espaçamento entre A Brazileira, Boutique Hotel, Torres Vedras e o copy em
  baixo»): the lockup's own proportions are the pitch's and stay as they are (re-measured: 1440 × 900, wordmark
  490 × 78, crest 126 wide = 0.257 W, line 399 wide = 0.81 W on one line; 390 × 844, wordmark 245 × 39, the line on
  two lines 166 wide = 0.68 W, as the pitch's horizontal version sets it); what changed is the space round it, so
  wordmark and line read as one unit and the words below as a second thing (Layout › The first screen's rhythm:
  51px between the line and the sentence on a phone, 73px at 1440, against 24 and 48 before).
- **Enlarged text** (WCAG 1.4.4; root size at 125–200%): the wordmark never grows past its column
  (`max-inline-size: 100%`, height from its ratio); the one-line label is a container query on the lockup
  (`(min-width: 5.52em) and (min-width: 21rem)`: the line is 29.7 of its own size wide), so it falls back to two
  lines as soon as one no longer fits; each label line may break between its words. At 200%: 320 × 640 and
  390 × 844 keep the wordmark inside the screen (224 and 294px) with the line on four and three lines; 1024 × 768
  takes the two-line label; nothing is cut. The top bar at 200% (fix r1): the sun note wraps inside the screen
  (`max-inline-size: calc(100vw - 2 × gutter)`, balanced) instead of running off a 320px screen, a PT · EN row that
  wraps sits under the note, and the stage clears the bar's real height (`--bar-h`, set by site.js only when the bar
  wraps or the note takes more than one line); the consent's privacy link, one unit that never breaks at normal
  sizes, wraps inside itself when it is wider than the line. Measured with the root at 200%: no sideways scroll at
  320, 390 and 1280, PT and EN.
- **Colour** (from the pitch, `colours.json`): Dia: wordmark and line `verde-torres` #24281B (the pitch's palette
  circle VERDE TORRES; its stroke cores measure #1A1C10), 13.00:1 on parede; emblem and the « · » `latao-marca`.
  Noite: wordmark and line `linho` (a light ink, 14.79:1 on parede-noite); emblem and the « · » `latao`. The semantic
  role is `--color-brand-ink`; nothing else on the site was recoloured. Forced colours: CanvasText.
- **Clear space**: the height of RAZILEIR's capitals (0.098 W) on every side of the lockup; 20px at the minimum.
  The page keeps 24px or more.
- **Minimum size** (screen): the full lockup at a 30px em (`--size-lockup-min`, the wordmark 204px wide; used as
  the home link on the privacy notice, on landscape phones under 328px tall and on portrait screens up to 600px
  tall, the line held at 11px; landscape phones take 9.15svh, 35.7px at 390px tall, to keep the old footprint); the wordmark alone at 120px wide (the B's spiral and the R's kicks still read at DPR 1). Below that,
  use the emblem alone (favicon.svg, app icons), which holds at 16px.
- **Icons**: favicon.svg, apple-touch-icon.png and icon-512.png stay emblem-based, unchanged.
- **Don't**: redraw the letters or set «A Brazileira» in a font, stretch, outline, recolour outside the two
  schemes, add a background plate, change the line's tracking, put the lockup on the photograph, pair it with the
  pitch monogram while that is on hold, animate the emblem.

## Colors

### Brand & accent
- **Parede** (`--parede` #FAECDF / `--parede-noite` #1C140F): the page, by day and by night. Sampled from the
  retouched photograph's plaster (#F8EADF / #1C150F) and moved 1–4 levels to the nearest colour AVIF decodes
  unchanged, so the photograph's flat outer wall and the page are the same pixel. Every text pair holds AA on it
  (Contrast matrix). Never pure white, never black.
- **Papel** (`--papel` #F9F0E9): the fill of form fields on the hall by day, and the button's text.
- **Areia** (`--areia` #F0DFCF): skip-link surface, selection; the photograph's plaster is graded between
  Papel and Areia (about #F4EBE1). Not a text colour.
- **Pedra** (`--pedra` #DECDBD): the limestone family the photograph is graded to; base of the night hairline.
- **Castanho** (`--castanho` #804F1E): muted text (5.93:1 on parede).
- **Nogueira** (`--nogueira` #5F3819): text, focus ring, hairlines and field borders (8.77:1); also the depth of
  the walnut the photograph is graded to (about #8E4F2A on its lit faces).
- **Tinta** (`--tinta` #2E1E14): the strongest text and the button (13.82:1 on parede).
- **Verde Torres** (`--verde-torres` #24281B): the identity pitch's ink, for the logo only: the wordmark and its
  line by day (13.00:1 on parede). Never interface text.
- **Latão** (`--latao` #DB9E42): ornament by day (2.02:1 on parede: never text there); text, emblem and focus by
  night (7.77:1 on parede-noite).
- **Oliva / Azulejo**: reserved (they coloured the drawing's olive). Never text, never interface.
- **Barro** (`--barro` #9E3B1E): form errors on the hall surface only (text and the invalid field edge).
- **Sala** (`--sala-dia` #F2DEC4, `--sala-noite` #FCE7BC): the lit hall. Stored as exact sRGB hex (not a
  `color-mix`), so every layer that paints it resolves to the same pixel.

### Surface
Three surfaces: `--color-bg` (parede / parede-noite: the photograph's wall), `--color-hall` (the lit hall: `--sala-dia` #F2DEC4 by day,
`--sala-noite` #FCE7BC by night) and `--color-surface` (areia / dark stone), which appears only under the
focused skip link. `--color-hall` is ONE token per theme and the only colour of the hand-off: the
photograph's far arch is graded to clip to it (within 2 levels after AVIF / WebP decoding), and the flat layer
that completes the walk-in (`.porta__flood`), the waiting list and the home footer paint it exactly, so the
colour never changes between the door and the form. Measured by pixel
sampling: ΔRGB = 0 over every pixel of the frame (list words and footer text excepted) from the moment the
screen is one colour (p = 0.66), at the middle of the list's rise, at p = 1 and with the seam where the stage
releases on screen, on 390 × 844, 430 × 932, 375 × 667, 320 × 568, 844 × 390, 768 × 1024, 1440 × 900,
1920 × 1080 and 2560 × 1080, both themes (`src/tests/cta.test.js`). Once the screen is one colour the page behind the stage takes it too
(an inline background on body), so a frame that draws the pinned stage a step behind a fast scroll uncovers
the same light, never the hero's paper.
A lossy photograph cannot hold one exact colour (decoded, the arch's centre is 1–3 levels off the token), so the
walk-in never ends on the image: the flat CSS layer fades in over the last stretch (p 0.52 → 0.66, slow at first:
under 2% when the doorway covers the screen at 0.54), and is the whole frame from p = 0.66. `.surface-hall` re-points the semantic roles for its subtree so components inside it
need no special colours. No cards, no panels, no glass.

### Hairlines
`--color-ground` (nogueira by day, 8.77:1 on parede; pedra 46% in noite by night, 3.37:1 on parede-noite): the styleguide's rules. The
page itself has none on the first screen: the drawing's floor line went with the drawing (the photograph has its
own ground, the steps and the calçada, fading into the page). Field and checkbox borders: nogueira 1px on the
hall (7.75:1).

### Text
`--color-text-strong`, `--color-text`, `--color-text-muted`, `--color-accent-text` (see the matrix).

### Semantic
`--color-focus` nogueira / latão (nogueira on the hall). `--color-error` barro, on the hall only. There is no
success colour: success is a sentence («Obrigado. Já está na lista.»), not a colour.

### Contrast matrix (measured on the rendered pages with Playwright, WCAG 2.x)

| Theme | Element | Foreground | Background | Ratio | Rule |
|---|---|---|---|---|---|
| Dia | Wordmark, lockup line (BOUTIQUE HOTEL · TORRES VEDRAS, 11–13.3px) | verde-torres #24281B | parede #FAECDF | 13.00:1 | text |
| Dia | Privacy section names, active control, CTA | tinta #2E1E14 | parede | 13.82:1 | text |
| Dia | Active-control tick, sun note | latao-texto #83602C | parede | 4.93:1 | text / non-text ≥ 3:1 |
| Dia | Lede, privacy body | nogueira #5F3819 | parede | 8.77:1 | text |
| Dia | Inactive control, separators, footer, scroll cue | castanho #804F1E | parede | 5.93:1 | text / graphic |
| Dia | Status | latao-texto #83602C | parede | 4.93:1 | text |
| Dia | Emblem, the lockup line's « · » (aria-hidden) | latao-marca #A57638 | parede | 3.45:1 | graphic ≥ 3:1 (logo) |
| Dia | Focus ring | nogueira | parede | 8.77:1 | non-text ≥ 3:1 |
| Noite | Wordmark, lockup line, section names, lede, active control, CTA | linho #F3E6D6 | parede-noite #1C140F | 14.79:1 | text |
| Noite | Inactive control, separators, footer, scroll cue | linho-escuro #C2AE96 | parede-noite | 8.47:1 | text / graphic |
| Noite | Status, emblem, the lockup line's « · », focus ring, active-control tick, sun note | latao #DB9E42 | parede-noite | 7.77:1 | text |
| Hall (Dia / Noite) | List name (Cinzel capitals), labels, consent link | tinta | hall #F2DEC4 / #FCE7BC | 12.21 / 13.18:1 | text |
| Hall | List sentence, consent text | nogueira | hall | 7.75 / 8.37:1 | text |
| Hall | Footer (home), muted | castanho | hall | 5.24 / 5.66:1 | text |
| Hall | Error message, invalid field edge | barro #9E3B1E | hall | 5.17 / 5.58:1 | text |
| Hall | Field and checkbox borders, focus ring | nogueira | hall | 7.75 / 8.37:1 | non-text ≥ 3:1 |
| Hall | Typed text | tinta | papel / luz-nucleo #FFF2D6 (field) | 14.23 / 14.42:1 | text |
| Hall (Noite) | Field border on the field | nogueira | luz-nucleo | 9.16:1 | non-text ≥ 3:1 |
| Hall | Button label | papel | tinta (button) | 14.23:1 | text |

`latao-texto` on the hall would be 4.36:1, so `--color-accent-text` points to castanho inside `.surface-hall`.

*Against the street* (polish pass): the first screen's text now stands on the wall's gradient (a touch deeper
towards the paving by day) and, by night, near the lantern's light. Measured on the real pixels behind each text box
(the text made transparent, the page shot, the lowest-contrast background pixel of the box decides; 7 viewports,
Dia and Noite, stored theme and sky-decided, `final2/work/polish/tools/contrast.js`): Dia wordmark and line 12.80:1,
lede 8.49, status 4.77 (its lowest, where the wall is deepest: was 4.93 on flat Parede; still above 4.5), action
13.27, sun note 5.93; Noite wordmark 13.63, line 14.62, lede and action 14.79, status 7.77, sun note 8.47. The
controls' boxes read lower only because they hold the brass tick (a graphic, 4.93 / 7.77:1 as above).

## Typography

The client asked for type «mais em linha com o que está aqui (tipos de letras no pitch)»: the identity board
shows a lettered wordmark drawn from the façade («PASTEIS DE FEIJÃO», «CAFÉ A BRAZILEIRA DE TÔRRES»), labels in
widely spaced Roman capitals and a Garamond specimen for text. The site now follows it, three voices.

### Font family
- The wordmark is not a face: «A Brazileira» is the pitch's lettering drawn as a vector
  (`assets/img/wordmark.svg`, inline; see Logo usage). The modified Cinzel Decorative file that used to set it
  («Brazileira Wordmark», 3.0 KB) and its licence copy are gone.
- **Cinzel** 400 (Cinzel 2.000, Natanael Gama, OFL), capitals only (A-Z, the Portuguese accented capitals,
  figures, the punctuation a label may carry: . , : ; · - – — ‘ ’ “ ” « » ? ! … ' & ( ) / © º ª): the label voice,
  always `text-transform: uppercase`, widely spaced: the lockup's line, the waiting list's name, the privacy
  notice's section names. 5.9 KB. Cinzel 2.000 (2020) declares no Reserved Font Name (`OFL-cinzel.txt`), so the
  subset keeps its name.
- **EB Garamond** 400 and 500 (Georg Duffner, Octavio Pardo; OFL): 400 for every sentence the house says (lede,
  the page title, the list sentence, the consent, the privacy notice, the sun note) and the email a guest types;
  500 for the interface (Dia · Noite, PT · EN, status, the action, the field label, messages, the button, the
  footer). 14.6 KB + 15.5 KB. EB Garamond rather than Cormorant: the board's specimen is a book Garamond (calm,
  normal x-height), not a display one, and the client found Cormorant «too AI».
- Subset to Latin + Portuguese (ASCII, nbsp, © ª « ° · º », À-Ã Ç-Ê Í Ñ Ó-Õ Ú Ü and lower case, – — ‘ ’ “ ” • … €,
  × ÷ −), layout features `kern` (GPOS), `liga` and `locl` (GSUB): the only ones the Latin files carry; unhinted.
  Δ and √ are not in EB Garamond's Latin files: the two places that use them (motion notes on /design/) fall back
  to Times. No italic; one file per weight,
  `font-synthesis: none`. EB Garamond in this build has lining figures only (© 2026, art. 6.º). Licences:
  `assets/fonts/OFL-*.txt`. The previous Cinzel 400/600/700 and Alegreya / Alegreya Sans files are gone.

### Hierarchy (computed, Chromium)

At most five text sizes outside the logo on any page and width (measured: home 3-4, privacy 4-5), nothing under
17px. Squint order on every width: lockup > lede > action > status and controls; on the list, the sentence leads
and its name is a spaced label above it. 320px is 320 × 640, 390px is 390 × 844, 1440px is 1440 × 900.

| Token | Family | 320px | 390px | 1440px | Weight | Line height | Tracking | Use |
|---|---|---|---|---|---|---|---|---|
| wordmark | drawn (SVG), 6.8em of the lockup's 36–72px | 245px wide (204px when the screen is ≤ 600px tall, and on landscape phones) | 245px | 490px | — | — | — | A Brazileira, the pitch's lettering |
| lockup line | Cinzel | 11.5px, two lines (11px) | 11.5px, two lines | 13.3px, one line with « · » | 400 | 1.3 | 0.42em | BOUTIQUE HOTEL · TORRES VEDRAS |
| label | Cinzel | 19px | 19px | 19px | 400 | 1.3 | 0.2em | LISTA DE ESPERA (the privacy section names 17px, 1.47) |
| title | EB Garamond | 28px | 28px | 38px | 400 | 1.15 | 0 | Nota de privacidade |
| lede | EB Garamond | 19.2px | 20.25px | 28px | 400 | 1em + 7.2px (26.4 / 27.5 / 35.2px) | 0 | the sentence, the list sentence, 404, thank-you |
| intro (`--size-intro`) | EB Garamond | 22px | 22px | 28px | 400 | 1em + 7.2px | 0 | the privacy intro: never under 22px (a clear step over the 19px body) |
| read | EB Garamond | 19px | 19px | 19px | 400 | 30px | 0 | privacy notice; the email field |
| consent | EB Garamond | 17px | 17px | 17px | 400 | 25px | 0 | the consent line |
| cta | EB Garamond | 17px | 17px | 21px (19px from 900 to 1199px) | 500 | 1.25 | 0.01em / 0.008em | the action, the button, «Voltar ao início» on every page |
| ui | EB Garamond | 17px | 17px | 17px | 500 | 21px / 25px | 0.01em (PT · EN 0.08em) | Dia · Noite, PT · EN, status, the field label, messages, footer |
| sun note | EB Garamond | 17px | 17px | 17px | 400 | 21px | 0 | «É noite em Torres Vedras.» under the theme control |

From 1920px the root size grows to 112.5% (131.25% from 2560px): everything scales together, never more
content. The field is 19px, never below 16px, so iOS Safari does not zoom on focus.

### Principles
- What the house says is EB Garamond 400; what you operate is EB Garamond 500; names are Cinzel capitals. Never
  capitals for controls, buttons or sentences: spaced capitals belong to the lockup and to labels, as on the pitch.
- The status is quieter than the action by colour (brass, not ink, no underline; on phones in Noite, where the
  action is the same 17px and brass is the most saturated text on the screen, the muted linen), size from 900px and space
  (8px under the sentence, 12px from 900px; 16px before the action stacked, 8px on short phones, 48px from
  900px), never by weight. The lede leads by size: 20px over a 17px action on phones, 28px over 19–21px from
  900px. The action carries the only full-ink underline of the first screen (1.5px); the current control is
  marked by a short brass tick, never by an underline.
- Figures: EB Garamond's lining figures everywhere (the only set the files carry).
- PT and EN get 0.08em because capitals need air.
- Line breaks by rule, not by luck: `text-wrap: balance` on the ledes and titles; the home sentence is one line
  wherever it fits and breaks in one place only where it does not, after the comma («Brevemente, / abrimos as
  portas.», «Soon, / we open our doors.»: the object is tied at build time). Since the 9 Nov sentence both languages
  set one line at every width from 320 to 2560px in EB Garamond (measured every 4px), so the tie is a safeguard for
  enlarged text. (Before: «Estamos a restaurar / um edifício antigo.» broke below about 335px and in the split
  layout's column from 900 to about 1080px.) The English list sentence breaks at its clause, as the Portuguese does («Leave your email and / we
  will let you know when we open.», «we will let you know» tied; «and» is not, or desktops set three lines), and
  the English consent keeps its object whole («… from A Brazileira / about the opening.», «about the opening» tied:
  review r2 found «we will / let you know» at every width and a two-word runt after «about» from 414px); the lockup's line takes one or two lines by rule (a media query
  for the size, a container query so it never overflows its column), not by a near miss in width; `text-wrap: pretty` on reading text; no hyphenation anywhere (the privacy notice is read word by word).
  Ties at build time (`nb()` in build.py): «A Brazileira», «Torres Vedras», «© 2026», and every one-letter word
  holds to the next («e avisamos», «a ser»). «nota de privacidade» never splits and sits on its own line under
  the consent.
- Below 480px the footer sets «© 2026 A Brazileira» / «Torres Vedras, Portugal» / «Privacidade» on three lines.
- Quotes: «» in Portuguese, “” in English (`q:lang()`). Noite text uses grayscale smoothing on macOS.
- Height-aware sizes (`svh` inside `min()`) keep the lockup and lede in one screen on short laptops.

### Font loading and fallbacks
All four faces are `font-display: swap`, and the three files (Cinzel capitals, EB Garamond 400 and 500, 37 KB
together) are preloaded on every page. The wordmark is drawn, so it needs no file, no preload and no fallback: it
is in the HTML. Every role has its own local fallback (Times New Roman, or the metric-compatible Liberation Serif /
Tinos), and after it a twin for Android (below), each sized so that role's own strings
set to the web font's width in Chromium, with English variants where the sentence differs (`[lang|=en]` swaps
the stacks). Centred multi-line text (the ledes) and wrapped text near a break (the consent, the privacy intro)
are matched on the line that decides the break, not on the average. Values (size-adjust, PT / EN):
lockup line BOUTIQUE HOTEL 103.15%, TORRES VEDRAS 98.6%, its « · » 80.49%;
list name 97.37 / 101.77%; section names 102.05%;
lede 94.41 / 94.01% (the polish pass's sentence; not yet regenerated for the 9 Nov sentence, see Roadmap and
known gaps); list sentence 93.14 / 91.31%;
intro 92.33 / 93.31%; title 94.28%;
consent 92.45 / 93.6%; text (sun note, field) 93.15 / 93.69%;
interface 97.94%; action 97.33 / 98.09%;
status 98.06 / 99.73% («Abrimos brevemente.», «Opening soon.»); back link 97.58 / 97.14%;
theme buttons 101.54 / 101.04% (so the sun note beside them never moves when the font lands;
`--font-theme`); PT · EN 104.67%; the «·» between controls 65.9%; footer name 95.62%,
place 97.91%, « · » 77.52%, link 96.87 / 94.75%. Ascent and descent
overrides carry EB Garamond's 1.007 / 0.298 and Cinzel's 0.976 / 0.372 through the size-adjust.
**Android** (review r2): it has none of those faces («Times New Roman» there is only an alias of the system serif,
Noto Serif, about 18% wider than EB Garamond), so every role's stack carries a second face after the first,
«… fallback noto» (`local("Noto Serif")`, `NotoSerif-Regular`, `Droid Serif`), sized by the Times value times the
role's own Liberation / Noto width ratio (lede 79.12 / 78.64%, status 82.17 / 85.56%, action 80.64 / 83.83%, theme
buttons 89.76 / 89.90%, lockup line 101.94%; `final2/work/fix-r2/tools/noto_ratio.js`, `noto_faces.py`, which
regenerates them). Without it the Portuguese sentence set in two lines in Noto Serif until EB Garamond came, then in
one, and the status, the action and the entrance moved up 28px: CLS 0.044 / 0.047 / 0.071 at 360 / 390 / 412px.
Simulated (woff2 held 3s, the Times faces made to fail, Noto Serif 400 as the system serif and behind
`local("Noto Serif")`): CLS 0.0000 at 320 × 640, 360 × 780, 375 × 667, 390 × 844, 412 × 915, 430 × 932, 568 × 320,
844 × 390, 768 × 1024, 1024 × 1366, 1366 × 657, 1440 × 900 and 1920 × 1080, PT and EN; the Times control unchanged
at 0.0000 (`shots/final2-fix-r2/cls-android.log`, `cls-android-more.log`). A screen with Times never reaches the twin. About 1 KB gzipped. The privacy
notice body uses the same EB Garamond 400 file under a second name with `font-display: optional` («EB Garamond
Text»): preloaded, so it is there on a normal load, and on a slow first visit the long paragraphs stay in their
fallback for that view instead of re-wrapping around their links. Checked with every woff2 held back 2s: CLS 0
on home PT/EN, privacy PT/EN and 404 at 320×568, 360, 375, 390, 430, 844×390, 768, 1024, 1280, 1440 and 1920,
motion on and off (77 runs); and the fallback layout matches the web font (no line-count change, no visible text
start moving 3px or more) at about 250 widths from 320 to 2560px on every page. Regenerate the values after any
copy change (they follow the strings): `tools` in the type pass measure each role's strings in both fonts.

## Layout

### Spacing system
4px base: 4, 8, 12, 16, 24, 32, 48, 64, 96 (`--space-1` … `--space-9`). Gutter 24 → 72px. Touch target 44px,
field and button 48px, form column 26rem.

**The first screen's rhythm** (polish pass, POLISH_BRIEF §2: «melhores o espaçamento entre A Brazileira, Boutique
Hotel, Torres Vedras e o copy em baixo»). Four intervals on that scale, each a distinct step, so the eye reads groups
and not a stack: the crest, the wordmark and its line are one unit (the pitch's own ratios, untouched); the sentence
and its postscript are a pair; the action stands apart; the identity and what it says are two things; the frame
round them breathes. Tokens (`tokens.css`), phones height-aware (svh), the split layout one step larger:

| Token | Between | Phones (390 × 844) | Short phones (≤ 680px tall) | Split (1440 × 900) | Landscape phones |
|---|---|---|---|---|---|
| `--rhythm-pair` | sentence → status (no status on the home page since 9 Nov) | 8px | 8px | 12px | 4px |
| `--rhythm-apart` | sentence → action (status → action before 9 Nov) | clamp(16px, 2.6svh, 24px): 22px | 12px | 32px | 0 |
| `--rhythm-break` | lockup's line → sentence | clamp(32px, 6svh, 52px): 51px | clamp(24px, 4.8svh, 32px) | clamp(56px, 8svh, 72px): 72px | 24px |
| `--rhythm-air` | top bar → crest, action → façade | clamp(24px, 4.2svh, 40px): 35px | 20px | (the column is centred on the wall) | — |

Measured between line boxes at 390 × 844: line → sentence 51px, sentence → status 8, status → action 23 (the action's
44px target adds its own air: about 36px of ink), action → the façade's box 25 (about 51px of ink to the keystone);
1440 × 900: 73, 12, 32, and the column's optical centre a little above the middle of the wall (`.intro`'s padding
grows with 10svh). Ratios of the ink gaps, pair : apart : break, about 1 : 2.5 : 4 on phones and 1 : 3 : 5 on
desktops. Before: 24 / 8 / 16 / 12 on phones and 48 / 12 / 48 on desktops (the action as far from the status as
the sentence was from the lockup, so nothing grouped). Since the status line went (9 Nov) the action follows the
sentence at `--rhythm-apart` and nothing stands in for the line: measured line → sentence → action, between boxes,
51 / 22 at 390 × 844, 72 / 32 at 1440 × 900, 16 / 12 at 320 × 568, 24 / 0 at 844 × 390 (there the action's 44px
target alone holds it apart, about 20px of ink); the action → façade box 24 at 390 × 844.

### Grid and container
- **Stacked** (portrait screens of any width, and every screen below 900px that is not landscape from 560px):
  lockup · lede · status · action, then the photograph at the foot of the
  first screen, then a band with the scroll cue. The door's axis sits on the page axis: the photograph is
  asymmetric (lantern left, olive right), so it is offset by `--scene-axis` (0.48241, the door axis as a share of
  its width, from photo.json); `--scene-reach` 1.06 lets its faded right margin reach into the gutter, and
  `--scene-lift` 0.05 lets its top (plain wall, faded into the page) rise 5% of its height above the entrance's box,
  into the space under the action. Measured widths (polish pass, with the new rhythm): 331px at 390 × 844 (the door
  105px wide), 402px at 430 × 932, 227px at 375 × 667. Round it the street runs on to the screen's edges (the wall
  above it, the paving along its foot and down through the cue's band), so the photograph's width is the door's
  size, not a frame.
- **Portrait tablets from 900px** (review r2): stacked, not split. Side by side, a portrait screen of 900px or
  more (1024 × 1366, iPad 13" upright; 912 × 1368, Surface Pro) had about the top 27% of empty wall, the lockup and
  the sentence in a narrow left column (the sentence on two lines) and the door a small photograph in the bottom
  right corner, about 230px wide on a 1024px screen: a desktop layout dropped into the wrong aspect ratio. The split
  layout works where its right column is about as wide as the scene is tall (the scene then fills the column's
  height); on a portrait screen it is width-bound and leaves dead quadrants. Stacked, the same screens scale the
  768 / 834 composition up: at 1024 × 1366 the wordmark 391px with its line on one line, the sentence on one line at
  28px, the scene 759px wide (the door about 250px); 912 × 1368 773px; 1024 × 1280 676px; 1024 × 1100 505px
  (`shots/final2-fix-r2/a1`, `sheet-portrait-a1.png`). The rule is the screen's shape: split needs
  `min-aspect-ratio: 1/1` (square counts as split: at 1000 × 1000 split gives the larger door, 463px, with nothing
  dead). The review proposed 4 : 5; that kept 1024 × 1280 split, where the scene was width-bound with 626px of empty
  wall above it, so the line is drawn at the square instead.
- **Split** (from 900px wide on landscape and square screens, or any landscape screen from 560px): 5fr text | 6fr entrance, 64px apart,
  container 86rem; the text column is a centred crest; the photograph fills the right column (681 × 751px at
  1440 × 900), standing at its foot.
- **Waiting list**: a full-height hall section (`min-height: 100svh`), one centred column of 26rem. The block (title
  to button) has its height at rest (`--lista-b`) measured by site.js at start, when the fonts arrive and on resize,
  never while a message is shown, so a message lengthens the form downwards and nothing above it moves (30rem without
  JavaScript). It used to start 22svh down, 16–88px above the middle. Without the sequence (reduced motion, no
  JavaScript) the section follows the photograph, one screen tall, and the block stands in the middle of the small
  viewport, between the safe areas: padding above max(16px, safe top, (100svh − its height + safe top − safe bottom)
  / 2); a block taller than the screen starts 16px from the top, the field in view.
  With the sequence on, the section is pulled up by one large viewport (`margin-top: -100lvh`), so it starts exactly
  where the pinned stage releases (the end of the run) and lies over the stage during the run; it is one large
  viewport tall less the footer's height (`--foot-h`, site.js), so the footer (positioned, over the stage's flat
  colour) closes that same screen and the page ends one large viewport after the run. The scroll stops there, so the
  block is placed against the page's end, in the dynamic viewport (what the visitor sees): padding above max(16px,
  safe top, min(100lvh − (100dvh + its height − safe top + safe bottom) / 2, 100lvh − footer − its height − gap)),
  padding below the gap (`--lista-g`: 32px, shrinking to 16px at least where the title would come within 16px of
  the top). On a
  desktop dvh = lvh = svh: the page ends with the run, the block in the middle. On an iPhone with Safari's bars shown
  the page ends 40px after the run (836 − 796 on the client's phone), with them hidden at the run's end; the block is
  in the middle of the screen at the page's end in both. Where the footer does not fit under the centred block with
  32px clear (320 × 568, 375 × 667, an iPhone SE), the block stands that gap above the footer, the title on screen
  (375 × 667: 19px above the middle; the page went on 51px before, 100px at 320 × 568, the title cut by the top). Only
  a block and footer taller than the screen together lengthen the section (844 × 390: 360 + 68px, 411px in English):
  the page goes on 69px (121px in English; 117 and 169 before) and its end shows the footer under the block's lower
  part; the run's end is its rest position (the block 16px from the top). The hero action, `#lista` and Tab land on
  that rest position (site.js `rest()`: the page's end when the list closes within the run's last screen, else the
  list's top). Its first screen is transparent (the stage behind it is the same flat colour) and its own colour starts
  exactly at the bottom of the stage. Its words are held at opacity 0, with no pointer target, until the screen is one
  colour (site.js). Home page document: 1.95 screens at 390 × 844 (2.09 before 9 Nov evening), 1.95 at 1440 × 900
  (2.03), 2.14 at 844 × 390 (2.26 on 9 Nov evening, 2.43 before), 1.95 at 320 × 568 (2.13, 2.21).
- **Privacy notice**: top bar, the lockup at its 30px minimum as a home link, a 40rem reading column, footer.
- **Very short portrait screens** (up to 600px tall: 320 × 568, iPhone SE in Safari 375 × 553): the lockup at its
  30px minimum, 12px above the lede, no scroll cue, and the photograph takes the height that is left, so the whole
  door and its steps are inside the first screen (tested in `src/tests/cta.test.js`).

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
| photograph | a real doorway in layers: its own perspective, its light, a hall out of focus behind it | the entrance only |
| hall | flat light colour | the waiting list (the end of the walk-in) |

Interface shadows: none. The invalid field's second pixel of edge is an inset line, not a shadow.

## Shapes
| Token | Value | Use |
|---|---|---|
| none | 0 | everything, fields, checkbox and button included |
| `--radius-focus` | 2px | focus-ring corners |
The arch is architecture, not a UI radius.

## Components

**`lockup`** (h1 on the home page; a home link at the 30px minimum on the privacy notice): the emblem, the drawn
wordmark (inline SVG) and its line; see Logo usage. States: none.

**`control`** (`.ctl`, buttons and links): EB Garamond 500 17px, tracking 0.01em (PT · EN 0.08em), sentence
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
`meta[name=theme-color]` follows (the wall colour; the hall's light once the screen is that colour, when the root
takes it too, so overscroll and the browser's bar never show the wall under the list). Storage is wrapped in try/catch (a choice still holds for the visit if
storage is blocked). A theme change lands at once on the controls and links (their colour transitions are held
for that frame, `.is-instant`), so nothing catches up after it.

**`sun note`** (`#sol-note`, inside the theme group): while `data-sol` is set, one short sentence on its own
line under the control says why the page looks as it does: «É noite em Torres Vedras.» / «É dia em Torres
Vedras.» («It is night in Torres Vedras.» / «It is daytime in Torres Vedras.»). On every width, phones included
(it used to be screen-reader-only below 600px, so the touch was invisible where most visitors arrive). It is
the house speaking, not a control: EB Garamond 400 17/21px, tracking 0, `--color-text-muted`, a verb and a full
stop, aligned with the control's text and tucked 8px under the row, out of the menu row so the menus hold only
Dia · Noite and PT · EN (it used to sit in the row in the control's voice and read as a third, broken menu
item). Both phrases are in the markup and the theme shows one, so it is right from the first paint (no shift:
the head script sets `data-sol` before it). No icon, no motion. It is also the description (`aria-describedby`)
of both theme buttons while the sky decides, and disappears the moment the visitor chooses. Clearance from the
crest, measured: 8px at 320 × 568 and 844 × 390, 16px at 390 × 844, 72px at 1440 × 900 (`src/tests/list.test.js`).

**`language switch`**: two links (`hreflang`, `lang`, `aria-current`); on the privacy notice they point to the
other language's notice.

**`cta`** (`.cta`, «Entrar na lista de espera» / «Join the waiting list» → `#lista`): the only action on the
first screen, a text link-button under the status. EB Garamond 500, 17px on phones, 19px from 900px and 21px
from 1200px, tinta / linho, a 1.5px underline 0.3em below in full ink at rest (`--underline-cta`), 44px tall,
48px under the status from 900px (squint test: after a blur it still reads as the next step beside a large
photograph). Hover (fine pointer): the underline firms to 2px, 150ms. Pressed: `scale(0.97)`, 160ms `--ease-out`. Click, tap, Enter or Space (it
is drawn as a button, so it answers Space too): the walk-in through the door, 1.25s, then the focus moves to
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
with a pen, not set as an icon: two strokes at `--stroke-cue` (1.15px, `vector-effect: non-scaling-stroke`), one
a little longer and bowed, that cross where they meet (the pen's overshoot). It lies on the paving, in strong ink:
14px wide at 1.3 × the stroke on phones; on the split layout 20px at 1.9 × (2.2px), because there, seen from further
away and at 1×, the phone's glyph had the size and weight of the cobbles' own joints and sank into them (review r1).
No plate behind it. Where: stacked, on the page axis, which is the door's axis; on the split layout, **on the door's
axis too** (review r2: centred on the window, x 720 at 1440, it lay in the gutter between the text column, axis about
345, and the door, about 1030, lined up with nothing): the band takes the stage's own columns (5fr | 6fr, the same
gap and inset), the cue the entrance's, and site.js (`aim()`, on load and resize, with the sequence on or not) nudges
it by the photograph's asymmetry (`--cue-dx`: the door axis is 0.482 of its width, 12px left of the column's centre
at 1440 × 900). Measured: cue centre = door axis ±0px at 1000 × 1000, 1366 × 657, 1366 × 1024, 1440 × 700 and
1440 × 900; without JavaScript it is centred on the entrance's column (12px off).

**`porta`** (the door sequence): `.porta` > `.porta__stage` (sticky) > `.porta__frame` (the first screen,
100svh) + `.porta__flood`. Without JS or with reduced motion it is just the first screen. Every moving layer
carries a `data-motion` hook (wrapper, stage, copy, cue, camera, plate, leaf-l, leaf-r, shade-l, shade-r,
spill, flood, list), attributes only, for tests. See Motion.

**`entrance`** (the photograph, «A Porta»; client decision of 8 November, PHOTO_BRIEF: it replaces the
caderno drawing): one photograph of a generic Portuguese entrance (`photo/src/door.webp`, 1194 × 1317), an
arched limestone doorway with a walnut double door under a radial fanlight, a wall lantern on the left, an olive
in a terracotta pot on the right, three steps and calçada. The house number 11 on the keystone is kept exactly as
photographed (client: «o 11 tem de ficar»). The asset pipeline (`photo/py/` in the working notes, not part of the
site build) made from it:
- a 2× master (2388 × 2634, EDSR super-resolution, chroma de-blocking, light luma sharpening; no generative fill);
- a grade per material, in the brand's palette: lime plaster about #F4EBE1 (between Papel and Areia), limestone in
  the Pedra family, walnut about #8E4F2A (rich, not orange), brass warm, terracotta natural, nothing saturated;
- **Noite**, a relight of the same photograph (not a filter): the wall in deep warm-blue dusk, the lantern lit
  (glass, bulb, a pool of light that falls off with distance), lamplight in the door gap and on the step tops
  (never the risers), the fanlight a blue-hour sky with a faint warm glow from below, the olive and pot in a
  thin rim light;
- the layers (each a fraction of the facade frame, so they line up at any size; `src/assets/photo/photo.json`):

| Layer | What | Rect (x0–x1, y0–y1 of the facade) | Files (AVIF / WebP) |
|---|---|---|---|
| plate | the hall beyond: a calm vestibule, sharp at the threshold and soft beyond | 0.191–0.774, 0.108–1.020 (clipped by the doorway) | 720, 1080, 1600 px wide |
| reveal | the doorway's soft shade, the stone sill and the open leaves' contact shade; moves with the facade | the doorway, 0.324–0.641, 0.348–0.844 | 1080, 2388 (facade px) |
| leaf-l, leaf-r | the two leaves, opaque, hinged on the outer jambs | 0.324–0.458 / 0.507–0.641 | 720, 1080, 1600, 2388 (facade px) |
| facade | everything else, the doorway transparent; its margin converges to the page colour | 0–1 | 720, 1080, 1600, 2388 |
| spill | Noite: lamplight on the steps as the doors open (one warm colour, alpha) | 0.020–0.980, 0.408–0.996 | 1080, 1600 (facade px) |

*The hall* (`photo/py/plate2.py`; the asset report's weak point, redone for this integration): the old plate was
a corridor with two wall lamps and a pendant whose bokeh read as hard discs and a lumpy glow. The new one is a short
vestibule (about 3.8m) rendered physically and then defocused: lime-plaster walls and ceiling, a limestone floor,
an arched opening at the far end into a bright room. Its light (an area light) is what lights the hall; by night the
hall is amber and darker near the door. The highlights roll off into the hall colour: the far arch clips to
`--color-hall`, as a bright room does in a photograph taken from a dim hall. No lamp, no bokeh, nothing specific.
The plate is the doorway grown 1.84× about the hall point, so with its slower zoom (zoom^0.8) it covers the
doorway to a camera zoom of 21; the driver keeps the exponent so it always does.

*Dia, third pass* (review r1: with the doors open the doorway read as a frosted beige panel 30cm behind the
leaves, a muddy grey-taupe darker than both the sunlit wall and the cream at the end, two grey-brown smudges at
the arch's shoulders, noise-free CG beside a photograph, and no floor or threshold). Now: a high-key hall. The
walls and ceiling are lime plaster, a warm white less saturated than the room's light (about (240, 221, 195) mid
wall), so walking in brightens the screen towards the cream instead of dimming it; the far wall is lit by the day
and the room (no dark spandrels: nothing in the arch zone darker than about (213, 198, 174), the light zone
itself at least (227, 208, 182)); the ceiling near the door is the darkest plane (about (210, 193, 168)), which
gives the box its shape. The floor is honed limestone, cooler and greyer than the walls, in slabs three across and
0.72m deep whose joints run to the hall point, with a soft, streaked reflection of the bright arch. The depth of
field is photographic: crisp just inside the threshold (the floor's first joints), soft further in (blur grows
with distance from the door plane; the far arch keeps a readable outline). Film grain covers it (σ 6 before a 1.2px
blur, at every export width: finer grain does not survive AVIF q68 / WebP q84), everywhere but the far arch's
flat light.
The far arch's light is exactly the hall colour wherever the render is within 1.5 of it, so the decoded centre is
within ΔRGB 1 in all six Dia files (AVIF and WebP, 720/1080/1600). The gap at rest now shows the hall's own
structure: the darker ceiling at the top, the bright arch at the hall point, the floor below; no dark band.

*The threshold* (reveal layer, both themes): a stone sill inside the doorway (the top step's own tread carried in,
1.7% of the photo's height, a soft joint at its back edge, then the hall floor), and each open leaf's contact
shade on the floor: a soft wedge from the hinge along the leaf's foot towards the hall point (where the leaf
stands at 84° in the page's perspective), spreading towards the middle. The leaves cover both while they are
closed or turning, so they appear with the opening. The step, a dark joint, the sill, the floor: the doorway now
reads as a way in, not a line.

*The doorway's edge*: the facade's hole is 4 master px (0.17%) smaller than the doorway on every side, so the
opaque frame overlaps the leaves and the hall's clip box. Before, three antialiased edges sat on one fractional
coordinate with nothing behind them, and the page colour showed through as a hairline along the hinges (and at
some sizes the head) at rest on most phones (review r1: 393 × 852 @3, 412 × 915, 414 × 896, 1440 × 900 @2,
768 × 1024, 320 × 568, 740 × 360). The ring keeps the photo's own pixels (the leaves' outer edges, which the leaves
show there at rest anyway; open, they read as the door stop), the transom's shadow over the gap and the dark
threshold joint along the foot; inside the hole the file's colour is the ring's own walnut (a bleed of the bright
jamb there gave the half-covered edge pixel a pale colour). With the moving layers promoted (during the sequence,
and with a mouse at rest), the compositor could still leave a sub-pixel gap at the leaves' outer edges, so a ring of
the frame's walnut (`--color-door-ring`, #47210B by day, #110400 by night since the 9 Nov gain; a 3px `box-shadow` on `.ph--hall`, under
the facade) is what shows there, never the page. Measured: a pale pixel 40 levels above the walnut either side of
the edge, at 18 viewports × 2 themes, as loaded and promoted: none (before: whole hinge edges at 393 × 852 @3,
844 × 390 @3, 1440 × 900 @2 and 768 × 1024 @2; `src/tests/list.test.js` I).

*The keystone* (Dia): the grade's protect mask for the keystone was its bounding box, so a hard-cornered rectangle
of the old, warmer wall colour sat behind its chamfered top (review r1: ΔRGB 10–24 with a straight edge). It is
now the keystone's own outline (the top edge, the chamfers and the side joints measured on the source, feathered
about 2.5px), and the plaster above and beside it takes the wall's grade: ΔRGB ≤ 1 between the wall just outside
the outline and 40px away (the keystone's own cast shadow on its right is the photograph's). The numerals are not
touched. *By night* the 11 was 1.07:1 against its stone: a soft warm wash from below (as from the lit fanlight, a
hidden uplight) now lights the keystone's face while the cut numerals keep their shade: 1.5:1, the wall still
night.

*The leaves by night*: the gap's light blooms onto the two inner arrises (a few CSS px at hero size), so the strip
is lamplight between two doors, not a pasted light box; the leaves' shade covers it as they turn.

*The street* (polish pass, POLISH_BRIEF §1; the client: «esticar o pavimento e parede da porta de um lado ao outro da
tela, quer em mobile quer no desktop, e que o fade da cor da parede seja para cima e muito subtil»). The photograph
no longer fades into the page at its sides and foot: the wall and the paving run on to the screen's edges, on phones
and desktops, in the CSS entrance and in the 3D one, by day and by night. Two parts, made to be the same pixels
where they meet.

1. **The page draws the street** (`.ph--street`, the first layer of the scene, so it moves with the camera like the
   photograph): one box reaching three scene widths to the left (the text column's side), two to the right and from
   0.3 above to 1.8 scene heights below the facade's top, with four CSS backgrounds (all geometry static percentages of the box; the theme's values are tokens
   written by the build from `photo.json › street`):
   - the wall: a vertical `linear-gradient`, the page colour T down to 12% of the facade's height, then easing
     (smootherstep, 7 stops) to the photograph's own lower plaster at the paving line (Dia: T × 0.990 / 0.979 /
     0.968, #F8E7D8 against #FAECDF: ΔL\* about 1.9 over 0.83 of the facade's height, about 300px on a phone and 620px
     at 1440). This is the wall's one fade, upward and very subtle, as the client asked. By night the wall is T,
     flat (the light is the lanterns', below). Under the strip's end the gradient turns to the colour the near
     paving blurs into;
   - the paving strip: one image per theme, **periodic at exactly one scene width** (repeat-x, its copy under the
     facade starting at the facade's left edge: the box starts three whole widths to its left, `background-position: 0`), from just above the
     plaster line (0.938) to 1.5 facade heights: the photograph's own cobbles where it shows them, synthesised behind
     the steps and the pot and across the wrap, then the pavement coming towards the viewer. That is the strip an
     upright phone gets (it sees less than one scene width of street). From 600px wide and in landscape the strip is
     **three scene widths wide** (`street3-*`, `--street-size3`): [A | B | C], A that same strip (so the copy under
     the facade is still the photograph's paving, pixel for pixel) and B, C quilted from it, so no stone repeats on a
     screen up to three scene widths across (2.7 at 2560 × 1440; review r1: the 1-width strip showed two or three
     identical tiles side by side on desktops, autocorrelation r 0.85–0.96 at one or two scene widths). The
     stylesheet keeps one density ladder and swaps the files and the tile size in one rule
     (`@media (min-width: 37.5em), (orientation: landscape)`);
   - by night, two lights: the lantern's (an ellipse 0.42 × 0.34 of the facade round the lamp) and the doorway's
     (0.42 × 0.56, centred on the door), radial gradients of S = 1 − 1/gain blended `color-dodge` (B / (1 − S) =
     B × gain): light multiplies what it falls on, so the cobbles and the plaster under it keep their contrast, and
     the photograph's lit stone runs on into the page as the same falloff. By day no layer (none).
   The strip's file follows the screen with media queries (phones under DPR 2.5 and desktops at DPR 1 under 1600px:
   720; phones at DPR 3 and large or DPR 2 screens: 1080; DPR 2 screens from 700px tall: 1600), AVIF through
   `image-set(... type())`, WebP otherwise.
   **Very wide, short windows** (review r2): the scene is sized by the height and stands in the right-hand column,
   so from about 3.5 : 1 at 700px tall or less its left edge was more than the box's three scene widths from the
   window's edge: a hard step from the wall to the page colour, the paving cut (137px at 1600 × 400, 214px at
   1920 × 450, 30px at 2560 × 600), until the camera had zoomed in (p 0.1). From 5 : 2 (`min-aspect-ratio: 5/2`)
   the box gains a copy of itself to its left (`::before`, the same size, so the strip's tiles fall on whole
   periods and the wall's vertical gradient runs on; no lights: theirs end in black, `color-dodge`'s identity, well
   inside the box). Measured at 1600 × 400, 1920 × 500, 1920 × 450, 1440 × 400, 1600 × 450, 2560 × 600 and 2560 × 700,
   Dia and Noite, at p 0, 0.02 and 0.05: no gap; the step across the join is within the paving's own
   column-to-column variation (Dia 2.5–4.7 levels against 2.0–7.2 beside it; Noite 0–1.9) and invisible
   (`shots/final2-fix-r2/street-edge.log`). Only on those windows, so the camera layer is no larger elsewhere.
   The 3D entrance draws the street per pixel on an unbounded plane, so it never had the gap.
   **Before the strip arrives** (review r2): under the strip (which is opaque) the wall's gradient is the paving's
   own mean colour row by row (`photo.json › street › rows`, `final2/work/fix-r2/py/street_rows.py`; 17 stops from
   the plaster line to 1.5 facade heights), so from the first paint the band reads as paving in its tone (Dia about
   #DBCEC1, Noite #463827 since the 9 Nov gain), never as bare wall, and the placeholder above it has no edge on a flat page.
2. **The photograph's margins are that street**: the facade (re-exported from the ungraded master, not from the
   old edge-faded file) is graded so that its outer 14% (Dia; by night an ellipse round the door and lantern, from
   0.56 to 1.04 of its radii, the outer 120–720 master px and the top 22%) hands its light over to the page's composite, computed with the browser's own maths (8-bit
   stops, linear interpolation, color-dodge), and its paving hands over to the strip, which holds the same cobbles
   (flattened). The plaster's mean is matched row by row (the grade had set its highlights, not its mean, to the
   wall), its texture fades with its light towards the edge, the olive's sprigs that the frame cut end on a ragged
   line 66–134 master px inside it, each tapered to a point, and the layer fades out (alpha) over a wide, irregular
   band: on the top and the sides it begins 0–3% of the width in and ends 7–10% in (up to 239 master px), both lines
   wandering along each side (smooth noise), so neither is straight; the olive's crown keeps its own matte inside it
   (never a ghost of leaves); the bottom, on the paving, which IS the strip there, over 70 master px. Each file is
   encoded, decoded and corrected (three passes: the low-frequency error on flat areas, the fade included, subtracted
   from the source), because AVIF's 4:2:0 chroma moved the wall's subtle gradient by 1–2 levels (ΔE about 1.4: the
   box was faintly visible).
   *Fix r1* (review: by night a darker ring, 1–2.5 levels and about 16px, drew the photograph's box on the wall;
   by day a faint hairline): the master's margin was already the street to 0.0 levels; the export broke it. Pillow
   resized RGBA premultiplied in 8 bits and un-premultiplied with a floor, so in the old 70px fade the colour came
   back up to 3 levels dark, and its outermost rows held (0, 0, 0). The files are now made from the same master by
   `final2/work/fix-r1/py/facade_export.py`: colour and alpha resampled apart in floating point and rounded once,
   the street's colour pinned under the outermost 24 master px, the wide wandering fade above, WebP with a lossy
   alpha plane (quality 60: the wandering fade cost 50% more bytes in lossless alpha; quantised alpha changes
   nothing where the photograph equals the street under it, which is all of the fade). Decoded and laid over the
   street in Python, the fade is within 0.15–0.36 levels of the ideal (mean |d|, AVIF / WebP).

*How the strip was made* (`final2/work/polish/pipe/`, outside the build; no generative fill): the photograph's paving
band (rows 2470–2634 of the 2388 × 2634 master) with its light taken out along each row (the row profile, the shade
along the wall, is kept; hard cast shadows lifted locally); image quilting (Efros–Freeman, 48px patches, 14px
overlaps, minimum-error cuts in every constrained overlap, matched with masked SSD among the best 12%, each block
only from exemplar rows within 6px of its own, because the stones are flatter near the wall) fills what the
photograph does not show: behind the steps and the pot, a 220px band across the wrap (so x = W−1 runs into x = 0;
a block that holds a pixel to fill holds no protected one, so its cut is free), and 860 rows towards the viewer
from the band's nearest rows. Those rows are then stretched with their distance from the horizon (the stones grow
taller) and blurred as they come nearer (depth of field: the camera is focused on the door; σ 0 at the photograph's
foot to 9 master px at 1.5 heights); by night they also darken by up to 28% away from the house. The lights by night
were fitted to the photograph's own plaster (least squares on its low-frequency light, log ratio, windowed shapes
that end with zero slope, so no ring marks where a gradient ends).

*Why not a perspective-correct ground*: drawn in true perspective round one vanishing point, the paving two scene
widths from the door (a desktop's left side) shears into long diagonal smears: that view is a 150° rectilinear
panorama. The strip is a push-broom continuation instead: each stretch of the street is seen straight on, as a
facade photographed in segments, so it can repeat at one width (three on wider screens) and stay believable at any
screen width.

*How the 3-width strip was made* (`final2/work/fix-r1/py/ground3.py`, `strip3_export.py`): a canvas three widths
wide that wraps, A in its first third (never changed) and A's own continuation laid in either side of the empty
two thirds (A is periodic: past its right edge come its first columns); quilted round the wrap (56px patches, 16px
overlaps, masked SSD, near-best at random within 25%, rows within 5px of their own; the first row of blocks, which
holds the plaster line, from exactly its own rows, so the line never jogs) from A and its mirror image; a block may
not take its patch from within 48px of where its neighbours' pixels came from, shifted by their offset (otherwise a
block next to A matches A's own continuation with an error of 0 and the quilt copies A verbatim: 352 columns of B
did, a period again); then each join with A is re-cut along a minimum-error path through a 64px band (the quilt
leaves a straight edge where a block stops inside a prefill). Rows, perspective stretch, depth of field, night
fall-off and the wall under the top rows are the 1-width strip's own (its first third matches it to 0.0 levels).
Bytes (AVIF, Dia / Noite, per scene width 720 / 1080 / 1600): 75 / 128 / 198 KB and 30 / 61 / 95 KB, three times
the 1-width files, on screens that are not phones held upright.

*How far it reaches* (`final2/work/polish/tools/extent.js`: the screen in scene units at every 1% of the visible
walk-in, 21 screens from 320 × 568 to 5120 × 1440): at most 2.69 widths to the left (5120 × 1440; 1.03 at 1440 × 900,
0.42 on phones), 1.84 to the right, 0.47 heights below the photograph; above it the page's own colour is the wall's
top colour, so the box need not go higher. The box is 3 + 1 + 2 widths by 2.1 heights (it was 11 by 3.3, five widths
either side: every scene size of it is work for the compositor when the camera layer is made or redrawn at a deep
zoom). Checked at 2560 × 1080, 3440 × 1440, 3840 × 2160 and 5120 × 1440, both themes, at rest and mid-walk-in: the
wall and the paving reach every edge; the rest frames match the larger box's but for the strip's resampling phase,
and the edge measurements below are unchanged (within 0.06).

*Measured* (Chromium screenshots of the final build at the seven review sizes, Dia and Noite,
`final2/work/polish/tools/`): the mean ΔE (CIELAB) of a 10px band just inside the photograph's edge against one
just outside, on plain wall, by day: at most 0.47 on desktops and 0.58 on phones (it was 1.4 before the encode
correction; about 1 is the threshold of visibility); the largest step at an edge net of the local gradient (each
side's 10px profile fitted with a line and extrapolated to the edge), at every side and height and along the top:
at most 0.67 L\* (Noite, 1920), under 0.6 elsewhere, except where the olive's leaves fall inside the measuring
window at the narrowest scenes. At ×10 contrast the photograph's own plaster mottling is still visible inside its
box, fading out towards the margins, which are flat; at normal contrast nothing marks the box. The door's axis on
phones: 0.0px off the page axis at 375, 390 and 430 (stored theme and sky-decided).
*Measured again in fix r1* (the review found what those numbers missed: the ring sat in the fade itself, which a
10px band either side of the edge did not see; `src/tests/edge.test.js`, `final2/work/fix-r1/tools/`): each frame
against itself with the facade hidden, so only what the photograph adds is left, across the top and both sides.
Before: by night a ring 1–2.5 levels deep (1440 × 900: −0.9, −1.2, −1.7, −2.6 over its 4–16px, then 0), by day
−0.3 to −1.3; straight-edge step up to 1.79. After: no ring, no line; the step at most 0.48 over 28 frames (7 screens,
2 themes, rest and walk-in), by day at most 0.25. What is left by night is a soft −0.3 to −0.9 inside the fade,
irregular, from headless Chromium itself: its software raster resamples semi-transparent pixels in 8-bit
premultiplied values when it draws a file smaller than its size (a flat-colour alpha ramp: exact at its own size,
up to −1 level per channel at 720 → 680px; the same facade file over a flat colour at its own size: within 0.05 of
the model). The paving (Dia, rest): autocorrelation of the band, high-passed, at every lag up to 0.9 of the screen:
r ≤ 0.10 at 844 × 390, 768, 1440, 1920 and 2560, Dia and Noite (was 0.81–0.96 at one or two scene widths, Dia). Evidence:
`shots/final2-fix-r1/` (`enh-before-*` / `enh-after-*` at ×8 contrast, `edge-*.txt`, `paving-*`).

*On the compositor*: the street's box is six scene widths wide and is painted in the camera layer, so that layer is
always made at the rest scale, even when the page arrives deep in the walk-in, and is dropped on a new size there
(Performance › Layer sizes has the rules and the measurements). Under 4× CPU throttle, wheel down through the
run and back and the walk-in on request, 390 × 844 @3 and 1440 × 900, Dia and Noite: p95 16.7–16.8ms (33ms at 1440 × 900
Noite, wheel), one frame over 50ms (83ms, the same run), as the build before the street measured the same way (p95 up to 33ms, two
frames over 50ms, at most 133ms; `final2/work/polish/tools/perf4x.js`).

*Markup* (`src/photo.py`): `.entrance` (`role="img"`, the alt text from photo.json: «Entrada em arco de pedra
calcária com portas duplas de madeira, bandeira em leque, lanterna de parede e uma oliveira num vaso de barro.» /
«Limestone arched entrance with double wooden doors, a fanlight, a wall lantern and an olive tree in a clay pot.»;
generic, no street) holds `.scene` (the facade's aspect ratio, 0.90661), and in it, back to front: `.ph--hall`
(the doorway's box, `overflow: clip`) with `.ph--plate` and `.ph--reveal`; `.door` (`perspective` 0.987 of the
photo's height, `perspective-origin` the hall point) with `.leaf--l` and `.leaf--r`, each with its `.leaf__shade`;
`.ph--facade`; `.ph--spill`. Each layer holds a `<picture>` per theme (`t-dia`, `t-noite`: `<source
type="image/avif">` + a WebP `<img>` with `srcset`, `sizes`, `width` / `height`, `alt=""`, `loading="lazy"`,
`decoding="async"`); the theme tokens show one (`--t-dia` / `--t-noite`: `display: contents` or `none`). A hidden
picture has no box, so its lazy image is never fetched. The srcset widths are in facade pixels (the file's width
over the share of the facade it spans), so every layer shares one `sizes`: the scene's width, modelled on the
layout (`src/photo.py` SIZES). The earlier fit ignored the stacked layout's minimum height (the entrance is at
least 40svh), so between 681 and 760px of height it asked for a slot 11–25% too small (facade-720 on a 3× phone at
430 × 740) and over-fetched on portrait tablets and at 3840 × 2160 (review r1). Now, in order: landscape phones
(as tall as the text column beside them); side by side from 900px on landscape and square screens (the right
column, 51vw − 3rem, or the height under the top bar, at most 939px); other landscape; portrait screens from 900px,
stacked since review r2 (the room under the text, whose height grows with the width up to the lockup's cap at 1440,
at most the column and its reach, 99.2vw: slot ÷ scene 0.999–1.000 at 912 × 1368, 1024 × 1100 / 1280 / 1366,
1440 × 1500 and 1080 × 1920; without it they fell to the next rule and asked 7–10% too little); portrait tablets
from 600px (the room under the text, which grows with the width); short phones (two steps, their own minimum heights and tighter text); phones (the room under
the text, never less than the entrance's minimum, never wider than the screen). Measured against the rendered
scene at 145 viewports from 320 × 560 to 3840 × 2160: every slot within 0.95–1.10 of the scene
(`shots/photoint-fix-r1/js/sizes.js`, `sizes.txt` in the review notes).
The head script, which already picks the theme, preloads the four first-paint files of that theme (facade,
both leaves, plate; AVIF with `type="image/avif"`; `fetchpriority="high"` on the facade, `low` on the others, so
they never compete with it). Until the facade has loaded, the scene shows the theme's LQIP (24 × 26px, drawn
blurred through an SVG filter, a theme token `--photo-lqip`), in a box inset by the facade's outer fade at its
widest (10% of the width at the sides, 9.1% of the height at the top, 2.7% at the foot: `photo.py › lqip_vars`,
from `photo.json › fade`), so it never shows through that fade, before or after the load; outside it the street
stands in for the margins, which are the street anyway. It is feathered on every side (a mask: 12% of its width
at the sides, 9% of its height at the top, 7% at the foot; review r2: its hard bottom edge, 57 levels in 8px at
1440 × 900, over a band of bare wall, drew a blurred rectangle on a flat page for the whole download, 165 KB on a
phone and 405 KB on a desktop over 4G), and the street under it already shows the paving's tone (Layout › The
street), so with every photo file held back the largest step across its foot fell from 59–61 to 33–35 levels in 8px by
day at 1440 × 900 and 1024 × 1366 (by night it was 5–8 and is 13, the band's own shadow at the plaster line), and
across its sides from 56–144 to 8–37 (`shots/final2-fix-r2/lqip.log`, `sheet-lqip-before-after.png`; on a phone the
foot's column also crosses the scroll cue). The street strip itself is not preloaded (its file depends on six media
queries); `fetchpriority` on it is left for a later pass. The doorway's layers (leaves, hall) are hidden
(`visibility`, with JavaScript only): the placeholder alone stands for the scene, never sharp doors floating in
a blur. site.js drops both after the facade's load (`.is-loaded`). The layers sit in boxes sized by CSS, so
loading never moves anything (CLS 0).

*The walk-in at full resolution*: the files are picked for the rest size, and the walk-in magnifies the facade
and the leaves 3–6× (review r1: 0.27–0.18 source px per device px at p 0.52; the stone, the 11 and the walnut
smeared). After the load, at idle, site.js fetches and decodes the shown theme's larger facade and leaves (a
detached copy of each picture with `sizes` = 3× the scene: the 2388 master on almost every screen; not on a data
saver or a 2G link, nor without the sequence: reduced motion, `?semporta`); the first time the sequence moves (or is primed by a wheel, a touch or a press on the
action), the real pictures take the same `sizes` and swap to those files from the cache while the doors are
still near rest. Measured (source px per device px at p 0 / 0.36 / 0.44 / 0.52 / 0.58): 390 × 844 @3
1.08 / 1.41 / 0.97 / 0.60 / 0.42 (was 1.08 / 0.64 / 0.44 / 0.27); 1440 × 900 @1 1.06 / 1.83 / 1.13 / 0.61 / 0.41
(was 1.06 / 0.55 / 0.34 / 0.18). Past p ≈ 0.48 the 2388 master itself runs out: it is a 2× super-resolution of a
1194px source, and the jambs are leaving the frame. The plate is blurred and keeps its rest file.

*Budgets* (measured in Chromium, transferred bytes of `assets/photo/`):

| Case | Files picked | First paint |
|---|---|---|
| 390 × 844, DPR 3, Dia | facade-1080, leaf-l/r-1080, plate-720, reveal-1080, **street-1080** (AVIF) | 161 KB (118 + the paving strip 43) |
| 390 × 844, DPR 3, Noite | the same set, street-1080 Noite | 79 KB (+ spill 20 KB after the load; 22 before the door finish's re-solve) |
| 375 × 667, DPR 2, Dia / Noite | facade-720 set, street-720 | 95 / 43 KB |
| 430 × 932, DPR 3, Dia | **facade-1300**, leaf-l/r-1600, plate-720, reveal-2388, street-1080 | 193 KB (Noite 98 KB); was 223 with facade-1600 |
| 440 × 956, DPR 3, Dia | facade-1300, leaf-l/r-1600, plate-1080, reveal-2388, street-1080 | 212 KB (Noite 101 KB); was 244 |
| 768 × 1024, DPR 2, Dia | facade-1080 set, **street3-720** (the 3-width strip) | 193 KB (Noite 110 KB with the spill) |
| 1440 × 900, DPR 1, Dia / Noite | facade-720 set, street3-720 | 145 / 63 KB (95 / 43 with the 1-width strip) |
| 1440 × 900, DPR 2, Dia | facade-1600, leaf-l/r-1600, plate-1080, reveal-2388, street3-1600 | 399 KB (Noite 235 KB); 265 / 130 with the 1-width strip |
| 1920 × 1080 and 2560 × 1440, DPR 1, Dia | facade-1080 set, street3-1080 | 246 KB (Noite 119–141 KB); 159 / 78 with the 1-width strip |
| any, the other theme | nothing (until the theme control is hovered, focused or pressed) | 0 |
| after the load, at idle, with the sequence on (the walk-in's larger files, shown theme) | facade-2388, leaf-l/r-2388 | 242 KB Dia / 124 KB Noite |

Budget: ≤ 180 KB for the hero images on a phone. Since the polish pass the paving strip (a CSS background: 25 / 43 /
66 KB by day, 11 / 21 / 33 KB by night at 720 / 1080 / 1600) is part of every first paint; the 390 × 844 @3 case is
161 KB by day. The large phones at 3× (430 × 932, 440 × 956: scenes of 405–428px, 1215–1284 device px) took the 1600
facade (223 / 244 KB by day); fix r1 adds a 1300 rung to the facade's ladder (both themes, AVIF 112 / 64 KB), so
they take it: **193 / 212 KB by day, still over by 13 / 32 KB** (Noite 98 / 101). The rest of the way down, not taken
because each costs the paving's sharpness where it meets the photograph: the 720 strip on phones (−18 KB), or AVIF
q44 for the strip (−12 KB, the grout smears); a 1300 rung for the leaves would save 6 KB. Wider screens (from 600px,
and landscape) fetch the 3-width paving strip, three times the bytes of the 1-width one (+50 KB at 1440 × 900 @1,
+87 KB at 1920 × 1080, +130 KB at 1440 × 900 @2 by day): the price of no repeat on a wide screen; there is no
desktop budget, and the strip is a background image, so it never competes with the facade for the first paint's
priority. (The phone budget is about the first view on a cellular link; a phone held upright keeps the 1-width
strip.) Measured with `final2/work/polish/tools/bytes.js` (bytes of `assets/photo/` up to the
load event). Each image is fetched
once (the head's preload is the file the picture picks). With the photo files held back 1.2s: CLS 0 at 390, 430
and 1440, both themes; the largest contentful paint is the facade image. The spill (Noite, invisible until the doors open) joins the scene after the page's load
(`.is-ready`); everything is decoded (`img.decode()`) after the load, before anything moves. Shipped in all:
4.85 MB in `assets/photo/` since fix r1 (2.87 MB before it: the 3-width paving strips add 1.51 MB, the 1300 rung 0.39 MB, the wider fade the rest; 2.20 MB before the polish pass: the paving strips added 0.51 MB, the re-graded facades 0.16 MB) (both themes, every width, AVIF and WebP), of which a visitor fetches one theme's
first-paint set. Without JavaScript a browser ignores `loading="lazy"` (the HTML standard turns it off when
scripting is off), so a no-JS visit fetches both themes' first sets (about 85 KB at 390 × 844, DPR 2): the price
of keeping one static page for both themes.

*Theme change*: the other theme is a different photograph. A pointer or the focus arriving on the Dia · Noite
control fetches and decodes it (`loading` switched to eager); a theme change waits for it (at most 800ms) before
the cross-fade, so the fade never lands on a half-loaded entrance.

**`waiting list`** (`#lista`, `.lista.surface-hall`): the room you walked into. h2 «Lista de espera» /
«Waiting list» (title), one sentence (lede), the form, and a `<noscript>` line, standing in the middle of the screen
where the run ends (Layout › Waiting list). With the sequence on, its words
rise in with the scroll itself, as the last part of the run (Motion: p 0.645 → 0.87, driven by the same loop as
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
  an inline message in barro 17px below it, which replaces the description; focus moves to the first invalid
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

**`footer`**: «© 2026 A Brazileira · Torres Vedras, Portugal · Privacidade» (EN «Privacy»), EB Garamond 500
17/25px muted; the link is 44px tall. Its 4px tap padding is taken back by a −4px margin, so both
« · » separators are spaced alike. Below 480px name, place and link take a line each (no dangling separator), and
the link's box takes back only 4px of the footer's 12px bottom padding, so its focus ring (2px at a 3px offset)
fits inside the page at its foot (review r1: at 320 × 568 the ring's bottom edge was cut off by the document's end).

**`privacy notice`** (`privacidade/`, `en/privacy/`): same top bar and tokens; the lockup (30px, its line on
two lines) as home link; h1 title (EB Garamond 28–38px); a short intro at `--size-intro` (the lede, never under
22px, so on phones it is a clear step over the 19px body, not a 1px one); ten short sections (section name as a
label, Cinzel capitals 17px tracked 0.2em, + one EB Garamond paragraph at 19/30px, measure 27em, no hyphenation): controller and contact; data; purpose (to let
you know about the opening: exactly what the consent covers); legal basis (consent, art. 6(1)(a) GDPR; giving the
email is optional; withdrawable without affecting the lawfulness of earlier processing); retention (until
withdrawal, at most 24 months); processor (Supabase, EU servers in Paris, and its short-lived request logs: IP
address and browser); hosting (GitHub Pages, which logs visitors' IP addresses for security); transfers (both are
US companies: GDPR safeguards such as the EU-US Data Privacy Framework or standard contractual clauses); rights
(incl. complaint to the CNPD); cookies (none; no analytics; the Dia / Noite choice is kept only in the browser;
apart from hosting, the only third-party request is the form). «Última atualização: novembro de 2026.» and a
link home. Linked from the consent label and every footer.

**`404`**: the same top bar as every page (Dia · Noite, PT · EN; site.js loaded), tokens and lockup (30–46px,
`--size-lockup-plain`), two sentences (PT and EN) and one link home in each language at the back-link size;
footer with the privacy link. A head script resolves the site root and writes `<base>`, the stylesheets and
site.js (deferred): the script is written too, so the preload scanner never fetches a page-relative
`a/b/assets/js/site.js` before the `<base>` applies (review r1: one 404 and a console error on every deep 404).
Without JavaScript the stylesheets come from the site root (`/assets/css/…`), so a 404 at any depth is styled on
the production domain (on the github.io preview, under `/abrazileira/`, a no-JS 404 is plain). Those two links are
single-quoted on purpose: the repository's deploy step, `tools/stamp_assets.py`, fingerprints double-quoted,
page-relative references only and stopped at a root-absolute one («404.html: missing asset /assets/css/tokens.css»,
so no page was stamped: review r1); it leaves these alone, keeps the unstamped files in `docs/`, and build.py still
gives them `?v=`. `src/tests/stamp.test.js` runs the build through that tool on a copy and checks every page's
CSS/JS references exist (it fails on the build before this fix). The two `theme-color` metas as on every page.

## Motion

### Client review on iPhone, 9 Nov (supersedes the numbers below where they differ)
- **«As portas aumentam de tamanho quando se entra»** (the 3D path, `?3d`): the 3D camera dollied to the threshold and
  on into the hall, so the open leaves, which reach about a metre into the hall, swept wider and wider as it neared
  them. The 3D camera now follows the CSS camera's zoom s exactly on the door's plane, mostly with the lens: it moves in
  only to s^-0.12 of its rest distance (`DOLLY` in site.js) and narrows its field for the rest (door3d.js `frame()`:
  focal x s·zc). Since the door finish review it moves in only while the doors open (zc = min(s, s(0.34))^-0.12, about
  0.93 of the rest distance) and stays put after: a dolly kept up past 0.34 still widened the open leaves by 9–11%
  against the doorway. The hall has its own camera that keeps the dolly all the way (zh = s^-0.12), see «The 3D
  entrance».
- **«A entrada na porta faz demasiado zoom e muito demorado»**: the walk-in ends a short step past the doorway
  (end = 1.15 x the scale at which the doorway covers the screen; it went on before to the arch of light, 1.5x past
  the doorway at least, up to 9x on a phone); keys `KX = [0.01, 0.34, 0.54, 0.66]`, doors 0 → 0.34, the hall's light
  0.52 → 0.66, `COVER_AT` 0.66, the list 0.645 → 0.87; `--porta-run` 115svh → 95svh; `--dur-flight` 1250 → 1000ms.
  From the top to the readable form: about 0.75 screens (was 0.95).
- **«À noite está demasiado escura»**: the Noite photograph is 1.85x brighter (sRGB values x 1.85, clipped;
  `tools/noite_gain.py`): the facade, the leaves, the street strips, the street's wall stops and the
  colour below the strip (the night lights are colour-dodge gains, so K x base gives K x the composite and the street
  still meets the photograph with no edge), the strip's mean-colour rows (the band under the strip before it arrives;
  scaled x 1.85 when the hotfix met fix r2, within 1.7 levels of the gained strip's own rows), the LQIP and the
  page's wall, `--parede-noite` #1C140F → #34251C. The hall, the plate, the doorway's shade and the lamplight are the interior's own light and are unchanged, so the hall colour
  hand-off stays exact. Text on the night wall: linho 11.98:1, linho-escuro 6.86:1, latão 6.29:1; the hairline
  (`--color-ground`, pedra 56%) 3.59:1; the night door ring (`--color-door-ring`) #090200 → #110400.
- **Hinge edges** (844 × 390 @3, Dia): the compositor could draw a leaf up to a device px short of its hinge edge, so
  the hall's light showed as a pale pinstripe; each leaf now carries 1px of the frame's walnut beyond its hinge edge
  (`box-shadow` in `--color-door-ring` on `.leaf--l` / `.leaf--r`, under the facade; it turns with the leaf, so it
  never shows open).
- **«Tira o texto “estamos a restaurar um edifício antigo”»**: the first screen says one sentence, «Brevemente,
  abrimos as portas.» / «Soon, we open our doors.» (the double door is the entrance; «abrir as portas» is also what a
  house does when it opens to guests). The status line («Abrimos brevemente.») is gone: the sentence says it.
- **«Nota-se um retângulo à volta da imagem original da porta»**: the iPhone showed the previous deploy's facade
  (same file name, cached for up to 10 minutes by GitHub Pages) inside the new street. `tools/stamp_assets.py` now
  versions the photographs as a set: a copy under `assets/photo/v<hash>/` and every page points there, so a page can
  never be paired with a photograph from another deploy (`src/tests/stamp.test.js` checks every photo reference). Since
  the door finish review the stylesheets too: the street's paving strips are CSS backgrounds in `tokens.css`
  (`url("../photo/<theme>/street-….avif")`), rewritten to the same version before the CSS/JS fingerprint pass, so
  `tokens.<hash>.css` names the version (unversioned, the CSS entrance drew a new facade in a street Safari kept from
  the deploy before, and the 3D path fetched the strip twice). The test reads every stylesheet as well.
- **«O scroll da porta deve acabar com o texto e inserir e-mail centrado a meio na altura da página. Não em cima»**
  (9 Nov evening, iPhone, Safari 26: innerHeight 796, large viewport 836). Where the run ended, the block (title to
  button) stood 16–88px above the middle (its title 22svh down), and the page went on past that point by the footer's
  height, plus the toolbar's on an iPhone (152px there; 114px at 390 × 844, 68px at 1440 × 900), so a flick stopped
  with the block near the top (its title 23px down on that iPhone). The first fix centred the block in the small
  viewport from the list's top and let the footer close that screen. Asked again on 10 Nov (the same words): on the
  iPhone the page ends one large viewport after the run, so with Safari's bars shown 40px of scroll remained and the
  block rested 40px high; with them hidden (after a finger scroll) 20px high; on short phones the footer still pushed
  the page on (51px at 375 × 667, 100px at 320 × 568, the title cut by the top). Headless Chromium could not show
  it (svh = lvh = dvh there). Now the block is placed against the page's end in the dynamic viewport, a little higher
  only where the footer must fit under it, and the hero action, `#lista` and Tab land on the page's end (Layout ›
  Waiting list). The run, its timeline and the hand-off are unchanged. Measured (`src/tests/list.test.js` J), Dia and
  Noite, PT and EN, where the scroll stops: |block centre − screen centre| ≤ 0.4px at the seven screens where the
  footer fits under the centred block (390 × 844, 390 × 796, 430 × 932, 768 × 1024, 1024 × 768, 1440 × 900,
  1920 × 1080), and after the hero action's flight; 375 × 667: 19px above the middle, 32px over the footer; 320 × 568:
  16px from the top, 27px over the footer; both end with the run. At 844 × 390 the block is taller than the screen
  with the footer (360px, 411px in English), so the 16px top rule applies at the run's end, the field whole (0.4px off
  centre in Portuguese by coincidence, 26px in English). iPhone emulation (`serve.ios`: the stylesheets with svh, lvh
  and dvh in px, the viewport as tall as the visible area): the client's 390 wide, 796 / 836: 0px off at the page's
  end with the bars shown (40px after the run) and hidden (at the run's end), after the flight and on `#lista`; 393 ×
  695 / 735: 5px / 0px; iPhone SE 375 × 553 / 627: the title 12px / 70px from the top, 16px / 32px over the footer.
  With the 3D entrance on (`?3d=force`, merged with the iOS round) the end of the run is the same frame: ΔRGB 0 at
  390 × 796 @3 and 1440 × 900, Dia and Noite.

### The door sequence (scroll-linked)
Client, round 3 (after testing on an iPhone): too many scrolls, the waiting list took too long to appear, and the
background "being removed" read wrong; zoom further in, until it is one colour, and then show the list, all in a
short space. Measured on that iPhone before: the form at y = 1678 with innerHeight 836, about 2.0 screens.

The first screen sits in a tall wrapper: the stage is `position: sticky` and stays pinned for `--porta-run`
(95svh since 9 Nov) of scroll. The waiting list starts exactly where the stage releases and lies over the stage during the
run, so the run ends with the list at rest. Scroll progress p (0 → 1 from the wrapper's top to the end of the
pinned stretch) drives every layer, each over its own sub-range and curve; scrolling back reverses everything
(walk back out). On screens shorter than the rest composition the stage first scrolls until its foot meets the
screen's bottom, then pins; the timeline starts at the wrapper's top all the same, so the doors move on the first
pixel there too (review r1: at 390 × 664, the iPhone's visible area with its toolbars, the first 26px moved
nothing; `src/tests/list.test.js` H).

**The run in three overlapping beats** (retuned to the photograph's geometry: the door axis, the hall point,
the doorway). The doors swing inwards from the first pixel and the camera starts with them; the camera walks in
towards the hall point (the photo's vanishing point, 0.48241 × 0.63326 of the facade, on the door axis): at
p = 0.34 the doors are open (84°) and the camera is at the threshold, by p = 0.54 the doorway covers the screen and
the jambs, the edge-on leaves and the steps have passed out of the frame, and it takes one short step more (to 1.15x
that scale) while the hall's light, one flat `--color-hall` over the whole stage, fades in (p 0.52 → 0.66); at
p = 0.66 the screen is that one colour, exactly the token, and the list rises in on it at once.
On a phone the photograph's foot holds at the visitor's feet while it grows (the hall point rises with the zoom)
and the steps leave through the bottom edge as the threshold is crossed.

**Measured scroll from the top until the list title and the email field are fully in view and readable**
(opacity ≥ 0.99, settled; 9 Nov evening values, with the block centred; `src/tests/list.test.js` C):

| Viewport | Scroll to the form | Screen is one colour at | End of the run |
|---|---|---|---|
| 390 × 844 | 636px = 0.75 screens | 0.63 | 0.95 |
| 430 × 932 | 701px = 0.75 | 0.63 | 0.95 |
| 375 × 667 | 503px = 0.75 | 0.63 | 0.95 |
| 844 × 390 | 294px = 0.75 | 0.64 | 0.96 |
| 768 × 1024 | 771px = 0.75 | 0.63 | 0.95 |
| 1440 × 900 | 678px = 0.75 | 0.63 | 0.95 |
| 1920 × 1080 | 814px = 0.75 | 0.63 | 0.95 |

Before 9 Nov: 1.00–1.04 screens; before the short run, about 2.0 (1.99 at 390 × 844).

*Wheel notches* (the rework brief also said «2–3 wheel notches on desktop»): with native scrolling at about 100px
a notch (Chrome on Windows; macOS varies with acceleration), the form needs about 9 notches at 1440 × 900 (890px),
7 at 1280 × 720 (724px), 9 at 1536 × 864 (857px) and 11 at 1920 × 1080 (1069px) before 9 Nov; since then about 7 at
1440 × 900 (678px) and 8 at 1920 × 1080 (814px). A one-screen run cannot also be
2–3 notches without taking over the wheel, which the native-scroll rule forbids (a hijacked wheel breaks
trackpads, keyboard scrolling, find-in-page and assistive tech). The screen target (about one screen) was chosen
over the notch count; on desktop the hero action is the one-press route (it walks in to the form in 1.0s), and
the scroll cue under the photograph does the same. Real touch
drags (iPhone 13 profile, the `tools/touch2.js` pattern: 350px finger drags, no momentum): the first drag reaches
p ≈ 0.44 (doors open, walking in), the second the list title and field in view (the form at 97% opacity, 100%
a few pixels on); one swipe with momentum on a real phone covers both.

| Element (hook) | Role | p range | Motion | Curve |
|---|---|---|---|---|
| Text column: lockup, lede, status, action (`copy`) | Support, exits | 0 → 0.14 of min(r, p) | opacity 1 → 0, rises 16px; no pointer target below 50% | `--curve-copy` (0.33, 1, 0.68, 1) |
| Scroll cue (`cue`) | Decoration | 0 → 0.05 of min(r, p) | opacity 1 → 0; no pointer target below 50% | `--curve-copy` |
| Left / right leaf (`leaf-l`, `leaf-r`) | Lead, from the first pixel | 0 → 0.34 | `rotateY` 0 → +84° / −84° (`--open-door`) about the outer hinge, inwards, in the photo's perspective (0.987 of its height, from the hall point) | `--curve-door` (0.3, 0.55, 0.35, 1) |
| Leaf shade (`shade-l`, `shade-r`) | Support | 0 → 0.34 | opacity = sin(angle) of `--color-leaf-shade` (noite at 28% by day, 40% by night): brightness 1 − 0.28 / 0.40 · sin(angle) | `--curve-door` |
| Lamplight on the steps, Noite (`spill`) | Support, carried by the leaves | 0 → 0.34 | opacity (1 − cos angle) / (1 − cos 84°): it grows with the opening | `--curve-door` |
| Camera: pan (`camera`) | Lead | 0 → 0.28 | the hall point travels on a straight line to the screen's centre. Portrait screens (hall point below the centre): the rise follows the growth, a = (s − 1) × foot distance / rise, so the photo's foot holds at the visitor's feet and then leaves through the bottom edge; a eases into 1 with zero slope over [0.75, 1.25] (it was clipped at 1, a bob of the threshold mid walk-in: its speed changed by about 6px per 0.004 of progress, review r1; now under 1.2px at 390 × 844, 390 × 664, 430 × 932 and 768 × 1024, `src/tests/list.test.js` F), and combines with a smoothstep over p 0.32 → 0.5 that centres it by p = 0.5 at the latest as 1 − (1 − a)(1 − b) | `--curve-pan` (0.35, 0.4, 0.3, 1); portrait: tied to the zoom |
| Camera: walk-in (`camera`) | Lead | 0.01 → 0.66 | scale 1 → S around the hall point, geometric, through four keyframes per screen (below) | monotone cubic on log(scale) |
| The hall (`plate`) | Depth | with the camera | its own `scale(s^(kp − 1))` inside the camera, so it grows as zoom^kp (kp 0.8): further away, it opens up behind the jambs | — |
| The hall's light (`flood`) | Arrival | 0.52 → 0.66 of max(r, p − 0.1) | `--color-hall` over the whole stage, opacity 0 → 1, slow at first: 0.013 when the doorway covers the screen (0.54), 0.28 at 0.6, 0.80 at 0.645 (so never a veil over the stone); 1 from 0.66 on; the page behind the stage takes the colour too | `--curve-light` (0.55, 0, 0.75, 0.55): slow, then all at once |
| Waiting list: title, sentence, form (`list`) | Arrival | 0.645 → 0.80 / 0.65 → 0.83 / 0.655 → 0.87 of r | opacity 0 → 1 and 16px (the form 10px) of rise, on top of the scroll's own; no pointer target below 50% | `--ease-out` (0.23, 1, 0.32, 1) on p |

**The walk-in's keyframes** (`measure()`, per screen): log(scale) passes through 0 at p = 0.01; inDoor^0.3 at
p = 0.34 (the threshold, as the doors finish opening); inDoor at p = 0.54, the scale at which the doorway covers
the whole large viewport with the open leaves pushed out of frame; and S at p = 0.66, with a monotone cubic
(Fritsch–Carlson) between them: it never goes back, never overshoots, starts softly (zero slope) and does not land
(the screen is one colour by then). Since 9 Nov S = min(1.15 × inDoor, what the plate covers) (client: too much zoom,
too long); measured inDoor / S: 390 × 844 5.52 / 6.34, 430 × 932 5.06 / 5.82, 375 × 667 6.43 / 7.39, 844 × 390
13.4 / 15.4, 768 × 1024 6.92 / 7.96, 1440 × 900 8.64 / 9.94, 1920 × 1080 9.73 / 11.2. The rest of this paragraph is the
formula before 9 Nov.
inDoor = 1.05 × max(vw / 2 / clear half-width, svh / 2 / (doorway top above the hall point), (lvh − svh / 2) /
(doorway foot below it)), where the clear half-width is between the hall point and an open leaf's free edge in
the photo's perspective (each leaf at 84° still covers about 10% of the doorway's width). S = max(1.5 × inDoor,
min(zl^(1/0.8), 20)), zl being the plate zoom at which the far arch's light (within ΔRGB 4 of the token: 0.0724 of
the photo's width either side, 0.126 above and 0.116 below the hall point) fills the screen; 20 is what the plate
covers (1.84^5 = 21, less a margin), and kp is raised above 0.8 if S had to go past it. Measured: 390 × 844
inDoor 5.7, S 17.6; 1440 × 900 inDoor 8.6, S 20; 1920 × 1080 inDoor 9.7, S 20; 768 × 1024 inDoor 7.2, S 20.

**The list rises in with the scroll.** Its section starts where the stage releases, so during the run its words
come up with the scroll itself (native, compositor-smooth), hidden; as the screen turns one colour all three
begin together (none is ever an empty field on that light) and settle one after the other, the stagger being in
how long each takes. In scroll terms: from one colour to a readable form about 0.13 of a screen (0.12–0.13 since
9 Nov); in the walk-in on request about 180ms (title) and 215ms (form) from first showing to rest. It is never driven by an IntersectionObserver: wherever
the page rests past the end of the run (a reload or a restored position at the bottom, a jump, the end of a
short landscape page) the words are at rest and opaque (`src/tests/list.test.js` B: every rest position from
the flat moment to the end of the page, and a reload at the bottom, on 844 × 390, 932 × 430, 667 × 375, 720 × 450
(1440 × 900 at 200%), 390 × 844 and 1440 × 900).

The hall's light starts at 0.52, just before the camera covers the screen with the doorway (0.54), but its curve is
slow (opacity 0.013 at 0.54), so it comes up over the soft hall and its arch of light, never over the stone; from 0.66
the frame is
the token (ΔRGB 0 on every pixel, nine aspect ratios, both themes: Colors › Surface). Before the photograph the
last part was a step of the flood over a flat drawn hall; a lossy photograph cannot hold the token, so it is now a
fade.

Which progress each layer reads: r, the rendered (smoothed) progress, except two groups. The text column and the
cue read min(r, p): they leave with the doors, but come back with the scroll itself, so after a fast flick to
the top the title is there as the page arrives (measured: within one frame of scrollY reaching 0 at 3000px/s).
The hand-off layers read max(r, p − 0.1): at hand speed (lag under 0.1) exactly r; after a fast fling the stage
is already one colour when the list panel arrives at p = 1, never a hard panel edge rising over a photograph the
smoothing has not caught up with (0 such frames at 3500px/s). The list reads r, so its words never show before
the hall's light; they begin at r 0.645 with the light at 0.80, so for the last 0.015 of progress up to a fifth of the
hall still shows through under them (r 0.65: light 0.87, title 0.14; r 0.66: light 1, title 0.39, sentence 0.23, form
0.10).

### Driver (why one plain-JS driver)
- One driver for every browser: a passive `scroll` listener (and `resize`, `visualViewport` resize,
  `orientationchange`, `load`, `pageshow`, `document.fonts.ready`) wakes one `requestAnimationFrame` loop.
  Each frame reads `pageYOffset` only (no layout reads), turns it into p **clamped to [0, 1]** (iOS
  rubber-band overscroll above the top or past the end never pushes a layer beyond its rest or end state),
  and moves the rendered progress r towards it: `r += (p − r) · (1 − e^(−dt/τ))`, τ = `--scroll-tau` 90ms,
  frame-rate independent (dt is clamped to 64ms). It snaps when |p − r| < 0.0005, snaps at once on a jump (the
  scroll itself moved more than 0.35 of the run since the last frame: a link, a focus move, a restored position; the
  sequence is never replayed as a flash), never lags more than 0.25 behind or ahead (`LAGMAX`: past that r moves with
  the scroll), and stops when settled (it keeps reading `pageYOffset` for 8 more frames so a late momentum frame is never
  missed). This is smoothing of what is drawn only: native scrolling is never prevented, delayed or
  animated, and the stage pins with plain `position: sticky`. Review, door finish: the jump test was the distance
  |p − r|, which under the follow is about the scroll's speed × 99ms, so an ordinary fast flick passed 0.35 (844 × 390
  from about 1330 px/s, 390 × 844 from about 2800) and r cut ahead in one frame (r 0.284 → 0.639, the scene ×9 in a
  frame). Now, with mouse-driven flicks at 1500 / 2500 / 3500 px/s on 390 × 844 and 844 × 390, the largest one-frame
  step of r is 0.03–0.16, never more than the scroll's own largest step, and r never snaps to p (`src/tests/cta.test.js`).
- At p = 0 every inline style is removed, so the hero is exactly its CSS rest state (opacity 1, transform
  none). This, the clamp and the removal of the former ViewTimeline / WAAPI path fix the regression where the
  site title disappeared after scrolling back up on iPhone Safari: the timeline path could resolve the text's
  exit at the end state during rubber-band overscroll and drifted with the collapsing toolbar. Regression
  test: `src/tests/reverse-scroll.test.js` (wheel, touch drags, programmatic jumps, emulated scrollY < 0 and >
  max, viewport height −84px / +60px mid-sequence, fast flicks) asserts `.intro` opacity 1, transform none and
  no inline style after every scenario; a mutated driver without the clamp fails it.
- Geometry is cached: the doorway centre and size (untransformed `offset*`), the small-viewport height (a
  100svh probe), the pin offset for short screens, the timeline's start (the wrapper's top) and the run
  (`wrapper − stage`, plus the pre-pin stretch on short screens; stable while mobile toolbars come and go). It is
  re-measured on the events above, keeping the same progress.
- **The list stays at rest when the screen changes size under it** (review r1). The run is in svh, the scroll
  position is kept, so a resize used to land the page back in the door sequence with the list hidden: after a
  keyboard closed in a browser that resizes the page (Android in-app browsers), or a rotation round trip, the
  focused email field was at opacity 0 (375 × 667: p 0.60). Now (a) while a field of the list has the focus and
  only the height changed, the run keeps its length in px (`--porta-run` inline) and the list its top padding (the
  block's centring, inline px), so the list and the field do not move under a keyboard; both are let go when the
  focus leaves the list; (b) when the list was at rest and the screen's
  width or small-viewport height changed, the page is put back at the same distance into the list. Measured with
  the reviewer's scenarios: 390 × 844, 375 × 667 and 430 × 932, the field focused at the end of the run and at the
  page's end, the page 300–350px shorter and back: the field stays opaque and in view, and the page returns to
  the same y; a 375 × 667 ↔ 667 × 375 round trip likewise (`src/tests/list.test.js` G).
- Writes are `transform` and `opacity` on the moving elements only (and `pointer-events: none` on the faded text
  and cue, so a tap on the photograph mid-sequence never launches the walk-in, and on the list's words until
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
  On short landscape screens the list is taller than the screen: Tab from the action into the field used to keep
  the browser's own focus scroll, which went past the list's start and clipped «Lista de espera» (844 × 390: the
  title 6–7px above the screen). The handler now puts the list at its rest position whenever what took the focus is
  in view there, from either side; only what would not fit is brought in with `scrollIntoView({ block: "nearest" })`.

### The walk-in on request (the hero action and the scroll cue)
Requirement: the walk-in on request must be fluid and read as entering through the door, neither slow nor rushed.
This replaces the former instant jump.

- **Still one driver.** The same rAF loop writes the scroll position itself (`window.scrollTo` per frame, never
  native smooth scroll) and the scene follows it through the same smoothing as a hand scroll, so the doors
  swing, the hall lights and the camera walks in exactly as under the finger. The first frame moves nothing
  (the layers are promoted in it), the travel starts on the next.
- **It eases the visual journey, not the distance.** Each pixel of the way weighs 1 + `--flight-weight` (2) ×
  the walk-in's change of (log) scale over it, + `--flight-weight-list` (1.2) × the list's change of opacity (the
  mean of its title, sentence and form: without it the words came in at the flight's top speed, in 90–130ms,
  review r1); the time curve `--curve-flight` (0.45, 0, 0.3, 1: soft start,
  long gentle settle) runs over that weighted way (a 96-step table built once per flight). Easing the plain
  distance was tried first and failed by eye: the peak speed fell in the doorway, the walk-in took 250ms and
  the list's plain rise took half the flight. Weighted, it reads as one gesture (measured per frame, from the
  click; `rework-tools/flight.js`; the travel starts about 90ms after the click, the press frame):

  | Beat (from the frame before the first move; rendered progress r; 9 Nov values) | 390 × 844 | 1440 × 900 |
  |---|---|---|
  | Doors open (84°, r = 0.34) | 0–367ms | 0–382ms |
  | The doorway covers the screen (r = 0.54) | 517ms | 521ms |
  | The screen is one colour (flood 1, r = 0.66) | 670ms | 676ms |
  | The list's title: first showing → at rest | 634 → 817ms (183ms) | 638 → 816ms (178ms) |
  | The form: first showing → at rest | 650 → 867ms (217ms) | 656 → 866ms (210ms) |
  | The scroll lands; focus in the email field (`preventScroll`) | 1001ms; 1001ms | 999ms; 1016ms |

  (`final3-work/r2/beats.js`, CSS path, Dia, per frame after the driver wrote it. Before 9 Nov, with
  `--dur-flight` 1250ms and the list at 0.745–0.94: doors 0–400, doorway 550–567, one colour 783–800, title
  750 → 1000, landing 1233–1250ms; `rv1m/flight.js`, no frame over 50ms under 4× CPU throttle.)

- **Duration** `--dur-flight` 1000ms for the whole way from the rest state since 9 Nov (client: «a entrada na porta
  faz demasiado zoom e muito demorado»; it was 1250ms, before that 1500ms over a way twice as long); a shorter way is
  shorter (× √share, never under 35%). Measured travel 1.00s at 390 × 844 and 1440 × 900 (`src/tests/cta.test.js`
  holds it to 0.9–1.1s, Dia and Noite). The list's part is 180ms (title) to 215ms (form) from first showing to rest,
  under the 250–350ms the earlier brief asked for: the hotfix's shorter flight and list keys are binding.
- **Interruptible.** `wheel`, `touchstart`, `pointerdown` or `keydown` (capture, passive), or a scroll that is
  not the flight's own (more than 4px from what it wrote), ends it at once: the page stays where it is, in the
  visitor's hands, the focus is not moved. Not interruptions: a held key repeating (the press that started it;
  repeated Space / Enter on the action are also prevented, so they neither scroll nor re-press), a second press
  on the action or the cue within 450ms (a double click or tap), and a second activation of the same flight,
  which simply carries on at the speed it has (no stall and restart).
- **Lands** on the list's rest position (site.js `rest()`, the same place as `#lista` on load and Tab): the page's
  end, which is the end of the run except on a phone with its toolbars shown (40px further on the client's iPhone),
  or the list's top where the list is longer than the run's last screen (844 × 390); with the title and the email
  field in view; the list's words rise in during the last 300ms of the flight
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
  top, just before it starts) site.js sets `will-change` on the facade (`transform`: its own layer, raster scale
  frozen while the camera zooms), the camera and the plate (`transform`), the two leaves (`transform`, 3D), their
  shades, the lamplight and the hall's light (`opacity`), and the text column and the cue. Every layer whose
  opacity changes per frame is its own layer, so no change repaints the doorway inside the zooming camera. The
  layers are made before the first moving frame: on the `wheel` or `touchstart` that starts a scroll, on the
  `pointerdown` of the action or the cue (a press lasts about 100ms before its click), and, with a mouse, when it
  first arrives over the page (the image layers only, never the text, whose subpixel antialiasing a layer can
  lose). All hints are dropped 300ms after the loop settles back at the top. Readying the layers at idle after the load
  on every device was tried and dropped: a layer sits on whole device pixels, so the photograph moved by a fraction
  of a pixel a second after the load (up to 194 levels on its sharpest edges at 390 × 844).
- Layer sizes: every promoted layer is the size of the photograph's box or smaller (the facade and the camera
  322 × 356px at 390 × 844 and 681 × 751px at 1440 × 900, the plate 0.58 × 0.91 of it and clipped by the doorway,
  the leaves 0.13 × 0.5, the lamplight 0.96 × 0.59), whatever the zoom: the zoom is a transform, not a bigger
  layer, so a phone never holds a texture many screens wide. The facade is a layer of its own so an engine that
  composites images directly (WebKit) can use the decoded image as the layer's contents instead of a backing
  store re-rendered at every zoom; the camera layer then paints almost nothing (the LQIP is gone after the load).
  Only Chromium was measured here. The one exception is the street (the wall and the paving round the
  photograph, since the polish pass): it is painted in the camera layer and its box is six scene widths wide (three
  to the left, two to the right) and 2.1 tall. It is rastered only where it is on screen, at the camera layer's raster scale, so that layer must
  be made at the rest scale, as it is from the top. Three rules keep it so:
  - Layers made under the flat colour (`#lista` on load, a jump to the list, a restored position) are made with
    the camera at its rest scale (`transform: none` for its first three frames and 60ms at least, out of sight
    under the hall's light: pixel-identical frames at nine viewports from 375 × 667 to 2560 × 1080, both themes),
    then the true camera; should the light lift before then, the true camera at once (site.js, `low`).
  - A new size deep in the walk-in (zoom over 2.2×: a window resized over the list, a rotation) drops the layers;
    they are made again when the page next moves.
  - With the 3D entrance, the photograph's layers are hidden while the canvas draws; when they come back
    under the flat colour, the camera is drawn at its rest scale for those first frames too. Without it, a theme
    change at rest after a walk-in redrew the street at the end's zoom and froze frame production for over 8s in the
    software renderer (the door3d test's "theme change: the next scroll uploads nothing" failed one run in three;
    after: 0 in 9).
  Without them, at 1440 × 900: the rewind to the top on a Tab back to the title from `#lista` froze the page for
  0.5–1.8s (frames of 517–1767ms), the scroll back up from `#lista` had frames of up to 300ms (7–13 over 50ms), and
  a resize at p 0.8 took 2–4s on the compositor (the reverse-scroll test's E2 failed one run in three). With them:
  frames of 17ms for the rewind, at most 33–50ms and none over 50ms coming back up (unthrottled and 4×), E2
  settled in 0.44–0.48s in eight runs, as before the street. Tried and dropped: the street as a layer of its own
  (made again at the doorway's zoom each time it came back into view: 9–21 frames over 50ms on a 4×-throttled wheel
  scroll at 1440 × 900), and hiding it once the doorway covers the screen (the camera layer's raster scale then
  followed the zoom: frames of 83–133ms coming back up).
- No blend modes: the lamplight on the steps was first a layer with `mix-blend-mode: screen`; a blended layer reads
  its backdrop back in every composited frame (1440 × 900 Noite, 4× throttle: p95 33ms, frames of 83ms). It is now an
  RGBA overlay of one warm colour whose alpha was solved against the night facade itself (`photo/py/spill2.py`),
  so it looks the same (mean error 0.7 level, 99th percentile 10) and costs an opacity change. Since the door finish
  that alpha also falls off from the doorway, across the steps and with depth, and lights the risers by bounce
  (`spill3.py`, Roadmap).
- Images are decoded before they move: after the load, `img.decode()` on every layer of the shown theme (the
  lamplight included); a theme change decodes the other theme before it shows it.
- Crisp at rest: 250ms after the scroll rests mid-sequence (while the jambs are on screen, p < 0.58), the facade is
  handed back for one frame (it re-rasters crisp at the current zoom) and promoted again at that scale, so the
  next scroll starts without raster work. Inside the hall there is nothing to re-raster (the hall is out of focus).
- Crisp during the walk-in on request: during a flight, while the zoom grows past 2.2× the scale of the last raster
  and the jambs are still on screen (p < 0.58), the facade is handed back for one frame and promoted again: a fresh
  raster at the current zoom. A hand scroll keeps the raster it has while it moves and turns crisp when it rests.

### The 3D entrance (door3d.js)
**Status: on by default wherever the device can draw it** (door finish, 9 Nov; client: «Porta: desenvolve logo até
ao fim, e publica no site»; `shared/DOOR_FINISH_BRIEF.md`), with the CSS entrance (the photograph in layers, «The door
sequence» above) as the automatic fallback at every step. Both follow the same rendered progress r at all times, so
either can take over from the other at the same frame. site.js, «The 3D entrance» in the driver:

- **The gate**, in this order; the first that answers names the reason (`?diag`, `geo().d3why`). Known without WebGL:
  reduced motion; `?semporta`; `?sem3d`; a data saver (`navigator.connection.saveData`); a 2G link (`effectiveType`
  `slow-2g` / `2g`); no ES modules; no `WebGL2RenderingContext` (WebGL 1 is not a path: three.js dropped it in r163, and
  Safari has had WebGL 2 since 15); a hand-back or a GPU refusal earlier in the same session (`sessionStorage["ab-3d"]`
  = `0|<why>`); then the soft heuristics, only for clearly weak devices: `navigator.deviceMemory` under 2 GB (Chromium
  reports 0.25–8 in powers of two; a 3–4 GB phone reports 2 and passes), fewer than 4 cores (`hardwareConcurrency`;
  not on iOS, where WebKit may report fewer than the device has). Then the GPU probe, once per session at idle: a
  throwaway WebGL 2 context with `failIfMajorPerformanceCaveat` (none: refused), its renderer's name
  (`WEBGL_debug_renderer_info`): a software renderer (SwiftShader, llvmpipe, softpipe, «Basic Render»: refused), a
  `MAX_TEXTURE_SIZE` under 4096 (refused), and the soft list `WEAK` of entry-level GPUs from 2014–2018 (Mali-400/450,
  Mali-T6xx–T8xx, Mali-G31; Adreno 1xx–4xx and 50x; PowerVR SGX and Rogue GE8100–GE8300; Intel GMA and HD Graphics
  2000/3000; VideoCore; Vivante; Tegra 2–4). An Apple GPU reports «Apple GPU» and is never on it. The answer is
  remembered for the session (`1|<renderer>` or `0|<why>`); the module repeats the software and caveat checks when it
  makes its own context.
- **Early, never in the way** (iOS round, 9 Nov: on the client's iPhone, `?diag` under the flat colour read
  `3d=loading`, the gate passed on «Apple GPU»; the 3D came only later). At the first idle moment after the first
  paint (a frame, then the next turn of the event loop; not after the load event, which waits for every photograph
  in view): the gate, the probe, then the module and three.js as module preloads at low priority (the first
  screen's photograph goes first). Every later step runs only while the page is still: no scroll being followed, no
  flight, no touch, wheel, key or pointer for 150 ms (`CALM`), anywhere in the run (until 9 Nov: 400 ms, and only at
  rest or under the flat colour, so a visitor who started to scroll got the 3D seconds after reaching the list).
  The steps run in slices: one may follow the last in the same task while the slice is under 10 ms (`SLICE`); the
  next slice is an idle callback, or a message-channel turn where there is none (Safari 26 has no
  `requestIdleCallback`: a 16–50 ms timeout per step stood in for it, ~0.9 s over a mount); a fence is polled at the
  next turn, then every 4 ms (16 before). The photographs are decoded in a small worker while three.js and the scene
  are built (the leaves' geometry, `prep()`, in a step of its own: 11–30 ms of the scene's 25–50 at 4×); the facade
  goes up in bands of ~250 rows, then its mip chain; on WebKit (every iOS browser, and Safari) one program is
  compiled per step and its link asked for a step later (`KHR_parallel_shader_compile` is exposed there but a link
  still blocks, webkit.org/b/251514), elsewhere `compileAsync`; each program is first used in the variant it is
  drawn with (the canvas variant in one scissored pixel of the hidden canvas: primed only in a target, the canvas
  programs were first used in the first warm frame, a 61–87 ms task at 4×); two frames are drawn ahead, hidden.
  Stages, in order: `gate probe fetch wait eval context decode three scene theme upload compile warm frames on`.
  Safari 26 API surface (MDN browser-compat-data, 9 Nov): no `requestIdleCallback` (flag only),
  `navigator.scheduling`, `scheduler.postTask`/`yield`; has workers with `createImageBitmap` (15; its options 15,
  `premultiplyAlpha` fully 17), AVIF (16), `modulepreload` (17), `fenceSync`/`getSyncParameter` (15),
  `OffscreenCanvas` (16.4; WebGL 2 in it 17, not used), `MessageChannel`; no import map is used.
  Measured (iPhone emulation in Chromium, `final4-work/ios-load/tools/ios.js` in the working notes: Safari 26.6.1
  user agent, DPR 3, 390 × 796, 4× CPU throttle, Safari's API surface, «Apple GPU» spoofed on SwiftShader; GPU times
  are SwiftShader's, a phone's GPU does that work in a fraction of it; re-run for iPhone round 2, 10 Nov, ranges with
  the number of runs). A still visitor: on 2.0–2.4 s after the load event (6 runs; the review's 7 runs on the same
  machine a few hours earlier: 2.4–3.0 s), 1.1–1.4 s of it on SwiftShader's fences; with DPR 1 (a ninth of the
  fill) 1.3–2.0 s (3 runs). Per stage, mean of 6 (ms): wait 37, decode 54, three 39, scene 42, upload 403, compile
  43, warm 506, frames 572 (before the iOS round: 3.6–4.3 s in all, upload 858, warm 768, frames 741). Long tasks
  after the load event: none in 6 still runs, one of 57 ms (scene) in 3 at DPR 1; in 16 flick runs, 54–56 ms (scene)
  in 2, 76 ms (frames, the visitor's flick landing in it) in 1, and 54–66 ms once the 3D was on in 2 (one in its
  frames before the hand-back, one 5.7 s after it); the review saw 51–72 ms in the three and scene
  steps in 4 of 14. Nothing held. A visitor flicking from
  1 s after the load (five flicks, 900 ms pauses, at the list 7.2 s after it): while it loads, no input waits over
  35–46 ms (5 runs; the review saw 54–76 ms in 4 of 12 flick runs, 3 of them while a frames step drew: a touch that
  lands in a frames step can wait 55–75 ms on SwiftShader, and once 151 ms in a first attempt of `door3d.test.js`);
  on at 7.4–9.2 s, after the list (5 of 5), so that walk-in is the CSS one: the steps wait for the pauses (held
  4.2–5.3 s) and SwiftShader's fences take 2.2–2.9 s as it composites the CSS walk-in at DPR 3 meanwhile. From 2 s:
  on at 2.0–3.7 s, taken over in the first walk-in (6 of 6: at the first frame of a flick, r 0.003, or parked
  mid-walk, r 0.202–0.217, by the cross-fade). From 3 s: on at 2.0–2.7 s, taken over at the first frame of the
  flick (5 of 5). On SwiftShader the 3D then cannot keep up at DPR 3 and the guard hands it back: before the GPU-lag
  rule (below) after 0.9–1.2 s of frames («a frame of 167–317 ms», 6 runs), with ~5 s of GPU work queued: touches
  waited up to 256–618 ms and the next flick came 4–4.5 s after the last (1.55 s on the CSS walk-in); with it (7
  runs) after 4–9 frames («the GPU 123–149 ms behind»): touches 36–213 ms, the next flick 1.55–2.1 s.
- **The live safeguard** (`watch3d()`, once per driver frame): the interval from a frame in which the canvas drew to
  the next frame (the GPU's share included: the next frame waits for it), over the first second of such frames after
  each mount. Any frame over 120 ms, or a median over 25 ms (or over 1.5× the display's own cadence where that is
  slower, so a 30 Hz low-power mode is not taken for a slow GPU: a dozen empty frames are timed at idle as soon as the
  gate has passed, before anything is fetched), hands back. So does the GPU's own lag (iPhone round 2): a fence after
  each frame drawn (door3d.js `lag()`, polled once a frame, never waited on); a frame the GPU has not finished after
  the frame limit (120 ms) with 3 or more waiting hands back («the GPU 124 ms behind, 8 frames (limit 120)»). In
  Chromium a WebGL canvas can queue seconds of GPU work before its main thread feels it: on the iPhone emulation the
  frame rule caught SwiftShader only after ~1 s of frames, with ~5 s of work queued that went on draining after the
  hand-back. One stale answer after a stall (a single frame waiting) is not counted. A loop that stopped (the page at rest) starts the count afresh; after a tab switch or
  a page restored from the back/forward cache the next two intervals are not counted (the first frame after a stall
  can carry the time stamp of a frame scheduled before it). So do a lost context while the page is shown (memory
  pressure, a GPU reset) and any exception in a draw. The hand-back is at the same progress, for the rest of the
  session (`0|<why>`; the next load is refused before anything is probed or fetched), and `?diag` says why. When the
  canvas still shows a frame (the timing rules), the CSS layers are shown under it at once and it dissolves into
  them over `--dur-handback` (180ms, linear, opacity on the compositor) with its last frame frozen: the slow 3D is not
  drawn again (review, door finish: drawn through a 400ms dissolve it gave 3 more slow frames; now none, and with a
  50 ms frame injected the frames return to 17 ms at once); a lost context or an exception cannot draw, and the swap
  is immediate. A hand-back disposes every texture, target, geometry and program at once, and lets the context go
  (`WEBGL_lose_context`) once the GPU has done what was queued (a fence, polled every 100 ms) and the page is still
  or hidden (`release()` in door3d.js), not at the next garbage collection: its drawing buffer (MSAA on a phone) is
  often what the device was short of. Lost at once, in the visitor's gesture, Chromium tore the command buffer down
  synchronously, waiting for the GPU's backlog (iPhone emulation, review: one main-thread task of 5.9–10.8 s right
  after the hand-back, the next flick 12 s late). Now (iPhone emulation, 13 runs): the context goes 2.7–7.2 s
  after the hand-back on SwiftShader (5 timed runs), once its queue has drained, in 9–19 ms (8 runs); no long task in the 2 s after the
  hand-back in 12 of 13 runs (one of 64 ms, 1.1 s after it), and 55–108 ms in 2 more runs 4–5 s after it (not the
  release). While SwiftShader drains the 3D frames already queued, touches wait 100–340 ms (the CSS walk-in alone:
  ≤ 42 ms), 37–213 ms since the GPU-lag rule hands back sooner (see the live safeguard). What changes at a hand-back is only what 3D adds:
  mean |ΔRGB| of the whole screen, 3D against CSS at the same p (headless, `final3-work/sbs.js`): p 0.002 0.36–0.99,
  p 0.15 1.1–2.3, p 0.3 2.5–3.6, p 0.5 18–26 (open, the 3D leaves stand in the doorway with their light, the CSS
  ones are flat and the hall differs in depth); the dissolve is there for that last case.
- **A context lost in the background** (iOS frees a hidden page's GPU memory, and may say so only when the page
  returns): if the page is hidden, away and not yet back (`pagehide` or hidden, with no return event yet: the loss can
  be told first), or was shown again less than 3 s before, the CSS entrance takes over at once and the 3D is rebuilt from the cached files when the page is shown and still (`visibilitychange`, `pageshow`, or 3 s later),
  twice at most per visit; a context that is gone without its event (`isContextLost()`) is found on the same return.
  A page restored from the back/forward cache with its context keeps it (no rebuild).
- **iOS** (iPhone, iPod, iPad, and iPadOS reporting a Mac with touch): the canvas at the device's pixel ratio, up to
  3, as everywhere (`maxDpr: 3`; decided 9 Nov after the door finish, against the brief's cap of 2: at 2 an iPhone's
  take-over frame was visibly softer than the photograph, see GPU budget). MSAA only up to a ratio of 2 and a drawing
  buffer of 4.2 Mpx (`MSAA_PX`): an iPhone at 3 (390 × 844 → 1170 × 2532) has none (~24 MB with its depth; the
  density hides the edges), a DPR 2 phone keeps it, 1440 × 900 at 2 and every iPad do not (they would need ~170 MB
  for edges that are already fine at that density). Textures: the existing masters, not ≤ 2048 (see GPU budget: the 2388 facade is the
  photograph's own detail at the walk-in's zoom; resizing it cost a 370 ms main-thread task at 4× throttle). The
  hall's two render targets are half the canvas (390 × 844 colour + depth on an iPhone). Memory pressure has no event
  on the web: it arrives as a lost context, handled above.
- **For testing:** `?3d` forces the 3D on a real device (no soft heuristics, no session memory read or written, no
  frame-time rule, whose numbers still show in `?diag`; the GPU probe and the context-loss and exception hand-backs
  stay); `?3d=force` also skips the probe (the headless tests draw with SwiftShader); `?guard[=MED,MAX]` turns the
  frame-time rule on in any mode with those limits in ms; `?sem3d` forces the CSS entrance. `?diag` shows
  `path=3D|CSS 3d=<state> why=<reason> dpr=<ratio>` (while loading, the stage, its step and the ms since the load
  began: `3d=loading:upload 5/19 840ms`), then `3d steps: load@<ms> gate@<ms> … on@<ms> held=<ms>` (when each stage
  began, ms since navigation; how long the steps waited for the page to be still) and, once mounted, `guard=on|off
  frames=<n> <ms> median= worst= gpu lag= cadence=`. States: `off`, `loading`, `on`, `refused`, `handing back`, `handed back`, `context lost`. The testing
  switches belong to the address: the PT · EN links do not carry them.

The client saw the CSS leaves as flat cut-outs («parece um jogo da Sega Saturn»: no thickness, a painted knob, no
light). Where the device can draw it, the same timeline is drawn in WebGL 2 (three.js
r187, self-hosted). The binding rule (client): **the photograph is the skin; no photorealism and no real detail of
the door may be lost.**

- **Projective texturing from the photograph's own camera.** The world is the one the interior plate was ray-traced
  in (`photo/py/plate2.py`): the photograph's camera C0 stands 3 m in front of the door, focal length 1512 px of the
  2388 px master, so the facade image spans 4.738 × 5.226 m on the plane z = 0 (doorway 1.50 × 2.59 m, eye 1.10 m
  above the sill, the hall point at the origin). Every surface the photograph shows (facade, leaves, knobs,
  escutcheon, hinge knuckles, the hall seen through the gap) takes, per fragment, the photo pixel its point had at
  rest seen from C0 (`proj()` in the shaders). So at p = 0 the frame IS the photograph whatever the geometry, and a
  turning leaf carries its own pixels. No procedural or stock material replaces a photographed one.
- **As sharp as the page's photograph.** The canvas is drawn at the device's own pixel ratio, up to 3 (the iPhone
  case; at 2 the take-over frame was drawn at 2/3 of the page photograph's resolution and upscaled), with MSAA only
  up to a ratio of 2; the facade and leaf samples carry a LOD bias of −0.65 (trilinear minification of the 2388 master
  is softer than the browser's own image scaling). Take-over frame at 1 px of scroll, gradient energy of the doorway,
  3D ÷ the page's own `<img>` (`?sem3d`, now the default page), Dia: 390 × 844 @1 / @2 / @3 1.08 / 0.97 / 1.13, 1440 × 900 @1 / @2 0.98 / 1.01
  (before: 0.87 / 0.80 / 0.64, 0.81 / 0.89). This is a deliberate deviation from the brief's «DPR ≤ 2» cap: the
  client's photorealism rule wins; without MSAA above 2 the drawing buffer of a 390 × 844 @3 phone is ~24 MB against
  ~47 MB at @2 with 4× MSAA. The door finish capped iOS at 2, as the brief
  asked; an iPhone's take-over frame was then drawn at 2/3 of the page photograph's resolution (iPhone user agent at
  DPR 3, headless, `final3-work/isharp.js`: 3D ÷ CSS gradient energy 0.74 Dia / 0.84 Noite, against 1.10 / 1.05 at a
  ratio of 3). Since 9 Nov iOS takes 3 too (`maxDpr: 3` in site.js): the photograph's sharpness wins; without MSAA
  its buffer is ~24 MB, less than ~42 MB at 2 with MSAA; the cost is 2.25× the pixels to shade, which the live
  safeguard watches (a phone that cannot keep up is handed back to the photograph).
- **What 3D adds** (only what a picture cannot): leaves 55 mm thick, hinged on their outer front corners (the brass
  knuckles stay, the leaves swing in to 84°); raised-and-fielded panels as real geometry on the photograph's own panel
  layout (`PANELS`, measured on it; iPhone round 2: a bolection moulding proud of the stiles, as the photograph shows
  it: per side a rise from the stile over 2–7 px, a rounded crest +12 mm, an ovolo falling to a fillet, the crease at
  the bevel's foot −6 mm, then a 10–30 px bevel up to a field 12 mm proud of the stile, 17–42°; it was 1–13 mm below
  the stile with a 9° bevel, too flat to catch a raking light; broad on purpose, the photograph draws the fine lines;
  mitred rings, smooth normals across crest and ovolo; the stiles and rails a grid through every ring corner, no
  T-junction cracks), so the photographed shading stays where its relief is and parallax shows at grazing angles; knobs as lathe solids (rose Ø 76 mm, head Ø 69 mm, 66 mm deep) and the
  escutcheon as a 4.5 mm plate, carrying the photographed brass; the doorway's depth (limestone jambs sampled from
  the pilasters, the lintel's soffit); the hall as a box; the facade as an endless plane carrying the page's street round the photograph (`FS_FACADE`: the wall's stops as a 256 × 1 lookup texture (walking the stops per pixel doubled the frame time in the software renderer the tests use: p95 167–200ms against 83–100 before the street; with the lookup 117–150), the paving strip with RepeatWrapping at one facade width, or three when the stylesheet picked the 3-width strip (`uSt.w`, the period, read from the file's name; fix r1) (no anisotropic filtering: the plane faces the camera all the way in), the colour below it, the two night lights as gains, evaluated only inside their ellipses; the photograph's outer fade laid over it; the strip is the file the page's stylesheet picked, read from `.ph--street`'s computed background, so it comes from the cache), so the take-over frame and the CSS rest frame meet with the street intact.
- **Brass the photograph saw edge-on** (the knob's neck, the rims of the rose and the head, the hinge barrel's sides)
  would carry the silhouette's pixels smeared across it (a black streak on the neck, dark rings): where a brass face
  turned less than ~0.12–0.4 towards C0 at rest, it takes the photograph's own mean brass of that part (a mip of the
  knob's cap, the escutcheon's plate, the barrel's axis column) and is lit as that face was.
- **Light modulates, never repaints.** Each surface is multiplied by E(now) / E(rest): the irradiance of its current
  pose over that of its pose in the photograph (sun from the upper right by day, matching the lantern's and the
  olive's shadows; the lantern as a point light by night; the street's sky; the hall's warm bounce, stronger deeper
  in; the sun or lantern seen only through the doorway; the knob's soft sphere shadow). At rest the ratio is exactly 1.
  Clamped to 0.5–1.45 by day, 0.5–8 by night (the leaves turning into the lamplit hall). Brass adds only the CHANGE of
  a restrained reflection (now minus rest).
  **The relief as the leaves turn** (iPhone round 2, 9 Nov; client: «não há relevo na porta», then «já há puxadores»).
  At rest the frame is the photograph, so the relief can only read in motion. The first attempt (each facet's full
  irradiance, sun + sky + hall, over its face's, to the power 1.25, and a Schlick reflection of a sky-coloured
  environment ×0.12) left the walnut's moulding-scale contrast where it was (−3…+0.5 %) and laid a blue-grey film on
  the turned leaves (walnut G/B 2.4 → 1.6). Now (FS_SOLID `keyL`, `relK`): the leaf's exposure still comes from its
  flat face (E(now) / E(rest), clamped), and the relief takes its contrast from one raking key alone, without the
  domes that diluted it: by day the street seen through the opening (from the doorway's plane face-on and a little
  from above, the photograph's own light: top bevels lit, bottom ones dark); by night the lamplit hall's far side,
  from inside (the street faces do not see it at rest). Per facet: (floor + its key) / (floor + the face's), now over
  at rest, to the power 2.8, within 0.35–2.2, floor 0.12 of a face-on key; exactly 1 at rest and on the face, a
  scalar, so the photograph's colour stays. The crease at each bevel's foot takes the moulding's shade when the key
  comes across it from the stile's side, reaching out by the tangent of the key's incidence (a quarter of the bevel
  at 45°). What the frames show: by day, from the first degrees of the swing, the hinge-side bevel and moulding of
  every panel light up with a dark crease line beside them and the free-edge side falls into shade; by night the
  reverse (the light comes from the hall's far side), on darker leaves. The sky's reflection is gone; the oiled
  walnut keeps a sheen as a gain on the photo pixel (chroma kept): the lit hall mirrored at grazing angles (Schlick,
  F0 0.04; ×0.08 Dia, ×0.1 Noite; at most +35 %), none at rest. Rejected on the way, by eye against the photograph:
  beads 1–2 device px wide (their lit and shaded facets broke the photograph's fine lines into dashes; no MSAA above
  4.2 Mpx), a crease shade spread over the whole bevel (it put out the photograph's bright top bevels), the key's
  own highlight (no visible gain: camera and key on the same side). Measured against the pre-relief build (doorway
  crops, 390 × 844 @3 and 1440 × 900 @2, `shots/iphone2/relief/relief2-sheet-*.png`, `relief2-zoom-*.png`; mean |DoG(1.5 vs 6
  device px)| of luminance over the panels' bands, mapped from `PANELS` through each leaf's projected face, probe
  `quadL` / `quadR`): Dia p 0.1–0.3 ×1.29–1.92 (p 0.05 ×1.13–1.48), the fields' grain ×0.78–1.07; Noite right leaf
  ×1.22–1.85, left leaf ×0.97–1.26 (it stands in the jamb's shade, luminance 17–23, and from p 0.2 it is a sliver
  ~30 device px wide); at rest ×0.98–1.00. Walnut G/B by day 2.09–2.23 / 2.40–2.44 (left / right leaf; pre-relief
  2.13–2.23 / 2.42–2.44, the first attempt 1.63–1.86 / 1.54–1.79). At rest nothing changes
  (`door3d.test.js` 5: the take-over frame equals the photograph). The sun's highlight on the walnut: a new one adds light; the photographed one
  going away scales the photo pixel as a whole, its chroma kept, by at most 12 % (an absolute amount taken from dark
  walnut emptied its blue channel: the leaves turned red-orange, crimson in shade). Walnut pixels with blue ≤ 2,
  1440 Dia: p 0 0.2 %, p 0.15 0.6 %, p 0.3 0.8 %, p 0.5 2.3 % (CSS entrance at p 0.5: 2.1 %; before: 15 / 11 / 44 %).
  The light the gap painted on the leaves' inner arris at rest (night: up to 6× in linear light within 6 px) is
  divided out as the leaves open, so no bright line travels with them; the closed leaves' shadow line on the sill
  and the gap's dark notch painted into the head of the frame above them (master px 1080–1206 × 907–920) fade as
  they open, to the stone and the head's own lower face beside them.
- **The hall** is the only part the photograph does not show, and it stays the photograph's own: the plate (the
  ray-traced, defocused hall the page shows through the doorway) projected from C0 onto the plate's own box (floor
  −1.10, ceiling 2.05, walls ±1.08, far wall 3.8 m behind the door by day, 4.0 by night), with the doorway's shade
  over it. So the gap shows exactly the page's hall at rest and the walk-in has true parallax. It is never brought
  into focus: a box with baked slabs and plaster drawn sharp read as CG exactly when it filled the screen (review r1),
  so the lens stays on the door. The hall is drawn first, from its own camera (below), into a half-size target and
  softened by a lens blur that grows with the walk-in's zoom (sigma up to 4 CSS px, smoothstep over 1 − s^−0.12 from
  0 to 0.6; split into up to three passes so the kernel never leaves gaps), and its plate is sampled ever softer (LOD
  bias up to +3, isotropic: seen from inside, the plate's surfaces near the door are stretched along the rays from C0
  and its render grain drew radial streaks). Light only modulates it: by day a faint, soft pool of sun through the
  opened doorway (+0.35 × in linear light at most, a wide penumbra at the doorway's edges and the leaves' shadows,
  let go as the lens blur grows), and the leaves' contact shadow on the floor. Review, door finish: the pool was
  +1.1 × with a hard edge, a bright wedge (+35–40 levels) with a long diagonal across the floor at 390 p 0.45–0.54;
  now the floor at 390 Dia p 0.45 averages 180 against 177 on the CSS path (bottom quarter of the frame), with no
  edge. It dissolves into the flat `--color-hall` as before.
- **The lintel's soffit** is at the door's depth, so it is drawn with the jambs (sharp, never in the hall's blur). At
  rest it is the photograph's hall and the doorway's shade (what the gap shows there); as the doors open it becomes
  the left pilaster's limestone at about its own scale, low-passed (its detail term at mip 5 at least, mip 3 before)
  and at half its contrast (its 5 mm pits had grown into 10–20 px blotches; review, door finish: the three blotches
  still seen at 390 Dia p 0.45 were 8–11 levels under their surroundings, now 0.4–2.4), a warm bounce by day (×0.78 / 0.74 / 0.69, lighter towards the street: 390 Dia p 0.5 mean
  rgb(176, 157, 135), was 141, 128, 114), the hall's lamplight by night (warmer and stronger towards it).
- **The camera is the page's.** site.js (`view3d()`) passes the photograph's rest box, the CSS camera's pan (tx, ty),
  its zoom s and two camera distances in rest units. The main camera (the facade, the jambs, the soffit, the leaves)
  stands at zc = min(s, s(0.34))^−0.12: it moves in only while the doors open (to about 0.93 of its rest distance) and
  stays put after; its lens makes up the rest (`frame()`: focal × s·zc), so the door's plane is magnified exactly s, as
  on the page, and the open leaves keep their width against the doorway (the 3D frame's own meshes projected: 0.1622–
  0.1626 at 390 × 844 and 0.1637–0.1639 at 1440 × 900 from p 0.34 to 0.66; it grew 9–11% before, review, door finish;
  `door3d.test.js` 7). The hall is drawn from a camera of its own at zh = s^−0.12 all the way, its lens also holding
  the door's plane at s, so the hall meets the doorway exactly where the main pass draws it and keeps the depth it had
  (held still with the rest, its far arch grew as s, 8.3× at 1440 p 0.54 against s^kp, 5.6×, on the CSS path; with
  its own dolly it is 1.17–1.18× the CSS path's there, the review's measure of this same hall camera; giving the hall
  the CSS path's own zoom, s^kp, is not done: it opens a band between the jambs and the hall box, see Open). The two
  cameras differ by about 2% at most at the leaves' feet (by the geometry, p 0.34–0.54) while the leaves are in frame,
  so the contact shadows stay under them. The doors' angle is the
  same `--curve-door` value as the CSS leaves'.
- **When it draws.** Only while 0 < r < the flat colour (p 0.66). At rest (r = 0) the page shows its own
  photograph and the canvas is hidden; under the flat colour nothing is drawn and, once the canvas has drawn, the
  photograph's layers stay hidden too (review, door finish: shown again there, at rest scale and then at the camera's
  zoom, they were decoded and painted under the opaque flood just as the list rose in, 4 decodes and frames of
  100–300 ms at 390 × 844; now 0 decodes and no slow frame through the hand-off). They come back only if the canvas
  cannot draw (a theme still loading, a hand-back, a lost context). It takes over as soon as it is ready (on, and
  again after each theme change), wherever the walk-in is: at rest on the next scroll's first frame and under the
  flat colour by a plain swap (the frames are equal); in the middle of the walk-in at the same r by a cross-fade
  (iPhone round 2, client: «não há relevo na porta», then «já há puxadores»: he opens the page and scrolls at once,
  and the take-over used to wait for rest or the flat colour, so his first walk-in was always the CSS one). The
  cross-fade: the canvas fades in over the CSS entrance, which follows the same r under it, over `--dur-handback`
  (180ms, linear, Web Animations on the compositor), and the photograph's layers are hidden only once it is opaque;
  a hand-back during it is immediate. What it changes is what 3D adds (the CSS leaves turn in the stage's
  perspective, the 3D ones in the camera's: at p 0.03–0.2 the leaves reshape and the hall deepens, doorway mean
  |ΔRGB| 4–6). The canvas sits one step above `.scene` (`calc(var(--z-scene) + 1)`), under the text, the cue and the
  flood (z-index 2, later in the document): at the same z-index the scene, later in the document, covered it, so
  the cross-fade showed only its end, and the hand-back's dissolve was in fact an instant swap. iPhone emulation,
  opened and scrolled at once to p 0.2 (Dia and Noite): on 3.4–3.5 s after the load, taken over at p 0.2024 by a
  fade of 175 ms (10 frames with both), no long task (`door3d.test.js` 8); the frame held at the fade's middle lies
  between the two (mean |ΔRGB| CSS → half 0.96 / 0.69, half → 3D 0.75 / 0.48, Dia / Noite; CSS → 3D 1.71 / 1.17,
  the doorway's centre 3.12 / 2.56; `shots/iphone2/ios-load-fix/midwalk-takeover-*.png` in the working notes). A
  visitor who reaches the flat colour before it is on still gets the CSS walk-in, and the 3D on the way back up. The
  swap is two inline styles (canvas `visibility`, `.scene` `visibility`), never a class on `html`. Whenever it cannot draw
  (the other theme's textures still loading, a lost context) the CSS entrance, which follows r all along, is shown;
  after a theme change under the shown canvas its last frame stays (at most 300 ms) until the new theme's facade and
  leaves are decoded, so the CSS entrance never comes back for a frame without its facade.
- **Delivery.** By default, behind the gate (see Status). Nothing on the critical path, and nothing in a gesture. A
  device with no WebGL 2 worth having is known before a byte is fetched (the probe, remembered for the session). At
  the first idle moment after the first paint the module and three.js are fetched as module preloads
  (`<link rel="modulepreload" fetchpriority="low">`; `data-3d` and `data-3d-dep` on `.porta` name both,
  content-hashed). The module is evaluated, mounted and warmed only while the page is still (see Status: 150 ms with
  no scroll followed, no flight and no input, anywhere in the run), in slices of about 10 ms: never in the hero's
  motion (it cost the CSS sequence 100–300 ms frames at 4× throttle, review r1).
  The module imports `assets/js/vendor/three.min.js` (an esbuild tree-shaken subset of `three`: 23 exports, MIT
  notice kept; `tools/vendor_three.py`, committed, the build only copies it). Textures are the page's own files: the
  facade and the leaves at the sizes the page already fetches for the walk-in (sizes = 3× the scene), the plate, the
  doorway's shade and the lamplight at the size shown; each decoded off the main thread (`createImageBitmap` from the
  file's bytes, from the HTTP cache, in a worker made from a blob; where workers or their `createImageBitmap` are
  missing, on the page's thread: one made from the page's `<img>` re-decoded the 2388 master on the main thread,
  126 ms at 4× throttle), uploaded at its own size (resizing the master to 2048 cost a 370 ms task at 4× throttle and
  saved no byte; anything over 4096 px would be scaled), compiled (KHR_parallel_shader_compile where available) and
  drawn once, each step its own idle task taken only while the page is still; then the decoded copies are closed. A
  theme change does the same for the new theme before the canvas may draw it, so the first frame of the next scroll
  uploads nothing (`theme.js`, 4× throttle: first 3D frames 1–12 ms, were 122–197 ms with the whole new theme
  uploaded in them; the change itself costs two idle tasks of 65–96 ms at rest, was one of 154–188 ms). Render on demand
  (only from the driver's frames); the default power preference (a two-GPU laptop's discrete GPU is not woken).
- **GPU budget** (texture uploads hooked, review r1 probe): the facade master 2388 × 2634 with mips (~33 MB, kept at
  that size on every device: the brief's «textures ≤ 2K» is not met for this one texture, by design, it is the
  photograph's detail at the walk-in's zoom), the leaves 319 × 1306, the plate 720–1080, the doorway's shade, the
  lamplight by night: 45–55 MB in all. No CPU copy is kept after upload. Only one theme is on the GPU at a time (a
  change disposes the other's). The drawing buffer stays allocated while the page lives (resizing it to 1 × 1 under
  the flat colour would cost the next take-over a reallocation): with MSAA (ratio ≤ 2 and ≤ 4.2 Mpx) 32 bytes a pixel
  (an iPhone at 2: ~42 MB; 1440 × 900 at 1: ~41 MB), without it 8 (390 × 844 at 3: ~24 MB; 1440 × 900 at 2: ~41 MB,
  was ~170 MB with MSAA before the door finish); estimates, not measured on a device.
- **Refused, quietly, to the CSS entrance:** everything the gate names (see Status), before anything of the 3D is
  fetched; a step that makes no progress within its limit (the watchdog, every 250 ms: 8 s of still time per step,
  12 s for the module's evaluation, 20 s of any time while fetching or decoding; none while waiting for the page to
  be still; time away never counts: a hidden page's ticks are skipped, one tick counts 500 ms at most, and a return
  from the background starts the step's limit afresh; until iPhone round 2 the overdue tick iOS fires on a page's
  return counted the whole absence, and 12 s away in «upload» refused the 3D for the tab's session in 4 of 6 runs),
  named (`timeout: upload 1/19 (no progress in 8.1 s)`), remembered for the session except while fetching
  or decoding (a network fault: tried again on the next load), so no promise (a photograph, the worker, a fence, a
  compile) can leave «loading» for good; a lost context or an exception, at the same progress (see the live safeguard). A shader that does not
  compile or link on the device's driver (three.js only logs it and draws on without that part: the leaves vanished
  from the doorway): `renderer.debug.onShaderError` and each program's `LINK_STATUS`, read in the mount, refuse it there
  («mount: compile: shader: …», nothing drawn); a program first used later hands back. Any mount that fails is
  remembered for the session with its stage (`0|mount: <stage>: <why>`: context, create, theme, upload, compile,
  warm), except a photograph that did not arrive (a network fault, tried again on the next load); a module fetched
  but not running (a syntax error, a throw at its top level) is known by the error event that names its file, or 10 s
  after it was asked for, and remembered the same way (`0|module: …`), so `?diag` never says «loading» for good and a
  reload fetches nothing (`door3d.test.js` 7). `?diag` shows which path runs and why.
- Files: `src/door3d.js` (module: scene, shaders, `mount()`), `src/assets/js/vendor/three.min.js`; the prototype
  (`door3d/proto/index.html` in the working notes) renders any p, theme and viewport from the same module. The baked
  hall atlas of the previous round (`tools/hall_bake.py`, `hall.{avif,webp}`, `hall-detail.webp`) is no longer
  shipped.

### Other motion
| Token | Duration | Easing | Use |
|---|---|---|---|
| `--dur-theme` | 400ms | `--ease-out` (0.23, 1, 0.32, 1) | Dia ↔ Noite chosen by the visitor: View Transitions cross-fade; colour transitions as fallback (never on `[data-motion]` layers; no snapshot while the sequence is moving) |
| `--dur-sky` | 1400ms | `--ease-sky` (0.45, 0, 0.55, 1) | Dia ↔ Noite changed by the sun on its own (nobody pressed anything): slower and symmetric, the lamps come on rather than flash. While the sequence is moving it waits until the page rests; parked anywhere (the list included) it cross-fades |
| `--dur-state` | 200ms | `--ease-out` | form messages, checkbox tick (opacity + scale 0.8 → 1) |
| `--dur-out` / `--dur-success` | 160ms / 240ms | `--ease-out` | success: the controls give way, the sentence takes their place |
| `--dur-flight` | 1000ms (whole way; 1250ms before 9 Nov) | `--curve-flight` (0.45, 0, 0.3, 1) over the weighted way (`--flight-weight` 2, `--flight-weight-list` 1.2) | the hero action and the scroll cue walk in through the door to the list |
| `--rise-list` | 16px of rise (the form 10px), on p 0.645 → 0.87 | `--ease-out` on p | the waiting list rises in on the light, with the scroll (no time-based entrance any more) |
| `--dur-press` | 160ms | `--ease-out` | action and button: `scale(0.97)` while pressed |
| `--dur-ui` | 150ms | `ease` | control and link colour on hover; a link's underline 45% → full ink; field and checkbox line darkens |

### Fallbacks
- `prefers-reduced-motion: reduce`: no pinning and no scroll-linked motion, no list rise; the photograph stands as
  it is, doors closed (the hall's light in the gap), and the list follows below; the action jumps to the list and
  focuses the email. No global kill switch: each component drops its movement (press scale,
  message rise, tick scale) and keeps short opacity / colour changes. A live change of the preference tears
  the sequence down (inline styles and hints removed).
- No JS: no pinning (the tall wrapper exists only with `.porta-on`, which site.js adds), the photograph with its
  doors closed (the theme's picture follows the system theme through the same tokens; its placeholder stays
  under it), the list is visible with a disabled form and the `<noscript>` line.
- Reduced motion and the theme: the change is instant, and the controls and links change with it (their colour
  transitions are held for that frame), so the control just pressed never flickers through a low-contrast mix.
- 3D entrance (above): wherever the gate refuses it (known before anything is fetched: reduced motion, `?sem3d`,
  `?semporta`, a data saver or 2G, no ES modules or WebGL 2, no GPU-backed context, a software renderer, a clearly weak
  device or GPU, a hand-back earlier in the session), before it is ready, while the other theme's textures load,
  after a context lost in the background (until it is rebuilt), and for the rest of the session after the live
  safeguard hands back (a slow first second, a context lost while shown, an exception), the CSS entrance (the
  photograph in layers) runs the same timeline at the same progress; nothing waits for the 3D, and the page never
  shows neither.
- Keyboard: Enter or Space on the action plays the walk-in and lands in the email field; Tab from the action
  lands on the email field with the list in view at once; focusing anything in the pinned first screen
  mid-sequence rewinds to the rest state, so focus is never on an invisible element. A tap or a click never
  moves the page (Driver › Focus moves the page for the keyboard only).

### Measured
Playwright (headless Chromium, software raster), 4× CPU throttle via CDP, traced with CDP tracing
(devtools.timeline); frame intervals are `requestAnimationFrame` intervals counted while the page moves.
390 × 844 at DPR 3, 1440 × 900 at DPR 1, Dia and Noite.

**Door finish (3D on by default)**, headless Chromium, SwiftShader (`final3-work/sbs.js`, `isharp.js`; frames read
after a settle wait, see Testing). 3D (`?3d=force`) against CSS (`?sem3d`) at the same progress, mean |ΔRGB| of the
whole screen / of the facade outside the doorway (grown by 4% of the box, the text excluded), the facade's best
alignment (searched ±5 device px), and the doorway's gradient energy 3D ÷ CSS:

| Viewport, theme | p 0.002 (take-over) | p 0.05 | p 0.15 | p 0.3 | p 0.5 | facade aligned at | energy 3D ÷ CSS |
|---|---|---|---|---|---|---|---|
| 390 × 844 @2, Dia | 0.99 / 0.59 | 1.70 / 0.60 | 1.96 / 0.59 | 3.42 / 1.00 | 18.3 / – | (0, 0) at every p | 1.03–1.10 (1.35 at 0.5) |
| 390 × 844 @2, Noite | 0.45 / 0.35 | 0.99 / 0.40 | 1.18 / 0.46 | 2.47 / 0.74 | 24.7 / – | (0, 0) | 1.03–1.09 (1.51) |
| 1440 × 900 @1, Dia | 0.84 / 0.60 | 1.77 / 0.58 | 2.34 / 0.59 | 3.60 / 1.27 | 20.3 / – | (0, 0) | 1.02–1.14 (1.72) |
| 1440 × 900 @1, Noite | 0.36 / 0.38 | 0.93 / 0.37 | 1.14 / 0.39 | 2.69 / 0.64 | 25.9 / – | (0, 0) | 1.00–1.14 (1.66) |

Also 390 × 844 @3 (p 0.002 / 0.15 / 0.3 / 0.5: 1.45 / 2.39 / 3.41 / 18.2 Dia, 0.59 / 1.29 / 2.29 / 24.7 Noite),
844 × 390 @2 and 2560 × 1440 @1 (p 0.002: 0.49–1.64, p 0.3: 2.29–3.66): the facade aligned at (0, 0) in every case,
the street (wall, paving and its upward fade) continuous round the photograph in both entrances and both themes.
At p 0.5 the camera is in the doorway (no facade left on screen) and the two differ by what 3D adds (the open leaves
standing in the doorway with their light and thickness, the hall's depth); this is the case the hand-back's dissolve
is for. The night lamplight above was measured before its re-solve (it changes both entrances alike).
Live safeguard in the same browser (a spoofed capable GPU, 390 × 844 @2, the first second of motion): median frame
16.7 ms, worst 133–367 ms (SwiftShader draws on the CPU; with the default limits it hands back on the worst frame,
as it should for a device this slow). Gate and probe: the default page decides in about 0.5 s after navigation
(`refused`, software renderer); a capable GPU is on about 1.0–1.2 s after navigation with no scroll; the probe's
WebGL context costs 17 ms warm and up to 260 ms for the first context of a cold headless browser at 4× throttle (one
task at idle after the load; real GPUs: 10–30 ms).

**3D entrance round** (`door3d/ptools/perf.js`, `weight.js` in the working notes; headless Chromium WITHOUT a GPU:
WebGL through SwiftShader, forced with `?3d=force`; 4× CPU throttle via CDP; measured
before the merge with the pitch typography and wordmark, which touch neither the driver nor the module). The renderer's GPU work runs on the CPU here,
so frame intervals say nothing about a phone (72–78ms median); what transfers is the main thread's work per frame,
timed around every `requestAnimationFrame` callback during a wheel gesture down the run and back:

| Viewport | Mode | Callbacks | p50 | p95 | Worst | > 17ms | > 50ms |
|---|---|---|---|---|---|---|---|
| 390 × 844, DPR 2 | CSS (`?sem3d`) | 170 | 0.1ms | 1.3ms | 7.9ms | 0 | 0 |
| 390 × 844, DPR 2 | 3D | 118 | 3.8ms | 9.5ms | 13.3ms | 0 | 0 |
| 1440 × 900, DPR 1 | CSS (`?sem3d`) | 174 | 0.1ms | 5.0ms | 8.4ms | 0 | 0 |
| 1440 × 900, DPR 1 | 3D | 120 | 4.1ms | 13.3ms | 25.2ms | 3 | 0 |

Mount (once, canvas hidden), 4× throttle: three long tasks of 163–183, 69–81 and 112–115 ms (module evaluation and
context; the facade's upload; programs and the first frames; the photographs are decoded off the main thread), and
only once the page is still at rest or under the flat colour (`early.js` in `shots/door3d-fix-r1`, a wheel, touch
drags or the action pressed 300 ms after the load: no long task while anything moves, the walk-in on request has the
same frames as with `?sem3d`, and the mount follows its landing; before this round the same gestures carried
69–1234 ms tasks).
Bytes (measured in the 3D round, on the photo build with its earlier fonts): first paint unchanged (the same 14–15 requests and bytes with and without the 3D entrance, Dia 312 KB at
390 × 844 DPR 3 / 266 KB at 1440 × 900, Noite 226–270 KB; HTML +44 bytes, site.js +3.6 KB raw / +1.1 KB gzip,
site.css +0.3 KB). Lazy, after the load: 2 requests, 572 KB raw, 145 KB gzip (three.min.js 536 / 133 KB, door3d.js
36 / 11.9 KB; the baked hall atlas and detail of the first round are gone); photographs: 0 extra bytes (the same
facade and leaf files the CSS entrance fetches at idle for its walk-in; the module re-reads them from the HTTP cache
to decode them off the main thread). Target ≤ ~600 KB compressed: met. A device the gate refuses fetches none of it.
Door finish (3D on by default), this build: lazy, at idle right after the load event, 2 requests, 575,982 bytes raw /
146,644 gzip (three.min.js 535,556 / 133,307; door3d.js 40,426 / 13,337); photographs 0 extra bytes (as above; the
night lamplight files, re-solved, are smaller: 19.9 / 35.9 KB AVIF, were 22.8 / 42.5). On the critical path only
site.js grew, by the gate and the safeguard: 43,095 bytes raw / 14,414 gzip, was 38,189 / 12,485 (+4.9 / +1.9 KB).

**Photo round (the photograph in layers; this build)**: `photoint-tools/perfwheel.js` (a wheel gesture down into the
list and back up; finger drags, touch events, 18px a frame) and `photoint-tools/perfflight.js` (the walk-in on
request from a raw CDP click or tap, so no Playwright actionability scripts run on the page's main thread; rAF
intervals from the press to the frame after the landing), 4× CPU throttle, traced, load average under 1:

| Scenario | Viewport | Runs | p95 frame | Worst frame | Frames > 50ms | Longest main-thread task |
|---|---|---|---|---|---|---|
| Wheel down + up, Dia / Noite | 390, DPR 3 | 6 | 16.7–16.8ms | 16.8–33.4ms | 0 | 22ms |
| Wheel down + up, Dia / Noite | 1440, DPR 1 | 6 | 16.7–16.8ms | 33.3–33.4ms | 0 | 25ms |
| Wheel down + up, the mouse arriving first, Dia / Noite | 1440, DPR 1 | 6 | 16.7–16.8ms | 33.3–33.5ms | 0 | 24ms |
| Finger drags, Dia / Noite | 390, DPR 3 | 4 | 16.7–16.8ms | 16.8–33.4ms | 0 | 17ms |
| The walk-in on request (instant press / 90ms press), Dia / Noite | 390, DPR 3 | 16 | 16.7–16.8ms | 16.8ms; 33.3ms once | 0 | 18ms |
| The walk-in on request (instant press / 90ms press), Dia / Noite | 1440, DPR 1 | 16 | 16.7–16.8ms | 16.8–33.4ms | 0 | 30ms |

Earlier sets of the same build, before the layers were made on the press: 49.9–50.1ms once in each of a few dozen
runs at 1440 (the frame in which the walk-in's layers were created, before anything moved; once a 17.7ms style
recalculation during a wheel scroll).

Found and removed on the way: the lamplight's `mix-blend-mode: screen` (p95 33.4ms and frames of 83ms at 1440 Noite;
now an RGBA overlay, 16.7ms) and the cost of creating the layers in the first frame (33–50ms; now readied at idle
after the load). A walk-in triggered through Playwright's own `tap()` / `click()` shows one 50–67ms frame at the
press: that is the harness's actionability scripts running on the page's main thread ("Receive mojo message",
64ms, nothing of the page's inside it); with raw input the press frame is 16.8ms.

**Round 3 (the short run, with the drawing)**, harness `tools/integ/perf.js` (wheel gesture down into the list and back
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
unless Dia was chosen, and the manual choice). Photograph roles that change: `--t-dia` / `--t-noite` (which
theme's picture is shown: `display: contents` or `none`), `--t-spill` (the lamplight on the steps, Noite only),
`--photo-lqip` (the theme's placeholder) and `--color-leaf-shade` (noite at 28% by day, 40% by night).
`--color-hall` changes too (`--sala-dia` / `--sala-noite`), and `--color-field-hall` (papel / luz-nucleo).

## A distinctive touch (extension)
The brief asked whether one distinctive touch should be added for atmosphere, beyond a premium interface. Four
candidates from the brief were prototyped on the built page (injected, outside the build), recorded and judged
against the motion budget (taste-skill: one hero motion per page, the door), Emil's first question (should
this animate at all: purpose, frequency, what it costs the next action) and the Jobs filter (does it say
something only this house can say, or is it decoration). One is kept.

| Candidate | Prototype and measurement | Verdict |
|---|---|---|
| **Torres Vedras time**: the default Dia / Noite follows sunrise and sunset over the house | the sun's altitude at 39.09 N, 9.26 W from a low-precision solar ephemeris in the head script (about 600 bytes): sunrise/sunset within 1–2 minutes of published times for 2026 (8 Nov 07:13 / 17:29 UTC, 21 Jun 05:12 / 20:07, 21 Dec 07:53 / 17:18); 18 checks (both system schemes, stored choice, manual toggle, every page, a sunset while the page is open) | **Kept**, and made perceptible on every screen (round 3): one short sentence under the control, «É noite em Torres Vedras.», in the house's serif, only while the sky decides (also the buttons' description for screen readers). A visitor in São Paulo at 19:00 sees the lantern lit and reads why: it is night in Torres Vedras. It says something only this house can say. Before round 3 it was screen-reader-only on phones and, on desktop, sat in the menu row in the control's voice, where it read as a third menu item. |
| **Ink draws itself** on first visit (contours, then washes bloom) | stroke-dash draw of the ink paths (top to bottom, 0.5s stagger, 0.9s each), washes fade in at 1.0s; holds 60fps under 4× throttle but rasters 133ms (390, DPR 3) / 316ms (1440) during the load window | **Removed** (and moot since the photograph replaced the drawing). It spent a second load gesture, withheld the approved drawing for 1.5s on the first visit, and the line-draw reveal is a common template trope. |
| **Living lantern** at night (irregular warm flicker of the lantern and the doorway light, opacity 0.86–1) | WAAPI opacity on the six lamplight layers, 4.2s irregular loop; cheap here, invisible in stills and only noticed as "something moves" beside the text | **Removed.** An endless ambient loop has no purpose a visitor can name (no feedback, no state, no space), pulls the eye from the sentence beside it, keeps the compositor busy on phones, and a flickering electric lantern reads as a failing bulb. The lamp is already alive where it counts: it is lit only at night, and the light swings open with the doors. |
| **Sketchbook signature** «Torres Vedras, 2026» in the drawing's corner | single-stroke script lettering (Hershey script cuts) with a hand wobble, in the drawing's ink | **Removed** (moot with the photograph). It read as a script font, not a hand, crowded the drawing and repeated the lockup. |

Evidence: frame strips, videos and the prototype measurements are kept with the review notes, not in the
repository.

## Voice & content (extension)
pt-PT first, EN second. Facts only.

| Key | PT | EN |
|---|---|---|
| title | A Brazileira · Boutique Hotel · Torres Vedras | A Brazileira · Boutique Hotel · Torres Vedras |
| description | A Brazileira, hotel em Torres Vedras. Brevemente, abrimos as portas. | A Brazileira, a hotel in Torres Vedras, Portugal. Soon, we open our doors. |
| lede | Brevemente, abrimos as portas. (9 Nov, client: «tira o texto “estamos a restaurar um edifício antigo”… mete só abrimos em breve ou algo mais teasing»; was «Estamos a restaurar um edifício antigo.») | Soon, we open our doors. |
| status | (removed 9 Nov: the lede says it) | (removed) |
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
| photograph (alt) | Entrada em arco de pedra calcária com portas duplas de madeira, bandeira em leque, lanterna de parede e uma oliveira num vaso de barro. | Limestone arched entrance with double wooden doors, a fanlight, a wall lantern and an olive tree in a clay pot. |
| footer | © 2026 A Brazileira · Torres Vedras, Portugal · Privacidade | … · Privacy |
| sun note | É dia em Torres Vedras. · É noite em Torres Vedras. | It is daytime in Torres Vedras. · It is night in Torres Vedras. |
| 404 | Esta página não existe. · Voltar ao início | This page does not exist. · Back to home |

### The first screen's words (polish pass, POLISH_BRIEF §2)
The client found the sentence «cringy». Read in order, the old screen said the town twice (the lockup's line, then
the sentence), explained a purpose the lockup already states («para receber hóspedes»: it is a hotel), and leaned on
«casa antiga», the romance of an old house, in a 13-word passive with an inversion. The rewrite gives each line one
job, in the order a visitor reads them: who and where (the lockup), what is happening now (the sentence), when (the
status), what to do (the action). Constraints: facts the brief allows only (an old building, under restoration,
opening soon); no virtue words, clichés («casa com história», «mãos de artesão», «no coração de»), puns or
exclamation marks; at most about 14 words for the sentence; pt-PT as a person from Torres Vedras would say it.

Five options per language (sentence / status / action):

| # | PT | EN | Note |
|---|---|---|---|
| **1** | **«Estamos a restaurar um edifício antigo.» / «Abrimos brevemente.» / «Entrar na lista de espera»** | **«We are restoring an old building.» / «Opening soon.» / «Join the waiting list»** | **chosen** |
| 2 | «Um edifício antigo de Torres Vedras, em obras para ser hotel.» / «Abre brevemente.» / same | «An old building in Torres Vedras, being restored as a hotel.» / «Opening soon.» / same | true, but says the town and «hotel» again, right under the lockup |
| 3 | «O edifício está em obras.» / «Abrimos brevemente.» / same | «The building is being restored.» / «Opening soon.» / same | the shortest; «o edifício» points at the photograph, but «em obras» reads as a building-site notice |
| 4 | «Ainda em obras. Quando abrirmos, avisamos quem estiver na lista.» / (none) / same | «Still being restored. When we open, we will write to everyone on the list.» / (none) / same | folds the status into the reason for the list; repeats the list's own sentence one scroll later |
| 5 | «Um hotel num edifício antigo, ainda em restauro.» / «Abre brevemente.» / «Pedir aviso da abertura» | «A hotel in an old building, still being restored.» / «Opening soon.» / «Ask to be told when we open» | a noun phrase, a caption more than a sentence; a new action label would split the one action's name from the button's |

Why 1: read aloud after the lockup it runs as one statement («A Brazileira, Boutique Hotel, Torres Vedras. Estamos
a restaurar um edifício antigo. Abrimos brevemente. Entrar na lista de espera.»), and from the lockup down that is
what a screen reader hears too: no word repeated, nothing explained twice. (On a first visit, with no stored theme,
the sun note «É noite em Torres Vedras.» sits in the top bar above the lockup and describes the theme buttons
(`aria-describedby`), so the town is named once more there, by design: the note says why the page is dark or light,
and it is the bar's, not the sentence's.) Active voice in the first person plural, the house speaking,
as its other lines already do («avisamos quando abrirmos»), so the status follows in the same voice («Abrimos»,
not «Abre»). One fact, no adjective but «antigo», six words: quiet because it is plain, confident because it does
not explain itself. It translates word for word. The action keeps its name: it is the button's label too, and the
list is called «Lista de espera» (ux-copy: same term for the same thing; the label says what happens).
Copy lint (taste-skill, by hand and grep, PT and EN): virtue or banned words 0, clichés 0, puns 0 («Abrimos» is a
business opening, not a door), exclamation marks 0, invented facts 0, «boutique» only in the lockup, 6 + 2 + 5
words (6 + 2 + 4 in English). The rival test (swap the town and the name) leaves the sentence true anywhere, by design: it carries the
news, while the lockup and the photograph carry the place. The new pt-PT lines need the client's sign-off.

The only contact on the site is inn@abrazileira.com (privacy notice, the no-JS line and the send error).
The round 3 copy changes (sun note, success, send error, button label) are new pt-PT lines: they need the client's
sign-off.
Open Graph: `assets/img/og.jpg`, 1200 × 630, 60 KB, Noite: the lockup with the pitch's drawn wordmark at 72px (the
wordmark 490px wide, the crest 126px; its line on two lines at 22px, 0.3em, so it still reads at about 9px when a
link preview shows the card 500px wide) and the photograph of the entrance (doors
closed, the lantern lit, the hall's light in the gap), rendered by `src/og.py` from the real components and
layers (`--replace` writes it into `src/assets/img/`); JPEG, since it is a photograph (the PNG of the same frame is
about ten times larger). `og:image:alt`: «… o logótipo e a fotografia de uma entrada em arco de pedra com portas de
madeira, à noite.» / «… the logo and a photograph of an arched stone entrance with wooden doors, at night.»

## Accessibility (extension)
WCAG 2.2 AA (see the contrast matrix; reading text 7:1 and above). One h1 per page. Landmarks: header, main,
footer, nav (language), group (theme), section (waiting list, labelled by its h2). Skip link is the first Tab
stop. Tab order (home): skip, Dia, Noite, PT, EN, action, email, consent, privacy link, button, footer link;
the scroll cue and the honeypot are out of the order. Focus ring visible on every ground (also on the drawn
checkbox). Photograph: the entrance is one `role="img"` with the manifest's alt text (generic: no street, no
number read out); its layers are `alt=""`. Form: real labels,
`aria-invalid` + `aria-describedby` inline messages, focus to the first invalid field, `role="status"` for
sending outcomes (always rendered, so it is announced), `aria-busy` while sending, 44px targets (the inline
privacy link reaches 44px into the free space below its line). The email field is described by the list
sentence. The sun note describes both theme buttons while the sky decides. `prefers-contrast: more` lifts muted
text to the strong ink (on the hall too); forced colours keep the photograph (images keep their colours) and hide
the light layers (shade, lamplight, the hall's light); print drops the pinning, the top bar, the scroll cue and the form. Keyboard and the sequence: Enter or
Space on the action plays the walk-in (any key stops it) and lands in the email field; Tab from the action
lands on the email field with the list in view (a jump, no replay of the sequence); focusing anything
in the first screen mid-sequence rewinds to the rest state, so focus is never on an invisible element. Only
keyboard focus moves the page: a tap or a click into the form (or anywhere) never scrolls it under the pointer.
Before the run brings it in, the list's content has no pointer target but stays in the Tab order and the
accessibility tree (nothing is made inert or hidden).

## Implementation notes (extension)
- Source: `src/` (build.py, photo.py, site.css, site.js, tokens.tpl.css, noite.css, styleguide.py, og.py,
  `assets/` with the emblem, the wordmark, fonts, icons, favicon, og.jpg and `photo/` (the layers per theme, AVIF + WebP, and
  photo.json), `tests/`). `python3 src/build.py` rebuilds `docs/` completely with Python 3 alone; every path is
  relative to `build.py`, nothing is read from outside `src/`. `photo.py` turns photo.json into the markup (see
  Components › entrance); the photo files are encoded once by the asset pipeline and copied as they are (the build
  needs no image library and is deterministic). The caderno drawing's generators (`scene.py`, `hand.py`) and every
  rule and token that drew it (`.k*`, `.w-*`, `--pen-*`, `--ink-*`, `--w-*`, `--i-*`, the hall's SVG layers, the
  load animation) are gone.
- Consolidation (8 November 2026): this build joins three workstreams made in parallel from the photo version: the
  wall-coloured page with the 3D entrance (`door3d.js` and the vendored three.js subset), the pitch typography
  (Cinzel labels, EB Garamond; the version live at the time) and the pitch wordmark as a vector (`wordmark.svg` in
  Verde Torres) over the current emblem. Where they met: the build ships the 3D module, three.js and only the fonts
  still used (Cinzel capitals, EB Garamond 400 / 500; the wordmark face and its licence copy are gone); the
  styleguide's contrast table measures the pitch's roles on the wall (`parede` / `parede-noite`), and so does
  `--color-brand-ink` (Verde Torres 13.00:1 on parede, linho 14.79:1 on parede-noite); og.jpg is re-rendered with
  `og.py --replace`, so the card's night ground and facade are the wall-graded ones. The 3D entrance was then made
  opt-in (`?3d`), and on by default behind a gate and a live safeguard at the door finish (Motion › The 3D entrance).
- Photo asset pipeline (outside the site, in the working notes `photo/py/`; Python with numpy, OpenCV and Pillow
  with AVIF): `masks`, `grade`, `build_dia`, `night`, `build_noite`, `export` (the first pass), then for this
  integration `plate2` (the hall), `export2` (plate files, LQIPs), `facade2` (the elliptical edge), `spill2` (the
  lamplight as an RGBA overlay; `final3-work/photo/spill3.py` re-solves it with the doorway's fall-off, door finish), and `photoint-tools/ship_assets.py`, which copies the files the page uses into
  `src/assets/photo/` and writes photo.json.
- Tests (Playwright + Chromium, never touching the real endpoint; they need `require("playwright")` to resolve:
  `npm i -D playwright && npx playwright install chromium` in the repository, or a global install on
  `NODE_PATH`): `node src/tests/reverse-scroll.test.js docs` (the reverse-scroll / overscroll / toolbar
  regression plus fast flicks, 84 checks; it chooses Dia or Noite explicitly, since the default follows the sky)
  and `node src/tests/cta.test.js docs` (75 checks: the walk-in on request at 390 and 1440, from PT and EN, in
  both themes and the default sky theme with a pinned clock: click, Enter, Space, the scroll cue, a held Space or
  Enter and a double click fly forwards only, 0.9–1.1s, without a stall, with the scene playing, and land with
  the title and the email in view and the focus in the email; a wheel, a key, a pointer press or a touch stops
  it and nothing moves afterwards; a tap where the faded action was does nothing; Tab, reduced motion and
  `#lista` on load jump without a replay; after a flight, wheeling back up restores the exact rest state; the
  colour hand-off is ΔRGB 0 on every pixel of the frame (list words and footer text excepted) from the moment the
  screen is one colour, mid-rise, at p = 1 and with the seam on screen, Dia and Noite, at 390 × 844, 430 × 932,
  375 × 667, 320 × 568, 844 × 390, 768 × 1024, 1440 × 900, 1920 × 1080 and 2560 × 1080; on 320 × 568, 375 × 553, 375 × 667 and 390 × 664
  the photograph's foot is inside the first screen and the cue is never sliced) and `node
  src/tests/list.test.js docs` (156 checks: a tap or a click on the email field or the button never moves the
  page, at three rest positions on 390 × 844 and 375 × 667 by touch and 1440 × 900 and 1280 × 720 by mouse, and the
  button's first press runs the validation; the list's words are never invisible on the flat colour and are at
  rest after a reload at the bottom, on six screens including 844 × 390 and 1440 × 900 at 200%; the scroll to the
  readable form is 0.6–1.0 screens on six viewports; the send error carries the mailto link and the success line
  sits where the field was, PT and EN; the sun note shows on phones, in EB Garamond, with dark mode not overriding
  the sky, clear of the crest at five sizes; J: where the scroll stops (the page's end) the block is within 8px of the screen's
  middle where the footer fits under it with 32px clear, otherwise 16–32px above the footer with the title on screen,
  and the page ends with the run (a block and footer taller than the screen: 16px from the top where the run ends, the
  field whole), at ten sizes, Dia and Noite, PT and EN; the same with Safari's bars shown and hidden, emulated by
  `serve.ios` (the client's 390 × 796 / 836, 393 × 695 / 735, 375 × 553 / 627), where the hero action and `#lista`
  land at the page's end; and a failed check grows the form downwards;
  K: reduced motion and no JavaScript put the list right after the photograph, centred at `#lista`). `src/tests/png.js` decodes the screenshots (Node's zlib only).
- The 3D entrance: `node src/tests/door3d.test.js docs` (113 checks). Headless Chromium has no GPU, so the default
  page refuses its SwiftShader renderer, as it should; the 3D path is driven with `?3d=force` (no probe, no frame-time
  rule) or, for the default path, with a capable GPU spoofed in an init script (the renderer's name, the
  major-performance-caveat flag dropped, 8 cores and 8 GB) and `?guard=MED,MAX` limits SwiftShader can meet.
  1. Per viewport (390 × 844 touch, 1440 × 900 mouse) and theme, `?3d=force`: requested at the first idle moment after
  the first paint and mounted with no scroll; the photograph at rest with no inline style; the canvas drawing the doorway at
  p 0.15 / 0.3 / 0.5 with the layers hidden; flat `--color-hall`, no canvas and the photograph hidden at p 0.9; the
  exact rest state back at the top; touch drags down and back (390) and the walk-in on request recorded frame by frame
  (a ResizeObserver, after the driver wrote the frame): while the camera moves the canvas draws and the photograph is
  hidden, never a frame with neither under a stage that is not yet flat, never the camera at rest deep in the run; the
  flight lands in the email field in 0.9–1.1 s (within one SwiftShader frame; SwiftShader's landing frame sometimes
  takes 100–300 ms, on the 9 Nov base build too, so about one flight in twelve misses it: timing, run it again); a
  theme change mid-run
  (canvas or CSS entrance, never neither); a theme change at rest after which the next scroll uploads no texture; a
  context lost in the background (the CSS entrance while away, the 3D rebuilt once shown); a context lost while shown
  (the CSS entrance at the same progress, mean |ΔRGB| of the frames before and after < 6, kept after a pageshow).
  2. The gate, 390 × 844: the default page on a software renderer, `?sem3d`, `?semporta`, reduced motion (with and
  without `?3d=force`), a data saver, a 2G link, deviceMemory 1, 2 cores, a weak GPU's name: refused with the reason,
  nothing requested, no WebGL context made where the reason is known before the probe; the refusal remembered for the
  session (no probe on the next load); `?3d` on a weak GPU draws (soft heuristics skipped), `?3d` on a software
  renderer is refused (the probe stays); a capable GPU gets the 3D by default, requested within 2.5 s of the load
  event, before any scroll.
  3. The live safeguard (capable GPU spoofed): a 2.5 s frame in the first second of motion dissolves into the CSS
  entrance at the same progress (mean |ΔRGB| against the 3D frame at p 0.3 < 6; the canvas mid-dissolve over 180ms;
  no draw call while handing back), remembered
  for the session (the next load neither probes nor requests) and named in `?diag`; a slow median (50 ms of work a
  frame) and an exception in a draw hand back too; a tab switch's 2.5 s is not counted; a page restored from the
  back/forward cache with its context keeps the same 3D; `?diag` names the path and reason on a software renderer and
  on a capable GPU (with the guard's numbers).
  4. iOS (iPhone user agent, DPR 3) and Android Chrome at DPR 3: the canvas at 3, no MSAA.
  5. The take-over frame (1 px of scroll) as sharp as the page's photograph (3D ÷ CSS gradient energy 0.95–1.3) and
  equal to it (mean |ΔRGB| < 2) at 390 × 844 @3 and 1440 × 900 @1; at p 0.15 and 0.3 (390 Dia, 1440 Noite) the facade
  outside the doorway aligns at a shift of (0, 0) device px (searched ±4) and differs by a mean < 2 levels: the door's
  plane follows the CSS camera (the lens zoom of the 9 Nov hotfix).
  6. A wheel or touch drag 300 ms after the load at 4× CPU throttle: no long task over 50 ms. That last check is a
  timing gate: on a machine busy with other headless browsers one task of the machine's own once landed in its window
  (review r2: 81 ms, one run in three), so it fails only when a second attempt in a fresh context shows a long task
  too (the log says RETRY); run the suite alone for a strict reading. SwiftShader presents a 3D frame late (a frame
  read 300 ms after a scroll can be one drawn earlier), so every frame compared is read after a settle wait.
  6b. A touch drag that starts as the module is asked for, and one at the facade's first band (default path, 4×
  throttle): no input waits over 50 ms (the same two-attempt gate). The first lands on the module's evaluation, one
  task by design: at the final check of 10 Nov it waited 44–69 ms on this build and 53–76 ms on the build the iPhone
  round started from (5 runs each, same machine), so a slower machine can fail both attempts with no regression;
  compare with the previous build before reading a failure as one.
  7. Review, door finish: the open leaves' width against the doorway flat from p 0.34 to 0.62 (within 1%; the 3D
  frame's meshes projected by its own camera, `__porta.d3probe()`), the main camera still and the hall's camera walking
  in, at 390 × 844 and 1440 × 900; a shader that does not compile (injected) refused at the mount on the default path
  and with `?3d=force`, nothing drawn, remembered; a draw that throws while the mount warms up, and a module with a
  syntax error, refused, named, remembered, the next load asking for nothing; a hand-back loses the context once the
  GPU has caught up and the page is still.
  8. iOS round: under the iPhone emulation (Safari 26.6.1 user agent, DPR 3, 390 × 796, 4× CPU throttle, no
  `requestIdleCallback` / `navigator.scheduling` / `scheduler` / `deviceMemory` / `navigator.connection`, «Apple GPU»
  spoofed), a still visitor: the gate within 1 s of the first paint, «on» within 4 s of the load event and within
  1.5 s of it net of SwiftShader's fence waits, every stage in order, no long task over 50 ms after the
  load event, under 300 ms held; a visitor flicking from 1 s after the load event while the 3D loads: no input waits over 50 ms (both
  two-attempt timing gates); `?diag` while loading names the stage, its step and the time
  (`3d=loading:upload 5/19 840ms`) and, once on, when each stage began; the watchdog: a band's crop that never
  resolves is refused as `timeout: upload 1/n (no progress in 8.x s)` and remembered, a worker that never answers as
  `timeout: decode (… 20.x s)`, not remembered. iPhone round 2: opened and scrolled at once (p 0.2 while loading),
  the 3D takes over in that walk-in when on, at the same r, by a cross-fade (frames with both layers, opaque after
  120–700 ms, never a frame with neither, no long task over 50 ms), and the next flick is drawn in 3D; a forced
  hand-back (`?guard=25,60`): no long task over 50 ms in the next 2 s, the context let go later in under 50 ms; the
  main thread held 12 s in «upload» (CDP `Debugger.pause`, as iOS suspends a page): «on», nothing remembered. The
  flicking visitor's input check counts the inputs before «on» only (once on, it may take over mid-walk, and
  SwiftShader's 3D frames at DPR 3 then hold touches up to 213–340 ms until the guard hands back).
  The other suites load the default page, which refuses SwiftShader, so they exercise the CSS entrance, plus a 3D pass
  where the review asked for one (review, door finish): `reverse-scroll.test.js` runs each viewport again with
  `?3d=force` (one theme each, `R3D_ALL=1` for both), its rest checks waiting for r = p = 0 and asking for the canvas
  hidden, the photograph shown and the 3D still on, and its frame monitor failing any frame with neither the canvas nor
  the photograph under a stage that is not yet flat; `cta.test.js` checks the colour hand-off on the 3D path too
  (walked in by wheel, the canvas drawn before the flat colour, then both layers hidden under it) at 390 × 844,
  844 × 390 and 1440 × 900, Dia and Noite, and fast mouse flicks (1500 / 2500 / 3500 px/s at 390 × 844 and 844 × 390:
  the largest one-frame step of r at most 0.15, or the scroll's own largest step where that is more: 844 × 390 at
  3500 px/s moves about 0.16 of its 371 px run a frame; no snap of r to p). Frame-timing assertions stay on the CSS path:
  they would mean nothing with SwiftShader drawing the canvas on the CPU.
- The photograph's box (fix r1): `node src/tests/edge.test.js docs` (28 checks: 375 × 667 @2, 390 × 844 @3,
  430 × 932 @3, 768 × 1024 @2, 1440 × 900, 1920 × 1080 and 2560 × 1440, Dia and Noite, at rest and in the walk-in):
  each frame against the same frame with the facade hidden (the street alone), the difference averaged along the
  top and both sides and high-passed across them; the straight-edge step is at most 0.6 levels by day and 0.6 x 1.85
  = 1.11 by night (the build before fix r1 fails 26 of 28, worst 1.79 before the gain). The night limit follows the
  9 Nov gain: every Noite layer is 1.85x brighter, so what the photograph adds inside its box grows 1.85x in levels,
  and the night facade, re-encoded at its old byte size, carries compression-block steps in its fade (1440 × 900: one
  33px inside the top edge, 0.41 → 0.60; 375 × 667 @2: 13px inside, up to 0.73; the live hotfix build reads the same;
  at the box edge itself under 0.4). Worst after the merge: Dia 0.26, Noite 0.73. Still caught by night: a 1px ring
  of 3% black (2.81), a 16px soft ring of 5% (1.76). And the deploy step: `node src/tests/stamp.test.js docs
  [tools/stamp_assets.py]` (the repository's fingerprinting run on a copy of the build: it exits cleanly and every
  page's CSS/JS reference, either quote style, names a file that exists; since the 9 Nov hotfix also every photo
  reference of every page, the scene's JSON stems included, names the one versioned set `assets/photo/v<hash>/`
  and a file in it, with no unversioned reference left; since the door finish review every stylesheet too, the
  fingerprinted copies included: the street strips' `url(...)` name the same version, relative to the sheet, and
  exist; the tool before that fix fails it with 108 unversioned references).
- Output: `docs/index.html`, `docs/en/index.html`, `docs/privacidade/index.html`, `docs/en/privacy/index.html`,
  `docs/404.html`, `docs/design/index.html` (noindex, unlinked styleguide), `assets/css/tokens.css`,
  `assets/css/site.css`, `assets/js/site.js`, fonts, images, `assets/photo/{dia,noite}/` (100 files), `favicon.svg`, `robots.txt`, `sitemap.xml` (home
  and privacy, with hreflang), `site.webmanifest`, `.nojekyll`.
- Cache busting: the build stamps every local CSS/JS URL with `?v=<sha256 prefix>` (GitHub Pages caches for
  10 minutes; this keeps HTML and CSS/JS in step), in either quote style; the repository's deploy step
  (`python3 tools/stamp_assets.py docs`) then fingerprints the file names. `node src/tests/stamp.test.js docs
  [tools/stamp_assets.py]` checks that pair. A missing tool is a failure since review r2 (it printed SKIP and
  exited 0, so a run outside the repository never checked the deploy step): outside the repository pass the
  repository's tool (`node src/tests/stamp.test.js docs /path/to/repo/tools/stamp_assets.py`, or `STAMP_TOOL`);
  `STAMP_SKIP=1` skips on purpose.
- Shipped CSS and JS are stripped of comments and indentation by build.py (`min_css`, `min_js`; the build asserts
  the CSS is unchanged once whitespace is ignored and that no `//` comment exists); `src/` keeps every comment.
- Internal URLs are relative (the tests serve the site under `/abrazileira/`; production is `/`); canonical,
  hreflang and OG are absolute `https://abrazileira.com/…`. No cookies, no analytics; apart from the host (GitHub
  Pages), the only third-party request is the form submit to Supabase (EU).
- Raw hex appears only in tokens.css, plus what cannot read CSS: the two `theme-color` metas, the manifest and
  favicon.svg.
- Budget, measured on the home page with gzip -9 (fonts as shipped, photo excluded; re-measured on the consolidated
  build): 74.5 kB — HTML 14.5 (the
  drawn wordmark inline: 2.9 kB, where its font file was 3.1), CSS 10.9 (tokens 5.3 with the two LQIPs and the
  fallback faces, site 5.6), JS 12.1 (10.0 before the 3D entrance's loader and fallbacks), fonts 37.0 (Cinzel capitals 6.1, EB Garamond 400 15.0 and 500 15.9; the
  pitch typography replaced 62.2 kB of Cinzel and Alegreya files, 94.2 kB before); target 150 kB, ceiling 170 kB
  (og and icons excluded). The privacy notice is 9.4 kB of HTML (70.4 kB in all). The 3D entrance, where the gate lets
  it, adds door3d.js 16.8 kB and three.min.js 133.3 kB gzip (53.9 / 535.6 kB raw), fetched at the first idle moment
  after the first paint; site.js is 15.6 kB gzip since the iPhone round of 9 Nov (14.4 since the door finish, 12.5
  before).
  The photo is counted on its own (Components › entrance › Budgets: 98 KB by day, 47 KB by night on a 3× phone).
  The HTML lost the inline SVG drawing (it was most of the page) and gained a `<picture>` per layer and theme. CLS 0
  on every page (the photograph's boxes are sized by CSS; the wrapper grows below the fold).

## Responsive behavior

| Name | Query | Key changes |
|---|---|---|
| Stacked (default) | portrait (taller than wide) at any width; below 900px unless landscape from 560px | lockup · lede · status · action, then the photograph at the foot (door axis on the page axis, its faded top may rise 5% into the space under the action), then the cue band; portrait tablets from 900px (1024 × 1366, 912 × 1368) take it too since review r2, scaled up (one-line lockup label, 28px sentence on one line, a 676–773px scene) |
| Tight portrait | `(orientation: portrait) and (max-height: 42.5em)` (≤ 680px tall) | top bar inset 4px, lede 16px above, action 8px under the status, 16px between the action and the photograph, compact cue band |
| Very short portrait | `(orientation: portrait) and (max-height: 37.5em)` (≤ 600px tall) | lockup at its 30px minimum, lede 12px above, no cue band, the photograph takes the height that is left (door and steps in the first screen) |
| Split | `(min-width: 56.25em) and (min-aspect-ratio: 1/1), (orientation: landscape) and (min-width: 35em)` | 5fr text \| 6fr entrance, 64px apart, container 86rem; lede 48px under the lockup; action 48px under the status; top bar inset follows the container; the cue band takes the same columns, the cue on the door's axis. Review r2: was `(min-width: 56.25em), (orientation: landscape) and (min-width: 37.5em)`: portrait tablets from 900px are stacked now, and the landscape threshold is 560px, so a 568 × 320 phone (iPhone SE 1st generation on its side), stacked before with only the lockup on plain page colour in its first screen and the door from y 365, now takes the compact split: wall, door and paving beside the text (the action's box ends at 324px, its text inside the screen; the steps are below the fold, as at 667 × 375) |
| Short landscape | `(orientation: landscape) and (max-height: 31.25em)` | compact split: lockup 30–36px (`--size-lockup-short`, 9.15svh: 35.7px at 390px tall, so the drawn lockup keeps the 142px footprint the old one had and the photograph beside it keeps its size), the wordmark 204–245px wide (its line on two lines), lede 19px, status 4px under it, action right under it, entrance min 16rem |
| Action steps | `(min-width: 56.25em)`; `(min-width: 75em)` | the action and the button 19px; then 21px |
| Lockup line | `(min-width: 56.25em) and (min-height: 31.26em)`, then `@container (min-width: 5.52em) and (min-width: 21rem)` on the lockup; in the split layout from 500px tall the two-line fallback is capped at the one-line size | home only: BOUTIQUE HOTEL · TORRES VEDRAS on one line, as on the pitch, where it is at most 0.9 of the wordmark's width (0.86 where the 11.2px floor binds, 0.80 from 1440) and fits the column (two lines on phones, portrait tablets below 900px, short landscape phones, 900–915px split and with enlarged text). Review r2: was `(min-width: 64em) and (min-height: 43.75em)`, which sent 1366 × 657 (a 1366 × 768 laptop in Chrome), 1280 × 600 and 900–1023px split screens to a 15.7–17.2px two-line block |
| Footer lines | `(max-width: 29.99em)` | name, place and link on three lines, no separators |
| Home sentence | `text-wrap: balance`, the object tied | one line where it fits (PT from about 335px at the phone size; EN from 320px); otherwise two, «Estamos a restaurar / um edifício antigo.» (below 335px, and in the split layout's narrow column from 900 to about 1080px) (the 13.4em one-phrase-a-line rule for the old three-phrase sentence is gone) |
| Sun note | every width; `(min-width: 56.25em) and (min-height: 37.5em)` | its own line under Dia · Noite; the stage clears it by 12px (`--sol-h`) except on screens from 900 × 600, where the crest is far below; with very large text it wraps inside the screen and the stage clears the bar's real height (`--bar-h`) |
| Wide | `(min-width: 120em)`; `(min-width: 160em)` | root 112.5%; 131.25% (everything scales together) |
| Large text | any width, browser text size 150–200% | the top bar wraps instead of overflowing (the sun note too, and PT · EN goes under it); the stage clears the bar's real height; the list column shrinks to the screen (minmax(0, 1fr)) and long words wrap; the consent's privacy link wraps inside itself |

Touch targets: 44px for every control and link (the inline privacy link reaches 44px into the space below its
line); the field and the button are 48px. Nothing collapses into a menu: there are only two controls.

## Do's and Don'ts

Do:
- Use the lockup exactly (emblem.svg, the pitch's drawn wordmark.svg, Cinzel capitals for its line), with the lockup at 30px or more (the wordmark 204px wide; 120px when it stands alone).
- Read colours through the semantic roles (`--color-*`) and the photograph's roles (`--t-*`, `--photo-lqip`,
  `--color-leaf-shade`); add new values to tokens.css first.
- Keep one action per screen and give it the only full-ink underline there.
- Mark a current control with ink and the brass tick; keep underlines for links.
- Keep `--color-hall` the one colour of the hall's light and the waiting list (ΔRGB 0), and grade the
  photograph's far arch to clip to it.
- Ship every photo layer as AVIF + WebP at the ladder's widths, sized by CSS, lazy unless the first paint needs it;
  keep the first paint on a phone under 180 KB.
- Move only `transform` and `opacity`; promote layers only while they move.
- Give every interruption back to the visitor at once (wheel, touch, key, pointer).
- Respect the visitor: a stored choice, then the sky over the house (the system's dark mode decides only
  without JavaScript).
- Move the page on focus for the keyboard only; a tap or a click never moves it.
- Re-run the CLS fallback tuning after any copy change, and the contrast matrix after any colour change.
- Write pt-PT first, plain and factual.

Don't:
- Recolour, redraw, outline or animate the logo; set its words in another face or tracking.
- Add tracked capitals outside the lockup and labels; add italics, bold, exclamation marks, emoji or virtue words.
- Add shadows, glass, gradients in the interface, cards, panels, dividers or rounded corners (the focus ring's
  2px is the only radius).
- Add ornament that says nothing, or a second copy of something the visitor has just seen (the list's own lamp
  was removed in round 3).
- Add a second gesture on load, ambient loops, parallax, cursors, counters or sound.
- Use `scroll-behavior: smooth` or hijack native scrolling; the walk-in is the only programmatic scroll.
- Fade a flat colour over the stone or the tree: the hall's light only comes up once the doorway covers the screen.
- Use a blend mode on a moving layer (a backdrop read-back every frame); bake the look into an RGBA layer.
- Let the photograph read as a rectangle: it stands in the street the page draws (`.ph--street`), and its own
  margins are that street (graded into the same composite, then faded out over its last 70 master px).
- Put raw hex outside tokens.css (except the theme-color metas, the manifest and favicon.svg).
- Quote private correspondence or name people in the repository.
- Store anything about the visitor other than the Dia / Noite choice.

## Iteration guide
1. Change one component at a time and name its token.
2. New values go into tokens.css first (primitive, then role); components read roles only.
3. Re-measure the contrast matrix after any colour change (the hall surface too).
4. Keep the logo untouched; new pages reuse `.lockup`.
5. Keep tracked capitals to the lockup and labels (Cinzel) and sentence case everywhere else.
6. Change the photograph in the asset pipeline (re-export, then `ship_assets.py`, which rewrites photo.json), never
   by hand in the HTML; keep the layers' rects in facade fractions.
7. Change the sequence in the table in `src/site.js` (element, p range, curve, values) and the curves in
   tokens.css (`--curve-*`); keep it transform and opacity only, re-record it (frame by frame) at 390 and
   1440, both themes, and re-run `src/tests/` and the 4× CPU trace (no frame over 50ms, p95 ≤ 17ms).
8. Any new layer whose opacity or transform changes per frame joins the promotion list in site.js (`LAYERS`).
9. Re-run the copy check (banned words, privacy) after any text change.
10. Prefer more space over more ornament.
11. Check the first screen on the visual matrix after any layout change, Dia and Noite, PT and EN: 320 × 568,
    375 × 667, 390 × 844, 430 × 932 (phones); 568 × 320, 667 × 375, 844 × 390 (landscape phones); 768 × 1024,
    834 × 1194, 912 × 1368, **1024 × 1366** (portrait tablets, stacked); 1000 × 1000, 1366 × 1024 (square and
    landscape tablets); 1280 × 600, 1366 × 657, 1440 × 700, 1440 × 900, 1920 × 1080, 2560 × 1440 (laptops and
    desktops); 1600 × 400, 1920 × 450, 2560 × 600 (very wide, short windows: the street's left edge).
12. After a copy change, regenerate both fallback sets (the Times values with the type pass's tools, then the
    Android twins: `final2/work/fix-r2/tools/noto_ratio.js` over `items.json`, then `noto_faces.py`); after a new
    paving strip, `final2/work/fix-r2/py/street_rows.py` (the band's placeholder tone).

## Agent prompt guide
- Canvas parede #FAECDF / parede-noite #1C140F (the photograph's wall) · hall #F2DEC4 / #FCE7BC · text nogueira #5F3819 / linho #F3E6D6 ·
  strongest tinta #2E1E14 · muted castanho #804F1E / linho-escuro #C2AE96 · brass text latao-texto #83602C
  by day, latao #DB9E42 by night · errors barro #9E3B1E on the hall only.
- "A control in the A Brazileira system: EB Garamond 500, 17px, tracking 0.01em, sentence case, colour
  `--color-text-muted`, 44px target, current state = `--color-text-strong` with a short 2px brass tick
  (`--color-accent-text`) centred under the word (never an underline: underlines are links), focus = 2px solid
  `--color-focus`, offset 3px."
- "A form on the hall: `.surface-hall`, 26rem column, its name in Cinzel capitals 19px tracked 0.2em, EB Garamond
  500 17px labels above 48px square fields (EB Garamond 400 19px text; papel by day, luz-nucleo by night, 1px
  nogueira), a full-width 48px tinta button with papel text in EB Garamond 500 17/19/21px, the consent in EB
  Garamond 400 17/25px, errors in barro 17px under the field with
  aria-invalid/aria-describedby, outcomes in a role=status line."

## Roadmap and known gaps
- The street: the paving strip is three scene widths wide wherever a screen shows more than one (fix r1), so it
  repeats only past three: at rest on 3440 × 1440 (3.7 widths) and wider a careful eye could find a cobble cluster
  twice, far apart. B and C are quilted from A and its mirror, so their stones are A's in a new order; a second
  photograph of the same paving would vary them more. On an upright phone the 1-width strip (one period is wider
  than the screen).
  The box reaches three scene widths left and two right, and from 5 : 2 six to the left (review r2: very wide, short
  windows such as 1920 × 450 needed more than three on the text column's side); the right side holds to 5120 × 1440
  (1.84 needed). The Android fallback twins are matched on Noto Serif 5.0.19 (fontsource) and simulated here;
  check on a real Android phone (Chrome and Samsung Internet) with the fonts throttled. The first paint waits on the
  street strip's file for the paving's texture (its tone is there at once); a preload would need its six media
  queries, left for later. The olive's crown, which the
  source cut at its right edge, now ends on a ragged line 66–134 master px inside the frame; a crown drawn out past
  the edge would need new foliage (not generated: no generative fill). The phone budget is exceeded at 430 × 932 @3 by
  day (193 KB with the 1300 rung, was 223; 440 × 956 @3 212 KB; Components › entrance › Budgets). The sentence and
  description are the client's own since 9 Nov.
- The lede's metric-matched fallbacks (Typography › Font loading) still carry the values matched to the polish pass's
  sentence; the 9 Nov sentence is narrower in EB Garamond, so they are off by: PT Times +0.9%, PT Noto +1.2%, EN Times
  −1.3%, EN Noto −2.9% (fallback against web width). Measured on the Times path (Liberation Serif, every 11px from
  320 to 2560, PT and EN): one re-wrap, at 848 × 844 in Portuguese (two lines in the fallback, one in the web font;
  the split column has 1–3px to spare there), and text starts moved by at most 2px elsewhere; the Noto path's EN
  start moves about 4–5px at desktop sizes (computed). The regenerated values, for the typography workspace (left
  alone here, it owns the font code): lede 93.56 / 95.23%, Noto 78.20 / 80.95% (web / Liberation and web / Noto
  widths of the new strings, `final2/work/fix-r2/tools/noto_ratio.js`; the status faces are unused on the home page
  since the line went).
- The 3D entrance's take-over frame (`?3d` only, review r1): the paving's fine detail still changes on the one frame
  the canvas takes over (pixels over 24 levels apart, all in the paving: 1.5% at 390 × 844 @2, 2.2% at 844 × 390 @2,
  0.35% at 1440 × 900, as measured before). It is not the filter: sampled bilinear without mips, and with a Mitchell
  cubic in the shader (Skia's high quality), the numbers stayed the same (1.52 / 2.22 / 0.35% and 1.56 / 2.32 /
  0.34%), so the shader keeps its mipmapped lookup. The page's repeating background is drawn in whole device pixels
  (Blink snaps a repeating tile's size and phase), the canvas samples the plane continuously: matching it means
  reproducing that snapping (the tile's rounded size and phase, read from the page) for the rest frame.
  The left leaf too (iPhone round 2, Chromium): at the take-over the 3D left leaf lands ~1 device px right of the CSS
  leaf (390 @3 and 1440 @2: mean |ΔRGB| 4.5–5.2, 1.6–2.4 shifted 1 px; the jamb and the right leaf align at 0).
  The canvas camera's box is the scene's whole-px offset box (site.js `box3`); the page draws the facade on whole px
  but `.leaf--l` at its fractional layout (the hinge ring is not the cause: same without it). A fractional box
  aligned the leaf and moved the jamb off (mean |ΔRGB| 1.5 → 6–10), so the whole-px box stays; matching both needs
  the leaf's own snapped rect, read from the page.
- Scrolling at 2560 × 1440 by night, CSS entrance, 4× CPU throttle, software raster (review r1, weak evidence): 278–292
  frames delivered against 321–324 for the build before the street, p95 66.7ms, no long task: the cost is in drawing
  (likely the street box's two large color-dodge gradients). Not reproducible as a real-GPU figure here; measure on a
  desktop GPU at 1440p and above before acting (then: draw the night lights as a pre-rendered image, or shrink the
  street box while zoomed).
- The facade's files grew a little with the wide fade (fix r1): AVIF +1–3% (Dia 1080 88.4 KB against 86.8, Noite
  1080 48.0 against 47.3), WebP +4–14% even with a lossy alpha plane (quality 60; lossless it was +50% by night).
- The 3D entrance is on by default (door finish) without a real device here: the gate's heuristics, the safeguard's
  limits (25 / 120 ms) and the iOS paths (a context lost in the background and rebuilt; bfcache) are tested only in
  headless Chromium (SwiftShader, a spoofed GPU name, `WEBGL_lose_context`, simulated visibility). Check on the client's
  iPhone and an Android mid phone with `?diag`: the path, the reason and the guard's median and worst frame are shown.
  If too many capable devices are handed back, raise the limits (`GUARD` in site.js) before touching the gate. On the
  iPhone the canvas is at the device's ratio (3) since 9 Nov: if the safeguard hands capable iPhones back for speed,
  the lever is `maxDpr` in site.js (2 halves the pixels but softens the take-over frame: 0.74 / 0.84 of the photo's
  gradient energy).
- The 3D entrance on real GPUs: frame times (p95 ≤ 17ms at 4× throttle on a mid phone) at the device's pixel ratio
  (2 on iOS, up to 3 elsewhere), memory (the 2388 facade is 33 MB with mipmaps, the plate 9–24 MB) and context loss on
  iOS Safari; measured here only on SwiftShader. If a phone misses 60 fps, the first cuts are the hall's blur passes
  (up to three at half size) and, off iOS, a ratio of 2.5.
- The 3D hall on wide screens (review, door finish, deferred): at 1440 p 0.45–0.54 the hall's far arch of light is
  1.17–1.18× the CSS path's, so the doorway opens onto a near-uniform cream field with less of the side walls' shading
  than the CSS plate shows (tonal spread p95 − p5 at 1440 p 0.54: Dia 7 against 11, Noite 42 against 85, central two
  thirds of the frame). Giving the hall the CSS path's zoom (s^kp about the hall point) shrinks the hall box against
  the doorway: its near edges, at the door's plane, would leave a band between the jambs and the hall (and the floor's
  near edge a band above the sill) unless the box is extended towards the street, where the plate's projection has no
  image (clamped, smeared edge pixels). A hall camera further back has the same band. Needs its own visual rounds;
  the hall's own camera (zh = s^−0.12) keeps it where it was before the review.
- The mount's last long tasks (review, door finish): at 4× CPU throttle on SwiftShader, one task of 64–97 ms may remain
  (three.js's renderer setup, 31–56 ms, or the first frame drawn ahead; none over 50 ms after the load event in the
  iPhone emulation of 9 Nov, The 3D entrance › Early), and the GPU probe's throwaway context at the first idle moment after the
  first paint (about 50 ms). Both run only while the page is still; a gesture that starts during one waits
  for it (28–53 ms measured for the first event, `door3d.test.js` 6b). Real-GPU figures still to be taken.
- The drawing buffer stays allocated for the visit even under the flat colour (resizing it away would cost the next
  take-over a reallocation); MSAA is off above 4.2 Mpx since the door finish, so a 1440 × 900 @2 laptop holds ~41 MB
  for it, was ~190 MB (estimates).
- The photo-asset items review r1 left for the pipeline, both entrances (door finish):
  - **Night lamplight on the steps: done.** The spill (an RGBA overlay of one warm colour, Noite only; not part of the
    ×1.85 gain, so no gained file was touched) is re-solved from spill2.py's own solve (`final3-work/photo/spill3.py`):
    its alpha is modulated by the irradiance a horizontal tread receives from the hall through the doorway (an area
    light at the reveal's inner face, ±0.81 m × 2.59 m, seen through the frame's ±0.75 m opening; the treads located
    on the solve's own bands, their depth from the photograph's camera), 0.10 ambient + 0.90 of it; each riser gets a
    sixth of the light of the tread below it (more at its foot) and each nosing a 7 px highlight. Alpha at the axis,
    tread 1 / 2 / 3: 0.83 / 0.72 / 0.44 (was 0.83 / 0.93 / 0.72); at ±0.8 m about half of that; the risers are no longer
    black. Same encoder settings as spill2 (AVIF q50, WebP q70 alpha q40); the files are 12–16% smaller.
  - **The olive's crown at the right edge: already done** by the full-bleed export (Components › entrance: its sprigs
    end on a ragged, tapered line 66–134 master px inside the edge, inside the facade's own wide fade); measured on the
    current masters, the rightmost foliage stops 65 px (Dia) / 67 px (Noite) from the edge, 105 px on most rows.
  - **The night olive's bright 1–2 px rim when magnified: not done.** It is in the night facade's pixels (the relight's
    rim light along the leaves' upper edges, plus a few isolated bright specks). A fix re-exports the night facade: a
    choke and decontamination on the lossless master (`noite_facade4.npy`), the ×1.85 gain applied there, then
    `facade_export.py` with its encode compensation recomputed against the gained street (the box-edge invariants
    the edge test holds). Doing it on the shipped files instead (decode, fix, re-encode, as noite_gain.py did) would add
    a third lossy generation to every night rung and its compression steps inside the box; left for that pipeline
    round.
- The CSS entrance keeps the closed gap's dark notch in the head of the frame as the doors open (the 3D entrance
  replaces it); fixing it there needs a retouched overlay that fades in with the opening.
- From the photograph's camera an inward-opening leaf shows its face, never its thickness (its free edge turns away,
  its hinge edge hides behind the casing): the 55 mm reads in the silhouette, the panels' parallax and the knob,
  not as a visible edge band. The hall stays the photograph's own defocused plate on its box (never in focus); a
  photographed hall plate of the real house, at the walk-in's resolution, would be the next step.
- The steps are part of the facade plane (their treads would be 7–9 cm deep in this camera's geometry): fine while
  they leave the frame, flat if the camera ever lingered over them.

- Real devices for the walk-in on request: iOS Safari (programmatic scroll per frame while the toolbar
  collapses) and Android Chrome (the focus at the landing may raise the keyboard, since the click's user
  activation is still valid 1.2s later). And the round 3 run on the client's iPhone: the short run is tuned on
  headless Chromium (touch drags emulated through CDP, no real momentum); one swipe should now reach the form.
- Deploy: the live site lags this build (review round 2 #7: cache-busting hashes and the head theme script
  differ). Publish once this round lands, then re-check the live index, en/, privacidade/ and 404 against the
  build. The repository has since moved to fingerprinted file names (its last commit); keep that when merging.
- Under 4× CPU throttle with software raster, an occasional frame of 50ms (3 vsyncs) was seen at 1440 × 900 in
  earlier runs (the frame that creates the layers; once a style recalculation); none in the final set (54 runs).
- WebKit: the layer strategy (the facade as its own layer, so WebKit can composite the decoded image directly at
  any zoom; no blend modes) is reasoned, not measured: check memory and frame times on a real iPhone.
- Real-device pass on iOS Safari (17–26) and Android Chrome for the single driver, rubber-band overscroll and
  the collapsing toolbar: the headless runs above use Chromium only (WebKit was not available here), and the
  iOS overscroll is emulated in the regression test, not reproduced.
- Raster figures above come from headless Chromium with software raster; real GPUs raster faster, phones
  with little GPU memory may need the promotion list trimmed (11 layers, each the photograph's box or smaller; the
  camera layer also holds the street, many screens wide but rastered only where it is on screen).
- The walk-in's sharpness is bounded by the master: past p ≈ 0.48 (the jambs leaving the frame) even the 2388px
  facade is drawn at 0.4–0.6 source px per device px; it is itself a 2× super-resolution of a 1194px photograph.
  A sharper walk-in needs a larger original (a photograph of the house's own door, see below).
- The list held at rest through a resize (keyboard, rotation) is tested in Chromium's emulation only; check a
  rotation and an in-app browser's keyboard on real phones.
- The photograph is a generic Portuguese entrance chosen by the client, not this house: when the house is
  restored, photograph its own door the same way (one frame, the doors closed, plus the layers).
- Content pages (rooms, ground floor, contacts) reuse these tokens and the hall surface.
- EB Garamond with old-style figures (`onum`) would match the pitch's specimen more closely; the Google build
  used here carries lining figures only.
- A double opt-in email and an unsubscribe link belong to the sending tool, not this page.
- Mail: inn@abrazileira.com is the only contact the site publishes (rights, withdrawal, the no-JS sign-up). The
  domain has no MX record yet; Email Routing for inn@ must be set up and tested from an outside mailbox
  (DEPLOY.md §4) before the address can receive anything.
- Retention: the notice promises at most 24 months; the database has no scheduled purge yet (a pg_cron delete of
  rows older than 24 months, or a dated manual task).
- The controller is named by its trade name only («A Brazileira»); the legal identity is the client's to add.
- Domain: canonical points to abrazileira.com; the .pt redirect is outside this repository.
