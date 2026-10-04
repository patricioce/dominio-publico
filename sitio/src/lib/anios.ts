// Armado de las páginas por año de liberación (ley argentina).
// Funciones puras: reciben los autores como parámetro para poder probarlas sin leer los datos.
import type { Autor } from './datos.ts';
import { LEGISLACIONES } from './calculo.ts';

export const CATEGORIAS = ['Literatura', 'Música', 'Artes visuales', 'Cine e historieta', 'Ciencia'];

/** Plazo argentino: fijo, así que el año de muerte se deduce del año de liberación. */
const PLAZO_AR = LEGISLACIONES.ar.plazo('');

export function anioMuerteDe(anioLiberacion: number): number {
  return anioLiberacion - PLAZO_AR - 1;
}

export function anioLiberacionDe(anioMuerte: number): number {
  return anioMuerte + PLAZO_AR + 1;
}

/** Años de liberación que tienen datos, de menor a mayor. */
export function aniosConDatos(autores: Autor[]): number[] {
  const anios = new Set(autores.flatMap((a) => a.aniosMuerte.map(anioLiberacionDe)));
  return [...anios].sort((x, y) => x - y);
}

export function esArgentino(a: Pick<Autor, 'consultas' | 'p'>): boolean {
  return (a.consultas ?? []).includes('argentinos') || /Argentina/.test(a.p ?? '');
}

/** "1898–1956"; con nacimiento dudoso, "1886 o 1888–1956"; sin nacimiento, "?–1956". */
export function periodoVida(a: Pick<Autor, 'b' | 'bd' | 'flags'>, anioMuerte: number): string {
  const nacimiento = a.flags.includes('nacimiento') ? a.bd : a.b ? a.b.slice(0, 4) : '?';
  return `${nacimiento}–${anioMuerte}`;
}

/** Fichas curadas primero, después por notoriedad; quienes entran solo como periodistas van al final. */
export function compararAutores(x: Autor, y: Autor): number {
  return (
    Number(!!x.solo_periodista) - Number(!!y.solo_periodista) ||
    Number(!!y.bio) - Number(!!x.bio) ||
    (y.sl ?? 0) - (x.sl ?? 0) ||
    x.n.localeCompare(y.n, 'es')
  );
}

export interface Grupo {
  categoria: string;
  autores: Autor[];
}

/** Autores que se liberan el 1 de enero del año dado, agrupados por categoría y ordenados. */
export function gruposDelAnio(autores: Autor[], anioLiberacion: number): Grupo[] {
  const muerte = anioMuerteDe(anioLiberacion);
  const delAnio = autores.filter((a) => a.aniosMuerte.includes(muerte));
  const categorias = [...CATEGORIAS, ...new Set(delAnio.map((a) => a.o).filter((o) => !CATEGORIAS.includes(o)))];
  return categorias
    .map((categoria) => ({
      categoria,
      autores: delAnio.filter((a) => a.o === categoria).sort(compararAutores),
    }))
    .filter((g) => g.autores.length > 0);
}
