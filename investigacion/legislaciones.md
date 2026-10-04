# Plazos de derecho de autor: investigación para el sitio

Investigación hecha el 4 de octubre de 2026. Sirve de base para "Cómo calculamos", para la tabla por legislación del perfil y para revisar las reglas de `CLAUDE.md`. **No es asesoramiento legal.** Lo que no se pudo confirmar en una fuente primaria está marcado como **[a verificar]**.

Nivel de las fuentes:
- **Primaria**: el texto de la ley en un boletín o base oficial (InfoLEG, BOE, la propia ley).
- **Secundaria**: Wikimedia Commons ("Copyright rules by territory"), Wikipedia, bibliotecas universitarias, prensa especializada.

---

## 1. Resumen: lo que cambia para el sitio

1. **Nueva Zelanda sigue en vida + 50.** `CLAUDE.md` dice que pasó a vida + 70, y es un error. La extensión surge del tratado con la UE, todavía no se aprobó (el plazo para hacerlo vence el 1/5/2028) y no se sabe si será retroactiva.
2. **Argentina aplica la "regla del plazo más corto" a las obras extranjeras** (art. 15, ley 11.723). Si la obra de un autor extranjero se publicó en un país con un plazo menor (China, Cuba, Venezuela, India…), en Argentina se libera antes. Hoy calculamos vida + 70 para todos, así que para esos autores nuestra fecha es un **máximo**, no la fecha exacta.
3. **En Argentina, cine y fotografía tienen otros plazos.** Las películas tienen 50 años desde la muerte del último entre guionista, productor y director. Las fotografías tienen **20 años desde la publicación**, sin importar cuándo murió el fotógrafo. El contador de un fotógrafo o de un director puede confundir si no lo aclaramos.
4. **España con vida + 80 aplica sobre todo a autores de la UE.** Para un autor no europeo cuya obra se publicó primero fuera de la UE, la directiva europea impone la regla del plazo más corto (art. 7). Para un argentino muerto en 1956 publicado en Buenos Aires, en España probablemente rija 2027 y no 2037 **[a verificar con especialista]**.
5. **México no es calculable con seguridad.** Hay al menos tres lecturas de cómo se aplican las extensiones sucesivas (ver 4.3). Mantener la regla de "mencionar, no calcular".
6. **Canadá, Japón y Corea del Sur sí son calculables**, porque tienen fechas de corte claras (ver 5.2). Podrían sumarse a la tabla del perfil.
7. **Uruguay pasó a vida + 70 en 2019 y la extensión fue retroactiva.** Para las muertes de 1950–1976 da lo mismo que Argentina.
8. **Desaparecidos de la dictadura** (por ejemplo, Haroldo Conti, que está en los datos de 1976): no hay fecha de muerte. La ley fija una "fecha presuntiva de desaparición" y no declara la muerte, así que el inicio del plazo es dudoso. Corresponde marcarlo como "Caso a verificar".
9. **Dominio público pagante:** según la Resolución FNA 15.850/1977, se paga un 3 % del precio de tapa en libros. Están exentos los usos exclusivamente culturales o didácticos con acceso libre y gratuito, y los textos escolares aprobados (ver 2.4).

---

## 2. Argentina (ley 11.723), fuente primaria

Texto actualizado en InfoLEG: <http://servicios.infoleg.gob.ar/infolegInternet/anexos/40000-44999/42755/texact.htm>

### 2.1 Plazos

| Caso | Plazo | Artículo |
|---|---|---|
| Regla general | Vida + 70, contados "a partir del 1 de enero del año siguiente al de la muerte del autor" | 5 (ley 24.870, 1997) |
| Obras en colaboración | 70 años desde el 1/1 siguiente a la muerte del **último colaborador** | 5 |
| Obras póstumas | Igual que la regla general: desde la muerte del autor (no desde la publicación) | 5 |
| Autor sin herederos (herencia vacante) | Los derechos pasan al Estado por todo el plazo | 5 |
| Obras anónimas de instituciones, corporaciones o personas jurídicas | **50 años desde la publicación** | 8 (decreto-ley 12.063/57) |
| Fotografías | **20 años desde la primera publicación** | 34 (ley 25.006, 1998) |
| Películas | **50 años desde la muerte del último** de los colaboradores del art. 20: autor del argumento, productor y director | 34 y 20 (ley 25.847, 2004) |
| Interpretaciones fijadas en fonogramas | 70 años desde el 1/1 siguiente a la publicación | 5 bis (ley 26.570, 2009) |

Historia: vida + 30 (1933) → vida + 50 (decreto-ley 12.063/57) → vida + 70 (ley 24.870/97). **La extensión de 1997 fue retroactiva** (art. 84): "Las obras que se encontraren bajo el dominio público, sin que hubiesen transcurrido los términos de protección previstos en esta ley, volverán automáticamente al dominio privado." Para nuestro rango (muertes desde 1950) no cambia nada, porque ninguna de esas obras había llegado a liberarse en 1997.

### 2.2 Obras extranjeras: la regla del plazo más corto

Art. 13: la ley se aplica a las obras publicadas en el extranjero, "sea cual fuere la nacionalidad de sus autores".

Art. 15 (literal): "La protección que la Ley argentina acuerda a los autores extranjeros, no se extenderá a un período mayor que el reconocido por las Leyes del país donde se hubiere publicado la obra. Si tales Leyes acuerdan una protección mayor, regirán los términos de la presente Ley."

Consecuencias:
- El criterio es el **país donde se publicó la obra**, no la nacionalidad del autor. La nacionalidad (lo único que tenemos en Wikidata) es solo una aproximación.
- Si una obra se publicó primero en un país con vida + 50 o vida + 60, en Argentina se libera con ese plazo más corto.
- Si se publicó en un país con un plazo más largo (México, Colombia, España con + 80), en Argentina rige igual vida + 70.
- Si el país de publicación no extendió el plazo en forma retroactiva (Canadá, Japón, Corea, Rusia), una obra que ya está libre allá debería estarlo también acá **[a verificar con especialista: no encontramos jurisprudencia ni doctrina sobre cómo se aplica el art. 15 en la práctica]**.

### 2.3 Obras derivadas, música y derecho moral

- **Traducciones** de obras en dominio público: el traductor "sólo tiene propiedad sobre su versión" y no puede impedir otras traducciones (art. 24). Una traducción tiene su propio plazo, que depende del traductor.
- **Adaptaciones** de obras en dominio público: el adaptador es "dueño exclusivo" de su adaptación (art. 26).
- **Canciones**: "la música y la letra se considerarán como obras distintas" (art. 18), y "no se considera colaboración la mera pluralidad de autores" (art. 17). Esto sugiere que, en Argentina, la letra y la música de un tango pueden liberarse en años distintos según quién murió primero. En la UE es al revés: desde 2011 se cuenta desde la muerte del último entre letrista y compositor (ver 3.1). **[a verificar con especialista; importa para letristas como Discépolo y Manzi]**.
- **Derecho moral**: el autor conserva el derecho a exigir la fidelidad del texto y del título y la mención de su nombre (art. 52). El art. 83 prevé un jurado para denunciar mutilaciones. La doctrina suele considerarlo perpetuo. En España la ley lo dice expresamente: las obras en dominio público se usan "siempre que se respete la autoría y la integridad de la obra" (art. 41 LPI).

### 2.4 Dominio público pagante

- Lo crea el decreto-ley 1224/58 (art. 6), que creó el Fondo Nacional de las Artes (FNA). Lo reglamenta el decreto 6255/58 (art. 6): el FNA fija la forma y el monto, que "no podrán exceder de los vigentes para el dominio privado". El art. 8 exime a los "libros, publicaciones y textos de enseñanza primaria y secundaria que fuesen incluidos en los programas oficiales".
- Los aranceles los fija la Resolución FNA 15.850/1977 (texto ordenado 1978), vigente desde el 1/1/1978 (<https://servicios.infoleg.gob.ar/infolegInternet/anexos/195000-199999/195433/norma.htm>):
  - Ediciones de libros: 3 % sobre el precio de tapa.
  - Música en radio y TV: 10 % de lo que se paga por obras en dominio privado.
  - Teatro y obras literarias en radio: el mismo arancel que en el dominio privado.
  - Exhibición de películas: 30 %.
  - Exentos: los usos "con fines exclusivamente culturales o didácticos en lugares con libre y gratuito acceso de público".
  - **[a verificar: si los porcentajes siguen vigentes o fueron actualizados; hay resoluciones posteriores, como la 16.001/2016 sobre películas en TV]**.
- Quién recauda: el FNA, con convenios con sociedades autorales. SAVA tiene el mandato para artes visuales desde 2012 (<https://www.sava.org.ar/dominio-publico-pagante>).
- En la práctica, las editoriales presentan una declaración jurada de dominio público pagante. El FNA excluye de sus convocatorias a las editoriales con deudas por este concepto (Programa de Apoyo a Editoriales Independientes 2025).
- Constitucionalidad: el Juzgado Contencioso Administrativo Federal N.º 9 la confirmó en *Directv Argentina c/ FNA* (6/6/2023) (<https://www.palabrasdelderecho.com.ar/articulo/4341/La-Justicia-Federal-confirmo-la-constitucionalidad-del-regimen-de-Dominio-Publico-Pagantes>).

### 2.5 Desaparición forzada

La ley 24.321 (1994) permite declarar la "ausencia por desaparición forzada". Fija como "fecha presuntiva" la de la denuncia original o la de la última noticia verificable (art. 6), y sus efectos civiles son "análogos" a los de la ausencia con presunción de fallecimiento (art. 7). **No declara la muerte.** Para el plazo de derecho de autor de Haroldo Conti (desaparecido el 5/5/1976) u otros autores en la misma situación, el inicio del cómputo es jurídicamente dudoso: marcar como "Caso a verificar" y explicarlo con respeto.

---

## 3. Unión Europea y España

### 3.1 Directiva 2006/116/CE (modificada por la 2011/77/UE)

Fuente secundaria confiable (legislation.gov.uk y resúmenes de EUR-Lex). No pude bajar el texto consolidado de EUR-Lex.

- Regla general: vida + 70. Obras en colaboración: desde la muerte del último coautor. Obras anónimas: 70 años desde la divulgación.
- **Películas**: 70 años desde la muerte del último de estos cuatro: director principal, guionista, autor de los diálogos y compositor de la música original. Es más largo y con más personas que en Argentina.
- **Canciones** (desde 2011): desde la muerte del último entre letrista y compositor, si sus aportes se crearon para esa composición.
- **Terceros países (art. 7)**: si el país de origen de la obra (según el Convenio de Berna) no es de la UE y el autor no es ciudadano de la UE, la protección "expirará en la fecha de expiración de la protección concedida en el país de origen", con un máximo de vida + 70. Es la regla del plazo más corto. Afecta a la fila "Unión Europea" de la tabla: un autor chino tendría vida + 50 en la UE.

### 3.2 España (texto refundido de la LPI, RDL 1/1996), fuente primaria

BOE: <https://www.boe.es/buscar/act.php?id=BOE-A-1996-8930>

- Art. 26: vida + 70 "después de su muerte o declaración de fallecimiento". Art. 30: se cuenta desde el 1 de enero del año siguiente.
- **Disposición transitoria cuarta** (literal): "Los derechos de explotación de las obras creadas por autores fallecidos antes del 7 de diciembre de 1987 tendrán la duración prevista en la Ley de 10 de enero de 1879", es decir, vida + 80. Esto confirma la regla de `CLAUDE.md`.
- Art. 28: colaboración y obras audiovisuales, desde la muerte del último coautor. Canciones: desde el último entre letrista y compositor.
- Art. 27: obras anónimas, 70 años desde la divulgación. Obras no divulgadas: 70 años desde la creación.
- **Art. 128, "meras fotografías"** (fotos sin carácter de obra): 25 años desde el 1/1 siguiente a la realización.
- **Art. 129**: quien divulga por primera vez una obra inédita que ya está en dominio público obtiene sus derechos de explotación. Los editores de obras no protegidas tienen derecho sobre su edición (composición tipográfica).
- Art. 41: las obras en dominio público se pueden usar "siempre que se respete la autoría y la integridad de la obra".
- **[a verificar con especialista]** Cómo se combina el + 80 de la transitoria cuarta con el art. 7 de la directiva para autores no europeos. La lectura más probable es que un autor argentino publicado en Argentina tenga en España el plazo argentino (70) y no 80.

### 3.3 Francia: prórrogas de guerra

Fuente secundaria: Commons.

- Las prórrogas eran de 6 años y 152 días (Primera Guerra, obras publicadas hasta 1920) y de 8 años y 120 días (Segunda Guerra, publicadas hasta 1947).
- La Corte de Casación (*Hazan*, 27/2/2007) resolvió que ya no se suman al plazo de 70 años, salvo casos residuales.
- Sigue vigente el **+ 30 años para autores "morts pour la France"** (por ejemplo, Saint-Exupéry, muerto en 1944), aunque se discute su alcance.
- Para nuestras muertes de 1950–1976 casi no aplica, pero conviene mencionarlo.

### 3.4 Reino Unido

Fuente secundaria. Vida + 70. Las obras **inéditas** de autores muertos antes de 1969 están protegidas hasta fines de 2039, sin importar cuándo murió el autor.

---

## 4. América Latina

### 4.1 Tabla

| País | Plazo | Ley | Notas | Fuente |
|---|---|---|---|---|
| Argentina | Vida + 70 | Ley 11.723 (ley 24.870/97) | Retroactiva; ver sección 2 | Primaria |
| Bolivia | Vida + 50 | Ley 1322 (1992), art. 18 | Hay un proyecto para llevarlo a 75 (PL 014/2023-2024); no encontré que se haya aprobado **[a verificar]** | Secundaria |
| Brasil | Vida + 70 | Ley 9.610/1998, art. 41 | Fotos y audiovisuales: 70 desde la divulgación. No revivió lo ya liberado con la ley de 1973 (vida + 60) | Secundaria (Commons) |
| Chile | Vida + 70 | Ley 17.336 (ley 19.914/2003) | 30 (1970) → 50 (1992) → 70 (2003). Retroactividad **[a verificar]** | Secundaria |
| Colombia | **Vida + 80** | Ley 23/1982 | Personas jurídicas y entes públicos: 70 desde la publicación (según Commons) | Secundaria |
| Costa Rica | Vida + 70 | Ley 6683 | | Secundaria |
| Cuba | **Vida + 50** | Ley 154/2022 | Fotos: 25 años desde la utilización | Secundaria (Commons) |
| Ecuador | Vida + 70 | | | Secundaria |
| El Salvador | Vida + 70 | | | Secundaria |
| Guatemala | **Vida + 75** | Decreto 33-98 | | Secundaria |
| Honduras | **Vida + 75** | | | Secundaria |
| México | **Vida + 100** | LFDA (reforma 2003) | Transiciones discutidas (4.3) | Secundaria |
| Nicaragua | Vida + 70 | Ley 312 | | Secundaria |
| Panamá | Vida + 70 | Ley 64/2012 | Algunas tablas todavía dicen 50 (ley 15/1994, derogada) | Secundaria |
| Paraguay | Vida + 70 | Ley 1328/98 | | Secundaria |
| Perú | Vida + 70 | DL 822 (1996) | | Secundaria |
| Rep. Dominicana | Vida + 70 | Ley 65-00 | | Secundaria |
| Uruguay | Vida + 70 | Ley 19.857 (23/12/2019) | **Retroactiva**: devolvió al dominio privado obras liberadas en los 20 años anteriores | Secundaria (Commons, CC Uruguay, prensa) |
| Venezuela | **Vida + 60** | Ley de 1993 | Fotos y anónimas: 60 desde la divulgación | Secundaria (Commons) |
| Jamaica | **Vida + 95** | | Para muertes desde 1962; antes, vida + 50 | Secundaria |
| Puerto Rico | Ley de EE.UU. | | | — |

### 4.2 Uruguay

La ley 19.857 se aprobó casi sin debate en diciembre de 2019. Incluye una disposición que devuelve al dominio privado las obras que se habían liberado en los últimos 20 años, y por eso la criticaron CC Uruguay y la Asociación de Bibliotecólogos. Commons menciona además un dominio público pagante del 3 % sobre la reventa de obras de arte (ley 17.616, 2003) **[a verificar: podría tratarse del derecho de participación en la reventa, que es otra figura]**.

### 4.3 México: tres lecturas

Historia de los plazos: vida + 20 (1948) → + 25 (1956) → + 30 (1963) → + 50 (1982) → + 75 (1993/94) → + 100 (2003).

1. **Commons**: ninguna extensión fue retroactiva. Quienes murieron antes de 1952 ya están en dominio público. Para los demás, vida + 100.
2. **Análisis jurídico de noviembre de 2025** (<https://reyesfenigesp.wordpress.com/2025/11/18/vigencia-derechos-autor-mexico/>): solo la reforma de 1993 tuvo cláusula retroactiva ("aquellos derechos que no hayan ingresado al régimen de dominio público"). Propone tres grupos:
   - Muertos antes de 1964: libres desde 1993.
   - Muertos entre 1964 y el 23/7/2003: vida + 75.
   - Muertos desde el 24/7/2003: vida + 100.
3. **Práctica de R3D y Creative Commons México**: aplican vida + 100 a todos. Celebraron en 2021 la liberación de autores muertos en 1920, y ubican la de Frida Kahlo (muerta en 1954) en 2055 (<https://r3d.mx/2021/01/19/un-siglo-de-espera-en-mexico-para-entrar-al-dominio-publico/>, <https://r3d.mx/2025/01/07/frida-kahlo-entro-al-dominio-publico-en-la-union-europea-en-mexico-a-esperar-30-anos-mas/>).

Para nuestras muertes de 1950–1976, las tres lecturas dan resultados muy distintos: "ya libre", "año + 76" o "año + 101". **Recomendación:** no calcular. Explicar que México tiene el plazo más largo del mundo y que su aplicación en el tiempo está en discusión.

---

## 5. Otros países relevantes

### 5.1 Estados Unidos (por publicación, no por muerte)

Fuente secundaria: Cornell University Library.

- Obras publicadas antes de 1931: dominio público. **El 1/1/2027 se liberan las obras publicadas en 1931** (95 años).
- Obras publicadas entre 1931 y 1963: hacía falta renovar el registro; sin renovación ya están libres.
- Obras publicadas entre 1964 y 1977: 95 años desde la publicación.
- Desde 1978: vida + 70. Obras por encargo (corporativas): 95 años desde la publicación o 120 desde la creación.
- Obras extranjeras: la URAA (1996) restauró la protección de muchas obras extranjeras que habían perdido el derecho por no cumplir los trámites (*Golan v. Holder*).
- Grabaciones sonoras anteriores a 1972 (Music Modernization Act, 2018): las de antes de 1923 se liberaron en 2022; las de 1923–1946 tienen 100 años desde la publicación (**en 2027 se liberan las de 1926**); las de 1947–1956, 110 años; las de 1957 al 15/2/1972 se liberan el 15/2/2067.
- EE.UU. **no** aplica la regla del plazo más corto. Esto confirma lo que dice `CLAUDE.md`: si se agrega, va como sección de obras, no de autores.

### 5.2 Extensiones sin retroactividad (con fechas de corte calculables)

| País | Cambio | Ya libres | Desde ahí |
|---|---|---|---|
| Canadá | Vida + 50 → + 70 el 30/12/2022 | Muertos hasta 1971 | Muertos desde 1972: vida + 70 (1972 → 2043) |
| Japón | Vida + 50 → + 70 el 30/12/2018 | Muertos hasta 1967 | Desde 1968: vida + 70. Hay además prórrogas de guerra (unos 10 años) para obras de nacionales de los países aliados **[a verificar detalle]** |
| Corea del Sur | Vida + 50 → + 70 en julio de 2013 | Muertos antes de 1963 | Desde 1963: vida + 70 |
| Nueva Zelanda | **Sigue en vida + 50** | — | Extensión pendiente (antes del 1/5/2028); retroactividad sin definir |

Fuentes: University of Alberta (Canadá); bilaterals.org y Commons (Japón); Commons (Corea); MinterEllison, 22/6/2026 (<https://minterellison.co.nz/insights/new-zealand-copyright-act-changes-to-watch>), para Nueva Zelanda.

### 5.3 Rusia

Fuente secundaria: Commons.

- Vida + 70 (Código Civil, art. 1281).
- **+ 4 años** para autores que trabajaron durante la Gran Guerra Patria (1941–1945) o participaron en ella. Wikidata no tiene ese dato, así que es "a verificar" en cada caso.
- **Reprimidos rehabilitados después de morir**: el plazo corre desde la rehabilitación, no desde la muerte.
- Quedan libres para siempre las obras cuyo plazo de 50 años venció antes del 1/1/1993: muertos antes de 1943 (antes de 1939 si les corresponde el + 4).
- Las obras de las otras 14 repúblicas soviéticas se rigen por la ley de cada país sucesor.

### 5.4 Vida + 60 y vida + 50

- Vida + 60: India, Bangladesh y Venezuela.
- Vida + 50 (entre otros): China, Egipto, Cuba, Bolivia, Nueva Zelanda (por ahora), Filipinas, Tailandia, Vietnam, Irán, Arabia Saudita, Sudáfrica, Kenia y Argelia.
- Fuente: tabla de Wikipedia "List of countries' copyright lengths", que tiene errores (por ejemplo, Nueva Zelanda y Panamá aparecen desactualizados). Usarla solo como punto de partida.

---

## 6. Sutilezas generales (para "Cómo calculamos")

1. **Territorialidad**: cada país aplica su propia ley a los usos que se hacen en su territorio. Una obra puede estar libre en Argentina y protegida en México al mismo tiempo. Publicar en internet no "elige" una ley.
2. **País de origen frente a nacionalidad**: la regla del plazo más corto (Berna, art. 7.8; UE, art. 7; Argentina, art. 15) mira dónde se publicó la obra por primera vez, no la nacionalidad del autor.
3. **Cómputo**: casi todos los países cuentan desde el 1 de enero del año siguiente a la muerte, así que la obra se libera el 1 de enero. EE.UU. también vence a fin de año.
4. **Coautoría**: se cuenta desde el último coautor que murió. Pero Argentina trata la letra y la música como obras distintas (art. 18), mientras que la UE las une desde 2011.
5. **Películas**: Argentina da 50 años desde el último entre guionista, productor y director. La UE da 70 desde el último entre director, guionista, dialoguista y compositor. Un director no "libera" sus películas con su propia muerte.
6. **Fotografía**: en Argentina, 20 años desde la publicación. En España, las "meras fotografías" tienen 25 años desde que se tomaron y las fotos con carácter de obra, vida + 70.
7. **Traducciones, adaptaciones y ediciones** tienen su propio plazo (Argentina, arts. 24 y 26). Que Brecht se libere no libera una traducción reciente. En España, la edición tiene su propia protección (art. 129.2).
8. **Obras inéditas o póstumas**: en Argentina se cuentan desde la muerte del autor. En España, quien divulga por primera vez una obra inédita ya libre obtiene derechos (art. 129.1). En el Reino Unido, las inéditas de autores muertos antes de 1969 están protegidas hasta 2039.
9. **Derecho moral**: aunque la obra esté en dominio público, hay que respetar la autoría y la integridad.
10. **Marcas y personajes**: una marca registrada puede proteger un nombre o un personaje aunque la obra esté libre.
11. **Interpretaciones y grabaciones**: tienen derechos conexos aparte. En Argentina, 70 años desde la publicación del fonograma. La partitura puede estar libre y la grabación no.
12. **Desaparición o muerte presunta**: ver 2.5.

---

## 7. Cambios que propongo (para decidir)

### En `CLAUDE.md`
- Sacar a Nueva Zelanda de "pasaron a vida + 70" y ponerla en vida + 50, con la aclaración de que hay una extensión pendiente antes de mayo de 2028.
- Agregar a las reglas el art. 15 argentino (regla del plazo más corto para obras extranjeras).
- Agregar como "Caso a verificar": fotógrafos (20 años desde la publicación), directores y guionistas (cine: 50 años), letristas y compositores (art. 18) y desaparecidos (ley 24.321).

### En el sitio
- **Tabla del perfil**:
  - Agregar Canadá, Japón y Corea con sus fechas de corte; son calculables.
  - Agregar Colombia (+ 80), Guatemala y Honduras (+ 75) y Venezuela (+ 60), que son relevantes para la región.
  - Dejar México como texto, sin año.
  - Para España, mostrar + 80 solo si el autor es de un país de la UE; si no, una nota.
- **Contador**: si la nacionalidad del autor es de un país con un plazo más corto que el argentino, decir "como máximo" y explicar el art. 15.
- **Avisos por ocupación** en el perfil, para fotógrafos, directores y letristas.
- **"Cómo calculamos"**: usar las secciones 2.4 y 6 como base.

---

## Fuentes

Primarias:
- Ley 11.723, texto actualizado: <http://servicios.infoleg.gob.ar/infolegInternet/anexos/40000-44999/42755/texact.htm>
- Decreto 6255/58 (reglamento del FNA): <https://archivos.fnartes.gob.ar/reglamentos/Decreto-Reglamentario-6255-58.pdf>
- Resolución FNA 15.850/77: <https://servicios.infoleg.gob.ar/infolegInternet/anexos/195000-199999/195433/norma.htm>
- Ley 24.321: <http://www.derechos.org/nizkor/arg/ley/24321.html>
- LPI española (RDL 1/1996): <https://www.boe.es/buscar/act.php?id=BOE-A-1996-8930>

Secundarias:
- Wikimedia Commons, "Copyright rules by territory": <https://commons.wikimedia.org/wiki/Commons:Copyright_rules_by_territory> (Argentina, México, España, Rusia, Japón, Uruguay, Colombia, Brasil, Chile, Cuba, Venezuela, Francia, Reino Unido, Corea del Sur)
- Wikipedia, "List of countries' copyright lengths": <https://en.wikipedia.org/wiki/List_of_countries%27_copyright_lengths>
- Wikisource, "Duración de derechos de autor por país": <https://es.wikisource.org/wiki/Wikisource:Duraci%C3%B3n_de_derechos_de_autor_por_pa%C3%ADs>
- Directiva 2006/116/CE, art. 7: <https://www.legislation.gov.uk/eudr/2006/116/article/7/data.htm?view=plain>
- Cornell, "Copyright Term and the Public Domain": <https://guides.library.cornell.edu/copyright/publicdomain>
- Canadá: <https://www.ualberta.ca/copyright/about-the-copyright-office/news/2023/extension-to-copyright-term.html>
- Nueva Zelanda: <https://minterellison.co.nz/insights/new-zealand-copyright-act-changes-to-watch>
- Uruguay: <https://www.creativecommons.uy/2019/12/20/el-parlamento-uruguayo-aprobo-la-extension-del-plazo-de-derecho-de-autor-a-70-anos-post-mortem/>
- México: <https://reyesfenigesp.wordpress.com/2025/11/18/vigencia-derechos-autor-mexico/>, <https://r3d.mx/2021/01/19/un-siglo-de-espera-en-mexico-para-entrar-al-dominio-publico/>
- Panamá, ley 64/2012: <https://www.wipo.int/wipolex/en/legislation/details/15426>
- Bolivia, ley 1322: <https://www.lexivox.org/norms/BO-L-1322.html>
- Fallo *Directv c/ FNA*: <https://www.palabrasdelderecho.com.ar/articulo/4341/La-Justicia-Federal-confirmo-la-constitucionalidad-del-regimen-de-Dominio-Publico-Pagantes>
- SAVA, dominio público pagante: <https://www.sava.org.ar/dominio-publico-pagante>
- Grabaciones sonoras en EE.UU.: <https://www.copyright.gov/music-modernization/pre1972-soundrecordings/index.html>
