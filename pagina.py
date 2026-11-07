#!/usr/bin/env python3
"""Mostrar una página PDF, o su facsímil local, sin confundirla con el folio."""
import argparse
from corpus_tools import CATALOG, CORPUS, page_parts

p = argparse.ArgumentParser(description=__doc__)
p.add_argument('libro', choices=sorted(CATALOG))
p.add_argument('pagina', type=int)
p.add_argument('--facsimil', action='store_true', help='Imprimir ruta del JPEG local')
a = p.parse_args()
if not 1 <= a.pagina <= CATALOG[a.libro]['pdf_pages']:
    p.error('Página fuera del PDF registrado')
if a.facsimil:
    path = CORPUS / a.libro / 'assets' / f'page-{a.pagina:04d}.jpg'
    if not path.exists():
        p.error(f'Facsímil no disponible: {path}')
    print(path)
else:
    try:
        parts = page_parts(a.libro, a.pagina)
    except FileNotFoundError as e:
        p.error(str(e))
    if not parts:
        p.error('Página sin extracción de texto localizable')
    for path, text in parts:
        print(f'\n{path}\nPágina PDF {a.pagina}\n\n{text}')
