# Arte de Comunismo a la tica

Familia de ilustraciones vectoriales para la portada, los dieciséis capítulos y
el epílogo. Autoría del libro: **josoroma + AI Corpus**. El logotipo Josoroma es el
mismo archivo vectorial del libro de referencia, conservado con sus trazados y
colores originales.

## Dirección visual

Las escenas acompañan el tema editorial de
[Los arquitectos del Estado](https://josoroma.github.io/Los-Arquitectos-del-Estado/)
con una familia nueva de objetos: imprentas, espacios de reunión, bananos,
urnas, radios, libros, fábricas, pancartas y mesas compartidas. El emblema lateral
reúne un libro abierto y tres personas; es una marca de esta edición, no el
logotipo de ningún partido.

Cada escena responde al contenido de su capítulo. Son **interpretaciones
editoriales, no reconstrucciones documentales** de lugares o acontecimientos.
El número de personas, sillas y objetos no representa una cifra histórica.
Los edificios y pancartas tampoco reproducen sedes ni insignias partidarias.
Las imágenes tienen fondo transparente, sombras suaves y colores propios que
se conservan en los temas claro y oscuro.

| Material | Color principal |
| --- | --- |
| Papel y muros | `#f2eadb` |
| Tinta y bases | `#183c34` |
| Vegetación | `#35604a` |
| Teja | `#af6048` |
| Acentos rojos | `#9c4035` |
| Madera y latón | `#72513a`, `#b58a45` |

## Fuentes y reproducción

- `build.mjs`: código editable y autónomo; genera dieciocho escenas y el emblema.
- `capitulos.json`: rutas, títulos, textos alternativos y descripciones;
  se regenera desde los metadatos del script.
- `../assets/img/portada.svg`: portada de 1000 × 1000 unidades.
- `../assets/img/capitulos/01.svg` a `17.svg`: escenas de 1000 × 680 unidades.
- `../assets/img/emblema.svg`: marca de libro y comunidad, de 80 × 96 unidades.
- `../assets/img/josoroma.svg`: logotipo original del autor; no lo modifica el
  generador.

Desde la raíz del repositorio:

```sh
node docs/art/build.mjs
```

Requiere Node.js 20 o posterior, sin paquetes npm, descargas, fuentes externas
ni servicios de imágenes. Los SVG contienen geometría vectorial, no imágenes
raster incrustadas. El generador cuantiza los cálculos geométricos para reducir
las diferencias de redondeo entre plataformas.

Las primitivas de proyección, materiales y objetos proceden del generador
original de Josoroma en
[docs/art/build.mjs de Los arquitectos del Estado](https://github.com/josoroma/Los-Arquitectos-del-Estado/blob/main/docs/art/build.mjs),
adaptado aquí con nuevas escenas y objetos. Se corrigió el orden de construcción
del zócalo y las paredes y se añadieron personas, bananos, radio, fábrica,
pancartas, verja, globo, libro abierto y computadora. No se han incorporado
módulos de bibliotecas externas ni emblemas ajenos.

## Comprobaciones

Se revisaron visualmente una hoja de contacto con las diecisiete escenas y la
portada completa mediante Chromium. Se comprobó la validez XML de los veinte
SVG, la presencia de títulos y descripciones en las escenas, la ausencia de
recursos remotos y la reproducción idéntica de los archivos al repetir el
comando de generación. La revisión visual comprueba composición y legibilidad;
no convierte las escenas en evidencia histórica.
