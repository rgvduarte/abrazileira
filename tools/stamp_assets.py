#!/usr/bin/env python3
"""Cache-bust local CSS/JS references in every HTML page under docs/.

GitHub Pages serves files with `cache-control: max-age=600`, so a browser can pair
new HTML with a stale stylesheet. Appending `?v=<content-hash>` to each local
stylesheet/script URL makes every deploy fetch matching assets.

Usage: python3 tools/stamp_assets.py [docs_dir]
"""
import hashlib
import pathlib
import re
import sys

DOCS = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "docs").resolve()
REF = re.compile(r'(?P<attr>href|src)="(?P<url>(?!https?:|//|data:|#)[^"?#]+\.(?:css|js))(?:\?v=[0-9a-f]+)?"')

def digest(path: pathlib.Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()[:10]

changed = 0
for page in sorted(DOCS.rglob("*.html")):
    text = page.read_text(encoding="utf-8")

    def stamp(m: re.Match) -> str:
        target = (page.parent / m["url"]).resolve()
        if not target.is_file():
            raise SystemExit(f"{page.relative_to(DOCS)}: missing asset {m['url']}")
        return f'{m["attr"]}="{m["url"]}?v={digest(target)}"'

    new = REF.sub(stamp, text)
    if new != text:
        page.write_text(new, encoding="utf-8")
        changed += 1
        print(f"stamped {page.relative_to(DOCS)}")
print(f"{changed} page(s) updated")
