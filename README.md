# Sitio de autores que pasan a dominio público (nombre a definir)

Lista, año por año, los autores cuya obra pasa a dominio público, con foco en Argentina y Latinoamérica.
Ver `CLAUDE.md` para objetivos, reglas de cálculo y hoja de ruta.

## Generar los datos de un año

```bash
python3 scripts/generar_anio.py 1956
```

Solo usa la biblioteca estándar de Python (3.9+). Genera `datos/generados/1956.json` y `datos/generados/reporte_1956.json`.

## Prototipo

```bash
python3 scripts/armar_prototipo.py
```

Inserta los datos generados en `prototipo/plantilla.html` y escribe `prototipo/prototipo.html` (no se versiona).

*Información orientativa, no es asesoramiento legal.*
