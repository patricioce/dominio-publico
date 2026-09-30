#!/usr/bin/env python3
"""Genera los datos de un año de muerte: consulta Wikidata, limpia, aplica
correcciones y fichas curadas, y escribe el JSON del año y su reporte de calidad.

Uso:
    python3 scripts/generar_anio.py 1956
    python3 scripts/generar_anio.py 1950-1976            # rango, una consulta por año
    python3 scripts/generar_anio.py 1956 --desde-crudo   # reusa la última respuesta guardada

Solo usa la biblioteca estándar. La lógica de limpieza viene de
referencia/limpieza_referencia.py (probada en el chat con 1956).
"""
import argparse
import csv
import json
import os
import re
import ssl
import sys
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Consultas que se corren por año y se unen por QID. La de argentinos baja la notabilidad y suma ocupaciones.
CONSULTAS = {
    'general': os.path.join(RAIZ, 'consultas', 'consulta_mejorada.rq'),
    'argentinos': os.path.join(RAIZ, 'consultas', 'consulta_argentinos.rq'),
}
BNMM_URL = 'https://catalogo.bn.gov.ar/F/?func=direct&local_base=BNA10&doc_number={}'
CORRECCIONES = os.path.join(RAIZ, 'datos', 'correcciones.csv')
CURADOS = os.path.join(RAIZ, 'datos', 'autores_curados.json')
GENERADOS = os.path.join(RAIZ, 'datos', 'generados')
CRUDO = os.path.join(GENERADOS, 'crudo')

ENDPOINT = 'https://query.wikidata.org/sparql'
# La política de Wikimedia pide un User-Agent con forma de contacto: completar cuando haya sitio/repositorio.
USER_AGENT = 'dominio-publico-datos/0.1 (sitio de dominio publico; contacto pendiente) python-urllib'
AVISO = 'Información orientativa, no es asesoramiento legal.'

MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto',
         'septiembre', 'octubre', 'noviembre', 'diciembre']

# --- Consulta a Wikidata -----------------------------------------------------

def _contexto_ssl():
    """Contexto SSL con verificación. El Python de python.org en macOS no trae
    certificados propios: si faltan, se usa el almacén del sistema."""
    ctx = ssl.create_default_context()
    if not ctx.get_ca_certs() and os.path.exists('/etc/ssl/cert.pem'):
        ctx = ssl.create_default_context(cafile='/etc/ssl/cert.pem')
    return ctx


def consultar_wikidata(anio, ruta_consulta, intentos=4):
    consulta = (open(ruta_consulta, encoding='utf-8').read()
                .replace('{ANIO_SIG}', str(anio + 1)).replace('{ANIO}', str(anio)))
    datos = urllib.parse.urlencode({'query': consulta}).encode()
    cabeceras = {'Accept': 'application/sparql-results+json', 'User-Agent': USER_AGENT}
    ctx = _contexto_ssl()
    for intento in range(1, intentos + 1):
        try:
            req = urllib.request.Request(ENDPOINT, data=datos, headers=cabeceras)
            with urllib.request.urlopen(req, timeout=90, context=ctx) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code not in (429, 500, 502, 503, 504) or intento == intentos:
                raise
            espera = int(e.headers.get('Retry-After') or 0) or 15 * intento
            print(f'  Wikidata respondió {e.code}; reintento en {espera} s ({intento}/{intentos})', file=sys.stderr)
        except (urllib.error.URLError, TimeoutError) as e:
            if isinstance(e, urllib.error.URLError) and isinstance(e.reason, ssl.SSLError):
                raise
            if intento == intentos:
                raise
            espera = 15 * intento
            print(f'  Error de red ({e}); reintento en {espera} s ({intento}/{intentos})', file=sys.stderr)
        time.sleep(espera)


def filas_desde_sparql(respuesta, consulta='general'):
    """Convierte la respuesta SPARQL en filas con las mismas columnas que el CSV de query.wikidata.org.
    Cada fila recuerda de qué consulta vino en '_consulta'."""
    filas = []
    for b in respuesta['results']['bindings']:
        fila = {k: v['value'] for k, v in b.items()}
        fila['_consulta'] = consulta
        filas.append(fila)
    return filas


def filas_desde_csv(ruta):
    with open(ruta, encoding='utf-8') as f:
        return [{k: v for k, v in r.items() if v != ''} for r in csv.DictReader(f)]

# --- Datos editados a mano ---------------------------------------------------

def cargar_correcciones():
    por_qid = {}
    with open(CORRECCIONES, encoding='utf-8') as f:
        for r in csv.DictReader(f):
            por_qid.setdefault(r['qid'].strip(), []).append(r)
    return por_qid


def cargar_curados():
    return json.load(open(CURADOS, encoding='utf-8'))['autores']

# --- Limpieza (portada de limpieza_referencia.py) ----------------------------

def normalizar(s):
    return unicodedata.normalize('NFD', s).encode('ascii', 'ignore').decode().lower().strip()


HISTORICOS = re.compile(r'Imperio|Raj |Cisleitania|Hetmanato|Gran Ducado|Principado|Zarato|Mandato|nazi|Weimar|'
                        r'República Popular Ucraniana|República del Don|República Rusa|Reino de los Serbios|'
                        r'Rusia Soviética|República Democrática de Azerbaiyán|Segunda República polaca')
RENOMBRAR_PAIS = [('Reino Unido de Gran Bretaña e Irlanda', 'Reino Unido'), ('Reino de Italia', 'Italia'),
                  ('Reino de Dinamarca', 'Dinamarca'), ('Reino de los Países Bajos', 'Países Bajos')]


def limpiar_paises(partes):
    """Hasta dos países actuales, en orden alfabético (el orden de Wikidata no es estable)."""
    if not partes:
        return ''
    quedan = sorted(p for p in partes if not HISTORICOS.search(p)) or sorted(partes)
    salida = []
    for p in quedan:
        for viejo, nuevo in RENOMBRAR_PAIS:
            p = p.replace(viejo, nuevo)
        if p not in salida:
            salida.append(p)
    return ' / '.join(salida[:2])


LITERATURA = {'escritor', 'poeta', 'dramaturgo', 'letrista',
              'novelista', 'ensayista', 'crítico literario', 'libretista', 'periodista'}
VISUALES = {'pintor', 'escultor', 'fotógrafo', 'ilustrador', 'dibujante'}
MUSICA = {'compositor', 'compositor de canciones', 'cantautor'}
DIRECCION = {'director de cine', 'realizador'}


def categoria(ocupaciones):
    """Categoría a partir de las ocupaciones (etiquetas en español de Wikidata).
    Las reglas 1-8 son las de limpieza_referencia.py, ampliadas a las ocupaciones de la consulta de argentinos."""
    o = set(ocupaciones)
    if o & DIRECCION and 'dramaturgo' not in o:
        return 'Cine e historieta'
    if 'historietista' in o and 'pintor' not in o:
        return 'Cine e historieta'
    if o & LITERATURA and not o & VISUALES:
        return 'Literatura'
    if o & VISUALES and not o & {'escritor', 'dramaturgo'}:
        return 'Artes visuales'
    if o & MUSICA and not o & {'escritor', 'poeta', 'dramaturgo'}:
        return 'Música'
    if o & LITERATURA:
        return 'Literatura'
    if o & MUSICA:
        return 'Música'
    if 'guionista' in o:
        return 'Cine e historieta'
    return 'Sin categoría'


def fecha_larga(iso):
    a, m, d = iso.split('-')
    return f'{int(d)} de {MESES[int(m) - 1]} de {a}'


def _lista(texto):
    """Separa un GROUP_CONCAT: las consultas usan ' | ' (hay países con comas en el nombre);
    el CSV de referencia usa ', '."""
    if not texto:
        return []
    sep = '|' if '|' in texto else ','
    return [x.strip() for x in texto.split(sep) if x.strip()]


def _unir(listas):
    salida = []
    for lista in listas:
        for x in lista:
            if x not in salida:
                salida.append(x)
    return salida


def limpiar(filas, anio, correcciones, curados):
    anio_txt = str(anio)
    reporte = {
        'anio': anio, 'filas': len(filas), 'personas_unicas': 0, 'personas_publicadas': 0,
        'por_categoria': {},
        'excluidos_sin_nombre': [], 'excluidos_por_correccion': [], 'movidos_a_otro_anio': [],
        'muerte_en_disputa': [], 'muerte_solo_anio': [], 'muerte_fuera_del_anio': [],
        'nacimiento_en_disputa': [], 'nacimiento_solo_anio': [], 'sin_nacimiento': [],
        'sin_pais': [], 'sin_wikipedia_es': [],
        'corregidos': [], 'curados_fusionados': [], 'curados_ausentes_en_wikidata': [],
        'correcciones_sin_uso': [], 'sin_categoria': [],
        'filas_por_consulta': {}, 'argentinos': 0, 'argentinos_sin_bnmm': [], 'solo_periodista': [],
    }
    for f in filas:
        c = f.get('_consulta', 'csv')
        reporte['filas_por_consulta'][c] = reporte['filas_por_consulta'].get(c, 0) + 1

    grupos = {}
    for f in filas:
        qid = f['autor'].rsplit('/', 1)[-1]
        grupos.setdefault(qid, []).append(f)
    reporte['personas_unicas'] = len(grupos)

    curados_por_qid = {c['qid']: c for c in curados if c.get('qid')}
    curados_por_nombre = {normalizar(c['n']): c for c in curados if not c.get('qid')}
    curados_usados = set()
    correcciones_usadas = set()
    personas = []

    for qid, g in grupos.items():
        r = g[0]
        nombre = r['autorLabel']
        # Nombre en español, inglés o "mul" (multilingüe). Con las columnas de etiquetas explícitas
        # (consulta nueva) se usan esas; con un CSV viejo, alcanza con que la etiqueta no sea el QID.
        if 'muertesFueraDelAnio' in r:
            sin_nombre = not any(x.get('etiquetaEs') or x.get('etiquetaEn') or x.get('etiquetaMul') for x in g)
        else:
            sin_nombre = bool(re.fullmatch(r'Q\d+', nombre))
        if sin_nombre:
            reporte['excluidos_sin_nombre'].append(f'{qid} ({nombre})')
            correcciones_usadas.update((qid, c['campo']) for c in correcciones.get(qid, []))
            continue

        marcas = []
        dias = sorted({x['muerte'][:10] for x in g if int(x['precision']) >= 11})
        if len(dias) == 1:
            muerte, muerte_txt = dias[0], fecha_larga(dias[0])
        elif len(dias) > 1:
            muerte, muerte_txt = dias[0], anio_txt
            marcas.append('muerte')
            reporte['muerte_en_disputa'].append(f"{nombre}: {', '.join(dias)}")
        else:
            muerte, muerte_txt = f'{anio_txt}-01-01', anio_txt
            marcas.append('anio')
            reporte['muerte_solo_anio'].append(nombre)

        # Fechas de muerte en otro año: si ninguna fecha de este año es la de mejor rango en Wikidata,
        # la preferida está en otro año y la persona se publica allá (salvo corrección o ficha curada).
        fuera = max(int(x.get('muertesFueraDelAnio') or 0) for x in g)
        preferida_en_otro_anio = False
        if fuera:
            if 'fechaPreferida' in r and not any(x.get('fechaPreferida') == '1' for x in g):
                preferida_en_otro_anio = True
            else:
                marcas.append('muerte_otro_anio')
                reporte['muerte_fuera_del_anio'].append(f'{nombre} ({qid})')
        muerte_verificada = False

        # Nacimiento: fecha completa solo si la precisión es de día (un CSV viejo no trae precisión: se asume día).
        nacs = sorted({(x['nacimiento'][:10], int(x.get('precisionNac') or 11)) for x in g if x.get('nacimiento')})
        anios_nac = sorted({n[:4] for n, _ in nacs})
        if not nacs:
            nac, nac_txt = None, 'Sin dato'
            marcas.append('sin_nacimiento')
            reporte['sin_nacimiento'].append(nombre)
        elif len(anios_nac) > 1 or len({n for n, p in nacs if p >= 11}) > 1:
            nac, nac_txt = nacs[0][0], ' o '.join(anios_nac)
            marcas.append('nacimiento')
            reporte['nacimiento_en_disputa'].append(f"{nombre}: {', '.join(n for n, _ in nacs)}")
        elif any(p >= 11 for _, p in nacs):
            nac = next(n for n, p in nacs if p >= 11)
            nac_txt = fecha_larga(nac)
        else:
            nac, nac_txt = nacs[0][0], anios_nac[0]
            reporte['nacimiento_solo_anio'].append(nombre)

        ocupaciones = sorted(_unir(_lista(x.get('ocupaciones')) for x in g))
        pais = limpiar_paises(_unir(_lista(x.get('paises')) for x in g))
        if not pais:
            reporte['sin_pais'].append(nombre)
            pais = 'Sin dato'
        wp = min((x['wikipediaEs'] for x in g if x.get('wikipediaEs')), default=None)
        if not wp:
            reporte['sin_wikipedia_es'].append(nombre)

        rec = {'id': qid.lower(), 'qid': qid, 'n': nombre, 'b': nac, 'd': muerte, 'bd': nac_txt, 'dd': muerte_txt,
               'p': pais, 'o': categoria(ocupaciones), 'occ': ocupaciones,
               'sl': max(int(x['sitelinks']) for x in g), 'wp': wp,
               'img': min((x['foto'] for x in g if x.get('foto')), default=None),
               'flags': marcas, 'src': 'wikidata'}
        consultas = sorted({x['_consulta'] for x in g if x.get('_consulta')})
        if consultas:
            rec['consultas'] = consultas
        bnmm = min((x['bnmm'] for x in g if x.get('bnmm')), default=None)
        if bnmm:
            rec['bnmm'] = bnmm

        # 1) Correcciones manuales.
        excluir = False
        for c in correcciones.get(qid, []):
            correcciones_usadas.add((qid, c['campo']))
            campo, valor = c['campo'].strip(), c['valor'].strip()
            if campo == 'excluir' and valor.lower() in ('si', 'sí'):
                excluir = True
            elif campo == 'nacimiento':
                rec['b'], rec['bd'] = valor, fecha_larga(valor)
                rec['flags'] = [m for m in rec['flags'] if m not in ('nacimiento', 'sin_nacimiento')]
            elif campo == 'muerte':
                rec['d'], rec['dd'] = valor, fecha_larga(valor)
                muerte_verificada = True
                rec['flags'] = [m for m in rec['flags'] if m not in ('muerte', 'anio')]
            elif campo == 'categoria':
                rec['o'] = valor
            elif campo == 'pais':
                rec['p'] = valor
            elif campo == 'nombre':
                rec['n'] = valor
            else:
                print(f'  Aviso: campo de corrección desconocido "{campo}" ({qid})', file=sys.stderr)
        if excluir:
            reporte['excluidos_por_correccion'].append(f'{qid} ({nombre})')
            continue
        if correcciones.get(qid):
            reporte['corregidos'].append(nombre)

        # 2) Fichas curadas: mandan sobre Wikidata y sobre las correcciones.
        c = curados_por_qid.get(qid) or curados_por_nombre.get(normalizar(nombre))
        if c and (c.get('qid') or c['d'][:4] == anio_txt):
            curados_usados.add(id(c))
            reporte['curados_fusionados'].append(nombre)
            for k in ('n', 'p', 'o', 'bio', 'w', 'c'):
                if c.get(k):
                    rec[k] = c[k]
            if c.get('id'):
                rec['id'] = c['id']
            rec['b'], rec['d'] = c['b'], c['d']
            rec['bd'], rec['dd'] = fecha_larga(c['b']), fecha_larga(c['d'])
            rec['flags'] = [m for m in rec['flags'] if m not in ('muerte', 'nacimiento', 'anio', 'sin_nacimiento')]
            rec['src'] = 'wikidata+curado'
            muerte_verificada = True

        if rec['d'][:4] != anio_txt:
            reporte['movidos_a_otro_anio'].append(f"{nombre} ({qid}): muerte {rec['d']}")
            continue
        if preferida_en_otro_anio and not muerte_verificada:
            reporte['movidos_a_otro_anio'].append(f'{nombre} ({qid}): la fecha preferida en Wikidata es de otro año')
            continue

        if rec['o'] == 'Sin categoría':
            reporte['sin_categoria'].append(f"{rec['n']} ({qid}): {', '.join(ocupaciones)}")
        # Quien entra solo como periodista se publica, pero el sitio no lo destaca
        # (suelen ser figuras políticas o de otros ámbitos). No es un problema de datos: no pasa a "check".
        if ocupaciones and set(ocupaciones) <= {'periodista'} and rec['src'] == 'wikidata':
            rec['solo_periodista'] = True
            reporte['solo_periodista'].append(f"{rec['n']} ({qid})")
        if 'argentinos' in rec.get('consultas', []):
            reporte['argentinos'] += 1
            if not rec.get('bnmm'):
                reporte['argentinos_sin_bnmm'].append(f"{rec['n']} ({qid})")
        rec['conf'] = 'check' if (rec.get('c') or rec['flags']) else 'ok'
        personas.append(rec)

    # Fichas curadas del año que Wikidata no devolvió (notabilidad baja, otra ocupación, etc.).
    for c in curados:
        if id(c) in curados_usados or c['d'][:4] != anio_txt:
            continue
        reporte['curados_ausentes_en_wikidata'].append(c['n'])
        rec = dict(c)
        rec.setdefault('id', c['qid'].lower() if c.get('qid') else re.sub(r'[^a-z0-9]+', '-', normalizar(c['n'])).strip('-'))
        rec.update({'bd': fecha_larga(c['b']), 'dd': fecha_larga(c['d']), 'occ': [], 'flags': [], 'src': 'curado'})
        rec.setdefault('conf', 'check' if c.get('c') else 'ok')
        personas.append(rec)

    for qid, filas_c in correcciones.items():
        for c in filas_c:
            if (qid, c['campo']) not in correcciones_usadas and qid in grupos:
                reporte['correcciones_sin_uso'].append(f"{qid} {c['campo']}")

    personas.sort(key=lambda p: (-p.get('sl', 0), normalizar(p['n'])))
    reporte['personas_publicadas'] = len(personas)
    cats = {}
    for p in personas:
        cats[p['o']] = cats.get(p['o'], 0) + 1
    reporte['por_categoria'] = dict(sorted(cats.items(), key=lambda kv: -kv[1]))
    reporte['a_revisar'] = sum(1 for p in personas if p['conf'] == 'check')
    return personas, reporte

# --- Salida ------------------------------------------------------------------

def escribir(anio, personas, reporte):
    os.makedirs(GENERADOS, exist_ok=True)
    # Sin marcas de tiempo: si Wikidata no cambió, el archivo no cambia (sirve para la rutina semanal).
    datos = {'anio_muerte': anio, 'aviso': AVISO, 'fuente': 'Wikidata (CC0) + correcciones y fichas curadas',
             'enlaces': {'bnmm': BNMM_URL}, 'autores': personas}
    with open(os.path.join(GENERADOS, f'{anio}.json'), 'w', encoding='utf-8') as f:
        json.dump(datos, f, ensure_ascii=False, indent=1)
        f.write('\n')
    with open(os.path.join(GENERADOS, f'reporte_{anio}.json'), 'w', encoding='utf-8') as f:
        json.dump(reporte, f, ensure_ascii=False, indent=1)
        f.write('\n')


def resumen(reporte):
    lineas = [f"Año {reporte['anio']}: {reporte['filas']} filas → {reporte['personas_unicas']} personas "
              f"→ {reporte['personas_publicadas']} publicadas ({reporte['a_revisar']} a revisar)"]
    for k, v in reporte.items():
        if isinstance(v, list) and v:
            lineas.append(f'  {k}: {len(v)}')
    lineas.append('  por categoría: ' + ', '.join(f'{k} {v}' for k, v in reporte['por_categoria'].items()))
    return '\n'.join(lineas)


def escribir_indice():
    """Resumen de todos los años generados (base para la vista "Calidad de datos")."""
    indice = []
    for nombre in sorted(os.listdir(GENERADOS)):
        m = re.fullmatch(r'reporte_(\d{4})\.json', nombre)
        if not m:
            continue
        r = json.load(open(os.path.join(GENERADOS, nombre), encoding='utf-8'))
        indice.append({'anio_muerte': r['anio'], 'personas': r['personas_publicadas'], 'a_revisar': r['a_revisar'],
                       'por_categoria': r['por_categoria'],
                       'muerte_fuera_del_anio': len(r['muerte_fuera_del_anio']),
                       'argentinos': r.get('argentinos', 0), 'argentinos_sin_bnmm': len(r.get('argentinos_sin_bnmm', [])),
                       'curados': len(r['curados_fusionados']) + len(r['curados_ausentes_en_wikidata'])})
    with open(os.path.join(GENERADOS, 'indice.json'), 'w', encoding='utf-8') as f:
        json.dump(indice, f, ensure_ascii=False, indent=1)
        f.write('\n')


def procesar(anio, desde_crudo, pausa=5):
    filas = []
    for n, (nombre, ruta) in enumerate(CONSULTAS.items()):
        sufijo = '' if nombre == 'general' else f'_{nombre}'
        ruta_crudo = os.path.join(CRUDO, f'{anio}{sufijo}.json')
        if desde_crudo:
            respuesta = json.load(open(ruta_crudo, encoding='utf-8'))
        else:
            if n:
                time.sleep(pausa)
            print(f'Consultando Wikidata para {anio} ({nombre})…', file=sys.stderr)
            respuesta = consultar_wikidata(anio, ruta)
            os.makedirs(CRUDO, exist_ok=True)
            with open(ruta_crudo, 'w', encoding='utf-8') as f:
                json.dump(respuesta, f, ensure_ascii=False)
        filas += filas_desde_sparql(respuesta, nombre)

    personas, reporte = limpiar(filas, anio, cargar_correcciones(), cargar_curados())
    escribir(anio, personas, reporte)
    print(resumen(reporte))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('anio', help='año de muerte (1956) o rango (1950-1976)')
    ap.add_argument('--desde-crudo', action='store_true', help='usar la respuesta guardada en datos/generados/crudo/')
    ap.add_argument('--pausa', type=float, default=5, help='segundos entre consultas de un rango (por defecto 5)')
    args = ap.parse_args()

    desde, _, hasta = args.anio.partition('-')
    anios = range(int(desde), int(hasta or desde) + 1)
    fallidos = []
    for i, anio in enumerate(anios):
        if i and not args.desde_crudo:
            time.sleep(args.pausa)
        try:
            procesar(anio, args.desde_crudo, args.pausa)
        except Exception as e:  # un año que falla no frena el resto del rango
            print(f'ERROR en {anio}: {e}', file=sys.stderr)
            fallidos.append(anio)
    escribir_indice()
    if fallidos:
        print(f'Fallaron: {fallidos}. Volver a correrlos de a uno.', file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
