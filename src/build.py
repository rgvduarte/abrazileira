"""Build the A Brazileira site into ../docs from the sources in this folder.

Portable: every path is relative to this file. The folder is self-contained (assets/ holds the emblem,
fonts, icons, favicon and the Open Graph image), so `python3 src/build.py` works from any checkout.
The build is deterministic and rewrites ../docs completely.
"""
import hashlib, json, os, re, shutil, sys

sys.dont_write_bytecode = True          # keep src/ free of __pycache__
SRC = os.path.dirname(os.path.abspath(__file__))
DOCS = os.path.join(os.path.dirname(SRC), "docs")
ASSETS = os.path.join(SRC, "assets")
sys.path.insert(0, SRC)
import scene  # noqa: E402

BASE = "https://abrazileira.com/"
CONTACT = "inn@abrazileira.com"


def read(p):
    with open(p, encoding="utf-8") as f:
        return f.read()


def write(p, s):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w", encoding="utf-8") as f:
        f.write(s)


# ---------------------------------------------------------------- emblem
def emblem(idp="ab-emblem"):
    s = read(os.path.join(ASSETS, "img/emblem.svg"))
    inner = re.sub(r"^<svg[^>]*>", "", s).replace("</svg>", "")
    inner = inner.replace('id="v"', f'id="{idp}-mask"').replace("url(#v)", f"url(#{idp}-mask)")
    inner = inner.replace('fill="#fff"', 'fill="white"').replace('stroke="#000"', 'stroke="black"')
    assert "#" not in re.sub(r"url\(#[^)]*\)", "", inner), "raw colour left in emblem"
    return f'<svg viewBox="0 0 200 228" aria-hidden="true" focusable="false">{inner}</svg>'


# ---------------------------------------------------------------- scene
def scene_markup(idp="ab"):
    """The entrance: back svg (hall), hall light (HTML), front svg (everything else), light spill, door leaves.
    Only the HTML layers move (opacity / transform), so the drawing is never repainted while it animates."""
    scene.EXT.clear()
    o = scene.build()
    xs = [p[0] for p in scene.EXT]
    ys = [p[1] for p in scene.EXT]
    m = 8.0
    vbx, vby = min(xs) - m, min(ys) - m
    vbw = max(xs) + m - vbx
    vbh = scene.G - vby          # the street (bottom of the steps) is the bottom edge: the page floor line
    lf = o["leaf"]
    sp = o["spill"]
    fx = lambda v: (v - vbx) / vbw
    fy = lambda v: (v - vby) / vbh
    pc = lambda f: f"{f * 100:.4f}%"
    door_w = (lf["x1"] - lf["x0"]) / vbw
    door_h = (lf["y1"] - lf["y0"]) / vbh
    door_cx, door_cy = fx(0), fy((lf["y0"] + lf["y1"]) / 2)
    sx0, sx1 = min(q[0] for q in sp["pts"]), max(q[0] for q in sp["pts"])
    sy0, sy1 = min(q[1] for q in sp["pts"]), max(q[1] for q in sp["pts"])
    clip = ",".join(f"{(q[0] - sx0) / (sx1 - sx0) * 100:.2f}% {(q[1] - sy0) / (sy1 - sy0) * 100:.2f}%" for q in sp["pts"])
    axis = fx(0)
    style = ";".join([
        f"--scene-ratio:{vbw / vbh:.5f}",
        f"--scene-axis:{axis:.6f}",
        f"--persp:{scene.D / vbw:.5f}",
        f"--vp-x:{pc(fx(o['vp'][0]))}",
        f"--vp-y:{pc(fy(o['vp'][1]))}",
        f"--leaf-left:{pc(fx(lf['x0']))}",
        f"--leaf-mid:{pc(fx(0))}",
        f"--leaf-top:{pc(fy(lf['y0']))}",
        f"--leaf-w:{door_w / 2 * 100:.4f}%",
        f"--leaf-h:{door_h * 100:.4f}%",
        f"--door-cx:{pc(door_cx)}",
        f"--door-cy:{pc(door_cy)}",
        f"--hall-floor:{o['hall_floor'] / (lf['y1'] - lf['y0']) * 100:.4f}%",
        f"--spill-x:{pc(fx(sx0))}",
        f"--spill-y:{pc(fy(sy0))}",
        f"--spill-w:{pc((sx1 - sx0) / vbw)}",
        f"--spill-h:{pc((sy1 - sy0) / vbh)}",
    ])
    vb = f"{scene.r1(vbx)} {scene.r1(vby)} {scene.r1(vbw)} {scene.r1(vbh)}"
    back = (f'<svg class="scene__art scene__art--back" viewBox="{vb}" preserveAspectRatio="xMidYMax meet" focusable="false">'
            f'{o["back_defs"]}\n{o["back"]}</svg>')
    front = (f'<svg class="scene__art" viewBox="{vb}" preserveAspectRatio="xMidYMax meet" focusable="false">'
             f'{o["defs"]}\n{o["body"]}</svg>')
    hall = '<div class="hall"><div class="hall__dawn"></div><div class="hall__light"><div class="hall__floor"></div></div></div>'
    spill = f'<div class="spill" style="clip-path:polygon({clip})"></div>'
    leaves = (f'<div class="door"><div class="leaf leaf--l"><div class="leaf__face">{scene.leaf_svg("l")}</div></div>'
              f'<div class="leaf leaf--r"><div class="leaf__face">{scene.leaf_svg("r")}</div></div></div>')
    # data-door: the opening (cx cy w h) as fractions of the scene box, read once by site.js for the camera
    data = f"{door_cx:.5f} {door_cy:.5f} {door_w:.5f} {door_h:.5f}"
    out = f'<div class="scene" data-door="{data}">\n{back}\n{hall}\n{front}\n{spill}\n{leaves}\n</div>'
    if idp != "ab":
        out = out.replace('id="ab-', f'id="{idp}-').replace("url(#ab-", f"url(#{idp}-")
    return out, dict(vb=(vbx, vby, vbw, vbh), style=style, axis=axis)


# ---------------------------------------------------------------- copy
T = {
    "pt": dict(
        lang="pt-PT", og_locale="pt_PT", alt_locale="en_GB", url=BASE, prefix="", home="./",
        privacy_href="privacidade/", privacy_url=BASE + "privacidade/",
        title="A Brazileira · Boutique Hotel · Torres Vedras",
        desc="A Brazileira, hotel em Torres Vedras. Uma casa antiga em restauro. Abre brevemente.",
        og_alt="A Brazileira, Boutique Hotel, Torres Vedras: o logótipo e o desenho de uma entrada em arco com as portas entreabertas, à noite.",
        skip="Saltar para o conteúdo", theme="Tema", day="Dia", night="Noite", langnav="Idioma",
        lede="Uma casa antiga de Torres Vedras está a ser restaurada para receber hóspedes.",
        status="Abre brevemente.",
        cta="Entrar na lista de espera",
        art="Desenho de uma entrada em arco de pedra, com portas duplas de madeira.",
        list_h="Lista de espera",
        list_p="Deixe-nos o seu email e avisamos quando abrirmos.",
        legend="Inscrição na lista de espera",
        email="Email",
        consent="Aceito receber emails de A Brazileira sobre a abertura. Ler a {link}.",
        consent_link="nota de privacidade",
        hp="Não preencher este campo",
        submit="Entrar na lista", sending="A enviar…",
        msg_ok="Obrigado. Avisamos quando abrirmos.",
        msg_email="Verifique o email.",
        msg_consent="Confirme que aceita receber emails.",
        msg_error="Não foi possível enviar. Tente de novo dentro de momentos.",
        noscript="Para se inscrever, ative o JavaScript ou escreva para {mail}.",
        privacy="Privacidade",
    ),
    "en": dict(
        lang="en", og_locale="en_GB", alt_locale="pt_PT", url=BASE + "en/", prefix="../", home="./",
        privacy_href="privacy/", privacy_url=BASE + "en/privacy/",
        title="A Brazileira · Boutique Hotel · Torres Vedras",
        desc="A Brazileira, a hotel in Torres Vedras, Portugal. An old house under restoration. Opening soon.",
        og_alt="A Brazileira, Boutique Hotel, Torres Vedras: the logo and a drawing of an arched entrance with its doors ajar, at night.",
        skip="Skip to content", theme="Theme", day="Day", night="Night", langnav="Language",
        lede="An old house in Torres Vedras is being restored to welcome guests.",
        status="Opening soon.",
        cta="Join the waiting list",
        art="Drawing of an arched stone entrance with double wooden doors.",
        list_h="Waiting list",
        list_p="Leave your email and we will let you know when we open.",
        legend="Sign up for the waiting list",
        email="Email",
        consent="I agree to receive emails from A Brazileira about the opening. Read the {link}.",
        consent_link="privacy notice",
        hp="Leave this field empty",
        submit="Join the list", sending="Sending…",
        msg_ok="Thank you. We will let you know when we open.",
        msg_email="Please check the email address.",
        msg_consent="Please confirm you agree to receive emails.",
        msg_error="We could not send it. Please try again in a moment.",
        noscript="To sign up, please enable JavaScript or write to {mail}.",
        privacy="Privacy",
    ),
}
FOOT = "© 2026 A Brazileira · Torres Vedras, Portugal"
THEME_HEAD = ('<script>try{var t=localStorage.getItem("ab-tema");'
              'if(t==="dia"||t==="noite")document.documentElement.setAttribute("data-theme",t)}catch(e){}</script>')
CHEVRON = ('<svg viewBox="0 0 16 10" aria-hidden="true" focusable="false">'
           '<path d="M1.5 1.5 8 8l6.5-6.5"/></svg>')
TICK = ('<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">'
        '<path d="M3.5 8.5 6.5 11.5 12.5 4.5"/></svg>')


def lockup_html(level="h1", idp="ab-emblem", extra=""):
    return (f'<{level} class="lockup{extra}">'
            f'<span class="lockup__emblem">{emblem(idp)}</span>'
            f'<span class="lockup__name">A Brazileira</span><span class="sr">, </span>'
            f'<span class="lockup__kind">Boutique Hotel</span><span class="sr">, </span>'
            f'<span class="lockup__place">Torres Vedras</span>'
            f'</{level}>')


def head(t, p, title, desc, canonical, alternates, og=True, robots="index, follow"):
    alt = "\n".join(f'<link rel="alternate" hreflang="{h}" href="{u}">' for h, u in alternates)
    ogm = ""
    if og:
        ogm = f"""
<meta property="og:type" content="website">
<meta property="og:site_name" content="A Brazileira">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{canonical}">
<meta property="og:locale" content="{t['og_locale']}">
<meta property="og:locale:alternate" content="{t['alt_locale']}">
<meta property="og:image" content="{BASE}assets/img/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="{t['og_alt']}">
<meta name="twitter:card" content="summary_large_image">"""
    return f"""<!doctype html>
<html lang="{t['lang']}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
{THEME_HEAD}
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{canonical}">
{alt}
<meta name="robots" content="{robots}">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#F9F0E9" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#1C120B" media="(prefers-color-scheme: dark)">{ogm}
<link rel="icon" href="{p}favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="{p}assets/img/apple-touch-icon.png">
<link rel="manifest" href="{p}site.webmanifest">
<link rel="preload" href="{p}assets/fonts/cinzel-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="{p}assets/fonts/cormorant-garamond-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="{p}assets/css/tokens.css">
<link rel="stylesheet" href="{p}assets/css/site.css">
<script src="{p}assets/js/site.js" defer></script>"""


def topbar(t, pt_href, en_href, k):
    cur_pt = ' aria-current="page"' if k == "pt" else ""
    cur_en = ' aria-current="page"' if k == "en" else ""
    return f"""<header class="topbar">
<div class="controls" role="group" aria-label="{t['theme']}" data-theme-switch hidden>
<button class="ctl" type="button" data-theme-set="dia" aria-pressed="false">{t['day']}</button><span class="controls__sep" aria-hidden="true">·</span><button class="ctl" type="button" data-theme-set="noite" aria-pressed="false">{t['night']}</button>
</div>
<nav class="controls controls--lang" aria-label="{t['langnav']}">
<a class="ctl" href="{pt_href}" hreflang="pt-PT" lang="pt-PT"{cur_pt}>PT<span class="sr"> · Português</span></a><span class="controls__sep" aria-hidden="true">·</span><a class="ctl" href="{en_href}" hreflang="en" lang="en"{cur_en}>EN<span class="sr"> · English</span></a>
</nav>
</header>"""


def footer(privacy_href, label, extra="", current=False):
    cur = ' aria-current="page"' if current else ""
    return (f'<footer class="foot{extra}">\n<p>{FOOT}<span class="foot__sep" aria-hidden="true"> · </span>'
            f'<a class="foot__link" href="{privacy_href}"{cur}>{label}</a></p>\n</footer>')


def waitlist(t):
    link = f'<a class="link-inline" href="{t["privacy_href"]}">{t["consent_link"]}</a>'
    mail = f'<a class="link-inline" href="mailto:{CONTACT}">{CONTACT}</a>'
    return f"""<section id="lista" class="lista surface-hall" aria-labelledby="lista-titulo">
<div class="lista__inner" data-reveal>
<h2 id="lista-titulo" class="lista__title">{t['list_h']}</h2>
<p class="lista__lede">{t['list_p']}</p>
<form class="form" data-waitlist data-lang="{t['lang']}" data-msg-ok="{t['msg_ok']}" data-msg-email="{t['msg_email']}" data-msg-consent="{t['msg_consent']}" data-msg-error="{t['msg_error']}" novalidate>
<fieldset class="form__set" disabled>
<legend class="sr">{t['legend']}</legend>
<div class="field">
<label class="field__label" for="email">{t['email']}</label>
<input class="field__input" id="email" type="email" name="email" autocomplete="email" inputmode="email" autocapitalize="off" spellcheck="false" required>
<p class="field__msg" id="email-msg" hidden></p>
</div>
<div class="check">
<input class="check__input" id="consent" type="checkbox" name="consent" required>
<label class="check__label" for="consent"><span class="check__box" aria-hidden="true">{TICK}</span><span class="check__text">{t['consent'].format(link=link)}</span></label>
<p class="field__msg" id="consent-msg" hidden></p>
</div>
<div class="form__hp" aria-hidden="true"><label for="website">{t['hp']}</label><input id="website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
<button class="button" type="submit"><span class="button__idle">{t['submit']}</span><span class="button__busy">{t['sending']}</span></button>
</fieldset>
<p class="form__msg" role="status" tabindex="-1"></p>
</form>
<noscript><p class="lista__noscript">{t['noscript'].format(mail=mail)}</p></noscript>
</div>
</section>"""


def page(k, scene_html, scene_style):
    t = T[k]
    p = t["prefix"]
    ld = {"@context": "https://schema.org", "@type": "Hotel", "name": "A Brazileira", "url": BASE,
          "address": {"@type": "PostalAddress", "addressLocality": "Torres Vedras", "addressCountry": "PT"}}
    alternates = [("pt-PT", BASE), ("en", BASE + "en/"), ("x-default", BASE)]
    return f"""{head(t, p, t['title'], t['desc'], t['url'], alternates)}
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
</head>
<body class="home">
<a class="skip" href="#conteudo">{t['skip']}</a>
{topbar(t, p + './', p + 'en/', k)}
<main id="conteudo">
<div class="porta" data-porta>
<div class="porta__stage">
<div class="porta__frame">
<div class="stage">
<div class="intro">
{lockup_html()}
<p class="lede">{t['lede']}</p>
<p class="status">{t['status']}</p>
<p class="cta-row"><a class="cta" href="#lista">{t['cta']}</a></p>
</div>
<div class="entrance" role="img" aria-label="{t['art']}" style="{scene_style}">
{scene_html}
</div>
</div>
<div class="porta__band"><a class="porta__cue" href="#lista" tabindex="-1" aria-hidden="true">{CHEVRON}</a></div>
</div>
<div class="porta__flood"></div>
</div>
</div>
{waitlist(t)}
</main>
{footer(t['privacy_href'], t['privacy'], ' surface-hall')}
</body>
</html>
"""


# ---------------------------------------------------------------- privacy notice (RGPD)
PRIVACY = {
    "pt": dict(
        title="Nota de privacidade · A Brazileira",
        desc="Como A Brazileira trata os dados da lista de espera.",
        h1="Nota de privacidade",
        intro="Esta nota explica o que acontece ao seu email quando se inscreve na lista de espera.",
        sections=[
            ("Responsável", "A Brazileira, Torres Vedras, Portugal. Contacto: {mail}."),
            ("Dados", "O seu email, o idioma da página e a data e hora do consentimento."),
            ("Finalidade", "Avisar sobre a abertura de A Brazileira e enviar novidades relacionadas."),
            ("Fundamento", "O seu consentimento (art. 6.º, n.º 1, alínea a) do RGPD). Pode retirá-lo a qualquer momento, "
                           "sem afetar o tratamento feito antes. Para isso, basta escrever para {mail}."),
            ("Conservação", "Até retirar o consentimento ou, no máximo, 24 meses após a inscrição."),
            ("Subcontratante", "Supabase, que aloja a base de dados em servidores na União Europeia (Paris)."),
            ("Direitos", "Tem direito de acesso, retificação, apagamento, limitação, oposição e portabilidade, "
                         "através de {mail}. Pode também apresentar reclamação à Comissão Nacional de Proteção de Dados "
                         "({cnpd})."),
            ("Cookies", "Este site não usa cookies nem ferramentas de análise. O único pedido a terceiros acontece "
                        "quando envia o formulário."),
        ],
        updated="Última atualização: novembro de 2026.",
        back="Voltar ao início",
    ),
    "en": dict(
        title="Privacy notice · A Brazileira",
        desc="How A Brazileira handles waiting-list data.",
        h1="Privacy notice",
        intro="This notice explains what happens to your email address when you join the waiting list.",
        sections=[
            ("Controller", "A Brazileira, Torres Vedras, Portugal. Contact: {mail}."),
            ("Data", "Your email address, the language of the page and the date and time of your consent."),
            ("Purpose", "To let you know when A Brazileira opens and to send related news."),
            ("Legal basis", "Your consent (Article 6(1)(a) of the GDPR). You can withdraw it at any time, without "
                            "affecting the processing carried out before. To do so, write to {mail}."),
            ("Retention", "Until you withdraw your consent or, at most, 24 months after you sign up."),
            ("Processor", "Supabase, which hosts the database on servers in the European Union (Paris)."),
            ("Your rights", "You have the right of access, rectification, erasure, restriction, objection and "
                            "portability, through {mail}. You can also lodge a complaint with the Portuguese data "
                            "protection authority, CNPD ({cnpd})."),
            ("Cookies", "This site does not use cookies or analytics tools. The only request to a third party "
                        "happens when you submit the form."),
        ],
        updated="Last updated: November 2026.",
        back="Back to home",
    ),
}


def page_privacy(k):
    t = T[k]
    c = PRIVACY[k]
    p = "../" if k == "pt" else "../../"
    mail = f'<a class="link-inline" href="mailto:{CONTACT}">{CONTACT}</a>'
    cnpd = '<a class="link-inline" href="https://www.cnpd.pt/" hreflang="pt-PT">www.cnpd.pt</a>'
    alternates = [("pt-PT", BASE + "privacidade/"), ("en", BASE + "en/privacy/"), ("x-default", BASE + "privacidade/")]
    pt_href = p + "privacidade/"
    en_href = p + "en/privacy/"
    secs = "\n".join(
        f'<section class="notice__item" aria-labelledby="s{i}"><h2 id="s{i}">{h}</h2><p>{b.format(mail=mail, cnpd=cnpd)}</p></section>'
        for i, (h, b) in enumerate(c["sections"], 1))
    home = "../"
    return f"""{head(t, p, c['title'], c['desc'], t['privacy_url'], alternates, og=False)}
</head>
<body class="page-notice">
<a class="skip" href="#conteudo">{t['skip']}</a>
{topbar(t, pt_href, en_href, k)}
<main id="conteudo" class="notice">
<a class="notice__home" href="{home}">{lockup_html('span', 'ab-emblem', ' lockup--small')}<span class="sr"> · {c['back']}</span></a>
<h1 class="notice__title">{c['h1']}</h1>
<p class="notice__intro">{c['intro']}</p>
{secs}
<p class="notice__updated">{c['updated']}</p>
<p class="notice__back"><a class="link" href="{home}">{c['back']}</a></p>
</main>
{footer('./', t['privacy'], current=True)}
</body>
</html>
"""


# 404.html is served at any depth (/abrazileira/a/b/c): resolve the site root first, then
# write the base and the stylesheets as parser-inserted (render-blocking) tags.
BASE_JS = ('<script>(function(){var p=location.pathname.split("/").filter(Boolean),'
           'b=(/\\.github\\.io$/.test(location.hostname)||p[0]==="abrazileira")&&p.length?"/"+p[0]+"/":"/";'
           'document.write(\'<base href="\'+b+\'"><link rel="stylesheet" href="assets/css/tokens.css">'
           '<link rel="stylesheet" href="assets/css/site.css"><link rel="icon" href="favicon.svg" type="image/svg+xml">\')})();</script>\n'
           '<noscript><link rel="stylesheet" href="assets/css/tokens.css"><link rel="stylesheet" href="assets/css/site.css"></noscript>')


def page404():
    return f"""<!doctype html>
<html lang="pt-PT">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
{BASE_JS}
{THEME_HEAD}
<title>Página não encontrada · A Brazileira</title>
<meta name="robots" content="noindex">
<meta name="color-scheme" content="light dark">
</head>
<body class="page-404">
<main class="stage stage--plain">
<div class="intro">
{lockup_html('p')}
<h1 class="lede">Esta página não existe.</h1>
<p class="lede lede--second" lang="en">This page does not exist.</p>
<p class="status status--links"><a class="link" href="./">Voltar ao início</a><span class="controls__sep" aria-hidden="true"> · </span><a class="link" href="en/" lang="en">Back to home</a></p>
</div>
</main>
{footer('privacidade/', 'Privacidade')}
</body>
</html>
"""


def tokens_css():
    tpl = read(os.path.join(SRC, "tokens.tpl.css"))
    noite = read(os.path.join(SRC, "noite.css")).rstrip("\n")
    css = tpl.replace("/*NOITE*/", noite, 1)
    css = css.replace("/*NOITE*/", "\n".join(l[2:] if l.startswith("  ") else l for l in noite.split("\n")), 1)
    return css


def sitemap():
    groups = [[("pt-PT", BASE), ("en", BASE + "en/"), ("x-default", BASE)],
              [("pt-PT", BASE + "privacidade/"), ("en", BASE + "en/privacy/"), ("x-default", BASE + "privacidade/")]]
    urls = []
    for g in groups:
        for _, loc in g[:2]:
            links = "\n".join(f'    <xhtml:link rel="alternate" hreflang="{h}" href="{u}"/>' for h, u in g)
            urls.append(f"  <url>\n    <loc>{loc}</loc>\n{links}\n  </url>")
    return ('<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
            + "\n".join(urls) + "\n</urlset>\n")


# ---------------------------------------------------------------- cache busting
# GitHub Pages serves assets with max-age=600; ?v=<content hash> keeps HTML and CSS/JS in step.
REF = re.compile(r'(?P<attr>href|src)="(?P<url>(?!https?:|//|data:|#|mailto:)[^"?#]+\.(?:css|js))(?:\?v=[0-9a-f]+)?"')


def stamp(docs):
    for root, _, files in os.walk(docs):
        for f in files:
            if not f.endswith(".html"):
                continue
            path = os.path.join(root, f)
            text = read(path)
            base = docs if f == "404.html" else root      # 404 resolves its links against the site root (<base>)

            def sub(m):
                target = os.path.normpath(os.path.join(base, m["url"]))
                if not os.path.isfile(target):
                    raise SystemExit(f"{path}: missing asset {m['url']}")
                with open(target, "rb") as fh:
                    h = hashlib.sha256(fh.read()).hexdigest()[:10]
                return f'{m["attr"]}="{m["url"]}?v={h}"'
            write(path, REF.sub(sub, text))


def copy(rel_src, rel_dst):
    dst = os.path.join(DOCS, rel_dst)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.copy(os.path.join(ASSETS, rel_src), dst)


def main():
    if os.path.isdir(DOCS):
        shutil.rmtree(DOCS)
    os.makedirs(DOCS)
    sc_html, info = scene_markup()
    write(os.path.join(DOCS, "index.html"), page("pt", sc_html, info["style"]))
    write(os.path.join(DOCS, "en/index.html"), page("en", sc_html, info["style"]))
    write(os.path.join(DOCS, "privacidade/index.html"), page_privacy("pt"))
    write(os.path.join(DOCS, "en/privacy/index.html"), page_privacy("en"))
    write(os.path.join(DOCS, "404.html"), page404())
    write(os.path.join(DOCS, "assets/css/tokens.css"), tokens_css())
    write(os.path.join(DOCS, "assets/css/site.css"), read(os.path.join(SRC, "site.css")))
    write(os.path.join(DOCS, "assets/js/site.js"), read(os.path.join(SRC, "site.js")))
    for f in ["cinzel-latin-400-normal.woff2", "cinzel-latin-600-normal.woff2", "cinzel-latin-700-normal.woff2",
              "cormorant-garamond-latin-wght-normal.woff2", "OFL-cinzel.txt", "OFL-cormorant-garamond.txt"]:
        copy("fonts/" + f, "assets/fonts/" + f)
    for f in ["apple-touch-icon.png", "icon-512.png", "emblem.svg", "og.png"]:
        copy("img/" + f, "assets/img/" + f)
    copy("favicon.svg", "favicon.svg")
    write(os.path.join(DOCS, ".nojekyll"), "")
    write(os.path.join(DOCS, "robots.txt"), f"User-agent: *\nAllow: /\n\nSitemap: {BASE}sitemap.xml\n")
    write(os.path.join(DOCS, "sitemap.xml"), sitemap())
    write(os.path.join(DOCS, "site.webmanifest"), json.dumps({
        "name": "A Brazileira · Boutique Hotel",
        "short_name": "A Brazileira",
        "lang": "pt-PT",
        "start_url": "./",
        "display": "browser",
        "background_color": "#F9F0E9",
        "theme_color": "#F9F0E9",
        "icons": [
            {"src": "favicon.svg", "sizes": "any", "type": "image/svg+xml"},
            {"src": "assets/img/icon-512.png", "sizes": "512x512", "type": "image/png"},
            {"src": "assets/img/apple-touch-icon.png", "sizes": "180x180", "type": "image/png"},
        ],
    }, ensure_ascii=False, indent=2) + "\n")
    import styleguide
    write(os.path.join(DOCS, "design/index.html"), styleguide.render(emblem, scene_markup, lockup_html, T, waitlist))
    stamp(DOCS)
    print("built", DOCS, {k: (round(v, 4) if isinstance(v, float) else v) for k, v in info.items() if k != "style"})


if __name__ == "__main__":
    main()
