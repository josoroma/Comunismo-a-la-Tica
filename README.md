# Comunismo a la tica

**Organización popular, reforma social y transformaciones de las izquierdas en Costa Rica, 1931–2026.**

Un libro original de historia por **josoroma + AI Corpus**.

[Leer el libro](https://josoroma.github.io/Comunismo-a-la-Tica/) · [Nota de método](00-portada-y-nota-de-metodo.md) · [Fuentes](92-fuentes.md) · [Registro de vacíos](91-registro-de-vacios.md)

El libro examina cómo se combinaron organización popular, participación electoral, negociación de reformas y proyectos de transformación. Sigue al comunismo histórico y sus relaciones con otras izquierdas, incluidos el Frente Amplio y el Partido de los Trabajadores, después denominado De la Clase Trabajadora. El título es una pregunta sobre una identidad disputada, no una explicación basada en un supuesto carácter nacional.

Dieciséis capítulos y un epílogo recorren desde los antecedentes de 1931 hasta el **6 de noviembre de 2026**. La división de Vanguardia Popular en 1983–1984 es una inflexión; seis capítulos desarrollan el período posterior. El libro distingue continuidad jurídica, circulación de militantes, afinidad doctrinal, alianzas y memoria. Los resultados de 2026 se apoyan en documentación oficial; las propuestas para 2026–2030 se presentan como propuestas.

Esta edición reúne aproximadamente **37.000 palabras de texto principal**, 257 notas y 296 registros de evidencia. Utiliza 12 obras del corpus local y 43 fuentes externas. El conteo del texto principal incluye la nota de método y el epílogo, y excluye notas y apéndices.

## Leer y revisar

El lector incluye una portada con la firma **Josoroma + AI Corpus**, un recorrido visual por los 16 capítulos y el epílogo, índice por secciones, búsqueda, enlaces estables, notas con retorno, progreso de lectura, temas claro y oscuro y presentación móvil. Su contenido permanece legible sin JavaScript. El tema acompaña al de [Los arquitectos del Estado](https://josoroma.github.io/Los-Arquitectos-del-Estado/), con ilustraciones isométricas originales para este libro. Son interpretaciones editoriales, no reconstrucciones documentales. Sus fuentes editables y procedencia se explican en [docs/art/README.md](docs/art/README.md).

Las notas remiten al corpus local y a documentos externos. La [matriz de evidencia](93-matriz-de-evidencias.md) separa hechos, declaraciones, interpretaciones e inferencias. La [bibliografía reciente](94-fuentes-1984-2026.md) registra procedencia y localizadores de las fuentes incorporadas. El [informe de verificación](research/verification.json) declara qué se comprobó automáticamente y sus límites.

La [revisión editorial y técnica](research/editorial-review.json) registra lectura cruzada, ajustes y pruebas del lector. Los 43 enlaces externos respondieron HTTP 200 al comprobarse. La disponibilidad de un enlace y la correspondencia de una nota no certifican por sí solas el respaldo de una interpretación.

El repositorio contiene texto original y referencias. No incluye las obras completas de terceros utilizadas en la biblioteca local. Esta es una primera edición asistida por IA, abierta a corrección y sin arbitraje académico externo.

## Reproducir el lector

Desde esta carpeta, con Python 3.9 o posterior:

```sh
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python verificar-citas.py
.venv/bin/python docs/build.py
.venv/bin/python docs/check.py
.venv/bin/python -m http.server 8000 --directory docs
```

Abra `http://localhost:8000`. GitHub Actions ejecuta las comprobaciones de metadatos, genera el lector y publica `docs/` en GitHub Pages al actualizar `main`.

## Consultar las fuentes locales

El catálogo de procedencia está en `research/corpus.json`. Para usar las herramientas con la biblioteca original, configure `BOOK_CORPUS` con la ruta a `data/books`:

```sh
export BOOK_CORPUS=/ruta/al/proyecto/data/books
python3 buscar.py 'huelga' --corpus
python3 pagina.py comunismo-a-la-tica-pvp-2020 124
python3 pagina.py comunismo-a-la-tica-pvp-2020 124 --facsimil
python3 verificar-citas.py --corpus
```

Sin `--corpus`, el verificador comprueba metadatos públicos, páginas catalogadas, llamadas, notas y matriz. Con `--corpus`, comprueba además archivos y páginas extraídas, y las citas literales registradas. Ninguno de estos modos demuestra por sí solo el respaldo histórico de una paráfrasis ni la exactitud del OCR. El cotejo visual se registra por afirmación, no se presume para toda una obra.

## Estructura editorial

- `00-…`: portada y método.
- `01-…` a `05-…`: antecedentes, organización, banano, elecciones, alianza y guerra.
- `06-…` a `10-…`: exclusión, anticomunismo, internacionalismo, reconstrucción y fractura.
- `11-…` a `16-…`: reorganización, movimientos sociales, Frente Amplio, PT y 2026.
- `17-…`: epílogo y examen de la tesis.
- `90-…` a `94-…`: cronología, vacíos, fuentes y matriz de evidencia.
- `research/`: metadatos, evidencia estructurada y registros de revisión.
- `docs/`: fuentes del lector y versión estática reproducible.

La referencia editorial y técnica fue [Los arquitectos del Estado](https://github.com/josoroma/Los-Arquitectos-del-Estado). Las afirmaciones históricas y la tesis de este libro se investigaron nuevamente. Las obras citadas conservan sus derechos y condiciones de uso; su incorporación a la biblioteca local se apoya en la autorización declarada por su responsable.
