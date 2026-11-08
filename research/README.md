# Registro de investigación y comprobación

Estos archivos acompañan la primera edición. Son metadatos, notas de trabajo y evidencia estructurada; no contienen el corpus completo.

- `corpus.json`: inventario de las 42 obras y documentos disponibles (32 de la primera versión y 10 incorporados el 7 de noviembre de 2026, marcados con `added`), con identificación, SHA-256 del original cuando consta, páginas y mapa de capítulos. El inventario registra disponibilidad, no acredita lectura íntegra de cada obra.
- `external-*.json`: fuentes externas incorporadas, con URL, fecha y localizador.
- `evidence-NN.json`: afirmaciones vinculadas a las notas de cada capítulo. `visual_checked` registra cotejo de facsímil de esa afirmación, no de toda la obra. Una fila sin esa marca puede apoyarse en texto nativo leído o en OCR que requiere cautela.
- `chronology-*.json`: acontecimientos seleccionados con referencia. `chronology-D.json` reúne los incorporados en la ampliación del 7 de noviembre de 2026.
- `source-notes-*.json`: registros de lectura, discrepancias y límites señalados durante la escritura. Corresponden a la primera versión; sus recuentos y números de nota no se actualizaron con la ampliación, cuyas discrepancias figuran en el registro de vacíos y en las notas.
- `verification.json`: última comprobación local de correspondencia entre notas, metadatos, archivos y páginas. La ejecución pública en Actions usa solo los metadatos; no dispone del corpus privado.

El proceso incluyó lectura distribuida de capítulos de las fuentes, construcción de las afirmaciones y sus contrapuntos, redacción, revisión de referencias y edición del lector. La matriz final registra el vínculo resultante; su existencia no constituye por sí sola prueba de que una inferencia sea correcta. Las conclusiones causales requieren lectura crítica y admiten revisión.

La comprobación automática no compara cada oración de una paráfrasis con una fuente. Tampoco certifica todos los nombres y cifras de todos los libros extraídos. Las revisiones visuales selectivas, los errores detectados y las comprobaciones técnicas del lector se describen en el registro editorial. El alcance de cada prueba se mantiene separado de la evaluación histórica.

Para reproducir las comprobaciones y la consulta local, véase el README del repositorio.
