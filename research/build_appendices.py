#!/usr/bin/env python3
"""Regenerar bibliografía, cronología y matriz a partir de registros editoriales."""
import json
import re
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent
R=ROOT/'research'
corpus={x['id']:x for x in json.loads((R/'corpus.json').read_text())}
external={x['id']:x for p in sorted(R.glob('external-*.json')) for x in json.loads(p.read_text())}
chapters={int(p.name[:2]):p.name for p in ROOT.glob('[0-9][0-9]-*.md') if 1<=int(p.name[:2])<=17}
def cell(s):return str(s or '—').replace('|','\\|').replace('\n',' ')
def label(source):
    s=corpus.get(source) or external.get(source)
    return s.get('title',source) if s else source
def page_text(pages):
    if not pages:return 'Localizador en la nota'
    result=[]
    for page in sorted(set(pages)):
        if result and page==result[-1][-1]+1:result[-1].append(page)
        else:result.append([page])
    return ', '.join(str(x[0]) if len(x)==1 else f'{x[0]}–{x[-1]}' for x in result)
evidence=[]
for p in sorted(R.glob('evidence-*.json')):
    chapter=int(p.stem.split('-')[1])
    for row in json.loads(p.read_text()):evidence.append(dict(row,chapter=chapter))
used={r['source'] for r in evidence if isinstance(r.get('source'),str)}
main=['# Fuentes y auditoría del corpus\n', 'El inventario inicial comprende 32 obras y documentos. La selección se hizo por pertinencia histórica; disponibilidad no equivale a uso ni a lectura integral de cada obra. Los capítulos utilizados y sus páginas están identificados en las notas y en la matriz. El corpus permanece en la biblioteca local y no se redistribuye con este ensayo.\n', '## Fuentes locales utilizadas\n', 'Las ediciones se identifican a partir de los registros de extracción y de los créditos revisados. «Sin año confirmado» conserva una incertidumbre bibliográfica; no fecha la obra mediante una conjetura. En obras colectivas, las notas de capítulo identifican la autoría específica.\n']
for id,s in corpus.items():
    if id not in used:continue
    main += [f'### {s["title"]}\n', f'**{s.get("author") or "Autoría en el documento"}.** {s.get("publisher") or "Edición identificada en la fuente"}. {s.get("year") or "Sin año confirmado en el registro"}. {s["pdf_pages"]} páginas PDF.\n', f'Identificador local: `{id}`. Extracción: {"OCR; cotejo visual selectivo, no revisión íntegra" if s.get("requires_ocr") else "texto nativo con facsímiles; no revisión íntegra palabra por palabra"}.\n']
    if s.get('source_url'):main.append(f'[Original o fuente de procedencia]({s["source_url"]}).\n')
    else:main.append('La copia consultada es local; no se registró una URL pública del original. Las notas identifican el archivo y la página para consulta con `pagina.py`.\n')
    main.append('Capítulos del ensayo que la utilizan: '+', '.join(f'[{n:02}]({chapters[n]})' for n in sorted({x['chapter'] for x in evidence if x.get('source')==id}))+'.\n')
main += ['## Criterios de lectura\n','Botey y Cisneros aportan una reconstrucción de antecedentes y fundación con un criterio de maduración revolucionaria que el ensayo discute. Molina permite contrastar movilización y rendimiento electoral. Rojas reconstruye la lucha social y la guerra; su ejemplar presenta omisiones materiales. Cortés estudia la ruptura y sus representaciones. Álvarez Garro analiza discursos de la década de 1950; esa muestra no acredita por sí sola su continuidad hasta 2026.\n','Los discursos de Mora y la memoria de Fallas son declaraciones situadas, no balances neutrales. La novela se utiliza como literatura. Los capítulos de *Luces y sombras* ofrecen estudios diferenciados del liberacionismo, las redes internacionales, el sindicalismo y la prensa cultural. Castro Méndez aporta una interpretación del derecho colectivo, que se atribuye y no sustituye los expedientes originales. Gómez Campos estudia organización partidaria en un período específico.\n','## Inventario completo disponible al iniciar\n','Esta tabla documenta la auditoría de disponibilidad. «Citada» significa presencia en las filas de evidencia del ensayo; «Contexto disponible» no acredita consulta sustantiva ni uso como prueba.\n','| Obra | Autoría registrada | PDF | Uso |\n|---|---|---:|---|\n']
for id,s in corpus.items():main.append(f'| {cell(s["title"])} | {cell(s.get("author"))} | {s["pdf_pages"]} | {"Citada" if id in used else "Contexto disponible"} |\n')
main += ['\n## Documentación externa\n','Las fuentes incorporadas para ampliar o contrastar el corpus se registran en [Fuentes para 1984–2026](94-fuentes-1984-2026.md). El registro incluye también documentos oficiales retrospectivos relevantes para períodos anteriores. Las afirmaciones de fuentes partidarias se distinguen de hechos corroborados.\n']
(ROOT/'92-fuentes.md').write_text('\n'.join(main))
out=['# Fuentes incorporadas para 1984–2026\n','Registro de documentación externa consultada para esta edición, separada del corpus inicial. Incluye fuentes retrospectivas para contrastar fechas anteriores. Una página partidaria acredita una declaración; una resolución electoral acredita el resultado o acto que resuelve. La fecha del documento se distingue de la del acontecimiento. Cuando no consta día o mes se conserva esa limitación. Consulta con corte al 6 de noviembre de 2026.\n']
for id,s in sorted(external.items()):
    out += [f'## {s["title"]}\n',f'**Autoría:** {s.get("author", "No consignada")}. **Tipo:** {s.get("type", "Documento identificado en las notas")}.\n',f'**Publicación:** {s.get("date") or "Sin fecha precisa consignada"}. **Acontecimiento o cobertura:** {s.get("event_date") or "Véase documento y nota de capítulo"}. **Consulta:** {s.get("accessed")}.\n',f'[Consultar documento]({s["url"]}). **Localizador:** {s.get("locator")}.\n',f'ID de evidencia: `{id}`. {s.get("notes") or "El alcance del uso se declara en la nota correspondiente."}\n']
(ROOT/'94-fuentes-1984-2026.md').write_text('\n'.join(out))
out=['# Matriz de evidencias\n','Cada fila vincula una afirmación seleccionada con una nota del capítulo. La nota conserva los datos bibliográficos y puede reunir más de una fuente. La matriz es una guía de trazabilidad, no una certificación automática del respaldo semántico de toda la prosa. «Lectura textual» no equivale a cotejo visual; «Facsímil cotejado» se limita al pasaje registrado. Las inferencias y valoraciones son responsabilidad de esta edición.\n']
for ch in sorted(chapters):
    rows=[r for r in evidence if r['chapter']==ch]
    if not rows:continue
    out += [f'## Capítulo {ch:02}' if ch!=17 else '## Epílogo', f'\n[Leer el texto y sus notas]({chapters[ch]}).\n', '| Nota | Afirmación | Fuente y página PDF | Tipo | Contrapunto o límite | Revisión |\n|---:|---|---|---|---|---|\n']
    for row in rows:
        source=row['source']; pages=row.get('pages',[])
        paths=[]
        if source in corpus:
            paths=['`data/books/'+c['file']+'`' for c in corpus[source]['chapters'] if set(pages)&set(c.get('pdf_pages',[]))]
        source_text=f'{label(source)}. {page_text(pages)}. '+ ('; '.join(paths) if paths else f'`{source}`')
        if row.get('visual_pages_checked'):
            review=('Facsímil cotejado: ' if row.get('visual_checked') else 'Cotejo visual parcial: ')+page_text(row['visual_pages_checked'])
        else:
            review='Facsímil del pasaje cotejado' if row.get('visual_checked') else 'Lectura textual; sin cotejo visual registrado'
        out.append(f'| {row["note"]} | {cell(row["claim"])} | {cell(source_text)} | {cell(row["type"])} | {cell(row.get("counterpoint"))} | {review} |\n')
(ROOT/'93-matriz-de-evidencias.md').write_text('\n'.join(out))
events=[]
for p in sorted(R.glob('chronology-*.json')):
    events+=json.loads(p.read_text())
def date_key(e):
    d=str(e['date']);m=re.search(r'\d{4}',d)
    return ((m.group() if m else '9999'),d)
out=['# Cronología documentada\n','Selección de acontecimientos tratados en el libro. Las fechas amplias se conservan como períodos; no se inventa un día para dar una precisión que la fuente no ofrece. La cronología no identifica coaliciones con fusiones ni programas con realizaciones.\n','## Antecedentes y recorrido\n','| Fecha o período | Acontecimiento | Referencia |\n|---|---|---|\n']
for e in sorted(events,key=date_key):
    source=e['source'];source=source[0] if isinstance(source,list) else source
    url=(external.get(source) or corpus.get(source) or {}).get('url') or (corpus.get(source) or {}).get('source_url')
    ref=f'[{label(source)}]({url})' if url else f'{label(source)} (`{source}`)'
    if e.get('pages'):ref+='; PDF '+page_text(e['pages'])
    out.append(f'| {cell(e["date"])} | {cell(e["event"])} | {cell(ref)} |\n')
out += ['\n## Corte de la edición\n','6 de noviembre de 2026. No se presentan hechos posteriores al corte como acontecimientos cumplidos. Las referencias completas están en las fuentes y las notas de cada capítulo.\n']
(ROOT/'90-cronologia.md').write_text('\n'.join(out))
print(f'Apéndices: {len(used & set(corpus))} obras citadas, {len(external)} fuentes externas, {len(evidence)} filas, {len(events)} acontecimientos.')
