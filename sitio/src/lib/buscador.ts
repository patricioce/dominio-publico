// Índice liviano para el buscador de /autores/: se genera al compilar (autores.json) y se filtra en el navegador.
import type { Autor } from './datos.ts';
import { anioDe, anioLiberacion } from './calculo.ts';
import { esArgentino, periodoVida } from './anios.ts';

export interface Entrada {
  n: string;   // nombre
  s: string;   // slug
  v: string;   // período de vida
  p: string;   // países
  o: string;   // categoría
  f: number;   // año de liberación en Argentina
  t: string;   // texto de búsqueda normalizado (nombre, país, categoría, ocupaciones)
  a?: 1;       // argentino
}

export function normalizar(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/** Por año de liberación y, dentro de cada año, por notoriedad. */
export function indiceBuscador(autores: Autor[]): Entrada[] {
  return [...autores]
    .sort((x, y) => anioLiberacion(x.d) - anioLiberacion(y.d) || (y.sl ?? 0) - (x.sl ?? 0) || x.n.localeCompare(y.n, 'es'))
    .map((a) => ({
      n: a.n,
      s: a.slug,
      v: periodoVida(a, anioDe(a.d)),
      p: a.p,
      o: a.o,
      f: anioLiberacion(a.d),
      t: normalizar([a.n, a.p, a.o, ...a.occ].join(' ')),
      ...(esArgentino(a) ? { a: 1 as const } : {}),
    }));
}

/** Todas las palabras de la consulta tienen que aparecer, en cualquier orden. */
export function coincide(e: Pick<Entrada, 't'>, consulta: string): boolean {
  const palabras = normalizar(consulta).split(/\s+/).filter(Boolean);
  return palabras.every((p) => e.t.includes(p));
}
