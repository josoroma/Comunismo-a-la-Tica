#!/usr/bin/env python3
"""Compilar Markdown en un lector estático; no requiere el corpus privado."""
import html
import json
import re
import unicodedata
from pathlib import Path
from markdown_it import MarkdownIt

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / 'docs'
MD = MarkdownIt('commonmark', {'html': False}).enable('table')


def slug(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')


def roman(n):
    return ('X' if n >= 10 else '') + ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'][n % 10]


def main():
    files = sorted(ROOT.glob('[0-9][0-9]-*.md'))
    if len([p for p in files if 1 <= int(p.name[:2]) <= 16]) != 16:
        raise SystemExit('Se necesitan los dieciséis capítulos terminados.')
    links = {p.name: 'c' + p.name[:2] for p in files}
    toc, content, search, counts, cards = [], [], [], [], []
    art = json.loads((DOCS / 'art/capitulos.json').read_text())
    manuscript_words = 0
    groups = {0: 'Para comenzar', 1: 'I · Formación y conflicto', 6: 'II · Exclusión y reconstrucción', 11: 'III · Recomponer las izquierdas', 13: 'IV · Nuevos partidos y disputas', 17: 'El balance', 90: 'Archivo del libro'}
    for path in files:
        n = int(path.name[:2])
        raw = re.sub(r'<!--.*?-->', '', path.read_text(), flags=re.S)
        title = re.search(r'^# (.+)$', raw, re.M).group(1)
        title = re.sub(r'^(?:\d+|[IVXLCDM]+)\.\s*', '', title)
        raw = re.sub(r'^# .+\n', '', raw, count=1, flags=re.M)
        cid = links[path.name]
        refs, occurrences = {}, {}

        def render(text, notes=False):
            if not notes:
                def mark(m):
                    nums = re.split(r'\s*,\s*', m.group(1))
                    tokens = []
                    for num in nums:
                        occurrences[num] = occurrences.get(num, 0) + 1
                        rid = f'{cid}-ref-{num}-{occurrences[num]}'
                        refs.setdefault(num, []).append(rid)
                        tokens.append(f'ZZREF{num}O{occurrences[num]}ZZ')
                    return ''.join(tokens)
                text = re.sub(r'\[(\d+(?:\s*,\s*\d+)*)\](?!\()', mark, text)
            result = MD.render(text)
            result = re.sub(r'ZZREF(\d+)O(\d+)ZZ', lambda m: f'<sup><a class="note-ref" id="{cid}-ref-{m[1]}-{m[2]}" href="#{cid}-note-{m[1]}" aria-label="Leer nota {m[1]}">{m[1]}</a></sup>', result)
            for file, dest in links.items():
                result = result.replace(f'href="{file}"', f'href="#{dest}"')
            return result.replace('<table>', '<div class="table-wrap" tabindex="0"><table>').replace('</table>', '</table></div>')

        sections = re.split(r'^## (.+)\n', raw, flags=re.M)
        intro = sections[0].strip()
        body = render(intro)
        sections_nav = []
        body_words = len(re.findall(r'\b\w+\b', intro))
        for i in range(1, len(sections), 2):
            heading, text = sections[i].strip(), sections[i+1].strip()
            sid = cid + '-' + slug(heading)
            is_notes = heading.casefold() == 'notas'
            if is_notes:
                items = re.findall(r'^\s*(\d+)\.\s+(.*?)(?=^\s*\d+\.\s|\Z)', text, re.M | re.S)
                fragment = '<ol class="notes">'
                for number, note in items:
                    back = ' '.join(f'<a class="note-back" href="#{rid}" aria-label="Volver a la referencia {j+1} de la nota {number}">↩{j+1 if len(refs.get(number, []))>1 else ""}</a>' for j, rid in enumerate(refs.get(number, [])))
                    fragment += f'<li id="{cid}-note-{number}" value="{number}">{render(note, True)}<span class="returns">{back}</span></li>'
                fragment += '</ol>'
            else:
                fragment = render(text)
                plain = html.unescape(re.sub(r'<[^>]+>', ' ', fragment))
                plain = re.sub(r'\s+', ' ', plain).strip()
                body_words += len(re.findall(r'\b\w+\b', text))
                search.append({'id': sid, 'chapter': title, 'title': heading, 'text': plain})
                sections_nav.append(f'<li><a href="#{sid}">{html.escape(heading)}</a></li>')
            body += f'<section class="{"apparatus" if is_notes else "section"}" id="{sid}"><h3>{html.escape(heading)}</h3>{fragment}</section>'
        if n in groups:
            toc.append(f'<p class="toc-group">{groups[n]}</p>')
        label = roman(n) if 1 <= n <= 16 else '§' if n == 0 else '✳' if n == 17 else 'A'
        nav_title = 'Nota de método' if n == 0 else title
        toc.append(f'<details class="toc-chapter"><summary><a href="#{cid}"><span>{label}</span>{html.escape(nav_title)}</a></summary><ul>{"".join(sections_nav)}</ul></details>')
        if 1 <= n <= 16:
            counts.append(body_words)
        if n <= 17:
            manuscript_words += body_words
        category = f'Capítulo {roman(n)}' if 1 <= n <= 16 else 'Epílogo' if n == 17 else 'Nota de método' if n == 0 else 'Documentación'
        illustration = ''
        if 1 <= n <= 17:
            image = art[f'{n:02}']
            src, alt = html.escape(image['src']), html.escape(image['alt'])
            if not (DOCS / image['src']).is_file():
                raise SystemExit(f'Falta la ilustración del capítulo {n}: {image["src"]}')
            cards.append(f'<a class="chapter-card{" epilogue-card" if n == 17 else ""}" href="#{cid}"><img src="{src}" width="1000" height="680" loading="lazy" decoding="async" alt=""><span class="chapter-card-copy"><span class="chapter-label">{category}</span><span class="chapter-card-title">{html.escape(title)}</span></span><span class="chapter-arrow" aria-hidden="true">↗</span></a>')
            illustration = f'<figure class="chapter-art"><img src="{src}" width="1000" height="680" loading="lazy" decoding="async" alt="{alt}"><figcaption><strong>{html.escape(image["titulo"])}</strong><span>{html.escape(image["descripcion"])}</span></figcaption></figure>'
        content.append(f'<article id="{cid}" data-chapter="{html.escape(title)}"><header class="chapter-header"><p class="eyebrow">{category}</p><h2>{html.escape(title)}</h2><p class="reading-time">{max(1, round(body_words/210))} min de lectura</p></header>{illustration}{body}<a class="back-to-contents" href="#recorrido">↑ Volver al recorrido</a></article>')
    page = (DOCS / 'template.html').read_text()
    page = page.replace('@@TOC@@', '\n'.join(toc)).replace('@@CONTENT@@', '\n'.join(content)).replace('@@CHAPTER_CARDS@@', '\n'.join(cards))
    page = page.replace('@@WORDS@@', f'{sum(counts):,}'.replace(',', '.'))
    (DOCS / 'index.html').write_text(page)
    (DOCS / 'assets/search.json').write_text(json.dumps(search, ensure_ascii=False, separators=(',', ':')) + '\n')
    (DOCS / 'assets/book.json').write_text(json.dumps({'title': 'Comunismo a la tica', 'cutoff': '2026-11-06', 'chapters': 16, 'chapter_words': counts, 'words_chapters': sum(counts), 'words_manuscript_without_notes': manuscript_words, 'word_count_method': 'Tokens léxicos del texto anterior a Notas; incluye marcadores numéricos y texto de tablas.', 'documents': len(files), 'sections': len(search)}, ensure_ascii=False, indent=2) + '\n')
    print(f'Lector generado: {len(files)} documentos, 16 capítulos, {sum(counts):,} palabras de capítulos, {len(search)} secciones.')


if __name__ == '__main__':
    main()
