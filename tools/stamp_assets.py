#!/usr/bin/env python3
"""Version the photographs, then fingerprint local CSS/JS, in every HTML page (and stylesheet) under docs/.

GitHub Pages and its CDN cache files for 10 minutes (`max-age=600`), and some caches ignore query
strings. A browser could then pair a new page with an old stylesheet or script (seen on iOS Safari).
Each referenced asset is copied to `name.<content-hash>.ext` and the page points at that file, so
every deploy references files that can only ever hold matching content. The unhashed originals stay
in place for pages that are still cached with the old references.

Usage: python3 tools/stamp_assets.py [docs_dir]
"""
import hashlib
import pathlib
import re
import shutil
import sys

DOCS = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "docs").resolve()
REF = re.compile(r'(?P<attr>href|src)="(?P<url>(?!https?:|//|data:|#)[^"?#]+?)(?P<ext>\.(?:css|js))(?:\?v=[0-9a-f]+)?"')
HASHED = re.compile(r"\.[0-9a-f]{10}$")

def digest(path: pathlib.Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()[:10]

# The photographs (assets/photo/<theme>/...): many files, and paths the scripts build from a stem (door3d.js adds
# ".avif" / ".webp"), so they are versioned as a set: a copy under assets/photo/v<hash>/, the hash of every file in
# the set, and every page points there. A page from this deploy can then never be paired with a photograph cached
# from an earlier one (seen on iOS Safari, 9 Nov: the previous facade, same file name, framed by the new street).
PHOTO = DOCS / "assets" / "photo"
PREF = re.compile(r"assets/photo/(?:v[0-9a-f]{10}/)?(dia|noite)/")
CREF = re.compile(r"((?:\.\./)*(?:assets/)?)photo/(?:v[0-9a-f]{10}/)?(dia|noite)/")
if PHOTO.is_dir():
    files = sorted(f for f in PHOTO.rglob("*") if f.is_file() and f.relative_to(PHOTO).parts[0] in ("dia", "noite"))
    h = hashlib.sha256()
    for f in files:
        h.update(str(f.relative_to(PHOTO)).encode() + b"\0" + f.read_bytes())
    ver = "v" + h.hexdigest()[:10]
    if not (PHOTO / ver).is_dir():
        for f in files:
            target = PHOTO / ver / f.relative_to(PHOTO)
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(f, target)
    for page in sorted(DOCS.rglob("*.html")):
        text = page.read_text(encoding="utf-8")
        new = PREF.sub(lambda m: f"assets/photo/{ver}/{m[1]}/", text)
        if new != text:
            page.write_text(new, encoding="utf-8")
            print(f"photos {ver} in {page.relative_to(DOCS)}")
    # the stylesheets too (review, door finish): the street's paving strips are CSS backgrounds in tokens.css
    # (url("../photo/<theme>/street-....avif")). Left unversioned, the CSS entrance drew this deploy's facade inside a
    # street Safari may hold from an earlier one, and the 3D path (which reads the strip's stem from the page) fetched
    # the same strip a second time under the versioned name. Rewritten here, before the CSS/JS fingerprint pass below,
    # so the stylesheet's own fingerprint covers the version it names.
    for sheet in sorted(DOCS.rglob("*.css")):
        if HASHED.search(sheet.stem):
            continue
        text = sheet.read_text(encoding="utf-8")
        new = CREF.sub(lambda m: f"{m[1]}photo/{ver}/{m[2]}/", text)
        if new != text:
            sheet.write_text(new, encoding="utf-8")
            print(f"photos {ver} in {sheet.relative_to(DOCS)}")
    used = set()
    for f in DOCS.rglob("*"):                         # the pages and the unfingerprinted sheets (the copies follow them)
        if f.suffix == ".html" or (f.suffix == ".css" and not HASHED.search(f.stem)):
            used.update(re.findall(r"photo/(v[0-9a-f]{10})/", f.read_text(encoding="utf-8")))
    for d in PHOTO.iterdir():
        if d.is_dir() and re.fullmatch(r"v[0-9a-f]{10}", d.name) and d.name not in used:
            shutil.rmtree(d)

changed = 0
for page in sorted(DOCS.rglob("*.html")):
    text = page.read_text(encoding="utf-8")

    def stamp(m: re.Match) -> str:
        stem, ext = m["url"], m["ext"]
        if HASHED.search(stem):                      # already fingerprinted: verify it exists
            if not (page.parent / (stem + ext)).resolve().is_file():
                raise SystemExit(f"{page.relative_to(DOCS)}: missing asset {stem + ext}")
            return m.group(0)
        source = (page.parent / (stem + ext)).resolve()
        if not source.is_file():
            raise SystemExit(f"{page.relative_to(DOCS)}: missing asset {stem + ext}")
        h = digest(source)
        target = source.with_name(f"{source.stem}.{h}{ext}")
        if not target.exists():
            shutil.copyfile(source, target)
        return f'{m["attr"]}="{stem}.{h}{ext}"'

    new = REF.sub(stamp, text)
    if new != text:
        page.write_text(new, encoding="utf-8")
        changed += 1
        print(f"stamped {page.relative_to(DOCS)}")

# drop fingerprinted copies that no page references any more (keeps docs/ from growing on every deploy)
referenced = set()
for page in DOCS.rglob("*.html"):
    for m in re.finditer(r'(?:href|src)="([^"?#]+\.[0-9a-f]{10}\.(?:css|js))"', page.read_text(encoding="utf-8")):
        referenced.add((page.parent / m.group(1)).resolve())
for f in DOCS.rglob("*"):
    if f.is_file() and re.search(r"\.[0-9a-f]{10}\.(css|js)$", f.name) and f.resolve() not in referenced:
        f.unlink()
print(f"{changed} page(s) updated")
