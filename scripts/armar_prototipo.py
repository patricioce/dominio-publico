#!/usr/bin/env python3
"""Arma prototipo/prototipo.html: la plantilla del prototipo con los datos generados embebidos.

Uso:
    python3 scripts/armar_prototipo.py

El resultado es un solo archivo HTML sin dependencias (salvo Google Fonts), listo para
publicar como página. No se versiona: se regenera desde datos/generados/.
"""
import glob
import json
import os
import re

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GENERADOS = os.path.join(RAIZ, 'datos', 'generados')
PLANTILLA = os.path.join(RAIZ, 'prototipo', 'plantilla.html')
SALIDA = os.path.join(RAIZ, 'prototipo', 'prototipo.html')


def js(valor):
    # "</" dentro de un <script> cerraría la etiqueta antes de tiempo.
    return json.dumps(valor, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')


def main():
    autores, reportes, enlaces, anios = [], {}, {}, []
    ids = set()
    for ruta in sorted(glob.glob(os.path.join(GENERADOS, '[0-9][0-9][0-9][0-9].json'))):
        datos = json.load(open(ruta, encoding='utf-8'))
        anio = datos['anio_muerte']
        anios.append(anio)
        enlaces.update(datos.get('enlaces', {}))
        for a in datos['autores']:
            # Quien figura en dos años (fechas de muerte sin preferida) necesita un id distinto en cada uno.
            if a['id'] in ids:
                a = dict(a, id=f"{a['id']}-{anio}")
            ids.add(a['id'])
            autores.append(a)
        reportes[anio] = json.load(open(os.path.join(GENERADOS, f'reporte_{anio}.json'), encoding='utf-8'))
    indice = json.load(open(os.path.join(GENERADOS, 'indice.json'), encoding='utf-8'))

    html = open(PLANTILLA, encoding='utf-8').read()
    reemplazos = {
        '/*AUTORES*/[]': js(autores),
        '/*REPORTES*/{}': js(reportes),
        '/*INDICE*/[]': js(indice),
        '/*ENLACES*/{}': js(enlaces),
        '/*RANGO*/[0,0]': js([min(anios), max(anios)]),
    }
    for marcador, valor in reemplazos.items():
        if html.count(marcador) != 1:
            raise SystemExit(f'La plantilla no tiene el marcador {marcador}')
        html = html.replace(marcador, valor)
    with open(SALIDA, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f'{SALIDA}: {len(autores)} autores, {len(anios)} años, {os.path.getsize(SALIDA) / 1e6:.1f} MB')


if __name__ == '__main__':
    main()
