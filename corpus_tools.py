"""Consulta del corpus privado. Este módulo no lo descarga ni lo redistribuye."""
import json
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CORPUS = Path(os.environ.get('BOOK_CORPUS', ROOT.parent.parent / 'data' / 'books'))
CATALOG = {d['id']: d for d in json.loads((ROOT / 'research/corpus.json').read_text())}


def page_parts(book, page):
    record = CATALOG[book]
    parts = []
    for chapter in record['chapters']:
        if page not in chapter.get('pdf_pages', []):
            continue
        path = CORPUS / chapter['file']
        if not path.is_file():
            raise FileNotFoundError(f'Falta {path}. Configure BOOK_CORPUS.')
        text = path.read_text(encoding='utf-8')
        match = re.search(rf'^## Página {page} del PDF\s*\n(.*?)(?=^## Página |\Z)', text, re.M | re.S)
        if match:
            text = re.sub(r'<details>.*?</details>', '', match[1], flags=re.S)
            text = re.sub(r'\[Consultar la página.*?\]\(.*?\)', '', text)
            text = text.split('\n---\n')[0].strip()
            parts.append((path, text))
    return parts


def normalize(text):
    return re.sub(r'\s+', ' ', re.sub(r'[*_`]', '', text)).strip().casefold()
