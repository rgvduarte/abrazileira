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
    dia = [("Logótipo · wordmark e a sua linha (Verde Torres)", "verde-torres", "parede", "texto"),
           ("Texto forte · ação, controlo atual", "tinta", "parede", "texto"),
           ("Texto · lede", "nogueira", "parede", "texto"),
           ("Texto discreto · controlos, rodapé", "castanho", "parede", "texto"),
           ("Latão-texto · estado", "latao-texto", "parede", "texto"),
           ("Emblema · ponto do rótulo do logótipo", "latao-marca", "parede", "gráfico mín. 3:1"),
           ("Foco · linha do chão", "nogueira", "parede", "não-texto mín. 3:1")]
    noite = [("Texto · wordmark, rótulos, lede", "linho", "parede-noite", "texto"),
             ("Texto discreto · controlos, rodapé", "linho-escuro", "parede-noite", "texto"),
             ("Latão · estado, emblema, ponto do rótulo, foco", "latao", "parede-noite", "texto")]
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


def render(emblem, scene_markup, lockup_html, T=None, waitlist=None, theme_head="", photo=None, wordmark=None):
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
            f = f.replace(f'id="email-{k}" type="email"', f'id="email-{k}" type="email" aria-invalid="true" aria-describedby="email-msg-{k}" value="ana@"')
            f = f.replace(f'<p class="field__msg" id="email-msg-{k}" hidden></p>', f'<p class="field__msg" id="email-msg-{k}">Verifique o email.</p>')
            f = f.replace(f'id="consent-{k}" type="checkbox"', f'id="consent-{k}" type="checkbox" aria-invalid="true" aria-describedby="consent-msg-{k}"')
            f = f.replace(f'<p class="field__msg" id="consent-msg-{k}" hidden></p>', f'<p class="field__msg" id="consent-msg-{k}">Confirme que aceita receber emails.</p>')
        if state in ("sending", "error"):
            f = f.replace(f'id="email-{k}" type="email"', f'id="email-{k}" type="email" value="ana@exemplo.pt"')
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

    def panel(theme, scene_html, style, day, night):
        pressed_d = "true" if theme == "dia" else "false"
        pressed_n = "true" if theme == "noite" else "false"
        return f"""<section class="sg-panel" data-theme="{theme}" aria-label="{theme.capitalize()}">
<p class="sg-tag">{theme.capitalize()}</p>
<div class="sg-panel__grid">
<div class="sg-panel__text">
{lockup_html('p', 'sg-' + theme)}
<p class="lede">Estamos a restaurar um edifício antigo.</p>
<p class="status">Abrimos brevemente.</p>
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
.sg-logos {{ display: grid; gap: var(--space-5); grid-template-columns: repeat(auto-fit, minmax(min(100%, 30rem), 1fr)); margin-block-start: var(--space-5); }}
.sg-logo {{ margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: space-between; gap: var(--space-5); padding: var(--space-6) var(--space-4) var(--space-4); background: var(--color-bg); color: var(--color-text-muted); border: var(--hairline) solid var(--color-ground); font-size: var(--size-ui); text-align: center; }}
.sg-logo .lockup {{ font-size: min(4rem, 8.5vw); }}
/* clear space: the height of RAZILEIR's capitals (0.098 of the wordmark's width) on every side, drawn as a dashed edge */
.sg-clear {{ padding: calc(var(--lockup-wordmark) * 0.098); outline: var(--hairline) dashed var(--color-ground); }}
/* the home page's one-line line (site.css, inside its container query), shown here as the pitch draws it */
.sg-line .lockup__label {{ font-size: var(--lockup-label-line); margin-inline-end: calc(var(--track-label) * -1); }}
.sg-line .lockup__kind, .sg-line .lockup__place {{ display: inline-block; margin-inline-end: 0; }}
.sg-line .lockup__dot {{ display: inline; }}
.sg-mins {{ display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: center; gap: var(--space-6); }}
.sg-mins figure {{ margin: 0; display: grid; justify-items: center; gap: var(--space-2); }}
.sg-mins .lockup {{ font-size: var(--size-lockup-min); }}
.sg-wm {{ display: block; color: var(--color-brand-ink); }}
.sg-wm svg {{ display: block; inline-size: 100%; block-size: auto; }}
.sg-em {{ display: block; color: var(--color-mark); }}
.sg-em svg {{ display: block; inline-size: 100%; block-size: auto; }}
code {{ font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace; font-size: 0.875em; }}   /* this page only: token names */
</style>
</head>
<body>
<main class="sg">
<header class="sg-intro">
{lockup_html('p', 'sg-head')}
<div><h1>Sistema de design · v1.0</h1><p>Página interna, não indexada nem ligada ao site. Mostra os tokens e componentes reais (tokens.css, site.css).</p></div>
</header>

<h2>Logótipo</h2>
<p class="sg-note">O emblema atual (a coroa, os louros e o B) sobre o wordmark do pitch de identidade e a sua linha em capitais Cinzel muito espaçadas, nas proporções do pitch. O wordmark é o próprio lettering do pitch, vetorizado: o A grande, o B ornamental com a espiral e o fio ao lado, RAZILEIR em capitais menores com as pernas dos R lançadas, o A final grande. O monograma em escudo do pitch está em pausa, por decisão do cliente: fica o emblema atual.</p>
<div class="sg-logos">
<figure class="sg-logo sg-line" data-theme="dia">{lockup_html('p', 'sg-logo-dia', ' sg-clear')}<figcaption>Dia · wordmark e linha em Verde Torres, emblema e « · » em latão-marca · tracejado: a área de proteção</figcaption></figure>
<figure class="sg-logo sg-line" data-theme="noite">{lockup_html('p', 'sg-logo-noite', ' sg-clear')}<figcaption>Noite · wordmark e linha em linho, emblema e « · » em latão</figcaption></figure>
</div>
<div class="sg-logos">
<figure class="sg-logo" data-theme="dia"><div class="sg-mins">
<figure>{lockup_html('p', 'sg-min-dia')}<figcaption>logótipo no mínimo: 30px (wordmark 204px)</figcaption></figure>
<figure><span class="sg-wm" style="inline-size:120px">{wm_small}</span><figcaption>wordmark sozinho: 120px</figcaption></figure>
<figure><span class="sg-em" style="inline-size:32px">{emblem('sg-em32')}</span><figcaption>emblema: 32px</figcaption></figure>
<figure><span class="sg-em" style="inline-size:16px">{emblem('sg-em16')}</span><figcaption>16px (favicon)</figcaption></figure>
</div><figcaption>Tamanhos mínimos em ecrã</figcaption></figure>
<figure class="sg-logo" data-theme="noite"><div class="sg-mins">
<figure>{lockup_html('p', 'sg-min-noite')}<figcaption>30px</figcaption></figure>
<figure><span class="sg-wm" style="inline-size:120px">{wm_small}</span><figcaption>120px</figcaption></figure>
<figure><span class="sg-em" style="inline-size:32px">{emblem('sg-em32n')}</span><figcaption>32px</figcaption></figure>
<figure><span class="sg-em" style="inline-size:16px">{emblem('sg-em16n')}</span><figcaption>16px</figcaption></figure>
</div><figcaption>Os mesmos, de noite</figcaption></figure>
</div>
<ul class="sg-rules">
<li><strong>Ficheiros</strong>: <code>assets/img/wordmark.svg</code> (uma forma por letra, 218 nós, 5,4 KB; medido contra o pitch: IoU 0,974) e <code>assets/img/emblem.svg</code>. O wordmark não é uma fonte: vai inline no h1, <code>aria-hidden</code>, com <code>fill="currentColor"</code>, e o nome lê-se uma vez do texto escondido «A Brazileira, Boutique Hotel, Torres Vedras».</li>
<li><strong>Proporções</strong> (medidas no pitch; W = largura do wordmark, 2316,2 × 369, <code>--lockup-wordmark</code> 6.8em do tamanho do logótipo: 245px a 36px, 490px a 72px): emblema 0.257 W de largura (a área do monograma do pitch, 160 × 143 px em 579) · o pé do emblema desce 0.0073 W abaixo do topo do B, longe das letras · das pernas dos R às capitais da linha 0.0286 W · a linha numa só linha: capitais 0.019 W (Cinzel a 0.0271 W, nunca menos de 11,2px), tracking 0.42em, 0.81 W de largura; em duas linhas, max(0.32em, 11px).</li>
<li><strong>Área de proteção</strong>: a altura das capitais de RAZILEIR (0.098 W) em todos os lados do logótipo; 20px no tamanho mínimo.</li>
<li><strong>Tamanhos mínimos</strong> em ecrã: o logótipo completo a 30px (wordmark 204px, a linha presa a 11px); o wordmark sozinho a 120px de largura (o B ornamental e as pernas dos R ainda se leem); abaixo disso, só o emblema (favicon e ícones), que se aguenta a 16px.</li>
<li><strong>Cores</strong> (do pitch, <code>colours.json</code>): Verde Torres <code>--verde-torres</code> #24281B (o círculo da paleta; o traço medido é #1A1C10) é a tinta do wordmark e da linha de dia, 13,00:1 sobre a Parede; de noite, linho (14,79:1 sobre a Parede-noite). O emblema fica em latão-marca de dia e latão de noite. O Latão Antigo do pitch (#987245) pertence ao monograma em pausa e não é usado; o fundo do quadro (#F5F2EA) não substitui a Parede. Cores forçadas: CanvasText.</li>
<li><strong>Não</strong>: redesenhar ou compor o wordmark numa fonte, esticar, contornar, recolorir fora dos dois esquemas, pôr sobre a fotografia, juntar-lhe o monograma do pitch enquanto está em pausa, animar o emblema.</li>
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
<p class="sg-note">A entrada é uma fotografia (a mesma porta de dia e reiluminada à noite, ficheiros próprios para cada tema), cortada em camadas que se alinham pela geometria da fachada (<code>assets/photo/photo.json</code>): a sala ao fundo &lt; a sombra da ombreira &lt; as duas folhas &lt; a fachada, com a porta transparente &lt; a luz nos degraus (Noite). As folhas rodam para dentro sobre as dobradiças exteriores, até 84°, na perspetiva da própria fotografia (o ponto de fuga da sala); escurecem ao virar (1 − 0,28 · sen do ângulo de dia, 0,40 à noite). A sala, um vestíbulo desfocado com um arco de luz ao fundo, cresce mais devagar do que a porta (zoom<sup>0,8</sup>): está mais longe. A página é a parede: a sua cor foi tirada do reboco da fotografia (Parede #FAECDF de dia, Parede-noite #1C140F à noite) e a parede da fachada foi graduada para esse tom (de dia, em baixa frequência, mantendo a textura e as sombras da lanterna e da oliveira; à noite, a queda da luz do crepúsculo termina nele), por isso a fotografia nunca se lê como um retângulo, nem ao aproximar nem ao afastar. Em repouso, sem JavaScript ou com movimento reduzido: a fotografia tal como é, portas fechadas, a luz da sala na frincha. Por agora em teste, só com <code>?3d</code> no endereço (por omissão a entrada é a fotografia em camadas): onde o aparelho tem GPU, a mesma entrada é desenhada em 3D (WebGL, carregado depois da página): a própria fotografia é a pele, projetada a partir da sua câmara, de modo que em repouso o desenho é a fotografia; o 3D só acrescenta a espessura das folhas, o relevo das almofadas, os puxadores, o espelho e as dobradiças em latão, a profundidade da ombreira e do vestíbulo, e uma luz que apenas modula a da fotografia. Por omissão, sem GPU, com <code>?sem3d</code> ou se o contexto se perder: a entrada em camadas.</p>
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
<li><span class="lockup" style="font-size:var(--size-wordmark);align-items:flex-start">{wm_type}</span><small>O wordmark não é uma fonte: é o lettering do pitch vetorizado (<code>assets/img/wordmark.svg</code>, 11 formas, 5,4 KB, inline e <code>aria-hidden</code>) · <code>--lockup-wordmark</code> 6.8em do tamanho do logótipo (<code>--size-wordmark</code> 36 a 72px): 245 a 490px de largura · só no logótipo. A leitura do pitch do lettering da fachada (anos 30): romana pesada de serifas abertas, o B ornamental e os dois R de perna lançada</small></li>
<li><span class="lockup" style="font-size:var(--size-wordmark);align-items:flex-start"><span class="lockup__label" style="font-size:var(--lockup-label-line);margin:0"><span class="lockup__kind" style="display:inline;margin:0">Boutique Hotel</span><span class="lockup__dot" style="display:inline"> · </span><span class="lockup__place" style="display:inline;margin:0">Torres Vedras</span></span></span><small>Cinzel 400 (só capitais, 5,9 KB) · uma linha com « · », capitais a 0.019 da largura do wordmark (13,3px a 72px, nunca menos de 11,2px; 0.81 do wordmark, como no pitch) na página inicial a partir de 1024 × 700, se couber na coluna; duas linhas a 0.32em (nunca menos de 11px) em todo o lado · tracking 0.42em, o do pitch · das pernas dos R às capitais, 0.0286 do wordmark · Verde Torres de dia, linho de noite, o ponto em latão</small></li>
<li><span class="lista__title" style="text-align:start;margin:0">Lista de espera</span><small>Cinzel 400 · <code>--size-read</code> 19px · tracking 0.2em · capitais · o nome da secção, como o pitch nomeia as suas (nos nomes de secção da nota de privacidade, 17px)</small></li>
<li><span class="notice__title" style="margin:0">Nota de privacidade</span><small>EB Garamond 400 · <code>--size-title</code> 28 a 38px · altura de linha 1.15 · o título de página</small></li>
<li><span class="lede" style="margin:0">Estamos a restaurar um edifício antigo.</span><small>EB Garamond 400 · <code>--size-lede</code> 19px (320) a 20px (390) a 28px · linha 1em + 7.2px (20/27, 28/35) · uma linha; em 320 a 374px parte-se num só sítio, «Estamos a restaurar / um edifício antigo.»</small></li>
<li><span style="font-family:var(--font-text);font-weight:var(--weight-text);font-size:var(--size-read);line-height:var(--leading-read);font-variant-numeric:var(--num-text);max-inline-size:var(--measure-read);text-wrap:pretty">O seu consentimento (art. 6.º, n.º 1, alínea a) do RGPD). Pode retirá-lo a qualquer momento, sem afetar o tratamento feito antes.</span><small>EB Garamond 400 · <code>--size-read</code> 19/30px · algarismos alinhados (os únicos desta fonte) · medida 27em (até 70 caracteres) · sem hifenização · texto de leitura e o email escrito no campo</small></li>
<li><span class="cta" style="padding:0;min-block-size:0">Entrar na lista de espera</span><small>EB Garamond 500 · <code>--size-cta</code> 17px no telemóvel, 19px a partir de 900px, 21px a partir de 1200px · tracking 0.01em · sublinhado 1.5px · a ação, o botão e a ligação de regresso</small></li>
<li><span>Dia · Noite · <span style="letter-spacing:var(--track-caps)">PT · EN</span> · <span style="color:var(--color-accent-text)">Abrimos brevemente.</span></span><small>EB Garamond 500 · <code>--size-ui</code> 17px · tracking 0.01em · frase normal; PT e EN com 0.08em · o estado mais calmo que a ação: latão, mais perto da frase (no telemóvel, de Noite, a tinta calma: a ação tem lá o mesmo tamanho)</small></li>
<li><span style="font-family:var(--font-text);font-weight:var(--weight-text);color:var(--color-text-muted)">É noite em Torres Vedras.</span><small>EB Garamond 400 · <code>--size-ui</code> 17/21px · a nota do sol: uma frase da casa, por baixo de Dia · Noite, só quando o sol escolheu o tema, em todos os ecrãs</small></li>
<li><span style="font-family:var(--font-consent);font-weight:var(--weight-text);line-height:var(--leading-text)">Aceito receber emails de A&nbsp;Brazileira sobre a abertura.</span><small>EB Garamond 400 · <code>--size-ui</code> 17/25px · o consentimento (o rótulo «Email» e as mensagens em EB Garamond 500, 17px)</small></li>
<li><span style="line-height:var(--leading-text);color:var(--color-text-muted)">© 2026 A Brazileira · Torres Vedras, Portugal</span><small>EB Garamond 500 · <code>--size-ui</code> 17/25px</small></li>
</ul></div>

<h2>Espaço (base 4px)</h2>
<ul class="sg-space">
{space}
</ul>

<h2>Movimento</h2>
<p class="sg-note">Ao deslizar, uma única sequência ligada ao scroll (p de 0 a 1 ao longo de <code>--porta-run</code> = 115svh, com o palco fixo): do topo até ao título e ao campo de email legíveis, cerca de um ecrã de scroll. As portas abrem desde o primeiro píxel, a câmara entra até o ecrã ser uma só cor (a luz da sala, <code>--color-hall</code>) e a lista sobe nessa luz. Um só motor em JavaScript para todos os navegadores: o progresso desenhado segue o do scroll com suavização exponencial (<code>--scroll-tau</code> 90ms), sem nunca mexer no scroll nativo. Só <code>transform</code> e <code>opacity</code>. Ao subir, tudo volta atrás; em p = 0 o herói está exatamente no estado de repouso.</p>
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
<li><code>prefers-reduced-motion: reduce</code> · sem sequência nem palco fixo: a fotografia como é, portas fechadas, a lista a seguir; a ação leva logo à lista e põe o foco no email. Sem JavaScript: o mesmo, com o tema do sistema; a ação é uma ligação simples para a lista.</li>
</ul>

<h2>Regras (anti-slop)</h2>
<ul class="sg-rules">
<li>Três vozes, como no pitch de identidade: o wordmark (só no logótipo), capitais romanas espaçadas em Cinzel para rótulos (a linha do logótipo e os nomes de secção) e EB Garamond para tudo o que se diz (400 nas frases, 500 na interface, sempre em frase normal). No máximo cinco tamanhos de texto fora do logótipo, nada abaixo de 17px; o peso nunca separa a hierarquia (cor, espaço e tamanho separam).</li>
<li>Fundos planos: a parede da fotografia de dia (Parede #FAECDF, nunca branco), a parede ao crepúsculo à noite (Parede-noite #1C140F). A fotografia é a mesma parede; nenhum gradiente na interface.</li>
<li>O sublinhado é só para ligações. O estado atual de um controlo é tinta forte e um traço curto em latão; o estado nunca é só cor.</li>
<li>Sem divisores decorativos, molduras, halos de página, texturas, vidro, sombras na interface ou texto em gradiente.</li>
<li>Sem itálicos decorativos, pontos de exclamação, emoji ou palavras de virtude.</li>
<li>Nenhum valor de cor fora de tokens.css; componentes leem só papéis semânticos.</li>
</ul>
</main>
</body>
</html>
"""
