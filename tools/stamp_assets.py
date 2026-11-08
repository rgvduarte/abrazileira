#!/usr/bin/env python3
"""Fingerprint local CSS/JS in every HTML page under docs/.

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
