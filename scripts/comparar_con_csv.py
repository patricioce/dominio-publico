#!/usr/bin/env python3
"""Compara los datos generados de un año con un export CSV de query.wikidata.org
procesado con la misma limpieza. Sirve para detectar cambios en Wikidata o
diferencias introducidas por el script.

Uso:
    python3 scripts/comparar_con_csv.py 1956 datos/referencia/query.csv
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import generar_anio as g  # noqa: E402

CAMPOS = ['n', 'b', 'd', 'bd', 'dd', 'p', 'o', 'sl', 'wp', 'img', 'flags', 'conf', 'src']


def main():
    anio, ruta_csv = int(sys.argv[1]), sys.argv[2]
    filas_csv = g.filas_desde_csv(ruta_csv)
    viejo, rep_viejo = g.limpiar(filas_csv, anio, g.cargar_correcciones(), g.cargar_curados())
    nuevo = json.load(open(os.path.join(g.GENERADOS, f'{anio}.json'), encoding='utf-8'))['autores']
    rep_nuevo = json.load(open(os.path.join(g.GENERADOS, f'reporte_{anio}.json'), encoding='utf-8'))

    clave = lambda p: p.get('qid') or p['id']
    v = {clave(p): p for p in viejo}
    n = {clave(p): p for p in nuevo}

    print(f'CSV:     {rep_viejo["filas"]} filas → {rep_viejo["personas_unicas"]} personas → {len(viejo)} publicadas')
    print(f'Wikidata: {rep_nuevo["filas"]} filas → {rep_nuevo["personas_unicas"]} personas → {len(nuevo)} publicadas')

    print('\nSolo en el CSV:')
    for k in sorted(set(v) - set(n)):
        print(f"  {k} {v[k]['n']}")
    print('Solo en Wikidata hoy:')
    for k in sorted(set(n) - set(v)):
        print(f"  {k} {n[k]['n']} (sitelinks {n[k].get('sl')})")

    print('\nDiferencias por campo:')
    conteo = {}
    for k in sorted(set(v) & set(n), key=lambda k: v[k]['n']):
        for c in CAMPOS:
            if v[k].get(c) != n[k].get(c):
                conteo[c] = conteo.get(c, 0) + 1
                if c != 'sl':
                    print(f"  {v[k]['n']} [{c}]: {v[k].get(c)!r} → {n[k].get(c)!r}")
    print('\nResumen de diferencias:', conteo or 'ninguna')
    cambios_sl = [abs(n[k]['sl'] - v[k]['sl']) for k in set(v) & set(n) if 'sl' in v[k] and v[k]['sl'] != n[k]['sl']]
    if cambios_sl:
        print(f'  sitelinks: {len(cambios_sl)} cambiaron (máx. ±{max(cambios_sl)})')

    print('\nCategorías CSV:     ', rep_viejo['por_categoria'])
    print('Categorías Wikidata:', rep_nuevo['por_categoria'])


if __name__ == '__main__':
    main()
