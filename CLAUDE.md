# Proyecto: sitio de autores que pasan a dominio público

Nombre del sitio: **a definir** (candidatos: Faltan, Hora Libre, Primero de Enero). "Año Libre" es el nombre provisorio del prototipo y está descartado.

## Objetivo

Un sitio web que lista, año por año, los autores cuya obra pasa a dominio público, con un perfil por autor que incluye un contador ("Faltan 27 años para que quede libre"). Foco en Argentina y Latinoamérica, que es el diferencial frente a los sitios existentes (casi todos en inglés y centrados en EE.UU.).

## Cómo trabajar en este repositorio

- Responder y escribir en español rioplatense (voseo).
- Nunca inventar datos: fechas, obras o biografías que no se puedan verificar se marcan como pendientes.
- Trabajar en pasos chicos, mostrar el plan antes de cambios grandes y probar cada cambio.
- Las correcciones manuales van en `datos/correcciones.csv` y las fichas curadas en `datos/autores_curados.json`; nunca editar a mano los datos generados.

## Estructura

- `consultas/`: consultas SPARQL (plantillas con `{ANIO}` y `{ANIO_SIG}`).
- `datos/correcciones.csv`, `datos/autores_curados.json`: datos editados a mano.
- `datos/generados/`: salida del script (`AAAA.json`, `reporte_AAAA.json`). No editar a mano.
- `datos/referencia/query.csv`: export de 1956 hecho en el chat, para comparar.
- `scripts/generar_anio.py AAAA`: consulta Wikidata, limpia y genera los datos de un año.
- `referencia/`: script original del chat (solo documentación).
- `sitio/`: sitio estático en Astro. Lee `datos/generados/` al compilar (`sitio/src/lib/datos.ts`); compilar desde `sitio/` con `npm run build`. URL de año por año de liberación (`/anio/2027`) y de autor por `nombre-qid` (`/autor/bertolt-brecht-q38757`).
- `prototipo/plantilla.html`: prototipo HTML; `scripts/armar_prototipo.py` le inserta los datos y genera `prototipo/prototipo.html` (no versionado).

## Reglas de cálculo

Año de liberación = año de muerte + plazo + 1 (se libera el 1 de enero).

| Legislación | Plazo |
|---|---|
| Argentina (principal) | vida + 70 |
| Unión Europea | vida + 70 |
| España | vida + 80 si murió antes del 7/12/1987; si no, vida + 70 |
| Vida + 60 | India, Bangladesh, Venezuela |
| Vida + 50 | China, Egipto, buena parte de África y Asia |

- Canadá, Nueva Zelanda y Japón pasaron a vida + 70 sin retroactividad: NO van en vida + 50.
- México aplica vida + 100 (con transiciones complejas): mencionar, no calcular.
- Rusia: +4 años para autores que trabajaron durante la guerra de 1941-1945.
- EE.UU. se rige por fecha de publicación (95 años), no por la muerte del autor: si se agrega, va como sección de obras, no de autores.
- Casos que se marcan como "Caso a verificar": coautorías (cuenta la muerte del último coautor), obras póstumas o anónimas, traducciones, ilustraciones, películas (varios colaboradores), marcas registradas.
- Argentina: el uso comercial de obras en dominio público paga un derecho al Fondo Nacional de las Artes (dominio público pagante). Mencionarlo siempre.
- Todo el sitio lleva el aviso "Información orientativa, no es asesoramiento legal".

## Datos

- Fuente principal: Wikidata vía SPARQL (`consultas/consulta_mejorada.rq`). Correr un año por consulta; los rangos grandes agotan el tiempo.
- Filtros: humano (Q5), ocupación creativa, precisión de fecha ≥ año, 10+ artículos de Wikipedia (bajar a 3 para argentinos, Q414), descartar declaraciones con rango "deprecated".
- La columna `muertesFueraDelAnio` > 0 indica una fecha de muerte en otro año: revisar a mano, porque cambia el cálculo.
- Consulta de argentinos (`consultas/consulta_argentinos.rq`): ciudadanía argentina, 3+ artículos, ocupaciones ampliadas (guionista, periodista, ilustrador, caricaturista, dibujante, libretista, compositor de canciones, cantautor, novelista, ensayista, crítico literario, realizador). Sin traductores (las traducciones son "Caso a verificar"). El script corre las dos consultas por año y las une por QID.
- Periodistas, ensayistas y críticos van en Literatura (no hay categoría "Periodismo" por ahora). Quien entra solo como periodista lleva `solo_periodista: true`: se publica, pero el sitio no lo destaca. Una ficha curada anula la marca.
- Biblioteca Nacional Mariano Moreno: el cruce se hace con el identificador de Wikidata (P3788), que se guarda en el campo `bnmm`. El `robots.txt` del catálogo (catalogo.bn.gov.ar) prohíbe robots: no hacer scraping. VIAF bloquea accesos automáticos. Para un cruce completo, pedir a la BNMM una exportación de autoridades.
- Las consultas usan `MIN` y separador ` | `, y el script ordena países y ocupaciones: el resultado tiene que ser estable entre corridas (si no, la rutina semanal abriría PR sin cambios reales).

### Limpieza (lógica ya probada en `referencia/limpieza_referencia.py`; implementada en `scripts/generar_anio.py`)

1. Wikidata devuelve una fila por combinación de fechas: unificar por QID (216 filas → 175 personas en 1956).
2. Si hay varias fechas de muerte dentro del mismo año, el cálculo no cambia: mostrar solo el año y marcar "Dato a revisar".
3. Si hay varias fechas de nacimiento, mostrar los años posibles ("1886 o 1888").
4. Excluir personas sin nombre en español, inglés ni "mul" (Wikidata está pasando los nombres en alfabeto latino a la etiqueta multilingüe "mul"; sin ella se perdían casos como Einstein o Agustín Lara).
   - Si alguien tiene fechas de muerte en varios años, se publica en el año de la fecha preferida de Wikidata; si ninguna es preferida, aparece en todos esos años con "Dato a revisar" hasta que se corrija a mano.
5. Aplicar `correcciones.csv` y luego las fichas curadas (mandan sobre Wikidata).
6. Limpiar países históricos (Imperio ruso, Raj británico, etc.) y mostrar hasta dos.
7. Asignar categoría: Literatura, Música, Artes visuales, Cine e historieta, Ciencia.
8. Generar un reporte de calidad de datos por año.

## Diseño (del prototipo `prototipo/plantilla.html`)

- Sello como elemento central: violeta (`#5B3A9B`) = protegida, verde (`#2E7D57`) = libre.
- Tipografías: Literata (nombres, biografías) y Public Sans (interfaz).
- Vistas: página por año, perfil de autor (contador, línea de tiempo vida/protección/dominio público, tabla por legislación), buscador, "Cómo calculamos", "Calidad de datos".
- Tema claro y oscuro.

## Hoja de ruta

Meta: lanzar a mediados de diciembre de 2026, antes del 1/1/2027.

Para el lanzamiento:
1. [x] Script que consulte Wikidata directamente, limpie y genere los datos (con reporte de calidad).
2. [x] Datos reales para los años de muerte 1950 a 1976.
3. [x] Consulta aparte para argentinos con notabilidad más baja y más ocupaciones (letristas, guionistas, periodistas, ilustradores); cruzar con la Biblioteca Nacional Mariano Moreno.
   - Pendiente: cruce completo de fechas con la BNMM (pedirles exportación de autoridades o permiso; hoy solo se usa P3788 de Wikidata).
4. [ ] Sitio estático en Astro, con una URL por año y por autor, publicado en GitHub.
5. [ ] Fichas curadas para los 30 a 50 autores más buscados de cada año (redacción propia, no copiada de Wikipedia).
6. [ ] Revisión legal de "Cómo calculamos"; registrar dominio y nombre.

Después del lanzamiento:
7. [ ] Enlaces a obras libres (Wikisource, Gutenberg, Internet Archive, Biblioteca Digital Hispánica).
8. [ ] Fotos de Wikimedia Commons con su atribución.
9. [ ] Formulario de errores; devolver correcciones a Wikidata.
10. [ ] Campaña de diciembre "La clase de 2027", boletín, contacto con editoriales y bibliotecas.

Automatización prevista: rutina semanal en la nube que corre el script, compara con los datos anteriores y abre un pull request si hay cambios.

## Monetización (a 18 meses, no prioritaria para el lanzamiento)

Afiliados de libros y aportes voluntarios desde el día uno; patrocinios de editoriales independientes para la campaña; a mediano plazo, informe anual profesional y datos por suscripción.
