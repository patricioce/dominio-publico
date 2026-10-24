# Sitio de autores que pasan a dominio público (nombre a definir)

Lista, año por año, los autores cuya obra pasa a dominio público, con foco en Argentina y Latinoamérica.
Ver `CLAUDE.md` para objetivos, reglas de cálculo y hoja de ruta.

## Generar los datos de un año

```bash
python3 scripts/generar_anio.py 1956
```

Solo usa la biblioteca estándar de Python (3.9+). Genera `datos/generados/1956.json` y `datos/generados/reporte_1956.json`.

## Sitio (Astro)

Requiere Node 22.12 o más nuevo. Desde `sitio/`:

```bash
npm install
npm run dev      # vista previa en http://localhost:4321
npm test         # pruebas de las reglas de cálculo
npm run check    # revisión de tipos
npm run build    # genera sitio/dist/
```

El sitio lee `datos/generados/` al compilar. En cada push a `main`, `.github/workflows/sitio.yml` lo compila y lo publica en GitHub Pages (hay que activar Pages con la fuente "GitHub Actions" en la configuración del repo).

## Prototipo

```bash
python3 scripts/armar_prototipo.py
```

Inserta los datos generados en `prototipo/plantilla.html` y escribe `prototipo/prototipo.html` (no se versiona).

*Información orientativa, no es asesoramiento legal.*
