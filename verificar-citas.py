#!/usr/bin/env python3
"""Comprueba trazabilidad, no la verdad de las interpretaciones históricas.

Por defecto verifica manuscrito, catálogo, referencias y matriz sin corpus.
--corpus añade existencia de archivos, texto de páginas y citas registradas.
"""
import argparse
import json
import re
from corpus_tools import ROOT, CORPUS, CATALOG, page_parts, normalize

p = argparse.ArgumentParser(description=__doc__)
p.add_argument('--corpus', action='store_true')
p.add_argument('--json', action='store_true', help='Guardar informe en research/verification.json')
a = p.parse_args()
EDITION = '2026-11-08'  # fecha de la edición; el corte de los acontecimientos sigue siendo el 6 de noviembre
external = {}
errors, warnings = [], []
stats = dict(chapters=0, notes=0, corpus_references=0, web_references=0, pages_checked=0, evidence_rows=0, literal_quotes_checked=0, facsimile_review_rows=0)
for f in sorted((ROOT/'research').glob('external-*.json')):
    for record in json.loads(f.read_text()):
        if record['id'] in external and external[record['id']] != record:
            errors.append(f'ID externo duplicado y distinto: {record["id"]}')
        external[record['id']] = record
        for field in ['author', 'title', 'url', 'accessed', 'locator']:
            if not record.get(field):
                errors.append(f'{f.name}: falta {field} en {record["id"]}')
        if record.get('accessed', '9999') > EDITION:
            errors.append(f'Consulta posterior a la edición: {record["id"]}')
seen_pages = set()
for f in sorted(ROOT.glob('[0-9][0-9]-*.md')):
    number = int(f.name[:2])
    if not 1 <= number <= 17:
        continue
    stats['chapters'] += 1
    text = f.read_text()
    if '\n## Notas\n' not in text:
        errors.append(f'{f.name}: falta sección Notas'); continue
    body, apparatus = text.split('\n## Notas\n', 1)
    note_items = re.findall(r'^\s*(\d+)\.\s+(.*?)(?=^\s*\d+\.\s|\Z)', apparatus, re.M|re.S)
    notes = {int(n): item for n,item in note_items}
    if len(notes) != len(note_items): errors.append(f'{f.name}: notas duplicadas')
    calls = set(int(n) for group in re.findall(r'\[(\d+(?:\s*,\s*\d+)*)\](?!\()',body) for n in re.split(r'\s*,\s*',group))
    if calls != set(notes): errors.append(f'{f.name}: llamadas sin nota {sorted(calls-set(notes))}; notas sin llamada {sorted(set(notes)-calls)}')
    if set(notes) != set(range(1,len(notes)+1)): errors.append(f'{f.name}: numeración de notas no consecutiva')
    for n,note in notes.items():
        stats['notes'] += 1
        loc = f'{f.name}, nota {n}'
        cr = re.findall(r'<!--\s*ref:corpus:([^:\s]+):([\d,-]+)\s*-->', note)
        wr = re.findall(r'<!--\s*ref:web:([^\s]+)\s*-->', note)
        if not cr and not wr: errors.append(f'{loc}: falta referencia legible por máquina')
        for source, page_spec in cr:
            stats['corpus_references'] += 1
            if source not in CATALOG:
                errors.append(f'{loc}: fuente no catalogada {source}'); continue
            pages=[]
            for part in page_spec.split(','):
                ends=list(map(int,part.split('-')))
                pages.extend(range(ends[0],ends[-1]+1))
            for page in pages:
                if not 1 <= page <= CATALOG[source]['pdf_pages']:
                    errors.append(f'{loc}: página {page} fuera de {source}'); continue
                covered = [ch for ch in CATALOG[source]['chapters'] if page in ch.get('pdf_pages',[])]
                if not covered: errors.append(f'{loc}: página {page} sin capítulo catalogado')
                if not any(ch['file'] in note for ch in covered):
                    errors.append(f'{loc}: falta ruta de capítulo que contiene PDF {page} de {source}')
                if a.corpus:
                    try:
                        parts=page_parts(source,page)
                        if not parts: errors.append(f'{loc}: encabezado de página no encontrado, PDF {page}')
                        seen_pages.add((source,page))
                    except FileNotFoundError as e: errors.append(str(e))
        for source in wr:
            stats['web_references'] += 1
            if source not in external: errors.append(f'{loc}: fuente externa no registrada {source}')
    ep=ROOT/'research'/f'evidence-{number:02d}.json'
    if not ep.exists():
        errors.append(f'{f.name}: falta matriz JSON'); continue
    evidence=json.loads(ep.read_text())
    evidenced=set()
    for row in evidence:
        stats['evidence_rows'] += 1
        evidenced.add(int(row['note']))
        for field in ['claim','source','type','counterpoint']:
            if not row.get(field): errors.append(f'{ep.name}, nota {row.get("note")}: falta {field}')
        if row.get('visual_checked'): stats['facsimile_review_rows'] += 1
        quote=row.get('quote')
        source=row.get('source')
        if quote and source in CATALOG and a.corpus:
            try:
                extraction=' '.join(t for page in row.get('pages',[]) for _,t in page_parts(source,page))
                fragments=re.split(r'\[?…\]?|\[\.\.\.\]',quote)
                cursor=0
                for fragment in fragments:
                    fragment=normalize(fragment)
                    if not fragment: continue
                    found=normalize(extraction).find(fragment,cursor)
                    if found < 0:
                        errors.append(f'{ep.name}, nota {row["note"]}: cita no coincide en orden con extracción'); break
                    cursor=found+len(fragment)
                else: stats['literal_quotes_checked'] += 1
            except FileNotFoundError as e: errors.append(str(e))
    if evidenced != set(notes): errors.append(f'{ep.name}: notas sin matriz {sorted(set(notes)-evidenced)}; matriz sin nota {sorted(evidenced-set(notes))}')
stats['pages_checked']=len(seen_pages)
if stats['chapters'] != 17: errors.append(f'Se esperan 16 capítulos y epílogo; encontrados {stats["chapters"]}')
if not a.corpus: warnings.append('Sin corpus: páginas contrastadas solo con catálogo. No se verificó el texto de las fuentes locales.')
warnings.append('Las comprobaciones automáticas no certifican respaldo semántico, causalidad, representatividad ni exactitud del OCR. La revisión de facsímiles se registra por afirmación; no cubre todas las páginas.')
report={'mode':'local-corpus' if a.corpus else 'public-metadata','cutoff':'2026-11-06','edition':EDITION,'counts':stats,'errors':errors,'limitations':warnings}
if a.json: (ROOT/'research/verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False,indent=2))
raise SystemExit(bool(errors))
