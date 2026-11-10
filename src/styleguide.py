"""docs/design/index.html: a small, unlinked, noindex styleguide that renders the real tokens and components."""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))


def primitives():
    css = open(os.path.join(HERE, "tokens.tpl.css"), encoding="utf-8").read()
    out = []
    for name, hexv, note in re.findall(r"--([a-z-]+):\s*(#[0-9A-Fa-f]{6});\s*/\*\s*([^*]*?)\s*\*/", css):
        out.append((name, hexv.upper(), note))
    return out


def lum(h):
    h = h.lstrip("#")
    r, g, b = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    f = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)


def ratio(a, b):
    la, lb = lum(a), lum(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)


def mix(a, b, t):
    """CSS color-mix(in srgb, a t, b): gamma-encoded linear interpolation."""
    a, b = a.lstrip("#"), b.lstrip("#")
    return "#" + "".join(f"{round(int(a[i:i + 2], 16) * t + int(b[i:i + 2], 16) * (1 - t)):02X}" for i in (0, 2, 4))


def pairs():
    P = dict((n, h) for n, h, _ in primitives())
    # the hall tokens are stored as exact hex; they must stay the mixes they were derived from
    assert P["sala-dia"] == mix(P["latao"], P["papel"], 0.22) and P["sala-noite"] == mix(P["luz-nucleo"], P["luz"], 0.72)
    # the page is the wall (parede / parede-noite); every pair must hold AA there
    dia = [("Logótipo · wordmark e a sua linha (Verde-tinta)", "verde-tinta", "parede", "texto"),
           ("Texto forte · ação, controlo atual", "tinta", "parede", "texto"),
           ("Texto · lede", "nogueira", "parede", "texto"),
           ("Texto discreto · controlos, rodapé", "castanho", "parede", "texto"),
           ("Latão-texto · estado", "latao-texto", "parede", "texto"),
           ("Brasão · ouro, paragem escura (o corpo vai de 1,56 a 3,09:1; decorativo: o nome é texto)", "ouro-escuro", "parede", "decorativo"),
           ("Foco · linha do chão", "nogueira", "parede", "não-texto mín. 3:1")]
    noite = [("Texto · wordmark, rótulos, lede", "linho", "parede-noite", "texto"),
             ("Texto discreto · controlos, rodapé", "linho-escuro", "parede-noite", "texto"),
             ("Latão · estado, foco", "latao", "parede-noite", "texto"),
             ("Brasão · ouro, paragem clara", "ouro-claro", "parede-noite", "gráfico mín. 3:1"),
             ("Brasão · ouro, paragem média", "ouro", "parede-noite", "gráfico mín. 3:1"),
             ("Brasão · ouro, paragem escura", "ouro-escuro", "parede-noite", "gráfico mín. 3:1")]
    hall = []
    for h in ("sala-dia", "sala-noite"):
        hall += [("Título, rótulos, ligações · " + h, "tinta", h, "texto"),
                 ("Texto · " + h, "nogueira", h, "texto"),
                 ("Rodapé · " + h, "castanho", h, "texto"),
                 ("Erro · " + h, "barro", h, "texto"),
                 ("Borda do campo, foco · " + h, "nogueira", h, "não-texto mín. 3:1")]
    hall += [("Texto do botão", "papel", "tinta", "texto"), ("Texto no campo · Dia", "tinta", "papel", "texto"),
             ("Texto no campo · Noite", "tinta", "luz-nucleo", "texto"), ("Borda do campo · Noite", "nogueira", "luz-nucleo", "não-texto mín. 3:1")]
    rows = []
    for theme, lst in (("Dia", dia), ("Noite", noite), ("Sala (lista)", hall)):
        for label, fg, bg, use in lst:
            rows.append((theme, label, fg, P[fg], bg, P[bg], ratio(P[fg], P[bg]), use))
    return rows


def render(crest_svg, scene_markup, lockup_html, T=None, waitlist=None, theme_head="", photo=None, wordmark=None,
           crest_defs=None, monogram_svg=None):
    prims = primitives()
    wm = wordmark() if wordmark else ""
    wm_small = wm.replace('class="lockup__name" ', '', 1)      # the drawing alone, sized by its wrapper
    wm_type = wm
    # the form copies link to the real notice: from /design/ that is one level up
    T_sg = dict(T["pt"], privacy_href="../" + T["pt"]["privacy_href"])
    sw = "\n".join(
        f'<li class="sg-sw"><span class="sg-chip" style="background:var(--{n})"></span>'
        f'<span class="sg-sw__name">--{n}</span><span class="sg-sw__hex">{h}</span><span class="sg-sw__note">{note}</span></li>'
        for n, h, note in prims)
    rows = "\n".join(
        f"<tr><td>{t}</td><td>{label}</td><td><code>--{fg}</code> {fh}</td><td><code>--{bg}</code> {bh}</td>"
        f"<td class=\"sg-num\">{r:.2f}:1</td><td>{use}</td></tr>"
        for t, label, fg, fh, bg, bh, r, use in pairs())
    scene_d, style_d = scene_markup("../", motion=False)
    scene_n, style_n = scene_d, style_d
    space = "\n".join(
        f'<li><span class="sg-bar" style="inline-size:var(--space-{i})"></span><code>--space-{i}</code> {px}px</li>'
        for i, px in zip(range(1, 10), (4, 8, 12, 16, 24, 32, 48, 64, 96)))


    def photo_state(theme, scene_html, style, state, caption):
        return (f'<figure class="sg-open sg-open--{state}" data-theme="{theme}"><div class="entrance sg-entrance" aria-hidden="true" style="{style}">'
                f'{scene_html}</div><figcaption>{theme.capitalize()} · {caption}</figcaption></figure>')

    # the layers of each theme, their files and weights (photo.json): what the page ships
    def layer_rows():
        out = []
        names = {"facade": "Fachada (porta transparente)", "leaf-l": "Folha esquerda", "leaf-r": "Folha direita",
                 "plate": "Sala (vestíbulo desfocado)", "reveal": "Sombra da ombreira", "spill": "Luz nos degraus (Noite)"}
        for th in ("dia", "noite"):
            for name, files in photo.P["layers"][th].items():
                ws = " · ".join(f"{f['px'][0]}×{f['px'][1]}: {f['avif'] / 1024:.1f} / {f['webp'] / 1024:.1f}" for f in files)
                out.append(f"<tr><td>{th.capitalize()}</td><td>{names[name]}</td><td class=\"sg-num\">{ws}</td></tr>")
        return "\n".join(out)
    fp = {t: [photo.bytes_first_paint(t, w) / 1024 for w in (720, 1080, 1600)] for t in ("dia", "noite")}

    def form_state(theme, state, k, label):
        """The real waiting-list form (from build.waitlist), with unique ids and a fixed state."""
        html = waitlist(T_sg)
        f = html[html.index("<form"):html.index("</form>") + 7].replace(' aria-describedby="lista-lede"', "")
        for i in ("email", "consent", "website", "email-msg", "consent-msg"):
            for attr in ("id", "for"):
                f = f.replace(f'{attr}="{i}"', f'{attr}="{i}-{k}"')
        f = f.replace("data-waitlist ", "").replace('<fieldset class="form__set" disabled>', '<fieldset class="form__set">')
        f = f.replace('class="form"', f'class="form" data-state="{state}"', 1)
        if state == "invalid":
            f = f.replace(f'id="email-{k}" type="email"', f'id="email-{k}" type="email" aria-invalid="true" aria-describedby="email-msg-{k}" value="nome@"')
            f = f.replace(f'<p class="field__msg" id="email-msg-{k}" hidden></p>', f'<p class="field__msg" id="email-msg-{k}">Verifique o email.</p>')
            f = f.replace(f'id="consent-{k}" type="checkbox"', f'id="consent-{k}" type="checkbox" aria-invalid="true" aria-describedby="consent-msg-{k}"')
            f = f.replace(f'<p class="field__msg" id="consent-msg-{k}" hidden></p>', f'<p class="field__msg" id="consent-msg-{k}">Confirme que aceita receber emails.</p>')
        if state in ("sending", "error"):
            f = f.replace(f'id="email-{k}" type="email"', f'id="email-{k}" type="email" value="nome@example.com"')
            f = f.replace(f'id="consent-{k}" type="checkbox"', f'id="consent-{k}" type="checkbox" checked')
        if state == "nojs":
            f = f.replace('<fieldset class="form__set">', '<fieldset class="form__set" disabled>')
            f += ('<p class="lista__noscript">Para se inscrever, ative o JavaScript ou escreva para '
                  '<a class="link-inline" href="mailto:inn@abrazileira.com">inn@abrazileira.com</a>.</p>')
        if state == "sending":
            f = f.replace('<button class="button" type="submit">', '<button class="button" type="submit" aria-disabled="true">')
        msg = {"error": "Não foi possível enviar. Tente de novo dentro de momentos ou escreva para "
                        '<a class="link-inline" href="mailto:inn@abrazileira.com">inn@abrazileira.com</a>.',
               "done": "Obrigado. Já está na lista."}.get(state, "")
        f = f.replace('<p class="form__msg" role="status" tabindex="-1"></p>', f'<p class="form__msg" role="status" tabindex="-1">{msg}</p>')
        if state == "done":
            f = f.replace('class="form" data-state="done"', 'class="form" data-state="done" style="min-block-size:21rem"')
        return f'<div class="sg-form surface-hall"><p class="sg-tag">{label}</p>{f}</div>'

    states = [("idle", "Em repouso"), ("invalid", "Erro de validação (foco no primeiro campo)"), ("sending", "A enviar (botão inativo)"),
              ("done", "Enviado"), ("error", "Erro de envio"), ("nojs", "Sem JavaScript (inativo, com o email de contacto)")]
    # the row caption sits on the page's own ground (outside the themed row), so it always reads in the page theme
    forms = "\n".join(
        f'<p class="sg-tag sg-tag--row">{th.capitalize()} · superfície da sala <code>--color-hall</code></p>'
        f'<div class="sg-forms" data-theme="{th}">'
        + "".join(form_state(th, st, f"{th}{i}", lab) for i, (st, lab) in enumerate(states)) + "</div>"
        for th in ("dia", "noite"))

    timeline = [
        ("Texto (lockup, frase, estado, ação)", "Apoio, sai", "0 a 0.14", "opacidade 1 a 0, sobe 16px", "--curve-copy (0.33, 1, 0.68, 1)"),
        ("Indicador de deslizar", "Decoração", "0 a 0.05", "opacidade 1 a 0", "--curve-copy"),
        ("Folhas da porta", "Principal, desde o primeiro píxel", "0 a 0.36", "rodam para dentro sobre as dobradiças exteriores, de fechadas a 84°, na perspetiva da fotografia; escurecem com o seno do ângulo", "--curve-door (0.3, 0.55, 0.35, 1)"),
        ("Luz nos degraus (Noite)", "Apoio, levada pelas folhas", "0 a 0.36", "opacidade 0 a 1 com a abertura (1 − cos do ângulo)", "--curve-door"),
        ("Câmara: centrar o ponto de fuga", "Principal", "0 a 0.30", "translação em linha reta até ao centro do ecrã; em ecrãs ao alto a subida acompanha o crescimento (o pé da fotografia fica aos pés de quem entra e sai pela margem de baixo)", "--curve-pan (0.35, 0.4, 0.3, 1); ao alto, presa ao zoom"),
        ("Câmara: entrar", "Principal", "0.01 a 0.76", "escala geométrica por quatro pontos (1; o limiar quando as portas acabam de abrir; a porta cobre o ecrã aos 0.58; dentro do arco de luz ao fundo aos 0.76); a sala cresce como zoom<sup>0,8</sup>; curva monótona que começa suave e não trava", "cúbica monótona sobre log(escala), por ecrã"),
        ("A luz da sala", "Apoio, chegada", "0.60 a 0.76", "uma camada lisa --color-hall sobre todo o palco, opacidade 0 a 1, depois de a porta cobrir o ecrã: a câmara entra na luz e o fim é o próprio token (ΔRGB 0)", "--curve-light (0.55, 0, 0.75, 0.55)"),
        ("Lista de espera", "Chegada", "0.745 a 0.94", "título, frase e formulário começam juntos quando o ecrã é uma só cor e assentam um a seguir ao outro (0.88, 0.90, 0.94): opacidade 0 a 1, sobem 16px (o formulário 10px) além do próprio scroll; em repouso no fim do percurso", "--ease-out sobre p"),
    ]
    trows = "\n".join(f"<tr><td>{a}</td><td>{b}</td><td class=\"sg-num\">{c}</td><td>{d}</td><td>{e}</td></tr>" for a, b, c, d, e in timeline)

    def circle(ground, variant):
        """the circle application: a ground, a ring (gold; white on black) and the crest at 0.7. On the light
        grounds the disc is flat and ends at the ring's outer edge; on the deep green and the brown the gold ring is
        outermost, a thin light gap inside it, then the disc, and the gold is a step lighter (--ouro-vivo-*: the day
        gold went muddy there)"""
        crest = crest_svg("sg", defs=False, variant=variant, bare=True)
        if ground in ("verde", "castanho"):
            crest = crest.replace("url(#sg-g)", "url(#sg-gv)")
            disc, ring = 48.35, 49.3
        elif ground == "preto":
            disc, ring = 49.6, 48.9
        else:
            disc, ring = 49.75, 49.3
        return (f'<svg class="sg-circle sg-circle--{ground}" viewBox="0 0 100 100" role="img" aria-label="A Brazileira">'
                f'<circle class="sg-circle__fundo" cx="50" cy="50" r="{disc:g}"/><circle class="sg-circle__anel" cx="50" cy="50" r="{ring:g}"/>'
                f'<g transform="matrix(.7 0 0 .7 14.14 11.6)">{crest}</g></svg>')

    def mins(theme, caption):
        """the minimum sizes, the same five items and captions by day and by night (so the two cards wrap alike)"""
        return (f'<figure class="sg-logo" data-theme="{theme}"><div class="sg-mins">'
                f'<figure>{lockup_html("p", "sg", defs=False)}<figcaption>vertical no mínimo: 30px (W 162px)</figcaption></figure>'
                f'<figure><span class="sg-wm" style="inline-size:140px">{wm_small}</span><figcaption>letras sozinhas: 140px</figcaption></figure>'
                f'<figure><span style="inline-size:48px;display:block">{crest_svg("sg", defs=False)}</span><figcaption>brasão: 48px</figcaption></figure>'
                f'<figure><span style="inline-size:24px;display:block">{monogram_svg("sg")}</span><figcaption>monograma: 24px</figcaption></figure>'
                f'<figure><img src="../favicon.svg" width="16" height="16" alt=""><figcaption>favicon: 16px</figcaption></figure>'
                f'</div><figcaption>{caption}</figcaption></figure>')

    def panel(theme, scene_html, style, day, night):
        pressed_d = "true" if theme == "dia" else "false"
        pressed_n = "true" if theme == "noite" else "false"
        return f"""<section class="sg-panel" data-theme="{theme}" aria-label="{theme.capitalize()}">
<p class="sg-tag">{theme.capitalize()}</p>
<div class="sg-panel__grid">
<div class="sg-panel__text">
{lockup_html('p', 'sg', defs=False)}
<p class="lede">Brevemente, abrimos as portas.</p>
<p class="cta-row"><a class="cta" href="#sg-lista">Entrar na lista de espera</a></p>
<div class="sg-controls">
<div class="controls" role="group" aria-label="Tema (exemplo)"><button class="ctl" type="button" aria-pressed="{pressed_d}">Dia</button><span class="controls__sep" aria-hidden="true">·</span><button class="ctl" type="button" aria-pressed="{pressed_n}">Noite</button></div>
<div class="controls"><a class="ctl" href="#" aria-current="page">PT</a><span class="controls__sep" aria-hidden="true">·</span><a class="ctl" href="#">EN</a></div>
</div>
<p class="sg-foot">© 2026 A Brazileira · Torres Vedras, Portugal</p>
</div>
<div class="entrance sg-entrance" aria-hidden="true" style="{style}">
{scene_html}
</div>
</div>
</section>"""

    return f"""<!doctype html>
<html lang="pt-PT">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
{theme_head}
<title>Sistema de design · A Brazileira</title>
<meta name="robots" content="noindex, nofollow">
<meta name="color-scheme" content="light dark">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="../assets/css/tokens.css">
<link rel="stylesheet" href="../assets/css/site.css">
<style>
body {{ display: block; font-size: var(--size-ui); }}
.sg {{ max-inline-size: var(--container); margin-inline: auto; padding: var(--space-7) max(var(--gutter), env(safe-area-inset-left)) var(--space-9); }}
.sg h1, .sg h2 {{ margin: 0; font-family: var(--font-title); font-weight: var(--weight-text); letter-spacing: var(--track-lede); color: var(--color-text-strong); }}
.sg h1, .sg h2 {{ font-size: var(--size-title); line-height: var(--leading-title); letter-spacing: var(--track-title); }}
.sg h2 {{ margin-block: var(--space-8) var(--space-4); padding-block-start: var(--space-4); border-block-start: var(--hairline) solid var(--color-ground); }}
:where(.sg) p, :where(.sg) ul {{ margin: 0; }}
.sg-intro {{ display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-6); }}
.sg-intro .lockup {{ font-size: var(--size-lockup-min); }}
.sg-intro p + p {{ margin-block-start: var(--space-2); color: var(--color-text-muted); }}
.sg-note {{ max-inline-size: var(--measure-read); font-family: var(--font-text); font-weight: var(--weight-text); font-size: var(--size-read); line-height: var(--leading-read); letter-spacing: 0; font-variant-numeric: var(--num-text); color: var(--color-text); text-wrap: pretty; }}
.sg-sws {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr)); gap: var(--space-4); padding: 0; list-style: none; }}
.sg-sw {{ display: grid; grid-template-columns: var(--space-8) 1fr; column-gap: var(--space-3); align-items: center; }}
.sg-chip {{ grid-row: span 3; block-size: var(--space-8); border: var(--hairline) solid var(--color-ground); }}
.sg-sw__name {{ color: var(--color-text-strong); }}
.sg-sw__hex, .sg-sw__note {{ font-size: var(--size-ui); color: var(--color-text-muted); }}
.sg-panels {{ display: grid; gap: var(--space-5); }}
.sg-panel {{ background: var(--color-bg); color: var(--color-text); border: var(--hairline) solid var(--color-ground); padding: var(--space-5); }}
.sg-tag {{ color: var(--color-text-muted); margin-block-end: var(--space-4); }}
.sg-panel__grid {{ display: grid; gap: var(--space-6); align-items: end; }}
.sg-panel__text {{ display: flex; flex-direction: column; align-items: center; text-align: center; }}
.sg-panel .lockup {{ font-size: var(--size-lockup-plain); }}
.sg-controls {{ display: flex; justify-content: center; flex-wrap: wrap; gap: var(--space-5); margin-block-start: var(--space-5); }}
.sg-foot {{ margin-block-start: var(--space-4); font-size: var(--size-ui); color: var(--color-text-muted); }}
.sg-entrance {{ flex: none; block-size: 26rem; max-block-size: none; margin: 0; overflow: clip; }}
.sg-opens {{ display: grid; gap: var(--space-5); grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr)); }}
.sg-open {{ margin: 0; padding: var(--space-5); background: var(--color-bg); color: var(--color-text-muted); border: var(--hairline) solid var(--color-ground); font-size: var(--size-ui); }}
.sg-open .sg-entrance {{ block-size: 20rem; margin-block-end: var(--space-3); }}
.sg-open--open .leaf--l {{ transform: rotateY(var(--open-door)); }}
.sg-open--open .leaf--r {{ transform: rotateY(calc(var(--open-door) * -1)); }}
.sg-open--open .leaf__shade {{ opacity: 0.99; }}
.sg-open--open .ph--spill {{ display: var(--t-spill); opacity: 1; }}
.sg-open--hall .scene {{ transform: scale(2.5); }}
.sg-open--hall .ph--plate {{ transform: scale(0.833); }}   /* 2.5^0.8 / 2.5: the hall grows slower than the doorway */
.sg-open--hall .leaf--l {{ transform: rotateY(var(--open-door)); }}
.sg-open--hall .leaf--r {{ transform: rotateY(calc(var(--open-door) * -1)); }}
.sg-forms {{ display: grid; gap: var(--space-4); grid-template-columns: repeat(auto-fill, minmax(min(100%, var(--measure-form)), 1fr)); margin-block-end: var(--space-5); }}
.sg-tag--row {{ margin-block: var(--space-6) var(--space-3); }}
.sg-states {{ display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-5); padding: var(--space-5); border: var(--hairline) solid var(--color-ground); }}
.sg-states .is-focus {{ outline: var(--focus-width) solid var(--color-focus); outline-offset: var(--focus-offset); border-radius: var(--radius-focus); }}
.sg-states .is-hover {{ color: var(--color-text-strong); text-decoration-color: currentColor; }}
.sg-states .skip {{ position: static; transform: none; }}
.sg-states figure {{ margin: 0; display: grid; justify-items: center; gap: var(--space-2); color: var(--color-text-muted); }}
.sg-form {{ padding: var(--space-5); color: var(--color-text); }}
.sg-form .form {{ margin: 0; }}
@media (min-width: 56.25em) {{ .sg-panel__grid {{ grid-template-columns: 1fr 1fr; }} .sg-panels {{ grid-template-columns: 1fr; }} }}
.sg table {{ inline-size: 100%; border-collapse: collapse; font-size: var(--size-ui); }}
.sg th, .sg td {{ text-align: start; padding: var(--space-2) var(--space-3) var(--space-2) 0; border-block-end: var(--hairline) solid var(--color-surface); vertical-align: top; }}
.sg th {{ font-weight: var(--weight-ui); color: var(--color-text-strong); }}
.sg-num {{ font-variant-numeric: lining-nums; color: var(--color-text-strong); }}
.sg-scroll {{ overflow-x: auto; }}
.sg-h2 {{ font-family: var(--font-label); font-weight: var(--weight-label); letter-spacing: var(--track-section); text-transform: uppercase; color: var(--color-text-strong); }}
.sg-scroll:focus-visible {{ outline-offset: var(--space-1); }}
.sg-type li {{ display: grid; gap: var(--space-1); padding-block: var(--space-4); border-block-end: var(--hairline) solid var(--color-surface); }}
.sg-type small {{ font-size: var(--size-ui); color: var(--color-text-muted); }}
.sg-type ul, .sg-space, .sg-rules {{ padding: 0; list-style: none; }}
.sg-space li {{ display: flex; align-items: center; gap: var(--space-3); padding-block: var(--space-1); }}
.sg-bar {{ block-size: var(--space-3); background: var(--color-text-muted); }}
.sg-rules li {{ padding-block: var(--space-2); border-block-end: var(--hairline) solid var(--color-surface); max-inline-size: 48em; }}
.crest-defs {{ position: absolute; inline-size: 0; block-size: 0; overflow: hidden; }}
.sg-logos {{ display: grid; gap: var(--space-5); grid-template-columns: repeat(auto-fit, minmax(min(100%, 30rem), 1fr)); margin-block-start: var(--space-5); }}
.sg-logo {{ margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: space-between; gap: var(--space-5); padding: var(--space-6) var(--space-4) var(--space-4); background: var(--color-bg); color: var(--color-text-muted); border: var(--hairline) solid var(--color-ground); font-size: var(--size-ui); text-align: center; }}
.sg-logo .lockup {{ font-size: min(4rem, 8.5vw); }}
/* clear space: the height of the wordmark's capitals (0.096 W) on every side, drawn as a dashed edge */
.sg-clear {{ box-sizing: content-box; padding: calc(var(--lockup-wordmark) * 0.096); outline: var(--hairline) dashed var(--color-ground); }}
/* the crest's variants, each on its own ground (tokens): the tile's ground is also the colour the one-ink crest's
   leaf veins are cut in (--crest-ground) */
.sg-ids {{ display: grid; gap: var(--space-4); grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr)); margin-block: var(--space-3) var(--space-5); }}
.sg-id {{ margin: 0; display: grid; grid-template-rows: 1fr auto; justify-items: center; align-items: center; gap: var(--space-3); padding: var(--space-5) var(--space-4) var(--space-3); border: var(--hairline) solid var(--color-ground); background: var(--sg-ground); color: var(--sg-ink, var(--verde-tinta)); --crest-ground: var(--sg-ground); }}
.sg-id figcaption {{ font-size: var(--size-ui); color: var(--sg-cap, var(--castanho)); text-align: center; }}
.sg-id .crest {{ display: block; inline-size: min(100%, 11rem); block-size: auto; }}
.sg-id .monogram {{ inline-size: 4.5rem; }}
.sg-id--branco {{ --sg-ground: var(--branco); --sg-ink: var(--preto); }}
.sg-id--marfim {{ --sg-ground: var(--marfim); }}
.sg-id--preto {{ --sg-ground: var(--preto); --sg-ink: var(--branco); --sg-cap: var(--linho-escuro); }}
.sg-circles {{ grid-template-columns: repeat(auto-fill, minmax(min(100%, 11rem), 1fr)); }}
.sg-circle {{ display: block; inline-size: min(100%, 9.5rem); block-size: auto; overflow: visible; }}
.sg-circle__fundo {{ fill: var(--c-ground); }}
.sg-circle__anel {{ fill: none; stroke: url(#sg-g); stroke-width: 0.9; }}
.sg-circle--marfim {{ --c-ground: var(--marfim); --crest-ground: var(--marfim); }}
.sg-circle--branco {{ --c-ground: var(--branco); }}
.sg-circle--verde {{ --c-ground: var(--verde-fundo); }}
.sg-circle--castanho {{ --c-ground: var(--castanho-fundo); }}
.sg-circle--preto {{ --c-ground: var(--preto); --crest-ground: var(--preto); color: var(--branco); }}
.sg-circle--preto .sg-circle__anel {{ stroke: var(--branco); }}
.sg-circle--verde .sg-circle__anel, .sg-circle--castanho .sg-circle__anel {{ stroke: url(#sg-gv); }}
.sg-s-vivo1 {{ stop-color: var(--ouro-vivo-claro); }}
.sg-s-vivo2 {{ stop-color: var(--ouro-vivo); }}
.sg-s-vivo3 {{ stop-color: var(--ouro-vivo-escuro); }}
/* the horizontal version: crest | a hairline | the wordmark over its line. W (--w) drives it, in fixed ratios
   (crest 0.391 W wide, the rule 0.208 W tall, 0.038 W after the crest and 0.068 W before the letters) */
.lockup-h {{ --w: max(12.5rem, min(26rem, 52vw)); display: flex; align-items: center; max-inline-size: 100%; overflow-x: auto; color: var(--color-brand-ink); }}   /* never under its minimum (W 200px): on a narrow phone it slides in its card */
.lockup-h > * {{ flex: none; }}
.lockup-h .lockup__crest {{ inline-size: calc(var(--w) * 0.391); flex: none; }}
.lockup-h__rule {{ flex: none; inline-size: 0; block-size: calc(var(--w) * 0.208); margin-inline: calc(var(--w) * 0.038) calc(var(--w) * 0.068); border-inline-start: var(--hairline) solid color-mix(in srgb, currentColor 40%, transparent); }}
.lockup-h__words {{ inline-size: var(--w); container-type: inline-size; display: flex; flex-direction: column; align-items: center; }}
.lockup-h .lockup__name {{ margin: 0; }}
.sg-mins {{ display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: center; gap: var(--space-6); }}
.sg-mins figure {{ margin: 0; display: grid; justify-items: center; gap: var(--space-2); }}
.sg-mins .lockup {{ font-size: var(--size-lockup-min); }}
.sg-mins .crest {{ display: block; inline-size: 100%; block-size: auto; }}
.sg-wm {{ display: block; color: var(--color-brand-ink); }}
.sg-wm svg {{ display: block; inline-size: 100%; block-size: auto; }}
.sg-idsw {{ display: flex; flex-wrap: wrap; gap: var(--space-3) var(--space-5); padding: 0; margin-block: var(--space-3) var(--space-5); list-style: none; }}
.sg-idsw li {{ display: flex; align-items: center; gap: var(--space-2); }}
.sg-idsw .sg-chip {{ inline-size: var(--space-6); block-size: var(--space-6); }}
code {{ font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace; font-size: 0.875em; }}   /* this page only: token names */
</style>
</head>
<body>
{crest_defs("sg")}
<svg class="crest-defs" width="0" height="0" aria-hidden="true" focusable="false"><defs><linearGradient id="sg-gv" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="35.86" y2="100"><stop offset="0" class="sg-s-vivo1"/><stop offset=".45" class="sg-s-vivo2"/><stop offset="1" class="sg-s-vivo3"/></linearGradient></defs></svg>
<main class="sg">
<header class="sg-intro">
{lockup_html('p', 'sg', defs=False)}
<div><h1>Sistema de design · v1.0</h1><p>Página interna, não indexada nem ligada ao site. Mostra os tokens e componentes reais (tokens.css, site.css).</p></div>
</header>

<h2>Logótipo</h2>
<p class="sg-note">A identidade: o brasão (a coroa de cinco pontas com folhas e pérolas na banda, o escudo de contorno duplo com os ombros enrolados, o monograma B com o gancho da haste, entre dois ramos de oliveira), o lettering «A Brazileira» e BOUTIQUE HOTEL em capitais espaçadas. Tudo desenhado à mão em vetores. Um só desenho do brasão por página: as variantes abaixo reutilizam-no, e todas as cores são tokens.</p>
<ul class="sg-idsw">
<li><span class="sg-chip" style="background:linear-gradient(160deg, var(--ouro-claro), var(--ouro) 45%, var(--ouro-escuro))"></span><code>--ouro-claro · --ouro · --ouro-escuro</code></li>
<li><span class="sg-chip" style="background:var(--ouro-luz)"></span><code>--ouro-luz</code></li>
<li><span class="sg-chip" style="background:var(--ouro-sombra)"></span><code>--ouro-sombra</code></li>
<li><span class="sg-chip" style="background:var(--ouro-fundo)"></span><code>--ouro-fundo</code></li>
<li><span class="sg-chip" style="background:linear-gradient(160deg, var(--ouro-vivo-claro), var(--ouro-vivo) 45%, var(--ouro-vivo-escuro))"></span><code>--ouro-vivo-claro · --ouro-vivo · --ouro-vivo-escuro</code></li>
<li><span class="sg-chip" style="background:var(--marfim)"></span><code>--marfim</code></li>
<li><span class="sg-chip" style="background:var(--verde-fundo)"></span><code>--verde-fundo</code></li>
<li><span class="sg-chip" style="background:var(--castanho-fundo)"></span><code>--castanho-fundo</code></li>
<li><span class="sg-chip" style="background:var(--preto)"></span><code>--preto</code></li>
<li><span class="sg-chip" style="background:var(--verde-tinta)"></span><code>--verde-tinta</code> (letras)</li>
</ul>
<p class="sg-tag sg-tag--row">O brasão</p>
<div class="sg-ids">
<figure class="sg-id sg-id--branco">{crest_svg("sg", defs=False, label="A Brazileira")}<figcaption>Ouro</figcaption></figure>
<figure class="sg-id sg-id--marfim">{crest_svg("sg", defs=False, label="A Brazileira")}<figcaption>Ouro · marfim</figcaption></figure>
<figure class="sg-id sg-id--preto">{crest_svg("sg", defs=False, variant="plano", label="A Brazileira")}<figcaption>Plano · preto</figcaption></figure>
<figure class="sg-id sg-id--branco">{crest_svg("sg", defs=False, variant="linha", label="A Brazileira")}<figcaption>Traço</figcaption></figure>
</div>
<p class="sg-tag sg-tag--row">Em círculo</p>
<div class="sg-ids sg-circles">
{"".join(f'<figure class="sg-id sg-id--marfim">{circle(g, v)}<figcaption>{cap}</figcaption></figure>' for g, v, cap in (("marfim", "ouro", "Círculo marfim"), ("branco", "ouro", "Círculo branco"), ("verde", "ouro", "Círculo verde"), ("castanho", "ouro", "Círculo castanho"), ("preto", "plano", "Círculo preto, plano")))}
</div>
<p class="sg-tag sg-tag--row">Monograma (variantes mínimas)</p>
<div class="sg-ids">
<figure class="sg-id sg-id--branco">{monogram_svg("sg", label="A Brazileira")}<figcaption>Monograma dourado</figcaption></figure>
<figure class="sg-id sg-id--branco">{monogram_svg("sg", variant="plano", label="A Brazileira")}<figcaption>Monograma preto</figcaption></figure>
<figure class="sg-id sg-id--preto">{monogram_svg("sg", variant="plano", label="A Brazileira")}<figcaption>Monograma branco</figcaption></figure>
</div>
<p class="sg-tag sg-tag--row">Com texto</p>
<div class="sg-logos">
<figure class="sg-logo" data-theme="dia"><p class="lockup-h" tabindex="0"><span class="lockup__crest">{crest_svg("sg", defs=False)}</span><span class="lockup-h__rule" aria-hidden="true"></span><span class="lockup-h__words"><span class="sr">A Brazileira</span>{wm}<span class="sr">, </span><span class="lockup__label">Boutique Hotel</span></span></p><figcaption>Versão horizontal: brasão, um filete e as letras (para faixas baixas: cabeçalhos, assinaturas); nunca abaixo de W 200px (num telemóvel estreito desliza no cartão)</figcaption></figure>
</div>
<div class="sg-logos">
<figure class="sg-logo" data-theme="dia">{lockup_html('p', 'sg', ' sg-clear', defs=False)}<figcaption>Versão vertical, Dia (a do primeiro ecrã): letras e linha em Verde-tinta, brasão em ouro · tracejado: a área de proteção</figcaption></figure>
<figure class="sg-logo" data-theme="noite">{lockup_html('p', 'sg', ' sg-clear', defs=False)}<figcaption>Versão vertical, Noite: letras e linha em linho, o mesmo ouro (cada paragem 4,12:1 ou mais sobre a Parede-noite)</figcaption></figure>
</div>
<div class="sg-logos">
{mins("dia", "Tamanhos mínimos em ecrã")}
{mins("noite", "Os mesmos, de noite")}
</div>
<ul class="sg-rules">
<li><strong>Ficheiros</strong> (<code>assets/img/</code>): <code>crest-gold.svg</code> (o brasão em ouro com relevo), <code>crest.svg</code> (uma tinta, <code>currentColor</code>, nervuras recortadas: a variante plana), <code>crest-line.svg</code> (uma tinta, as folhas em traço com a nervura: a variante de traço), <code>crest-circle.svg</code> (o brasão em ouro num círculo marfim), <code>monogram-gold.svg</code> e <code>monogram.svg</code> (o monograma mínimo), <code>wordmark.svg</code> (as letras desenhadas, 11 formas, 5,6 KB) e <code>favicon.svg</code> (o monograma com contorno, para 16 a 32px). Na página, o brasão vai inline uma vez (<code>build.py › crest_svg</code>, ids com prefixo, cores por classe a partir dos tokens) e é <code>aria-hidden</code>: o nome lê-se uma vez, do texto escondido «A Brazileira», com a linha «Boutique Hotel» em texto vivo. Sozinho (aqui), o brasão tem <code>role="img"</code> e um só nome: «A Brazileira».</li>
<li><strong>Proporções</strong> (W = largura das letras, 1042,6 × 151,5, <code>--lockup-wordmark</code> 5.4em do tamanho do logótipo: 194px a 36px, 389px a 72px): brasão 0.526 W de largura, centrado, com a ponta do escudo à altura do topo do B (a 0.026 W acima das capitais) · da cauda dos R às capitais da linha 0.037 W (0.056 W abaixo da linha de base) · BOUTIQUE HOTEL em Cinzel Bold, com capitais de 0.031 W (Cinzel a 0.0443 W, nunca menos de 11px) e 0.745 W de largura (tracking 0.56em; com o mínimo de 11px, o tracking cede primeiro, nunca abaixo de 0.25em). Horizontal: brasão 0.391 W, filete 0.208 W de altura, a 0.038 W do brasão e a 0.068 W das letras.</li>
<li><strong>Área de proteção</strong>: a altura das capitais das letras (0.096 W) em todos os lados; 16px no tamanho mínimo.</li>
<li><strong>Tamanhos mínimos</strong> em ecrã: a versão vertical com W de 162px (30px de corpo; a linha presa a 11px); a horizontal com W de 200px; as letras sozinhas a 140px (o B alto e as caudas dos R ainda se leem); o brasão sozinho a 48px (abaixo disso a coroa e os ramos empastam); por baixo, o monograma (24px) e o favicon (16 a 32px, com contorno escuro para ler em separadores claros e escuros).</li>
<li><strong>Cores</strong>: o ouro em três paragens (<code>--ouro-claro</code>, <code>--ouro</code>, <code>--ouro-escuro</code>) com o relevo à escala dos traços (cada traço, folha e letra com a encosta virada para cima à esquerda em <code>--ouro-luz</code> e a outra em <code>--ouro-fundo</code>, as nervuras em <code>--ouro-sombra</code>), e um passo mais claro nos círculos verde e castanho (<code>--ouro-vivo-claro</code>, <code>--ouro-vivo</code>, <code>--ouro-vivo-escuro</code>), igual de dia e de noite; as letras e a linha em Verde-tinta de dia (13,00:1) e linho de noite (11,98:1). Fundos das aplicações: marfim, branco, verde, castanho, preto. Cores forçadas: o brasão plano em CanvasText.</li>
<li><strong>Não</strong>: compor as letras numa fonte, esticar, contornar, mudar o ouro ou pôr o brasão em latão, separar a coroa ou os ramos, pôr sobre a fotografia, animar o brasão. O emblema antigo (coroa com cruz, coroa de louros fechada, laço) está retirado.</li>
</ul>

<h2>Materiais (primitivos)</h2>
<ul class="sg-sws">
{sw}
</ul>

<h2>Dia e Noite</h2>
<p class="sg-note">Os mesmos componentes com <code>data-theme</code> aplicado a cada painel. Na página pública, até o visitante escolher, o tema segue o sol em Torres Vedras (Dia do nascer ao pôr do sol, Noite depois), e uma frase curta por baixo do controlo diz-o, em todos os ecrãs: «É noite em Torres Vedras.» O modo escuro do sistema não se sobrepõe ao céu (só decide sem JavaScript). Escolher Dia ou Noite guarda a escolha, que passa a valer sempre; tocar no tema já mostrado não guarda nada. O estado atual de cada controlo é a tinta forte com um traço curto em latão por baixo (o sublinhado fica só para ligações). Esta página segue a mesma regra.</p>
<div class="sg-panels">
{panel("dia", scene_d, style_d, "Dia", "Noite")}
{panel("noite", scene_n, style_n, "Dia", "Noite")}
</div>

<h2>Estados e peças pequenas</h2>
<p class="sg-note">Foco (anel de 2px, a 3px; no campo, a 2px por dentro do espaço da linha), passagem do rato (o sublinhado passa de 45% a tinta inteira), a ligação de saltar, o indicador de deslizar, a ligação de regresso e o nome de secção da nota de privacidade.</p>
<div class="sg-states">
<figure><a class="cta is-focus" href="#sg-lista">Entrar na lista de espera</a><figcaption>ação · foco</figcaption></figure>
<figure><a class="cta is-hover" href="#sg-lista">Entrar na lista de espera</a><figcaption>ação · rato por cima</figcaption></figure>
<figure><span class="controls"><button class="ctl is-focus" type="button" aria-pressed="true">Dia</button><span class="controls__sep" aria-hidden="true">·</span><button class="ctl" type="button" aria-pressed="false">Noite</button></span><figcaption>controlo · atual + foco</figcaption></figure>
<figure><a class="skip" href="#sg-lista">Saltar para o conteúdo</a><figcaption>ligação de saltar (visível com foco)</figcaption></figure>
<figure><span class="porta__cue" aria-hidden="true"><svg viewBox="0 0 16 10" aria-hidden="true" focusable="false"><path d="M1.5 1.5 8 8l6.5-6.5"/></svg></span><figcaption>indicador de deslizar</figcaption></figure>
<figure><a class="link" href="../">Voltar ao início</a><figcaption>ligação de regresso</figcaption></figure>
<figure><span class="notice__item"><span class="sg-h2">Finalidade</span></span><figcaption>nome de secção (nota de privacidade)</figcaption></figure>
</div>

<h2>A fotografia em camadas</h2>
<p class="sg-note">A entrada é uma fotografia (a mesma porta de dia e reiluminada à noite, ficheiros próprios para cada tema), cortada em camadas que se alinham pela geometria da fachada (<code>assets/photo/photo.json</code>): a sala ao fundo &lt; a sombra da ombreira &lt; as duas folhas &lt; a fachada, com a porta transparente &lt; a luz nos degraus (Noite). As folhas rodam para dentro sobre as dobradiças exteriores, até 84°, na perspetiva da própria fotografia (o ponto de fuga da sala); escurecem ao virar (1 − 0,28 · sen do ângulo de dia, 0,40 à noite). A sala, um vestíbulo desfocado com um arco de luz ao fundo, cresce mais devagar do que a porta (zoom<sup>0,8</sup>): está mais longe. A página é a parede: a sua cor foi tirada do reboco da fotografia (Parede #FAECDF de dia, Parede-noite #34251C à noite) e a parede da fachada foi graduada para esse tom (de dia, em baixa frequência, mantendo a textura e as sombras da lanterna e da oliveira; à noite, a queda da luz do crepúsculo termina nele), por isso a fotografia nunca se lê como um retângulo, nem ao aproximar nem ao afastar. Em repouso, sem JavaScript ou com movimento reduzido: a fotografia tal como é, portas fechadas, a luz da sala na frincha. Onde o aparelho a consegue desenhar (WebGL 2 com GPU, sem movimento reduzido, poupança de dados nem rede 2G), a mesma entrada é desenhada em 3D (WebGL, carregado logo depois da página, sem atrasar o primeiro ecrã): a própria fotografia é a pele, projetada a partir da sua câmara, de modo que em repouso o desenho é a fotografia; o 3D só acrescenta a espessura das folhas, o relevo das almofadas, os puxadores, o espelho e as dobradiças em latão, a profundidade da ombreira e do vestíbulo, e uma luz que apenas modula a da fotografia. Sem GPU, num aparelho claramente fraco, com <code>?sem3d</code>, se o primeiro segundo do 3D for lento (mediana acima de 25 ms por imagem, ou uma imagem acima de 120 ms) ou se o contexto se perder com a página à vista: a entrada em camadas, no mesmo ponto do percurso, até ao fim da sessão (<code>?3d</code> força o 3D para testes; <code>?diag</code> diz qual das duas corre e porquê).</p>
<div class="sg-opens">
{photo_state("dia", scene_d, style_d, "rest", "em repouso: portas fechadas")}
{photo_state("dia", scene_d, style_d, "open", "portas abertas (84°)")}
{photo_state("dia", scene_d, style_d, "hall", "a entrar (2,5×)")}
{photo_state("noite", scene_n, style_n, "rest", "em repouso: portas fechadas")}
{photo_state("noite", scene_n, style_n, "open", "portas abertas, luz nos degraus")}
{photo_state("noite", scene_n, style_n, "hall", "a entrar (2,5×)")}
</div>
<p class="sg-note">Ficheiros (largura × altura: AVIF / WebP, KB). Cada camada tem um <code>&lt;picture&gt;</code> por tema com AVIF e WebP em larguras que acompanham a da fachada, um <code>sizes</code> comum (a largura da cena) e <code>loading="lazy"</code>: a imagem do tema escondido nunca é pedida; o script do cabeçalho pré-carrega as quatro da primeira pintura do tema escolhido. Primeira pintura (AVIF) com a cena a 720 / 1080 / 1600 px de dispositivo: Dia {fp["dia"][0]:.0f} / {fp["dia"][1]:.0f} / {fp["dia"][2]:.0f} KB, Noite {fp["noite"][0]:.0f} / {fp["noite"][1]:.0f} / {fp["noite"][2]:.0f} KB (orçamento: 180 KB num telemóvel). Até a imagem chegar, um marcador de 24 px desfocado ocupa o lugar; as dimensões vêm do CSS (sem deslocamento de layout).</p>
<div class="sg-scroll" tabindex="0" role="region" aria-label="Ficheiros da fotografia"><table>
<thead><tr><th>Tema</th><th>Camada</th><th>Ficheiros</th></tr></thead>
<tbody>
{layer_rows()}
</tbody></table></div>

<h2 id="sg-lista">Lista de espera</h2>
<p class="sg-note">O formulário real, nos seus estados. A superfície é a luz da sala nos dois temas, por isso a tinta é escura em ambos. Mensagens em linha com <code>aria-invalid</code> e <code>aria-describedby</code>; envio e erros numa região <code>role="status"</code>. Sem JavaScript o conjunto fica inativo e uma nota indica o email de contacto.</p>
{forms}

<h2>Contraste medido (WCAG 2.x)</h2>
<div class="sg-scroll" tabindex="0" role="region" aria-label="Contraste medido"><table>
<thead><tr><th>Tema</th><th>Uso</th><th>Cor</th><th>Fundo</th><th>Rácio</th><th>Mínimo</th></tr></thead>
<tbody>
{rows}
</tbody></table></div>

<h2>Tipografia</h2>
<div class="sg-type"><ul>
<li><span class="lockup" style="font-size:var(--size-wordmark);align-items:flex-start">{wm_type}</span><small>As letras não são uma fonte: são o lettering da identidade, desenhado em vetores (<code>assets/img/wordmark.svg</code>, 11 formas, 5,6 KB, inline e <code>aria-hidden</code>) · <code>--lockup-wordmark</code> 5.4em do tamanho do logótipo (<code>--size-wordmark</code> 36 a 72px): 194 a 389px de largura · só no logótipo. Uma romana de serifas abertas em capitais da mesma altura, o B alto com a bandeira no topo, os dois R com a perna lançada numa cauda</small></li>
<li><span class="lockup" style="font-size:var(--size-wordmark);align-items:flex-start"><span class="lockup__label" style="margin:0">Boutique Hotel</span></span><small>Cinzel 700 (as dez letras da linha, 1,4 KB; o Q com a cauda encurtada), um peso firme (a 400 tinha metade da tinta) · capitais a 0.031 da largura das letras (Cinzel a 0.0443 W: 17,2px a 72px, nunca menos de 11px) · 0.745 W de largura (tracking 0.56em; onde o mínimo de 11px manda, o tracking cede, nunca abaixo de 0.25em) · das caudas dos R às capitais, 0.037 W · Verde-tinta de dia, linho de noite</small></li>
<li><span class="lista__title" style="text-align:start;margin:0">Lista de espera</span><small>Cinzel 400 · <code>--size-read</code> 19px · tracking 0.2em · capitais · o nome da secção (nos nomes de secção da nota de privacidade, 17px)</small></li>
<li><span class="notice__title" style="margin:0">Nota de privacidade</span><small>EB Garamond 400 · <code>--size-title</code> 28 a 38px · altura de linha 1.15 · o título de página</small></li>
<li><span class="lede" style="margin:0">Brevemente, abrimos as portas.</span><small>EB Garamond 400 · <code>--size-lede</code> 19px (320) a 20px (390) a 28px · linha 1em + 7.2px (20/27, 28/35) · a única frase do primeiro ecrã; onde não cabe numa linha, parte-se depois da vírgula, «Brevemente, / abrimos as portas.»</small></li>
<li><span style="font-family:var(--font-text);font-weight:var(--weight-text);font-size:var(--size-read);line-height:var(--leading-read);font-variant-numeric:var(--num-text);max-inline-size:var(--measure-read);text-wrap:pretty">O seu consentimento (art. 6.º, n.º 1, alínea a) do RGPD). Pode retirá-lo a qualquer momento, sem afetar o tratamento feito antes.</span><small>EB Garamond 400 · <code>--size-read</code> 19/30px · algarismos alinhados (os únicos desta fonte) · medida 27em (até 70 caracteres) · sem hifenização · texto de leitura e o email escrito no campo</small></li>
<li><span class="cta" style="padding:0;min-block-size:0">Entrar na lista de espera</span><small>EB Garamond 500 · <code>--size-cta</code> 17px no telemóvel, 19px a partir de 900px, 21px a partir de 1200px · tracking 0.01em · sublinhado 1.5px · a ação, o botão e a ligação de regresso</small></li>
<li><span>Dia · Noite · <span style="letter-spacing:var(--track-caps)">PT · EN</span></span><small>EB Garamond 500 · <code>--size-ui</code> 17px · tracking 0.01em · frase normal; PT e EN com 0.08em</small></li>
<li><span style="font-family:var(--font-text);font-weight:var(--weight-text);color:var(--color-text-muted)">É noite em Torres Vedras.</span><small>EB Garamond 400 · <code>--size-ui</code> 17/21px · a nota do sol: uma frase da casa, por baixo de Dia · Noite, só quando o sol escolheu o tema, em todos os ecrãs</small></li>
<li><span style="font-family:var(--font-consent);font-weight:var(--weight-text);line-height:var(--leading-text)">Aceito receber emails de A&nbsp;Brazileira sobre a abertura.</span><small>EB Garamond 400 · <code>--size-ui</code> 17/25px · o consentimento (o rótulo «Email» e as mensagens em EB Garamond 500, 17px)</small></li>
<li><span style="line-height:var(--leading-text);color:var(--color-text-muted)">© 2026 A Brazileira · Torres Vedras, Portugal</span><small>EB Garamond 500 · <code>--size-ui</code> 17/25px</small></li>
</ul></div>

<h2>Espaço (base 4px)</h2>
<ul class="sg-space">
{space}
</ul>

<h2>Movimento</h2>
<p class="sg-note">Ao deslizar, uma única sequência ligada ao scroll (p de 0 a 1 ao longo de <code>--porta-run</code> = 95svh, com o palco fixo): do topo até ao título e ao campo de email legíveis, menos de um ecrã de scroll. As portas abrem desde o primeiro píxel, a câmara entra até o ecrã ser uma só cor (a luz da sala, <code>--color-hall</code>) e a lista sobe nessa luz. Um só motor em JavaScript para todos os navegadores: o progresso desenhado segue o do scroll com suavização exponencial (<code>--scroll-tau</code> 90ms), sem nunca mexer no scroll nativo. Só <code>transform</code> e <code>opacity</code>. Ao subir, tudo volta atrás; em p = 0 o herói está exatamente no estado de repouso.</p>
<div class="sg-scroll" tabindex="0" role="region" aria-label="Sequência ao deslizar"><table>
<thead><tr><th>Elemento</th><th>Papel</th><th>Intervalo de p</th><th>Movimento</th><th>Curva</th></tr></thead>
<tbody>
{trows}
</tbody></table></div>
<ul class="sg-rules">
<li><code>--dur-flight</code> 1200ms · <code>--curve-flight</code> (0.45, 0, 0.3, 1) · <code>--flight-weight</code> 2 · a ação «Entrar na lista de espera» (e o indicador de deslizar) faz a entrada pela porta: o mesmo motor desliza a página até à lista, as portas abrem e a câmara entra; cada píxel do caminho pesa 1 + 2 × a mudança de escala, por isso a passagem pela porta lê-se com calma e a subida da lista é mais rápida. Um caminho mais curto dura menos (× √ da fração, nunca menos de 35%). Qualquer roda, toque, tecla ou clique fora da ação para-a onde está (uma tecla mantida premida ou um segundo clique na própria ação não a param). No fim, o foco vai para o campo de email (<code>preventScroll</code>), que é descrito pela frase da lista. Movimento reduzido: o mesmo destino, de uma vez.</li>
<li>Progresso desenhado: as portas, a luz e a câmara seguem o progresso suavizado; o texto do herói usa o menor dos dois (sai com as portas, volta com o próprio scroll); a passagem para a cor da sala usa o maior entre o suavizado e o do scroll menos 0.1 (num deslize rápido o palco já é cor da sala quando a lista chega).</li>
<li><code>--dur-press</code> 160ms · botão e ação: <code>scale(0.97)</code> ao premir. <code>--dur-state</code> 200ms · mensagens do formulário, visto. Sucesso: os campos saem em 160ms e a frase entra em 240ms.</li>
<li><code>--dur-theme</code> 400ms · <code>--ease-out</code> · troca Dia/Noite escolhida pelo visitante, em fundido (View Transitions, ou transição de cor). <code>--dur-sky</code> 1400ms · <code>--ease-sky</code> (0.45, 0, 0.55, 1) · a troca que o sol faz sozinho, mais lenta e suave. Sem fundido enquanto a sequência se move (espera que pare) e com movimento reduzido.</li>
<li><code>--dur-ui</code> 150ms · cor dos controlos ao passar o rato (curva <code>ease</code>).</li>
<li><code>--dur-handback</code> 180ms · linear · se o 3D for lento, dissolve-se na entrada em camadas no mesmo ponto do percurso (as duas seguem o scroll durante o fundido).</li>
<li><code>prefers-reduced-motion: reduce</code> · sem sequência nem palco fixo: a fotografia como é, portas fechadas, a lista a seguir; a ação leva logo à lista e põe o foco no email. Sem JavaScript: o mesmo, com o tema do sistema; a ação é uma ligação simples para a lista.</li>
</ul>

<h2>Regras (anti-slop)</h2>
<ul class="sg-rules">
<li>Três vozes: o wordmark (só no logótipo), capitais romanas espaçadas em Cinzel para rótulos (a linha do logótipo e os nomes de secção) e EB Garamond para tudo o que se diz (400 nas frases, 500 na interface, sempre em frase normal). No máximo cinco tamanhos de texto fora do logótipo, nada abaixo de 17px; o peso nunca separa a hierarquia (cor, espaço e tamanho separam).</li>
<li>Fundos planos: a parede da fotografia de dia (Parede #FAECDF, nunca branco), a parede ao crepúsculo à noite (Parede-noite #34251C). A fotografia é a mesma parede; nenhum gradiente na interface.</li>
<li>O sublinhado é só para ligações. O estado atual de um controlo é tinta forte e um traço curto em latão; o estado nunca é só cor.</li>
<li>Sem divisores decorativos, molduras, halos de página, texturas, vidro, sombras na interface ou texto em gradiente.</li>
<li>Sem itálicos decorativos, pontos de exclamação, emoji ou palavras de virtude.</li>
<li>Nenhum valor de cor fora de tokens.css; componentes leem só papéis semânticos.</li>
</ul>
</main>
</body>
</html>
"""
