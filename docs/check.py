#!/usr/bin/env python3
"""Verificar anclas, enlaces locales y estructura del HTML generado."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json

DOCS=Path(__file__).resolve().parent
class Reader(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids=[]; self.links=[]; self.articles=0
    def handle_starttag(self,tag,attrs):
        d=dict(attrs)
        if 'id' in d:self.ids.append(d['id'])
        if tag=='article':self.articles+=1
        for key in ('href','src'):
            if key in d:self.links.append(d[key])
p=Reader();p.feed((DOCS/'index.html').read_text());errors=[]
for i,n in Counter(p.ids).items():
    if n>1:errors.append(f'ID duplicado: {i}')
for link in p.links:
    u=urlsplit(link)
    if u.scheme or u.netloc:continue
    if u.path and not (DOCS/unquote(u.path)).exists():errors.append(f'Archivo enlazado inexistente: {link}')
    if not u.path and u.fragment and unquote(u.fragment) not in p.ids:errors.append(f'Ancla inexistente: {link}')
for row in json.loads((DOCS/'assets/search.json').read_text()):
    if row['id'] not in p.ids:errors.append(f'Búsqueda sin destino: {row["id"]}')
if p.articles != 23:errors.append(f'Se esperan 23 documentos, hay {p.articles}')
print(json.dumps({'documents':p.articles,'anchors':len(p.ids),'links':len(p.links),'errors':errors},ensure_ascii=False,indent=2))
raise SystemExit(bool(errors))
