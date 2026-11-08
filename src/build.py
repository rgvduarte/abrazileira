"""Build the A Brazileira site into ../docs from the sources in this folder.

Portable: every path is relative to this file. The folder is self-contained (assets/ holds the emblem,
fonts, icons, favicon, the Open Graph image and the photographic entrance in assets/photo), so
`python3 src/build.py` works from any checkout with Python 3 alone (no image tools: the photo layers are encoded
once by the asset pipeline and copied as they are). The build is deterministic and rewrites ../docs completely.
"""
import hashlib, json, os, re, shutil, sys

sys.dont_write_bytecode = True          # keep src/ free of __pycache__
SRC = os.path.dirname(os.path.abspath(__file__))
DOCS = os.path.join(os.path.dirname(SRC), "docs")
ASSETS = os.path.join(SRC, "assets")
sys.path.insert(0, SRC)
import photo  # noqa: E402

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


# ---------------------------------------------------------------- the entrance (photo.py)
def scene_markup(p="", motion=True):
    """the photograph of the entrance in layers, and the custom properties that place them (on .entrance)"""
    return photo.scene_markup(p, motion=motion), photo.style_vars()


# ---------------------------------------------------------------- copy
T = {
    "pt": dict(
        lang="pt-PT", og_locale="pt_PT", alt_locale="en_GB", url=BASE, prefix="", home="./",
        privacy_href="privacidade/", privacy_url=BASE + "privacidade/",
        title="A Brazileira · Boutique Hotel · Torres Vedras",
        desc="A Brazileira, hotel em Torres Vedras. Uma casa antiga em restauro. Abre brevemente.",
        og_alt="A Brazileira, Boutique Hotel, Torres Vedras: o logótipo e a fotografia de uma entrada em arco de pedra com portas de madeira, à noite.",
        skip="Saltar para o conteúdo", theme="Tema", day="Dia", night="Noite", langnav="Idioma",
        sol_day="É dia em Torres Vedras.", sol_night="É noite em Torres Vedras.",
        lede="Uma casa antiga de Torres Vedras está a ser restaurada para receber hóspedes.",
        status="Abre brevemente.",
        cta="Entrar na lista de espera",
        list_h="Lista de espera",
        list_p="Deixe-nos o seu email e avisamos quando abrirmos.",
        legend="Inscrição na lista de espera",
        email="Email",
        consent="Aceito receber emails de A&nbsp;Brazileira sobre a abertura. Ler a {link}.",
        consent_link="nota de privacidade",
        hp="Não preencher este campo",
        submit="Entrar na lista de espera", sending="A enviar…",
        msg_ok="Obrigado. Já está na lista.",
        msg_email="Verifique o email.",
        msg_consent="Confirme que aceita receber emails.",
        msg_error="Não foi possível enviar. Tente de novo dentro de momentos ou escreva para {mail}.",
        noscript="Para se inscrever, ative o JavaScript ou escreva para {mail}.",
        privacy="Privacidade",
    ),
    "en": dict(
        lang="en", og_locale="en_GB", alt_locale="pt_PT", url=BASE + "en/", prefix="../", home="./",
        privacy_href="privacy/", privacy_url=BASE + "en/privacy/",
        title="A Brazileira · Boutique Hotel · Torres Vedras",
        desc="A Brazileira, a hotel in Torres Vedras, Portugal. An old house under restoration. Opening soon.",
        og_alt="A Brazileira, Boutique Hotel, Torres Vedras: the logo and a photograph of an arched stone entrance with wooden doors, at night.",
        skip="Skip to content", theme="Theme", day="Day", night="Night", langnav="Language",
        sol_day="It is daytime in Torres Vedras.", sol_night="It is night in Torres Vedras.",
        lede="An old house in Torres Vedras is being restored to welcome guests.",
        status="Opening soon.",
        cta="Join the waiting list",
        list_h="Waiting list",
        list_p="Leave your email and we will let you know when we open.",
        legend="Sign up for the waiting list",
        email="Email",
        consent="I agree to receive emails from A&nbsp;Brazileira about the opening. Read the {link}.",
        consent_link="privacy notice",
        hp="Leave this field empty",
        submit="Join the waiting list", sending="Sending…",
        msg_ok="Thank you. You are on the list.",
        msg_email="Please check the email address.",
        msg_consent="Please confirm you agree to receive emails.",
        msg_error="We could not send it. Please try again in a moment or write to {mail}.",
        noscript="To sign up, please enable JavaScript or write to {mail}.",
        privacy="Privacy",
    ),
}
def nb(s):
    """Typographic ties for running text (never titles or metadata): the name and the town never split across a
    line, and a one-letter word (a, e, o, à, é; I in English) never hangs at the end of a line, so «e avisamos»
    and «a ser» start the next line together."""
    s = s.replace("A Brazileira", "A\u00a0Brazileira").replace("Torres Vedras", "Torres\u00a0Vedras")
    s = s.replace("© 2026", "©\u00a02026")
    s = re.sub(r"\b(art\.|n\.º|Article) (?=\d)", "\\1\u00a0", s)  # art. 6.º, n.º 1, Article 6(1)(a)
    s = re.sub(r"(?<=\d) (?=[a-zà-ÿ])", "\u00a0", s)                  # 24 meses, 24 months
    return re.sub(r"(?<![\w\u00c0-\u017f(])([aeoAEOIàé]) (?=[\w{])", "\\1\u00a0", s)


for _k in ("pt", "en"):
    for _f in ("lede", "list_p", "consent", "msg_ok", "msg_error", "noscript"):
        T[_k][_f] = nb(T[_k][_f])
# the last phrase of the sentence holds together: on 320-359px phones the lede sets one phrase a line
# («Uma casa antiga de Torres Vedras / está a ser restaurada / para receber hóspedes.», site.css)
T["pt"]["lede"] = T["pt"]["lede"].replace("para receber hóspedes", "para\u00a0receber\u00a0hóspedes")

# the town is its own span: on phones it takes a second line by rule, not by a near miss in width
FOOT = ('<span class="foot__name">' + nb("© 2026 A Brazileira") + '</span><span class="foot__dot"> · </span>'
        '<span class="foot__place">' + nb("Torres Vedras, Portugal") + "</span>")
# Dia / Noite before the first paint: the visitor's choice on this site if there is one; otherwise the sky over
# Torres Vedras (39.09 N, 9.26 W) at this moment, as the brief asks («when the visitor has not chosen»): Dia while the
# sun is above the horizon (altitude > -0.833 deg, the standard sunrise/sunset), Noite otherwise. A system dark mode is
# not a choice made here, so it does not override the house's sky (decided in round 2; DESIGN.md › Dia & Noite); one
# press on Noite is remembered. The sun's position is a low-precision solar ephemeris (about 1 minute against
# published sunrise/sunset times for 2026); site.js reuses it (root.__sol) to turn the lights on at sunset. data-sol
# marks a theme the sky chose (never stored); a line under the control then says so («É noite em Torres Vedras.»).
# Without JavaScript the page follows the system theme.
THEME_HEAD = ('<script>(function(r){var t;try{t=localStorage.getItem("ab-tema")}catch(e){}'
              'r.__sol=function(m){var k=Math.PI/180,d=m/864e5-10957.5,g=(357.529+.98560028*d)*k,'
              'L=(280.459+.98564736*d+1.915*Math.sin(g)+.02*Math.sin(2*g))*k,e=(23.439-3.6e-7*d)*k,'
              'c=Math.asin(Math.sin(e)*Math.sin(L)),a=Math.atan2(Math.cos(e)*Math.sin(L),Math.cos(L)),'
              'h=(280.46061837+360.98564736629*d-9.26)*k-a,f=39.09*k;'
              'return Math.asin(Math.sin(f)*Math.sin(c)+Math.cos(f)*Math.cos(c)*Math.cos(h))>-.833*k};'
              'if(t!=="dia"&&t!=="noite"){t=r.__sol(Date.now())?"dia":"noite";r.setAttribute("data-sol","")}'
              'r.setAttribute("data-theme",t)})(document.documentElement)</script>')


def theme_head(p):
    """the head script of the home page: the theme, then a preload of the first-paint photo files of that theme"""
    return THEME_HEAD.replace('r.setAttribute("data-theme",t)})', 'r.setAttribute("data-theme",t);' + photo.head_preload(p) + '})', 1)


# the scroll cue, drawn with a pen rather than set as an icon: two strokes, one a little longer and bowed, that
# cross where they meet (the pen's overshoot), at --stroke-cue (site.css)
CHEVRON = ('<svg viewBox="0 0 16 10" aria-hidden="true" focusable="false">'
           '<path d="M1.1 1.6c2.2 2.3 4.4 4.6 7.2 6.9"/><path d="M7.5 8.7c2.3-2.2 4.6-4.6 7.3-7.5"/></svg>')
TICK = ('<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">'
        '<path d="M3.5 8.5 6.5 11.5 12.5 4.5"/></svg>')


def lockup_html(level="h1", idp="ab-emblem", extra=""):
    """the crest, the wordmark (a large A and the ornamental B, RAZILEIR at 72%, a large closing A; drawn, aria-hidden,
    its name read once from the hidden «A Brazileira») and its line in spaced capitals; the text reads «A Brazileira,
    Boutique Hotel, Torres Vedras» (the « · » is drawn, not read)"""
    return (f'<{level} class="lockup{extra}">'
            f'<span class="lockup__emblem">{emblem(idp)}</span>'
            f'<span class="sr">A Brazileira</span><span class="lockup__name" aria-hidden="true">A B<span class="lockup__sc">razileir</span><span class="lockup__end">a</span></span><span class="sr">, </span>'
            f'<span class="lockup__label"><span class="lockup__kind">Boutique Hotel</span>'
            f'<span class="lockup__dot" aria-hidden="true"> · </span><span class="sr">, </span>'
            f'<span class="lockup__place">Torres Vedras</span></span>'
            f'</{level}>')


def head(t, p, title, desc, canonical, alternates, og=True, robots="index, follow", preload=False):
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
<meta property="og:image" content="{BASE}assets/img/og.jpg">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="{t['og_alt']}">
<meta name="twitter:card" content="summary_large_image">"""
    return f"""<!doctype html>
<html lang="{t['lang']}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
{theme_head(p) if preload else THEME_HEAD}
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
<link rel="preload" href="{p}assets/fonts/brazileira-wordmark.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="{p}assets/fonts/cinzel-caps-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="{p}assets/fonts/eb-garamond-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="{p}assets/fonts/eb-garamond-500.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="{p}assets/css/tokens.css">
<link rel="stylesheet" href="{p}assets/css/site.css">
<script src="{p}assets/js/site.js" defer></script>"""


def topbar(t, pt_href, en_href, k):
    cur_pt = ' aria-current="page"' if k == "pt" else ""
    cur_en = ' aria-current="page"' if k == "en" else ""
    # the note: a short sentence in the house's voice under the control, shown only while the sky chose the theme
    # (html[data-sol]); both phrases are in the markup and the theme shows one, so it is right from the first paint;
    # it also describes the two buttons (site.js)
    note = (f'<span class="controls__note" id="sol-note"><span class="controls__note-dia">{t["sol_day"]}</span>'
            f'<span class="controls__note-noite">{t["sol_night"]}</span></span>')
    return f"""<header class="topbar">
<div class="controls" role="group" aria-label="{t['theme']}" data-theme-switch hidden>
<button class="ctl" type="button" data-theme-set="dia" aria-pressed="false">{t['day']}</button><span class="controls__sep" aria-hidden="true">·</span><button class="ctl" type="button" data-theme-set="noite" aria-pressed="false">{t['night']}</button>{note}
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
    # the agreement, then the pointer to the notice on a line of its own: the link reads and taps as one unit
    agree, more = t["consent"].format(link=link).split(". ", 1)
    consent = f'{agree}. <span class="check__more">{more}</span>'
    return f"""<section id="lista" class="lista surface-hall" aria-labelledby="lista-titulo" data-motion="list">
<div class="lista__inner" data-reveal>
<h2 id="lista-titulo" class="lista__title">{t['list_h']}</h2>
<p class="lista__lede" id="lista-lede">{t['list_p']}</p>
<form class="form" data-waitlist data-lang="{t['lang']}" data-msg-ok="{t['msg_ok']}" data-msg-email="{t['msg_email']}" data-msg-consent="{t['msg_consent']}" data-msg-error="{t['msg_error']}" data-mail="{CONTACT}" novalidate>
<fieldset class="form__set" disabled>
<legend class="sr">{t['legend']}</legend>
<div class="field">
<label class="field__label" for="email">{t['email']}</label>
<input class="field__input" id="email" type="email" name="email" autocomplete="email" inputmode="email" autocapitalize="off" spellcheck="false" required aria-describedby="lista-lede">
<p class="field__msg" id="email-msg" hidden></p>
</div>
<div class="check">
<input class="check__input" id="consent" type="checkbox" name="consent" required>
<label class="check__label" for="consent"><span class="check__box" aria-hidden="true">{TICK}</span><span class="check__text">{consent}</span></label>
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


def page(k):
    t = T[k]
    p = t["prefix"]
    scene_html, scene_style = scene_markup(p)
    ld = {"@context": "https://schema.org", "@type": "Hotel", "name": "A Brazileira", "url": BASE,
          "address": {"@type": "PostalAddress", "addressLocality": "Torres Vedras", "addressCountry": "PT"}}
    alternates = [("pt-PT", BASE), ("en", BASE + "en/"), ("x-default", BASE)]
    return f"""{head(t, p, t['title'], t['desc'], t['url'], alternates, preload=True)}
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
</head>
<body class="home">
<a class="skip" href="#conteudo">{t['skip']}</a>
{topbar(t, p or './', p + 'en/', k)}
<main id="conteudo">
<div class="porta" data-porta data-motion="wrapper">
<div class="porta__stage" data-motion="stage">
<div class="porta__frame">
<div class="stage">
<div class="intro" data-motion="copy">
{lockup_html()}
<p class="lede">{t['lede']}</p>
<p class="status">{t['status']}</p>
<p class="cta-row"><a class="cta" href="#lista">{t['cta']}</a></p>
</div>
<div class="entrance" role="img" aria-label="{photo.alt(k)}" style="{scene_style}">
{scene_html}
</div>
</div>
<div class="porta__band"><a class="porta__cue" href="#lista" tabindex="-1" aria-hidden="true" data-motion="cue">{CHEVRON}</a></div>
</div>
<div class="porta__flood" data-motion="flood"></div>
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
            ("Responsável", "A&nbsp;Brazileira, Torres Vedras, Portugal. Contacto: {mail}."),
            ("Dados", "O seu email, o idioma da página e a data e hora do consentimento."),
            ("Finalidade", "Avisar sobre a abertura de A&nbsp;Brazileira."),
            ("Fundamento", "O seu consentimento (art. 6.º, n.º 1, alínea a) do RGPD). Dar o email é opcional; sem ele, "
                           "não o podemos avisar. Pode retirar o consentimento a qualquer momento, sem afetar a licitude "
                           "do tratamento feito antes. Para isso, basta escrever para {mail}."),
            ("Conservação", "Até retirar o consentimento ou, no máximo, 24 meses após a inscrição."),
            ("Subcontratante", "Supabase, que aloja a base de dados em servidores na União Europeia (Paris). Ao receber "
                               "o formulário, regista também, por pouco tempo, dados técnicos do pedido (endereço IP e "
                               "navegador)."),
            ("Alojamento", "Este site é servido pelo GitHub Pages (GitHub, Inc.), que regista os endereços IP de quem "
                           "o visita, por razões de segurança."),
            ("Transferências", "A Supabase e a GitHub são empresas dos Estados Unidos. Se tratarem dados fora da União "
                               "Europeia, fazem-no com as garantias previstas no RGPD, como o Quadro de Privacidade de "
                               "Dados UE-EUA ou cláusulas contratuais-tipo."),
            ("Direitos", "Tem direito de acesso, retificação, apagamento, limitação, oposição e portabilidade, "
                         "através de {mail}. Pode também apresentar reclamação à Comissão Nacional de Proteção de Dados "
                         "({cnpd})."),
            ("Cookies", "Este site não usa cookies nem ferramentas de análise. Se escolher Dia ou Noite, essa escolha "
                        "fica guardada apenas no seu navegador. Além do alojamento, o único pedido a terceiros acontece "
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
            ("Controller", "A&nbsp;Brazileira, Torres Vedras, Portugal. Contact: {mail}."),
            ("Data", "Your email address, the language of the page and the date and time of your consent."),
            ("Purpose", "To let you know when A&nbsp;Brazileira opens."),
            ("Legal basis", "Your consent (Article 6(1)(a) of the GDPR). Giving your email address is optional; "
                            "without it, we cannot let you know. You can withdraw your consent at any time, without "
                            "affecting the lawfulness of processing carried out before. To do so, write to {mail}."),
            ("Retention", "Until you withdraw your consent or, at most, 24 months after you sign up."),
            ("Processor", "Supabase, which hosts the database on servers in the European Union (Paris). When it "
                          "receives the form, it also keeps technical request data (IP address and browser) for a "
                          "short time."),
            ("Hosting", "This site is served by GitHub Pages (GitHub, Inc.), which logs visitors' IP addresses for "
                        "security purposes."),
            ("Transfers", "Supabase and GitHub are companies based in the United States. If they process data outside "
                          "the European Union, they do so with the safeguards provided for in the GDPR, such as the "
                          "EU-US Data Privacy Framework or standard contractual clauses."),
            ("Your rights", "You have the right of access, rectification, erasure, restriction, objection and "
                            "portability, through {mail}. You can also lodge a complaint with the Portuguese data "
                            "protection authority, CNPD ({cnpd})."),
            ("Cookies", "This site does not use cookies or analytics tools. If you choose Day or Night, that choice "
                        "is stored only in your browser. Apart from hosting, the only request to a third party "
                        "happens when you submit the form."),
        ],
        updated="Last updated: November 2026.",
        back="Back to home",
    ),
}


def page_privacy(k):
    t = T[k]
    c = dict(PRIVACY[k])
    c["intro"], c["updated"] = nb(c["intro"]), nb(c["updated"])
    c["sections"] = [(h, nb(b)) for h, b in c["sections"]]
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
    # the same top bar as every page (Dia · Noite, PT · EN); the script is resolved against <base> like the styles
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
<script src="assets/js/site.js" defer></script>
</head>
<body class="page-404">
{topbar(T["pt"], "./", "en/", None)}
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
    # the photo's placeholders (24px, drawn blurred), one per theme, are theme tokens like any other
    css = css.replace("LQIP_DIA", photo.lqip_svg(photo.P["lqip"]["dia"])).replace("LQIP_NOITE", photo.lqip_svg(photo.P["lqip"]["noite"]))
    return css


# ---------------------------------------------------------------- shipped CSS / JS
# src/ keeps every comment (they are the documentation); docs/ ships without them. The sources have no "/*" or
# "//" comment markers inside strings or regular expressions except the URLs below (checked), so stripping is
# a plain pass; the build asserts nothing else changed shape (same tokens once whitespace is ignored).
def min_css(css):
    out = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    out = re.sub(r"\s+", " ", out)
    out = re.sub(r"\s*([{};,>])\s*", r"\1", out)
    out = re.sub(r"\s*:\s*(?=[^{}]*;)", ":", out)       # declarations only (never selectors like a:hover)
    out = out.replace(";}", "}").strip() + "\n"
    bare = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    assert out.count("{") == bare.count("{") and out.count("}") == bare.count("}"), "CSS blocks changed"
    assert re.sub(r"\s", "", out) == re.sub(r"\s", "", bare).replace(";}", "}"), "CSS changed beyond whitespace"
    return out


def min_js(js):
    out = re.sub(r"/\*.*?\*/", "", js, flags=re.S)
    out = "\n".join(l.strip() for l in out.split("\n") if l.strip())
    assert "//" not in out.replace("https://", ""), "a // comment would need a real parser"
    return out + "\n"


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
    write(os.path.join(DOCS, "index.html"), page("pt"))
    write(os.path.join(DOCS, "en/index.html"), page("en"))
    write(os.path.join(DOCS, "privacidade/index.html"), page_privacy("pt"))
    write(os.path.join(DOCS, "en/privacy/index.html"), page_privacy("en"))
    write(os.path.join(DOCS, "404.html"), page404())
    write(os.path.join(DOCS, "assets/css/tokens.css"), min_css(tokens_css()))
    write(os.path.join(DOCS, "assets/css/site.css"), min_css(read(os.path.join(SRC, "site.css"))))
    write(os.path.join(DOCS, "assets/js/site.js"), min_js(read(os.path.join(SRC, "site.js"))))
    for f in ["brazileira-wordmark.woff2", "cinzel-caps-400.woff2", "eb-garamond-400.woff2", "eb-garamond-500.woff2",
              "OFL-cinzel-decorative.txt", "OFL-cinzel.txt", "OFL-eb-garamond.txt"]:
        copy("fonts/" + f, "assets/fonts/" + f)
    for f in ["apple-touch-icon.png", "icon-512.png", "emblem.svg", "og.jpg"]:
        copy("img/" + f, "assets/img/" + f)
    shipped = 0
    for theme in ("dia", "noite"):                 # the photo layers, exactly the files photo.json lists
        for name, files in sorted(photo.P["layers"][theme].items()):
            for f in files:
                for fmt in ("avif", "webp"):
                    copy(f"photo/{theme}/{name}-{f['w']}.{fmt}", f"assets/photo/{theme}/{name}-{f['w']}.{fmt}")
                    shipped += f[fmt]
    copy("favicon.svg", "favicon.svg")
    write(os.path.join(DOCS, ".nojekyll"), "")
    # GitHub Pages custom domain; keeps the domain attached on every rebuild
    write(os.path.join(DOCS, "CNAME"), "abrazileira.com\n")
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
    write(os.path.join(DOCS, "design/index.html"), styleguide.render(emblem, scene_markup, lockup_html, T, waitlist, THEME_HEAD, photo))
    stamp(DOCS)
    fp = {t: {w: round(photo.bytes_first_paint(t, w) / 1024, 1) for w in (720, 1080, 1300)} for t in ("dia", "noite")}
    print("built", DOCS, "photo layers", round(shipped / 1024), "KB; first paint (AVIF KB by scene device px):", fp)


if __name__ == "__main__":
    main()
