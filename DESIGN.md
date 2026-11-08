---
version: alpha
name: A Brazileira · Boutique Hotel
description: >-
  A coming-soon page for a boutique hotel in Torres Vedras, Portugal, and step 1 of its design system.
  The canvas is warm paper (papel #F9F0E9), never white, and by night a walnut dark (noite #1C120B), never
  black. The voice is the client's identity pitch: the original crowned B in a laurel wreath over the wordmark
  A BRAZILEIRA (a heavy flared Roman with the ornamental B and kicked R's, the pitch's reading of the façade's 1930s lettering) and
  BOUTIQUE HOTEL · TORRES VEDRAS in widely spaced Cinzel capitals; everything the house says, and the interface, is
  set in EB Garamond, in sentence case. Brass (latão) is ornament and logo by day and light by night. Two surface worlds, Dia and Noite,
  switch the whole page, including the photograph. The signature is a photograph of an arched limestone doorway
  (walnut double door, fanlight, wall lantern, an olive in a clay pot), cut into layers: scrolling swings the doors
  inwards, walks in through the doorway into a warm, out-of-focus hall and on into its light, one flat colour,
  where the waiting list is. Shapes are square-cut; depth comes only from the photograph and its light. The rule
  is restraint: one message, one action, no ornament.

colors:
  # primitives (tokens.css, layer 1)
  papel: "#F9F0E9"          # canvas by day; lime plaster; form fields
  areia: "#F0DFCF"          # lit stone, glass by day, skip-link surface
  pedra: "#DECDBD"          # limestone face
  oliva: "#72692E"          # olive (reserved: was the drawing's leaves; no use on the page now)
  azulejo: "#6F7A4A"        # glazed tile (reserved; no use on the page now)
  castanho: "#804F1E"       # walnut doors by day; muted text 6.11:1 on papel
  nogueira: "#5F3819"       # text, focus, hairlines, field borders; 9.03:1 on papel
  tinta: "#2E1E14"          # strongest text (wordmark), the button; 14.23:1 on papel
  latao: "#DB9E42"          # brass; 2.08:1 on papel = ornament only by day; 7.87:1 on noite
  latao-marca: "#A57638"    # emblem by day (graphic, 3.56:1), close to the original logo gold
  latao-texto: "#83602C"    # brass-hued small text by day, 5.08:1 on papel
  noite: "#1C120B"          # canvas by night
  linho: "#F3E6D6"          # text by night, 14.99:1 on noite
  linho-escuro: "#C2AE96"   # muted text by night, 8.58:1 on noite
  luz-nucleo: "#FFF2D6"     # lamplight core: form fields by night
  luz: "#F4C978"            # lamplight body (sala-noite is derived from it)
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
  color-accent-text: "#83602C"         # latao-texto: the status, the sun note, the control tick
  color-accent-text-on-night: "#DB9E42"   # latao
  color-mark: "#A57638"                # latao-marca: the emblem (graphic)
  color-mark-on-night: "#DB9E42"       # latao
  color-ground: "#5F3819"              # nogueira: hairline rules (styleguide)
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
  wordmark:                   # «A Brazileira»: the large A, the ornamental B, RAZILEIR at 72% (.lockup__sc), the large closing A
    fontFamily: "'Brazileira Wordmark', 'Wordmark fallback', 'Times New Roman', serif"
    fontSize: "clamp(min(2.25rem, 16vw), min(1.35rem + 3.5vw, 8.2svh), 4.5rem)"   # 36 -> 72px
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: 0.01em
    textTransform: uppercase
  label-lockup:               # BOUTIQUE HOTEL · TORRES VEDRAS
    fontFamily: "Cinzel, 'Cinzel lockup fallback', 'Times New Roman', serif"
    fontSize: "max(0.32em, 11px) of the wordmark on two lines; max(0.19em, 11.2px) on one line (home, from 1024 x 700, when it fits the column)"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0.32em
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
    textColor: "{colors.color-text-strong}"
    markColor: "{colors.color-mark}"
    labelColor: "{colors.color-text-strong}; its « · » {colors.color-mark}"
    typography: "{typography.wordmark}; {typography.label-lockup}"
    minSize: "30px wordmark (--size-lockup-min)"
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
  scroll-cue:                 # the pen-drawn chevron under the photograph (aria-hidden, out of the Tab order)
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
    layers: "plate (the hall) < reveal (the doorway's shade) < leaf-l, leaf-r < facade (doorway transparent) < spill (Noite)"
    files: "AVIF + WebP per theme; facade and leaves 720/1080/1600/2388 facade px, plate 720/1080/1600, reveal 1080/2388, spill 1080/1600"
    firstPaint: "<= 180 KB on phones (measured 112 KB Dia, 48 KB Noite at 390 x 844, DPR 3; 174 KB Dia at 430 x 932, DPR 3)"
    walkIn: "after the load, at idle: the larger facade and leaves (2388) for the walk-in, swapped in on the first move"
    edges: "the facade's margin converges to the page colour (Papel / Noite): no rectangle on the page; the olive's crown is kept out of the feather; the hole overlaps the leaves by 4 master px"
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
pot on the right, the house number 11 on the keystone. It is graded to the brand (lime plaster between Papel and
Areia, limestone in the Pedra family, walnut rich but not orange) and its margin fades into the page, so it sits
on the paper like the drawing it replaced, without a frame.

**Dia** is that doorway in daylight on the papel ground. **Noite** is the same photograph relit for the night
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
palette); no interface colour is sampled from it. Barro (terracotta) exists only for form errors. The interface
itself is 95% neutral.

**Key characteristics**
- Canvas `{colors.papel}` by day, `{colors.noite}` by night; the hall `{colors.color-hall}`; all flat.
- The pitch's lockup: the original emblem.svg inline over «A Brazileira» in the wordmark face (a large A, the
  ornamental B, RAZILEIR at 72% with both R's kicked out on the baseline, a large closing A) and, close under it,
  BOUTIQUE HOTEL · TORRES VEDRAS in Cinzel capitals, widely spaced.
- Three voices, as on the pitch: the wordmark (logo only), Cinzel capitals for labels (the lockup's line and
  section names), EB Garamond for everything said (400) and the interface (500), roman, sentence case.
- One accent: brass, `{colors.latao-texto}` by day (5.08:1), `{colors.latao}` by night (7.87:1).
- One action on the first screen: «Entrar na lista de espera» / «Join the waiting list».
- Square corners everywhere; the only radius is the 2px corner of the focus ring.
- Depth comes from the photograph alone (its perspective, its light), never from interface shadows.
- Motion: nothing moves on load; one scroll-linked sequence (115svh, one plain-JS driver) swings the doors in,
  walks through them into one flat colour and the waiting list; the hero action plays the same walk-in on its
  own (1.25s, any input stops it) and lands in the email field; Dia ↔ Noite cross-fades in 400ms when chosen,
  1.4s when the sun changes it.
- One light at the end of the hall: the arch into the bright room beyond, which the photograph clips to the hall
  colour; the walk-in ends in it. No lamp bokeh, no glow shapes.

## Logo usage

- **Source**: `src/assets/img/emblem.svg` (vector rebuild of the original: crown with cross, dense laurel,
  bow, Trajan-style B). It is inlined in the h1 with `currentColor`, `aria-hidden`; the accessible name is the
  live text "A Brazileira, Boutique Hotel, Torres Vedras". The drawn wordmark (`A B` + `razileir` + `a`, three
  text runs) is `aria-hidden`; a visually hidden «A Brazileira» carries the name as one run, so a screen reader
  that walks text runs (VoiceOver swiping) never reads «A B» and «razileir» apart.
- **Lockup** (as on the client's identity pitch, «Interpretação para a marca»): the emblem 2.27em wide (of the
  wordmark size; the same pixel size as before) · «A Brazileira» in Brazileira Wordmark 900: the large plain A, the
  ornamental B, then RAZILEIR in capitals at 72% (`--lockup-sc`), both R's with the leg kicked out on the
  baseline, and a large plain A to close, as on the board (its two A's are the same height), tracking 0.01em ·
  BOUTIQUE HOTEL · TORRES VEDRAS in Cinzel 400 capitals, tracking 0.32em, close under the letters as on the board
  (wordmark baseline to the line's capitals: 0.2 of the B's height, the board's 0.18; `--lockup-pull` -0.2em on
  the wordmark): on one line with a brass « · » where the wordmark is large (the home page in the split layout,
  from 1024 × 700: max(0.19em, 11.2px), 13.7px at 72px, 0.81 of the wordmark's width as on the board, never over
  0.9), on two lines (max(0.32em, 11px), 11.5px at 36px) everywhere else. Trailing tracking is compensated with a
  negative end margin so each line is optically centred. The pitch's shield monogram is not used: the crowned
  laurel B stays.
- **Enlarged text** (WCAG 1.4.4; checked with the root size at 125–200%): nothing in the lockup is held on one
  line by force. The wordmark breaks after its A («A / BRAZILEIRA»); the one-line label is a container query on
  the lockup (`container-type: inline-size`, home split only), `(min-width: 5.3em) and (min-width: 19.5rem)` in the
  wordmark's em, so it falls back to two lines as soon as one line no longer fits the column; each label line may
  break between its words; on a phone the wordmark's minimum yields to 16vw (13vw for the 30px size), which only
  binds with text enlarged. At 200%: 320 × 640 and 390 × 844 wrap to «A / BRAZILEIRA» inside the screen, 1024 ×
  768 takes the two-line label; no letter is cut.
- **Wordmark face**: Cinzel Decorative Black (Natanael Gama, OFL) is the closest open face to the pitch's
  lettering (flared Roman serifs, heavy stems, an ornamental B). It is modified for this one use (the ornamental
  B kept; the ornamental R kept with its swash tail, which dips well below the baseline in the original, redrawn
  as the board's kick along the baseline: the part below the baseline pulled up, y / (1 + 0.01|y|), the tail past
  the advance shortened by half, smooth joins kept; every other letter mapped to the plain Roman capital, upper
  and lower case alike, A-Z only, 3.0 KB; built by `tools/fonts.py`) and, as the Reserved Font Name «Cinzel» of
  Cinzel Decorative (2012) requires of a modified version, renamed «Brazileira Wordmark»
  (`assets/fonts/OFL-cinzel-decorative.txt`). Compared by eye against the board with Elsie + Elsie Swash Caps
  (closest B and R swashes, but Didone hairlines and ball terminals) and Limelight (Art Deco, too far from the
  board's Roman); Cinzel Decorative won on serifs, weight and proportions.
- **Colour**: Dia: emblem and the « · » `latao-marca`, wordmark and line `tinta`. Noite: emblem and the « · »
  `latao`, wordmark and line `linho`. Forced colours: CanvasText.
- **Clear space**: at least 0.75em of the wordmark size on every side (about the cap height of
  A BRAZILEIRA). The page keeps 24px or more (0.86em at the smallest size).
- **Minimum size**: wordmark 30px (`--size-lockup-min`; the wordmark about 187px wide; used at exactly this size
  as the home link on the privacy notice, on landscape phones and on portrait screens up to 600px tall, where the
  line is held at 11px, not the lockup's own 9.6px: Cinzel Regular's hairlines break up below that). Below that, use the emblem alone (favicon.svg, app icons),
  which holds at 16px.
- **Don't**: redraw, outline, recolour outside the two schemes, add a background plate, set the words in
  another face, add more swashes (the B and the two R's are the only ones), change the tracking, put the lockup on the photograph, animate the emblem.

## Colors

### Brand & accent
- **Papel** (`--papel` #F9F0E9): day canvas; the fill of form fields on the hall by day. Never pure white.
- **Areia** (`--areia` #F0DFCF): skip-link surface, selection; the photograph's plaster is graded between
  Papel and Areia (about #F4EBE1). Not a text colour.
- **Pedra** (`--pedra` #DECDBD): the limestone family the photograph is graded to; base of the night hairline.
- **Castanho** (`--castanho` #804F1E): muted text (6.11:1 on papel).
- **Nogueira** (`--nogueira` #5F3819): text, focus ring, hairlines and field borders (9.03:1); also the depth of
  the walnut the photograph is graded to (about #8E4F2A on its lit faces).
- **Tinta** (`--tinta` #2E1E14): the wordmark, the strongest text and the button (14.23:1).
- **Latão** (`--latao` #DB9E42): ornament by day (2.08:1 on papel: never text there); text, emblem and focus by
  night (7.87:1).
- **Oliva / Azulejo**: reserved (they coloured the drawing's olive). Never text, never interface.
- **Barro** (`--barro` #9E3B1E): form errors on the hall surface only (text and the invalid field edge).
- **Sala** (`--sala-dia` #F2DEC4, `--sala-noite` #FCE7BC): the lit hall. Stored as exact sRGB hex (not a
  `color-mix`), so every layer that paints it resolves to the same pixel.

### Surface
Three surfaces: `--color-bg` (papel / noite), `--color-hall` (the lit hall: `--sala-dia` #F2DEC4 by day,
`--sala-noite` #FCE7BC by night) and `--color-surface` (areia / dark stone), which appears only under the
focused skip link. `--color-hall` is ONE token per theme and the only colour of the hand-off: the
photograph's far arch is graded to clip to it (within 2 levels after AVIF / WebP decoding), and the flat layer
that completes the walk-in (`.porta__flood`), the waiting list and the home footer paint it exactly, so the
colour never changes between the door and the form. Measured by pixel
sampling: ΔRGB = 0 over every pixel of the frame (list words and footer text excepted) from the moment the
screen is one colour (p = 0.76), at the middle of the list's rise, at p = 1 and with the seam where the stage
releases on screen, on 390 × 844, 430 × 932, 375 × 667, 320 × 568, 844 × 390, 768 × 1024, 1440 × 900,
1920 × 1080 and 2560 × 1080, both themes (`src/tests/cta.test.js`). Once the screen is one colour the page behind the stage takes it too
(an inline background on body), so a frame that draws the pinned stage a step behind a fast scroll uncovers
the same light, never the hero's paper.
A lossy photograph cannot hold one exact colour (decoded, the arch's centre is 1–3 levels off the token), so the
walk-in never ends on the image: the flat CSS layer fades in over the last stretch (p 0.60 → 0.76), after the
doorway covers the screen, and is the whole frame from p = 0.76. `.surface-hall` re-points the semantic roles for its subtree so components inside it
need no special colours. No cards, no panels, no glass.

### Hairlines
`--color-ground` (nogueira by day, 9.03:1; pedra 46% in noite by night, 3.41:1): the styleguide's rules. The
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
| Dia | Wordmark, lockup line (BOUTIQUE HOTEL · TORRES VEDRAS, 9.6–13px; 17px at 2560), privacy section names, active control, CTA | tinta #2E1E14 | papel #F9F0E9 | 14.23:1 | text |
| Dia | Active-control tick, sun note | latao-texto #83602C | papel | 5.08:1 | text / non-text ≥ 3:1 |
| Dia | Lede, privacy body | nogueira #5F3819 | papel | 9.03:1 | text |
| Dia | Inactive control, separators, footer, scroll cue | castanho #804F1E | papel | 6.11:1 | text / graphic |
| Dia | Status | latao-texto #83602C | papel | 5.08:1 | text |
| Dia | Emblem, the lockup line's « · » (aria-hidden) | latao-marca #A57638 | papel | 3.56:1 | graphic ≥ 3:1 (logo) |
| Dia | Focus ring | nogueira | papel | 9.03:1 | non-text ≥ 3:1 |
| Noite | Wordmark, lockup line, section names, lede, active control, CTA | linho #F3E6D6 | noite #1C120B | 14.99:1 | text |
| Noite | Inactive control, separators, footer, scroll cue | linho-escuro #C2AE96 | noite | 8.58:1 | text / graphic |
| Noite | Status, emblem, the lockup line's « · », focus ring, active-control tick, sun note | latao #DB9E42 | noite | 7.87:1 | text |
| Hall (Dia / Noite) | List name (Cinzel capitals), labels, consent link | tinta | hall #F2DEC4 / #FCE7BC | 12.21 / 13.18:1 | text |
| Hall | List sentence, consent text | nogueira | hall | 7.75 / 8.37:1 | text |
| Hall | Footer (home), muted | castanho | hall | 5.24 / 5.66:1 | text |
| Hall | Error message, invalid field edge | barro #9E3B1E | hall | 5.17 / 5.58:1 | text |
| Hall | Field and checkbox borders, focus ring | nogueira | hall | 7.75 / 8.37:1 | non-text ≥ 3:1 |
| Hall | Typed text | tinta | papel / luz-nucleo #FFF2D6 (field) | 14.23 / 14.42:1 | text |
| Hall (Noite) | Field border on the field | nogueira | luz-nucleo | 9.16:1 | non-text ≥ 3:1 |
| Hall | Button label | papel | tinta (button) | 14.23:1 | text |

`latao-texto` on the hall would be 4.36:1, so `--color-accent-text` points to castanho inside `.surface-hall`.

## Typography

The client asked for type «mais em linha com o que está aqui (tipos de letras no pitch)»: the identity board
shows a lettered wordmark drawn from the façade («PASTEIS DE FEIJÃO», «CAFÉ A BRAZILEIRA DE TÔRRES»), labels in
widely spaced Roman capitals and a Garamond specimen for text. The site now follows it, three voices.

### Font family
- **Brazileira Wordmark** 900 (Cinzel Decorative Black, modified and renamed, see Logo usage): «A Brazileira»
  only. 3.0 KB.
- **Cinzel** 400 (Cinzel 2.000, Natanael Gama, OFL), capitals only (A-Z, the Portuguese accented capitals,
  figures, the punctuation a label may carry: . , : ; · - – — ‘ ’ “ ” « » ? ! … ' & ( ) / © º ª): the label voice,
  always `text-transform: uppercase`, widely spaced: the lockup's line, the waiting list's name, the privacy
  notice's section names. 5.9 KB. Cinzel 2.000 (2020) declares no Reserved Font Name (`OFL-cinzel.txt`), so the
  subset keeps its name; only the wordmark, from Cinzel Decorative (2012, RFN «Cinzel»), is renamed.
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
| wordmark | Brazileira Wordmark | 36px (30px when the screen is ≤ 600px tall, and on landscape phones) | 36px | 72px | 900 | 1.05 | 0.01em | A Brazileira (RAZILEIR at 72%) |
| lockup line | Cinzel | 11.5px, two lines (11px) | 11.5px, two lines | 13.7px, one line with « · » | 400 | 1.3 | 0.32em | BOUTIQUE HOTEL · TORRES VEDRAS |
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
- Line breaks by rule, not by luck: `text-wrap: balance` on the ledes and titles; on 320–359px phones the
  Portuguese lede is set one phrase a line («Uma casa antiga de Torres Vedras / está a ser restaurada / para
  receber hóspedes.»: a plain wrap at 13.4em, between the first phrase at 12.6em and the first phrase with «está»
  at 14.2em, with «para receber hóspedes» tied); the lockup's line takes one or two lines by rule (a media query
  for the size, a container query so it never overflows its column), not by a near miss in width; `text-wrap: pretty` on reading text; no hyphenation anywhere (the privacy notice is read word by word).
  Ties at build time (`nb()` in build.py): «A Brazileira», «Torres Vedras», «© 2026», and every one-letter word
  holds to the next («e avisamos», «a ser»). «nota de privacidade» never splits and sits on its own line under
  the consent.
- Below 480px the footer sets «© 2026 A Brazileira» / «Torres Vedras, Portugal» / «Privacidade» on three lines.
- Quotes: «» in Portuguese, “” in English (`q:lang()`). Noite text uses grayscale smoothing on macOS.
- Height-aware sizes (`svh` inside `min()`) keep the lockup and lede in one screen on short laptops.

### Font loading and fallbacks
All five faces are `font-display: swap`, and the four files (wordmark, Cinzel capitals, EB Garamond 400 and
500, 40 KB together) are preloaded on every page. Every role has its own local fallback (Times New Roman, or
the metric-compatible Liberation Serif / Tinos; the wordmark's is Times Bold), sized so that role's own strings
set to the web font's width in Chromium, with English variants where the sentence differs (`[lang|=en]` swaps
the stacks). Centred multi-line text (the ledes) and wrapped text near a break (the consent, the privacy intro)
are matched on the line that decides the break, not on the average. Values (size-adjust, PT / EN):
wordmark «A B» 108.9%, its RAZILEIR 103.26%, its closing A 99.7% (each run its own fallback, set from the
measured width ratio, so each run starts where the web font starts it);
lockup line BOUTIQUE HOTEL 103.15%, TORRES VEDRAS 98.6%, its « · » 80.49%;
list name 97.37 / 101.77%; section names 102.05%;
lede 92.74 / 93.51%; list sentence 93.14 / 91.31%;
intro 92.33 / 93.31%; title 94.28%;
consent 92.45 / 93.6%; text (sun note, field) 93.15 / 93.69%;
interface 97.94%; action 97.33 / 98.09%;
status 97.8 / 99.82%; back link 97.58 / 97.14%;
theme buttons 101.54 / 101.04% (so the sun note beside them never moves when the font lands;
`--font-theme`); PT · EN 104.67%; the «·» between controls 65.9%; footer name 95.62%,
place 97.91%, « · » 77.52%, link 96.87 / 94.75%. Ascent and descent
overrides carry EB Garamond's 1.007 / 0.298 and Cinzel's 0.976 / 0.372 through the size-adjust. The privacy
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

### Grid and container
- **Stacked** (portrait below 900px): lockup · lede · status · action, then the photograph at the foot of the
  first screen, then a band with the scroll cue. The door's axis sits on the page axis: the photograph is
  asymmetric (lantern left, olive right), so it is offset by `--scene-axis` (0.48241, the door axis as a share of
  its width, from photo.json); `--scene-reach` 1.06 lets its faded right margin reach into the gutter, and
  `--scene-lift` 0.05 lets its top (plain wall, faded into the page) rise 5% of its height above the entrance's box,
  into the space under the action. Measured widths: 322px at 390 × 844 (the door 102px wide, like the drawing's
  105), 402px at 430 × 932, 227px at 375 × 667, 148px at 320 × 568.
- **Split** (from 900px wide, or any landscape screen from 600px): 5fr text | 6fr entrance, 64px apart,
  container 86rem; the text column is a centred crest; the photograph fills the right column (681 × 751px at
  1440 × 900), standing at its foot.
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
  24px minimum, 12px above the lede, no scroll cue, and the photograph takes the height that is left, so the whole
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

**`lockup`** (h1 on the home page; a 24px home link on the privacy notice): see Logo usage. States: none.

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
`meta[name=theme-color]` follows. Storage is wrapped in try/catch (a choice still holds for the visit if
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
a little longer and bowed, that cross where they meet (the pen's overshoot).

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
the frame's walnut (`--color-door-ring`, #47210B by day, #090200 by night; a 3px `box-shadow` on `.ph--hall`, under
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

*The edges*: the facade's outer margin converges to exactly the page colour (rectangular fade, 7.5% / 7% / 5% by
day, 14% / 12% / 5% by night) and, on top, an elliptical falloff (`photo/py/facade2.py`): by night the dusk wall
falls away into the night ground as if only the lantern and the door lit it; by day a lighter touch at the
corners. The photograph never reads as a rectangle on the page, at 390 or at 1440 (the asset report noted a
faint rectangle by night on desktop: gone). The source crops the olive's crown at its right edge, and the 7.5%
feather drew a vertical ghosted band through the tree (review r1). By day the crown is protected from the
feather: its foliage keeps full strength until the last 60 master px (2.5%), where only the sprigs the frame cuts
fade out; the plaster around it fades as before (plaster and Papel are within a few levels). Widening the canvas
with synthesised wall was weighed and not done: it changes the photo's aspect and every layout that depends on
it, and the cut sprigs would still need the same short fade.

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
(as tall as the text column beside them); side by side from 900px (the right column, 51vw − 3rem, or the height
under the top bar, at most 939px); other landscape; portrait tablets from 600px (the room under the text, which
grows with the width); short phones (two steps, their own minimum heights and tighter text); phones (the room under
the text, never less than the entrance's minimum, never wider than the screen). Measured against the rendered
scene at 145 viewports from 320 × 560 to 3840 × 2160: every slot within 0.95–1.10 of the scene
(`shots/photoint-fix-r1/js/sizes.js`, `sizes.txt` in the review notes).
The head script, which already picks the theme, preloads the four first-paint files of that theme (facade,
both leaves, plate; AVIF with `type="image/avif"`; `fetchpriority="high"` on the facade, `low` on the others, so
they never compete with it). Until the facade has loaded, the scene shows the theme's LQIP (24 × 26px, drawn
blurred through an SVG filter, a theme token `--photo-lqip`; its outer ring is the page colour and the next half
way, so it has no rectangular edge either), and the doorway's layers (leaves, hall) are hidden
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
| 390 × 844, DPR 3, Dia | facade-1080, leaf-l/r-1080, plate-720, reveal-1080 (AVIF) | 112 KB |
| 390 × 844, DPR 3, Noite | the same set | 48 KB (+ spill 22 KB after the load) |
| 1440 × 900, DPR 1, Dia / Noite | facade-720 set | 66 / 27 KB |
| 430 × 932, DPR 3, Dia | facade-1600, leaf-l/r-1600, plate-720, reveal-2388 | 174 KB (Noite 80 KB) |
| 1440 × 900, DPR 2, Dia | facade-1600, leaf-l/r-1600, plate-1080, reveal-2388 | 192 KB (Noite 83 KB) |
| any, the other theme | nothing (until the theme control is hovered, focused or pressed) | 0 |
| after the load, at idle, with the sequence on (the walk-in's larger files, shown theme) | facade-2388, leaf-l/r-2388 | 242 KB Dia / 124 KB Noite |

Budget: ≤ 180 KB for the hero images on a phone; the largest phone case is 174 KB by day (the Dia plate grew from
4–11 KB to 17–75 KB with its grain and floor; a desktop at DPR 2 fetches 192 KB by day). Each image is fetched
once (the head's preload is the file the picture picks). With the photo files held back 1.2s: CLS 0 at 390, 430
and 1440, both themes; the largest contentful paint is the facade image. The spill (Noite, invisible until the doors open) joins the scene after the page's load
(`.is-ready`); everything is decoded (`img.decode()`) after the load, before anything moves. Shipped in all:
2.15 MB in `assets/photo/` (both themes, every width, AVIF and WebP), of which a visitor fetches one theme's
first-paint set. Without JavaScript a browser ignores `loading="lazy"` (the HTML standard turns it off when
scripting is off), so a no-JS visit fetches both themes' first sets (about 85 KB at 390 × 844, DPR 2): the price
of keeping one static page for both themes.

*Theme change*: the other theme is a different photograph. A pointer or the focus arriving on the Dia · Noite
control fetches and decodes it (`loading` switched to eager); a theme change waits for it (at most 800ms) before
the cross-fade, so the fade never lands on a half-loaded entrance.

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
run, so the run ends with the list at rest. Scroll progress p (0 → 1 from the wrapper's top to the end of the
pinned stretch) drives every layer, each over its own sub-range and curve; scrolling back reverses everything
(walk back out). On screens shorter than the rest composition the stage first scrolls until its foot meets the
screen's bottom, then pins; the timeline starts at the wrapper's top all the same, so the doors move on the first
pixel there too (review r1: at 390 × 664, the iPhone's visible area with its toolbars, the first 26px moved
nothing; `src/tests/list.test.js` H).

**The run in three overlapping beats** (retuned to the photograph's geometry: the door axis, the hall point,
the doorway). The doors swing inwards from the first pixel and the camera starts with them; the camera walks in
towards the hall point (the photo's vanishing point, 0.48241 × 0.63326 of the facade, on the door axis): at
p = 0.36 the doors are open (84°) and the camera is at the threshold, by p = 0.58 the doorway covers the screen and
the jambs, the edge-on leaves and the steps have passed out of the frame, and it keeps walking down the soft hall
into the arch of light at its end while the hall's light, one flat `--color-hall` over the whole stage, fades in
(p 0.60 → 0.76); at p = 0.76 the screen is that one colour, exactly the token, and the list rises in on it at once.
On a phone the photograph's foot holds at the visitor's feet while it grows (the hall point rises with the zoom)
and the steps leave through the bottom edge as the threshold is crossed.

**Measured scroll from the top until the list title and the email field are fully in view and readable**
(opacity ≥ 0.99, settled; `rework-tools/reach.js` in the review notes, and `src/tests/list.test.js` C):

| Viewport | Scroll to the form | Screen is one colour at | End of the run |
|---|---|---|---|
| 390 × 844 | 849px = 1.01 screens | 0.87 | 1.15 |
| 430 × 932 | 936px = 1.00 | 0.87 | 1.15 |
| 375 × 667 (stage pins after 24px; the doors move from the first) | 692px = 1.04 | 0.91 | 1.19 |
| 844 × 390 | 397px = 1.02 | 0.89 | 1.16 |
| 1440 × 900 | 904px = 1.00 | 0.87 | 1.15 |
| 1920 × 1080 | 1085px = 1.00 | 0.87 | 1.15 |

Before: about 2.0 screens (1.99 at 390 × 844). Whole home page: 2.27 screens at 390 × 844 (was 3.08).

*Wheel notches* (the rework brief also said «2–3 wheel notches on desktop»): with native scrolling at about 100px
a notch (Chrome on Windows; macOS varies with acceleration), the form needs about 9 notches at 1440 × 900 (890px),
7 at 1280 × 720 (724px), 9 at 1536 × 864 (857px) and 11 at 1920 × 1080 (1069px). A one-screen run cannot also be
2–3 notches without taking over the wheel, which the native-scroll rule forbids (a hijacked wheel breaks
trackpads, keyboard scrolling, find-in-page and assistive tech). The screen target (about one screen) was chosen
over the notch count; on desktop the hero action is the one-press route (it walks in to the form in 1.25s), and
the scroll cue under the photograph does the same. Real touch
drags (iPhone 13 profile, the `tools/touch2.js` pattern: 350px finger drags, no momentum): the first drag reaches
p ≈ 0.44 (doors open, walking in), the second the list title and field in view (the form at 97% opacity, 100%
a few pixels on); one swipe with momentum on a real phone covers both.

| Element (hook) | Role | p range | Motion | Curve |
|---|---|---|---|---|
| Text column: lockup, lede, status, action (`copy`) | Support, exits | 0 → 0.14 of min(r, p) | opacity 1 → 0, rises 16px; no pointer target below 50% | `--curve-copy` (0.33, 1, 0.68, 1) |
| Scroll cue (`cue`) | Decoration | 0 → 0.05 of min(r, p) | opacity 1 → 0; no pointer target below 50% | `--curve-copy` |
| Left / right leaf (`leaf-l`, `leaf-r`) | Lead, from the first pixel | 0 → 0.36 | `rotateY` 0 → +84° / −84° (`--open-door`) about the outer hinge, inwards, in the photo's perspective (0.987 of its height, from the hall point) | `--curve-door` (0.3, 0.55, 0.35, 1) |
| Leaf shade (`shade-l`, `shade-r`) | Support | 0 → 0.36 | opacity = sin(angle) of `--color-leaf-shade` (noite at 28% by day, 40% by night): brightness 1 − 0.28 / 0.40 · sin(angle) | `--curve-door` |
| Lamplight on the steps, Noite (`spill`) | Support, carried by the leaves | 0 → 0.36 | opacity (1 − cos angle) / (1 − cos 84°): it grows with the opening | `--curve-door` |
| Camera: pan (`camera`) | Lead | 0 → 0.30 | the hall point travels on a straight line to the screen's centre. Portrait screens (hall point below the centre): the rise follows the growth, a = (s − 1) × foot distance / rise, so the photo's foot holds at the visitor's feet and then leaves through the bottom edge; a eases into 1 with zero slope over [0.75, 1.25] (it was clipped at 1, a bob of the threshold mid walk-in: its speed changed by about 6px per 0.004 of progress, review r1; now under 1.2px at 390 × 844, 390 × 664, 430 × 932 and 768 × 1024, `src/tests/list.test.js` F), and combines with a smoothstep that centres it by p = 0.56 at the latest as 1 − (1 − a)(1 − b) | `--curve-pan` (0.35, 0.4, 0.3, 1); portrait: tied to the zoom |
| Camera: walk-in (`camera`) | Lead | 0.01 → 0.76 | scale 1 → S around the hall point, geometric, through four keyframes per screen (below) | monotone cubic on log(scale) |
| The hall (`plate`) | Depth | with the camera | its own `scale(s^(kp − 1))` inside the camera, so it grows as zoom^kp (kp 0.8): further away, it opens up behind the jambs | — |
| The hall's light (`flood`) | Arrival | 0.60 → 0.76 of max(r, p − 0.1) | `--color-hall` over the whole stage, opacity 0 → 1, only once the doorway covers the screen (never a veil over the stone); 1 from 0.76 on; the page behind the stage takes the colour too | `--curve-light` (0.55, 0, 0.75, 0.55): slow, then all at once |
| Waiting list: title, sentence, form (`list`) | Arrival | 0.745 → 0.88 / 0.75 → 0.90 / 0.755 → 0.94 of r | opacity 0 → 1 and 16px (the form 10px) of rise, on top of the scroll's own; no pointer target below 50% | `--ease-out` (0.23, 1, 0.32, 1) on p |

**The walk-in's keyframes** (`measure()`, per screen): log(scale) passes through 0 at p = 0.01; inDoor^0.3 at
p = 0.36 (the threshold, as the doors finish opening); inDoor at p = 0.58, the scale at which the doorway covers
the whole large viewport with the open leaves pushed out of frame; and S at p = 0.76, with a monotone cubic
(Fritsch–Carlson) between them: it never goes back, never overshoots, starts softly (zero slope) and does not land
(the screen is one colour by then, so the camera keeps going into the light).
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
how long each takes. In scroll terms: from one colour to a readable form about 0.13 of a screen; in the walk-in
on request about 250ms (title) and 300ms (form) from first showing to rest. It is never driven by an IntersectionObserver: wherever
the page rests past the end of the run (a reload or a restored position at the bottom, a jump, the end of a
short landscape page) the words are at rest and opaque (`src/tests/list.test.js` B: every rest position from
the flat moment to the end of the page, and a reload at the bottom, on 844 × 390, 932 × 430, 667 × 375, 720 × 450
(1440 × 900 at 200%), 390 × 844 and 1440 × 900).

The camera covers the screen with the doorway (p = 0.58) before the hall's light starts to fade in (0.60), so the
light only ever comes up over the soft hall and its arch of light, never over the stone; from 0.76 the frame is
the token (ΔRGB 0 on every pixel, nine aspect ratios, both themes: Colors › Surface). Before the photograph the
last part was a step of the flood over a flat drawn hall; a lossy photograph cannot hold the token, so it is now a
fade.

Which progress each layer reads: r, the rendered (smoothed) progress, except two groups. The text column and the
cue read min(r, p): they leave with the doors, but come back with the scroll itself, so after a fast flick to
the top the title is there as the page arrives (measured: within one frame of scrollY reaching 0 at 3000px/s).
The hand-off layers read max(r, p − 0.1): at hand speed (lag under 0.1) exactly r; after a fast fling the stage
is already one colour when the list panel arrives at p = 1, never a hard panel edge rising over a photograph the
smoothing has not caught up with (0 such frames at 3500px/s). The list reads r, so its words never show before
the hall's light.

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
  100svh probe), the pin offset for short screens, the timeline's start (the wrapper's top) and the run
  (`wrapper − stage`, plus the pre-pin stretch on short screens; stable while mobile toolbars come and go). It is
  re-measured on the events above, keeping the same progress.
- **The list stays at rest when the screen changes size under it** (review r1). The run is in svh, the scroll
  position is kept, so a resize used to land the page back in the door sequence with the list hidden: after a
  keyboard closed in a browser that resizes the page (Android in-app browsers), or a rotation round trip, the
  focused email field was at opacity 0 (375 × 667: p 0.60). Now (a) while a field of the list has the focus and
  only the height changed, the run keeps its length in px (`--porta-run` inline), so the list and the field do not
  move under a keyboard; it is let go when the focus leaves the list; (b) when the list was at rest and the screen's
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

  | Beat (from the first moving frame; rendered progress r) | 390 × 844 | 1440 × 900 |
  |---|---|---|
  | Doors open (84°, r = 0.36) | 0–400ms | 0–400ms |
  | The doorway covers the screen (r = 0.58) | 550ms | 567ms |
  | The screen is one colour (r = 0.76) | 783ms | 800ms |
  | The list's title: first showing → at rest | 750 → 1000ms (250ms) | 750 → 1000ms (250ms) |
  | The form: first showing → at rest | 767 → 1067ms (300ms) | 783 → 1067ms (283ms) |
  | The scroll lands; focus in the email field (`preventScroll`) | 1233ms; 1250ms | 1233ms; 1250ms |

  (`rv1m/flight.js` in the review notes, `shots/photoint-fix-r1/flight/`; the same in Dia and Noite and under
  4× CPU throttle; no frame over 50ms.)

- **Duration** `--dur-flight` 1250ms for the whole way from the rest state (it was 1500ms over a way twice as
  long, then 1200ms before the list was weighted: the 50ms keep the doors and the walk-in at their former pace);
  a shorter way is shorter (× √share, never under 35%). Measured travel 1.20–1.23s at 390 × 844 and 1440 × 900,
  Dia and Noite (`src/tests/cta.test.js` holds it to 1.1–1.3s). The list's part is 250ms (title) to 300ms (form)
  from first showing to rest, inside the 250–350ms the brief asks for.
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
  Only Chromium was measured here.
- No blend modes: the lamplight on the steps was first a layer with `mix-blend-mode: screen`; a blended layer reads
  its backdrop back in every composited frame (1440 × 900 Noite, 4× throttle: p95 33ms, frames of 83ms). It is now an
  RGBA overlay of one warm colour whose alpha was solved against the night facade itself (`photo/py/spill2.py`),
  so it looks the same (mean error 0.7 level, 99th percentile 10) and costs an opacity change.
- Images are decoded before they move: after the load, `img.decode()` on every layer of the shown theme (the
  lamplight included); a theme change decodes the other theme before it shows it.
- Crisp at rest: 250ms after the scroll rests mid-sequence (while the jambs are on screen, p < 0.58), the facade is
  handed back for one frame (it re-rasters crisp at the current zoom) and promoted again at that scale, so the
  next scroll starts without raster work. Inside the hall there is nothing to re-raster (the hall is out of focus).
- Crisp during the walk-in on request: during a flight, while the zoom grows past 2.2× the scale of the last raster
  and the jambs are still on screen (p < 0.58), the facade is handed back for one frame and promoted again: a fresh
  raster at the current zoom. A hand scroll keeps the raster it has while it moves and turns crisp when it rests.

### Other motion
| Token | Duration | Easing | Use |
|---|---|---|---|
| `--dur-theme` | 400ms | `--ease-out` (0.23, 1, 0.32, 1) | Dia ↔ Noite chosen by the visitor: View Transitions cross-fade; colour transitions as fallback (never on `[data-motion]` layers; no snapshot while the sequence is moving) |
| `--dur-sky` | 1400ms | `--ease-sky` (0.45, 0, 0.55, 1) | Dia ↔ Noite changed by the sun on its own (nobody pressed anything): slower and symmetric, the lamps come on rather than flash. While the sequence is moving it waits until the page rests; parked anywhere (the list included) it cross-fades |
| `--dur-state` | 200ms | `--ease-out` | form messages, checkbox tick (opacity + scale 0.8 → 1) |
| `--dur-out` / `--dur-success` | 160ms / 240ms | `--ease-out` | success: the controls give way, the sentence takes their place |
| `--dur-flight` | 1250ms (whole way) | `--curve-flight` (0.45, 0, 0.3, 1) over the weighted way (`--flight-weight` 2, `--flight-weight-list` 1.2) | the hero action and the scroll cue walk in through the door to the list |
| `--rise-list` | 16px of rise (the form 10px), on p 0.745 → 0.94 | `--ease-out` on p | the waiting list rises in on the light, with the scroll (no time-based entrance any more) |
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
- Keyboard: Enter or Space on the action plays the walk-in and lands in the email field; Tab from the action
  lands on the email field with the list in view at once; focusing anything in the pinned first screen
  mid-sequence rewinds to the rest state, so focus is never on an invisible element. A tap or a click never
  moves the page (Driver › Focus moves the page for the keyboard only).

### Measured
Playwright (headless Chromium, software raster), 4× CPU throttle via CDP, traced with CDP tracing
(devtools.timeline); frame intervals are `requestAnimationFrame` intervals counted while the page moves.
390 × 844 at DPR 3, 1440 × 900 at DPR 1, Dia and Noite.

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
| photograph (alt) | Entrada em arco de pedra calcária com portas duplas de madeira, bandeira em leque, lanterna de parede e uma oliveira num vaso de barro. | Limestone arched entrance with double wooden doors, a fanlight, a wall lantern and an olive tree in a clay pot. |
| footer | © 2026 A Brazileira · Torres Vedras, Portugal · Privacidade | … · Privacy |
| sun note | É dia em Torres Vedras. · É noite em Torres Vedras. | It is daytime in Torres Vedras. · It is night in Torres Vedras. |
| 404 | Esta página não existe. · Voltar ao início | This page does not exist. · Back to home |

The only contact on the site is inn@abrazileira.com (privacy notice, the no-JS line and the send error).
The round 3 copy changes (sun note, success, send error, button label) are new pt-PT lines: they need the client's
sign-off.
Open Graph: `assets/img/og.jpg`, 1200 × 630, 58 KB, Noite: the lockup (its line on two lines at 23px, 0.36em,
so it still reads at about 10px when a link preview shows the card 500px wide) and the photograph of the entrance (doors
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
  `assets/` with the emblem, fonts, icons, favicon, og.jpg and `photo/` (the layers per theme, AVIF + WebP, and
  photo.json), `tests/`). `python3 src/build.py` rebuilds `docs/` completely with Python 3 alone; every path is
  relative to `build.py`, nothing is read from outside `src/`. `photo.py` turns photo.json into the markup (see
  Components › entrance); the photo files are encoded once by the asset pipeline and copied as they are (the build
  needs no image library and is deterministic). The caderno drawing's generators (`scene.py`, `hand.py`) and every
  rule and token that drew it (`.k*`, `.w-*`, `--pen-*`, `--ink-*`, `--w-*`, `--i-*`, the hall's SVG layers, the
  load animation) are gone.
- Photo asset pipeline (outside the site, in the working notes `photo/py/`; Python with numpy, OpenCV and Pillow
  with AVIF): `masks`, `grade`, `build_dia`, `night`, `build_noite`, `export` (the first pass), then for this
  integration `plate2` (the hall), `export2` (plate files, LQIPs), `facade2` (the elliptical edge), `spill2` (the
  lamplight as an RGBA overlay), and `photoint-tools/ship_assets.py`, which copies the files the page uses into
  `src/assets/photo/` and writes photo.json.
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
  the photograph's foot is inside the first screen and the cue is never sliced) and `node
  src/tests/list.test.js docs` (50 checks: a tap or a click on the email field or the button never moves the
  page, at three rest positions on 390 × 844 and 375 × 667 by touch and 1440 × 900 and 1280 × 720 by mouse, and the
  button's first press runs the validation; the list's words are never invisible on the flat colour and are at
  rest after a reload at the bottom, on six screens including 844 × 390 and 1440 × 900 at 200%; the scroll to the
  readable form is 0.9–1.2 screens on six viewports; the send error carries the mailto link and the success line
  sits where the field was, PT and EN; the sun note shows on phones, in EB Garamond, with dark mode not overriding
  the sky, clear of the crest at five sizes). `src/tests/png.js` decodes the screenshots (Node's zlib only).
- Output: `docs/index.html`, `docs/en/index.html`, `docs/privacidade/index.html`, `docs/en/privacy/index.html`,
  `docs/404.html`, `docs/design/index.html` (noindex, unlinked styleguide), `assets/css/tokens.css`,
  `assets/css/site.css`, `assets/js/site.js`, fonts, images, `assets/photo/{dia,noite}/` (72 files), `favicon.svg`, `robots.txt`, `sitemap.xml` (home
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
- Budget, measured on the home page with gzip -9 (fonts as shipped, photo excluded): 72.7 kB — HTML 11.6, CSS
  11.0 (tokens 5.4 with the two LQIPs and the fallback faces, site 5.6), JS 10.1, fonts 40.0 (Brazileira Wordmark
  3.0, Cinzel capitals 6.0, EB Garamond 400 15.0 and 500 15.9; the pitch typography replaced 62.2 kB of Cinzel and
  Alegreya files, 94.2 kB before); target 150 kB, ceiling 170 kB (og and icons excluded). The privacy notice is
  6.9 kB of HTML (68.0 kB in all).
  The photo is counted on its own (Components › entrance › Budgets: 98 KB by day, 47 KB by night on a 3× phone).
  The HTML lost the inline SVG drawing (it was most of the page) and gained a `<picture>` per layer and theme. CLS 0
  on every page (the photograph's boxes are sized by CSS; the wrapper grows below the fold).

## Responsive behavior

| Name | Query | Key changes |
|---|---|---|
| Stacked (default) | portrait, below 900px | lockup · lede · status · action, then the photograph at the foot (door axis on the page axis, its faded top may rise 5% into the space under the action), then the cue band |
| Tight portrait | `(orientation: portrait) and (max-height: 42.5em)` (≤ 680px tall) | top bar inset 4px, lede 16px above, action 8px under the status, 16px between the action and the photograph, compact cue band |
| Very short portrait | `(orientation: portrait) and (max-height: 37.5em)` (≤ 600px tall) | lockup at its 24px minimum, lede 12px above, no cue band, the photograph takes the height that is left (door and steps in the first screen) |
| Split | `(min-width: 56.25em), (orientation: landscape) and (min-width: 37.5em)` | 5fr text \| 6fr entrance, 64px apart, container 86rem; lede 48px under the lockup; action 48px under the status; top bar inset follows the container |
| Short landscape | `(orientation: landscape) and (max-height: 31.25em)` | compact split: wordmark 30–36px (its line on two lines), lede 19px, status 4px under it, action right under it, entrance min 16rem |
| Action steps | `(min-width: 56.25em)`; `(min-width: 75em)` | the action and the button 19px; then 21px |
| Lockup line | `(min-width: 64em) and (min-height: 43.75em)`, then `@container (min-width: 5.3em) and (min-width: 19.5rem)` on the lockup | home only: BOUTIQUE HOTEL · TORRES VEDRAS on one line, as on the pitch, where it is at most 0.9 of the wordmark's width (0.84 at 1024 × 700, 0.81 from 1280) and fits the column (two lines everywhere else, and with enlarged text) |
| Footer lines | `(max-width: 29.99em)` | name, place and link on three lines, no separators |
| Narrow PT lede | `(min-width: 20em) and (max-width: 22.49em)` (and small landscape phones) | the Portuguese lede one phrase a line (a plain wrap at 14.4em) |
| Sun note | every width; `(min-width: 56.25em) and (min-height: 37.5em)` | its own line under Dia · Noite; the stage clears it by 12px (`--sol-h`) except on screens from 900 × 600, where the crest is far below |
| Wide | `(min-width: 120em)`; `(min-width: 160em)` | root 112.5%; 131.25% (everything scales together) |
| Large text | any width, browser text size 150–200% | the top bar wraps instead of overflowing; the list column shrinks to the screen (minmax(0, 1fr)) and long words wrap |

Touch targets: 44px for every control and link (the inline privacy link reaches 44px into the space below its
line); the field and the button are 48px. Nothing collapses into a menu: there are only two controls.

## Do's and Don'ts

Do:
- Use the pitch's lockup exactly (emblem.svg, the Brazileira Wordmark file, Cinzel capitals for its line), with the wordmark at 30px or more.
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
- Let the photograph read as a rectangle: its margin converges to the page colour.
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

## Agent prompt guide
- Canvas papel #F9F0E9 / noite #1C120B · hall #F2DEC4 / #FCE7BC · text nogueira #5F3819 / linho #F3E6D6 ·
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
  with little GPU memory may need the promotion list trimmed (11 layers, each the photograph's box or smaller).
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
