#!/usr/bin/env python3
"""Buscar texto en el manuscrito o, mediante --corpus, en fuentes locales."""
import argparse
from pathlib import Path
from corpus_tools import ROOT, CORPUS

p = argparse.ArgumentParser(description=__doc__)
p.add_argument('texto')
p.add_argument('--corpus', action='store_true')
p.add_argument('--limite', type=int, default=30)
a = p.parse_args()
base = CORPUS if a.corpus else ROOT
paths = sorted(base.glob('*/chapters/*.md') if a.corpus else base.glob('[0-9][0-9]-*.md'))
if not paths:
    p.error(f'No hay Markdown en {base}; para fuentes locales configure BOOK_CORPUS.')
hits = 0
for path in paths:
    for n, line in enumerate(path.read_text().splitlines(), 1):
        if a.texto.casefold() in line.casefold():
            print(f'{path.relative_to(base)}:{n}: {line[:500]}')
            hits += 1
            if hits >= a.limite:
                raise SystemExit(0)
if not hits:
    print('Sin coincidencias.')
