// Lee los datos generados por scripts/generar_anio.py (datos/generados/).
// Se ejecuta solo al compilar: el sitio publicado no lee estos archivos.
import fs from 'node:fs';
import path from 'node:path';

// Astro compila desde sitio/, así que los datos están un nivel arriba.
const DIR_DATOS = path.resolve(process.cwd(), '../datos/generados');

export type Marca = 'muerte' | 'nacimiento' | 'anio' | 'muerte_otro_anio' | 'sin_nacimiento';

/** Autor tal como viene en AAAA.json (claves cortas del generador). */
export interface AutorCrudo {
  id: string;
  qid?: string;
  n: string;          // nombre
  b: string;          // nacimiento ISO
  d: string;          // muerte ISO
  bd: string;         // nacimiento para mostrar ("1886 o 1888")
  dd: string;         // muerte para mostrar
  p: string;          // países
  o: string;          // categoría
  occ: string[];      // ocupaciones
  sl?: number;        // cantidad de Wikipedias
  wp?: string;
  img?: string;
  flags: Marca[];
  src: string;
  conf: string;       // "check" = Caso a verificar
  consultas?: string[];
  bnmm?: string;
  bio?: string;
  w?: string[];       // obras
  c?: string;         // advertencia
  solo_periodista?: boolean;
}

export interface Autor extends AutorCrudo {
  slug: string;
  /** Años de muerte en los que aparece (más de uno si Wikidata no tiene fecha preferida). */
  aniosMuerte: number[];
  /** Ficha curada de un año sin datos generados: tiene perfil, pero no entra en las páginas de año. */
  fueraDeRango?: boolean;
}

export interface Indice {
  anio_muerte: number;
  personas: number;
  a_revisar: number;
  por_categoria: Record<string, number>;
  muerte_fuera_del_anio: number;
  argentinos: number;
  argentinos_sin_bnmm: number;
  curados: number;
}

export function slugDe(a: Pick<AutorCrudo, 'n' | 'qid' | 'id'>): string {
  const nombre = a.n
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  // Sin QID (fichas curadas que Wikidata no trajo) va solo el nombre: /autor/jorge-luis-borges/.
  // Si dos fichas sin QID dieran el mismo nombre, cargarAutores() corta la compilación.
  if (!a.qid) return nombre || a.id.toLowerCase();
  const sufijo = a.qid.toLowerCase();
  return nombre ? `${nombre}-${sufijo}` : sufijo;
}

function leerJson<T>(archivo: string): T {
  return JSON.parse(fs.readFileSync(path.join(DIR_DATOS, archivo), 'utf8'));
}

export const indice: Indice[] = leerJson<Indice[]>('indice.json');

export const enlaces: Record<string, string> =
  leerJson<{ enlaces: Record<string, string> }>(`${indice[0].anio_muerte}.json`).enlaces;

function cargarAutores(): Autor[] {
  const porId = new Map<string, Autor>();
  for (const { anio_muerte } of indice) {
    const { autores } = leerJson<{ autores: AutorCrudo[] }>(`${anio_muerte}.json`);
    for (const crudo of autores) {
      const previo = porId.get(crudo.id);
      if (previo) {
        previo.aniosMuerte.push(anio_muerte);
      } else {
        porId.set(crudo.id, { ...crudo, slug: slugDe(crudo), aniosMuerte: [anio_muerte] });
      }
    }
  }
  // Fichas curadas de años que todavía no se generaron (Borges, Gardel, Quino…).
  const archivoFuera = path.join(DIR_DATOS, 'curados_fuera_de_rango.json');
  if (fs.existsSync(archivoFuera)) {
    const { autores: fuera } = leerJson<{ autores: AutorCrudo[] }>('curados_fuera_de_rango.json');
    for (const crudo of fuera) {
      if (porId.has(crudo.id)) continue; // el año ya se generó y la ficha está en su lista
      porId.set(crudo.id, {
        ...crudo, slug: slugDe(crudo), aniosMuerte: [Number(crudo.d.slice(0, 4))], fueraDeRango: true,
      });
    }
  }
  const autores = [...porId.values()];
  const slugs = new Set<string>();
  for (const a of autores) {
    if (slugs.has(a.slug)) throw new Error(`Slug repetido: ${a.slug}`);
    slugs.add(a.slug);
  }
  return autores;
}

export const autores: Autor[] = cargarAutores();

export function reporte(anioMuerte: number): Record<string, unknown> {
  return leerJson(`reporte_${anioMuerte}.json`);
}
