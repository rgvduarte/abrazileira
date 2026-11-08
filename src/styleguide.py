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


def halls():
    P = dict((n, h) for n, h, _ in primitives())
    h = {"hall-dia": P.get("sala-dia") or mix(P["latao"], P["papel"], 0.22),
         "hall-noite": P.get("sala-noite") or mix(P["luz-nucleo"], P["luz"], 0.72)}
    assert h["hall-dia"].upper() == mix(P["latao"], P["papel"], 0.22) and h["hall-noite"].upper() == mix(P["luz-nucleo"], P["luz"], 0.72)
    return h


def pairs():
    P = dict((n, h) for n, h, _ in primitives())
    P.update(halls())
    dia = [("Texto forte · wordmark", "tinta", "papel", "texto"),
           ("Texto · lede", "nogueira", "papel", "texto"),
           ("Texto discreto · controlos, rodapé", "castanho", "papel", "texto"),
           ("Latão-texto · Torres Vedras, estado", "latao-texto", "papel", "texto"),
           ("Emblema", "latao-marca", "papel", "gráfico ≥ 3:1"),
           ("Foco · linha do chão", "nogueira", "papel", "não-texto ≥ 3:1")]
    noite = [("Texto · wordmark, lede", "linho", "noite", "texto"),
             ("Texto discreto · controlos, rodapé", "linho-escuro", "noite", "texto"),
             ("Latão · Torres Vedras, estado, emblema, foco", "latao", "noite", "texto")]
    hall = []
    for h in ("hall-dia", "hall-noite"):
        hall += [("Título, rótulos, ligações · " + h, "tinta", h, "texto"),
                 ("Texto · " + h, "nogueira", h, "texto"),
                 ("Rodapé · " + h, "castanho", h, "texto"),
                 ("Erro · " + h, "barro", h, "texto"),
                 ("Borda do campo, foco · " + h, "nogueira", h, "não-texto ≥ 3:1")]
    hall += [("Texto do botão", "papel", "tinta", "texto"), ("Texto no campo · Dia", "tinta", "papel", "texto"),
             ("Texto no campo · Noite", "tinta", "luz-nucleo", "texto"), ("Borda do campo · Noite", "nogueira", "luz-nucleo", "não-texto ≥ 3:1")]
    rows = []
    for theme, lst in (("Dia", dia), ("Noite", noite), ("Sala (lista)", hall)):
        for label, fg, bg, use in lst:
            rows.append((theme, label, fg, P[fg], bg, P[bg], ratio(P[fg], P[bg]), use))
    return rows


def render(emblem, scene_markup, lockup_html, T=None, waitlist=None):
    prims = primitives()
    sw = "\n".join(
        f'<li class="sg-sw"><span class="sg-chip" style="background:var(--{n})"></span>'
        f'<span class="sg-sw__name">--{n}</span><span class="sg-sw__hex">{h}</span><span class="sg-sw__note">{note}</span></li>'
        for n, h, note in prims)
    rows = "\n".join(
        f"<tr><td>{t}</td><td>{label}</td><td><code>--{fg}</code> {fh}</td><td><code>--{bg}</code> {bh}</td>"
        f"<td class=\"sg-num\">{r:.2f}:1</td><td>{use}</td></tr>"
        for t, label, fg, fh, bg, bh, r, use in pairs())
    scene_d, info_d = scene_markup("sgd")
    scene_n, info_n = scene_markup("sgn")
    space = "\n".join(
        f'<li><span class="sg-bar" style="inline-size:var(--space-{i})"></span><code>--space-{i}</code> {px}px</li>'
        for i, px in zip(range(1, 10), (4, 8, 12, 16, 24, 32, 48, 64, 96)))

    scene_od, info_od = scene_markup("sgod")
    scene_on, info_on = scene_markup("sgon")

    def open_door(theme, scene_html, style):
        return (f'<figure class="sg-open" data-theme="{theme}"><div class="entrance sg-entrance" aria-hidden="true" style="{style}">'
                f'{scene_html}</div><figcaption>{theme.capitalize()} · portas abertas, sala iluminada</figcaption></figure>')

    def form_state(theme, state, k, label):
        """The real waiting-list form (from build.waitlist), with unique ids and a fixed state."""
        html = waitlist(T["pt"])
        f = html[html.index("<form"):html.index("</form>") + 7]
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
        if state == "sending":
            f = f.replace('<button class="button" type="submit">', '<button class="button" type="submit" aria-disabled="true">')
        msg = {"error": "Não foi possível enviar. Tente de novo dentro de momentos.", "done": "Obrigado. Avisamos quando abrirmos."}.get(state, "")
        f = f.replace('<p class="form__msg" role="status" tabindex="-1"></p>', f'<p class="form__msg" role="status" tabindex="-1">{msg}</p>')
        if state == "done":
            f = f.replace('class="form" data-state="done"', 'class="form" data-state="done" style="min-block-size:21rem"')
        return f'<div class="sg-form surface-hall"><p class="sg-tag">{label}</p>{f}</div>'

    states = [("idle", "Em repouso"), ("invalid", "Erro de validação (foco no primeiro campo)"), ("sending", "A enviar (botão inativo)"),
              ("done", "Enviado"), ("error", "Erro de envio")]
    forms = "\n".join(
        f'<div class="sg-forms" data-theme="{th}"><p class="sg-tag sg-tag--row">{th.capitalize()} · superfície da sala <code>--color-hall</code></p>'
        + "".join(form_state(th, st, f"{th}{i}", lab) for i, (st, lab) in enumerate(states)) + "</div>"
        for th in ("dia", "noite"))

    timeline = [
        ("Texto (lockup, frase, estado, ação)", "Apoio, sai", "0 → 0.16", "opacidade 1 → 0, sobe 16px", "--curve-copy (0.33, 1, 0.68, 1)"),
        ("Indicador de deslizar", "Decoração", "0 → 0.05", "opacidade 1 → 0", "--curve-copy"),
        ("Folhas da porta", "Principal, desde o primeiro píxel", "0 → 0.42", "esquerda +47° (41° → 88°), direita +61° (27° → 88°)", "--curve-door (0.3, 0.55, 0.35, 1)"),
        ("Sala iluminada, luz nos degraus (Noite)", "Apoio, levada pelas folhas", "0 → 0.42", "opacidade 0 → 1 (o valor das folhas)", "--curve-door"),
        ("Câmara: centrar a porta", "Principal", "0 → 0.36", "translação em linha reta até ao centro do ecrã", "--curve-pan (0.35, 0.4, 0.3, 1)"),
        ("Câmara: entrar", "Principal", "0.04 → 0.90", "escala geométrica 1 → S: a abertura cobre todo o ecrã em qualquer proporção", "--curve-zoom (0.5, 0.05, 0.3, 1) sobre log(escala)"),
        ("A sala torna-se a cor da lista", "Apoio, passagem", "0.60 → 0.86", "camada lisa --color-hall dentro da porta, opacidade 0 → 1", "--curve-fade (0.45, 0, 0.55, 1)"),
        ("Luz em todo o palco", "Apoio", "0.86 → 0.92", "a mesma cor sobre a mesma cor (cobre as folhas de perfil)", "--curve-fade"),
        ("Lista de espera", "Chegada", "título entra no ecrã a p ≈ 0.82", "título e frase: opacidade + 12px, 560ms; formulário +100ms, 480ms", "--ease-out"),
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
<p class="lede">Uma casa antiga de Torres Vedras está a ser restaurada para receber hóspedes.</p>
<p class="status">Abre brevemente.</p>
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
<script>try{{var t=localStorage.getItem("ab-tema");if(t==="dia"||t==="noite")document.documentElement.setAttribute("data-theme",t)}}catch(e){{}}</script>
<title>Sistema de design · A Brazileira</title>
<meta name="robots" content="noindex, nofollow">
<meta name="color-scheme" content="light dark">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="../assets/css/tokens.css">
<link rel="stylesheet" href="../assets/css/site.css">
<style>
body {{ display: block; font-size: var(--size-ui); }}
.sg {{ max-inline-size: var(--container); margin-inline: auto; padding: var(--space-7) max(var(--gutter), env(safe-area-inset-left)) var(--space-9); }}
.sg h1, .sg h2 {{ margin: 0; font-weight: var(--weight-text); color: var(--color-text-strong); }}
.sg h1 {{ font-size: var(--size-lede); }}
.sg h2 {{ font-size: var(--size-lede); margin-block: var(--space-8) var(--space-4); padding-block-start: var(--space-4); border-block-start: var(--hairline) solid var(--color-ground); }}
:where(.sg) p, :where(.sg) ul {{ margin: 0; }}
.sg-intro {{ display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-6); }}
.sg-intro .lockup {{ font-size: 1.5rem; }}
.sg-intro p + p {{ margin-block-start: var(--space-2); color: var(--color-text-muted); }}
.sg-note {{ max-inline-size: 40em; color: var(--color-text); }}
.sg-sws {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr)); gap: var(--space-4); padding: 0; list-style: none; }}
.sg-sw {{ display: grid; grid-template-columns: var(--space-8) 1fr; column-gap: var(--space-3); align-items: center; }}
.sg-chip {{ grid-row: span 3; block-size: var(--space-8); border: var(--hairline) solid var(--color-ground); }}
.sg-sw__name {{ color: var(--color-text-strong); }}
.sg-sw__hex, .sg-sw__note {{ font-size: var(--size-small); color: var(--color-text-muted); }}
.sg-panels {{ display: grid; gap: var(--space-5); }}
.sg-panel {{ background: var(--color-bg); color: var(--color-text); border: var(--hairline) solid var(--color-ground); padding: var(--space-5); }}
.sg-tag {{ color: var(--color-text-muted); margin-block-end: var(--space-4); }}
.sg-panel__grid {{ display: grid; gap: var(--space-6); align-items: end; }}
.sg-panel__text {{ display: flex; flex-direction: column; align-items: center; text-align: center; }}
.sg-panel .lockup {{ font-size: 2rem; }}
.sg-controls {{ display: flex; justify-content: center; flex-wrap: wrap; gap: var(--space-5); margin-block-start: var(--space-5); }}
.sg-foot {{ margin-block-start: var(--space-4); font-size: var(--size-small); color: var(--color-text-muted); }}
.sg-entrance {{ flex: none; block-size: 26rem; max-block-size: none; margin: 0; overflow: clip; }}
.sg-opens {{ display: grid; gap: var(--space-5); grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr)); }}
.sg-open {{ margin: 0; padding: var(--space-5); background: var(--color-bg); color: var(--color-text-muted); border: var(--hairline) solid var(--color-ground); font-size: var(--size-small); }}
.sg-open .sg-entrance {{ block-size: 20rem; margin-block-end: var(--space-3); }}
.sg-open .leaf--l {{ transform: rotateY(var(--open-l)); }}
.sg-open .leaf--r {{ transform: rotateY(calc(var(--open-r) * -1)); }}
.sg-open :is(.hall__light, .spill) {{ opacity: 1; }}
.sg-forms {{ display: grid; gap: var(--space-4); grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr)); margin-block-end: var(--space-5); }}
.sg-tag--row {{ grid-column: 1 / -1; margin: 0; }}
.sg-form {{ padding: var(--space-5); color: var(--color-text); }}
.sg-form .form {{ margin: 0; }}
@media (min-width: 56.25em) {{ .sg-panel__grid {{ grid-template-columns: 1fr 1fr; }} .sg-panels {{ grid-template-columns: 1fr; }} }}
.sg table {{ inline-size: 100%; border-collapse: collapse; font-size: var(--size-small); }}
.sg th, .sg td {{ text-align: start; padding: var(--space-2) var(--space-3) var(--space-2) 0; border-block-end: var(--hairline) solid var(--color-surface); vertical-align: top; }}
.sg th {{ font-weight: 600; color: var(--color-text-strong); }}
.sg-num {{ font-variant-numeric: tabular-nums; color: var(--color-text-strong); }}
.sg-scroll {{ overflow-x: auto; }}
.sg-type li {{ display: grid; gap: var(--space-1); padding-block: var(--space-4); border-block-end: var(--hairline) solid var(--color-surface); }}
.sg-type small {{ font-size: var(--size-small); color: var(--color-text-muted); }}
.sg-type ul, .sg-space, .sg-rules {{ padding: 0; list-style: none; }}
.sg-space li {{ display: flex; align-items: center; gap: var(--space-3); padding-block: var(--space-1); }}
.sg-bar {{ block-size: var(--space-3); background: var(--color-text-muted); }}
.sg-rules li {{ padding-block: var(--space-2); border-block-end: var(--hairline) solid var(--color-surface); max-inline-size: 48em; }}
code {{ font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace; font-size: 0.875em; }}
</style>
</head>
<body>
<main class="sg">
<header class="sg-intro">
{lockup_html('p', 'sg-head')}
<div><h1>Sistema de design · v1.0</h1><p>Página interna, não indexada nem ligada ao site. Mostra os tokens e componentes reais (tokens.css, site.css).</p></div>
</header>

<h2>Materiais (primitivos)</h2>
<ul class="sg-sws">
{sw}
</ul>

<h2>Dia e Noite</h2>
<p class="sg-note">Os mesmos componentes com <code>data-theme</code> aplicado a cada painel. Na página pública o tema segue o sistema e o botão Dia · Noite guarda a escolha.</p>
<div class="sg-panels">
{panel("dia", scene_d, info_d["style"], "Dia", "Noite")}
{panel("noite", scene_n, info_n["style"], "Dia", "Noite")}
</div>

<h2>A porta aberta</h2>
<p class="sg-note">O estado final da sequência, que é também o que vê quem prefere movimento reduzido: as portas abertas e a sala iluminada. Na página, o deslizar leva da porta entreaberta até aqui e depois até à lista de espera.</p>
<div class="sg-opens">
{open_door("dia", scene_od, info_od["style"])}
{open_door("noite", scene_on, info_on["style"])}
</div>

<h2 id="sg-lista">Lista de espera</h2>
<p class="sg-note">O formulário real, nos seus estados. A superfície é a luz da sala nos dois temas, por isso a tinta é escura em ambos. Mensagens em linha com <code>aria-invalid</code> e <code>aria-describedby</code>; envio e erros numa região <code>role="status"</code>. Sem JavaScript o conjunto fica inativo e uma nota indica o email de contacto.</p>
{forms}

<h2>Contraste medido (WCAG 2.x)</h2>
<div class="sg-scroll"><table>
<thead><tr><th>Tema</th><th>Uso</th><th>Cor</th><th>Fundo</th><th>Rácio</th><th>Mínimo</th></tr></thead>
<tbody>
{rows}
</tbody></table></div>

<h2>Tipografia</h2>
<div class="sg-type"><ul>
<li><span class="lockup" style="font-size:var(--size-wordmark);align-items:flex-start"><span class="lockup__name">A Brazileira</span></span><small>Cinzel 600 · <code>--size-wordmark</code> 28 a 56px · tracking 0.045em · só no logótipo</small></li>
<li><span class="lockup" style="font-size:var(--size-wordmark);align-items:flex-start"><span class="lockup__kind">Boutique Hotel</span></span><small>Cinzel 700 · 0.5em do wordmark · tracking 0.12em</small></li>
<li><span class="lockup" style="font-size:var(--size-wordmark);align-items:flex-start"><span class="lockup__place">Torres Vedras</span></span><small>Cinzel 400 · 0.4em · tracking 0.3em · latão</small></li>
<li><span style="font-size:var(--size-lede);line-height:var(--leading-lede);color:var(--color-text)">Uma casa antiga de Torres Vedras está a ser restaurada para receber hóspedes.</span><small>Cormorant Garamond 500 · <code>--size-lede</code> 20 a 28px · altura de linha 1.32</small></li>
<li><span>Dia · Noite · PT · EN · Abre brevemente.</span><small>Cormorant Garamond 500 · <code>--size-ui</code> 16px · frase normal, sem espaçamento</small></li>
<li><span style="font-size:var(--size-small);color:var(--color-text-muted)">© 2026 A Brazileira · Torres Vedras, Portugal</span><small>Cormorant Garamond 500 · <code>--size-small</code> 15px</small></li>
</ul></div>

<h2>Espaço (base 4px)</h2>
<ul class="sg-space">
{space}
</ul>

<h2>Movimento</h2>
<p class="sg-note">Ao deslizar, uma única sequência ligada ao scroll (p de 0 a 1 ao longo de <code>--porta-run</code> = 144svh, com o palco fixo). Um só motor em JavaScript para todos os navegadores: o progresso desenhado segue o do scroll com suavização exponencial (<code>--scroll-tau</code> 90ms), sem nunca mexer no scroll nativo. Só <code>transform</code> e <code>opacity</code>. Ao subir, tudo volta atrás; em p = 0 o herói está exatamente no estado de repouso.</p>
<div class="sg-scroll"><table>
<thead><tr><th>Elemento</th><th>Papel</th><th>Intervalo de p</th><th>Movimento</th><th>Curva</th></tr></thead>
<tbody>
{trows}
</tbody></table></div>
<ul class="sg-rules">
<li><code>--dur-door</code> 1100ms · <code>--ease-door</code> · ao carregar, as portas ficam entreabertas uma vez (41° e 27°).</li>
<li>A ação «Entrar na lista de espera» salta logo para a lista (sem animar a sequência) e põe o foco no campo de email.</li>
<li><code>--dur-press</code> 160ms · botão e ação: <code>scale(0.97)</code> ao premir. <code>--dur-state</code> 200ms · mensagens do formulário, visto. Sucesso: os campos saem em 160ms e a frase entra em 240ms.</li>
<li><code>--dur-theme</code> 400ms · troca Dia/Noite em fundido (View Transitions, ou transição de cor).</li>
<li><code>--dur-ui</code> 150ms · cor dos controlos ao passar o rato (curva <code>ease</code>).</li>
<li><code>prefers-reduced-motion: reduce</code> · sem sequência nem palco fixo: portas abertas, sala iluminada, a ação salta para a lista. Sem JavaScript: portas entreabertas, sem palco fixo, tema do sistema.</li>
</ul>

<h2>Regras (anti-slop)</h2>
<ul class="sg-rules">
<li>Maiúsculas espaçadas só dentro do logótipo. Interface em frase normal, Cormorant 500, 15 a 16px.</li>
<li>Fundos planos: Papel de dia, Noite (nogueira) à noite. O único gradiente é a luz dentro do desenho, à noite.</li>
<li>Sem divisores decorativos, molduras, halos de página, texturas, vidro, sombras na interface ou texto em gradiente.</li>
<li>Sem itálicos decorativos, pontos de exclamação, emoji ou palavras de virtude.</li>
<li>Nenhum valor de cor fora de tokens.css; componentes leem só papéis semânticos.</li>
</ul>
</main>
</body>
</html>
"""
