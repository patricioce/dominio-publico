// Armado del perfil de autor: tabla por legislación, avisos y línea de tiempo.
// Funciones puras: reciben el autor y la fecha para poder probarlas sin leer los datos.
import type { Autor } from './datos.ts';
import { anioDe, anioLiberacion, estado, LEGISLACIONES, textoEstado, type Estado, type Legislacion } from './calculo.ts';
import { avisosPorOcupacion, esDeLaUE, notaEspana, plazoMenorPorArt15, textoArt15 } from './avisos.ts';

export interface FilaLegislacion {
  legislacion: Legislacion;
  nombre: string;
  anio: number;
  estado: Estado;
  texto: string;
  nota?: string;
}

/** Una fila por legislación, en el orden de LEGISLACIONES, con la nota que corresponde a este autor. */
export function filasLegislacion(a: Pick<Autor, 'd' | 'p'>, hoy: Date): FilaLegislacion[] {
  return (Object.keys(LEGISLACIONES) as Legislacion[]).map((leg) => {
    const datos = LEGISLACIONES[leg];
    const e = estado(a.d, hoy, leg);
    let nota = datos.nota;
    // La nota del art. 7 de la directiva solo importa para autores de fuera de la UE.
    if (leg === 'ue' && esDeLaUE(a.p)) nota = undefined;
    if (leg === 'es') nota = notaEspana(a.p, a.d) ?? undefined;
    return { legislacion: leg, nombre: datos.corto, anio: e.anio, estado: e, texto: textoEstado(e), nota };
  });
}

export interface Aviso {
  titulo: string;
  texto: string;
}

const TEXTO_MARCA: Record<string, (a: Autor) => string> = {
  muerte: (a) =>
    a.flags.includes('muerte_otro_anio')
      ? `Wikidata registra además varias fechas de muerte dentro de ${anioDe(a.d)}: la fecha exacta está pendiente de verificar.`
      : `Wikidata registra más de una fecha de muerte, todas en ${anioDe(a.d)}. El año de liberación no cambia, ` +
        'pero la fecha exacta está pendiente de verificar.',
  nacimiento: () => 'Wikidata registra más de una fecha de nacimiento. No afecta el cálculo.',
  anio: () => 'Solo se conoce el año de muerte. Alcanza para el cálculo, pero la fecha exacta está pendiente.',
  muerte_otro_anio: (a) =>
    a.aniosMuerte.length > 1
      ? `Wikidata registra fechas de muerte en ${listaAnios(a.aniosMuerte)}, y ninguna figura como preferida. ` +
        `Por eso aparece en las listas de ${listaAnios(a.aniosMuerte.map((m) => anioLiberacion(`${m}-01-01`)))}. ` +
        'Según cuál sea la correcta, cambia el año de liberación.'
      : 'Wikidata registra también una fecha de muerte en otro año, y ninguna figura como preferida. ' +
        'Si la correcta es la otra, cambia el año de liberación.',
  sin_nacimiento: () => 'No hay fecha de nacimiento registrada. No afecta el cálculo.',
};

function listaAnios(anios: number[]): string {
  const xs = [...anios].sort((x, y) => x - y).map(String);
  return xs.length > 1 ? `${xs.slice(0, -1).join(', ')} y ${xs.at(-1)}` : xs[0];
}

export const TEXTO_PAGANTE =
  'En Argentina, el uso comercial de una obra en dominio público paga un derecho al Fondo Nacional de las Artes ' +
  '(dominio público pagante). En libros, es el 3 % del precio de tapa (Resolución FNA 15.850/77).';

/** Avisos del perfil, del más específico al más general. */
export function avisos(a: Autor): Aviso[] {
  const lista: Aviso[] = [];
  if (a.c) lista.push({ titulo: 'A tener en cuenta', texto: a.c });
  const art15 = plazoMenorPorArt15(a.p, a.d);
  if (art15) lista.push({ titulo: 'Puede quedar libre antes', texto: textoArt15(art15) });
  for (const texto of avisosPorOcupacion(a.occ)) lista.push({ titulo: 'Según el tipo de obra', texto });
  for (const marca of a.flags) {
    const texto = TEXTO_MARCA[marca];
    if (texto) lista.push({ titulo: 'Dato a revisar', texto: texto(a) });
  }
  lista.push({ titulo: 'Dominio público pagante', texto: TEXTO_PAGANTE });
  return lista;
}

/**
 * "Caso a verificar": lo marcan los datos (conf), o el perfil muestra un aviso que puede cambiar el año
 * (plazo más corto por el art. 15 o un tipo de obra con reglas propias).
 */
export function esCasoAVerificar(a: Pick<Autor, 'conf' | 'p' | 'd' | 'occ'>): boolean {
  return a.conf === 'check' || plazoMenorPorArt15(a.p, a.d) !== null || avisosPorOcupacion(a.occ).length > 0;
}

/** "10 de febrero de 1898 – 14 de agosto de 1956". */
export function fechasVida(a: Pick<Autor, 'bd' | 'dd'>): string {
  return `${a.bd || 'Nacimiento sin dato'} – ${a.dd}`;
}

/** Iniciales para el monograma: las dos últimas palabras que empiezan con mayúscula. */
export function iniciales(nombre: string): string {
  const palabras = nombre
    .split(/\s+/)
    .filter((w) => w.length > 1 && /\p{Lu}/u.test(w[0]));
  return palabras.slice(-2).map((w) => w[0]).join('') || nombre[0];
}

export interface LineaDeTiempo {
  inicio: number;
  muerte: number;
  liberacion: number;
  fin: number;
  /** Porcentajes del ancho total. */
  vida: number;
  proteccion: number;
  libre: number;
}

/** Barra vida / protección / dominio público, con margen para que se vea el presente. */
export function lineaDeTiempo(a: Pick<Autor, 'b' | 'd'>, hoy: Date): LineaDeTiempo {
  const muerte = anioDe(a.d);
  const liberacion = anioLiberacion(a.d);
  const inicio = a.b ? anioDe(a.b) : muerte - 60;
  const fin = Math.max(liberacion + 8, hoy.getFullYear() + 6);
  const pct = (y: number) => ((y - inicio) / (fin - inicio)) * 100;
  return {
    inicio, muerte, liberacion, fin,
    vida: pct(muerte),
    proteccion: pct(liberacion) - pct(muerte),
    libre: 100 - pct(liberacion),
  };
}

/** Posición de "Hoy" en la línea de tiempo, en porcentaje (0 a 100). */
export function posicionHoy(inicio: number, fin: number, hoy: Date): number {
  const ahora = hoy.getFullYear() + hoy.getMonth() / 12;
  return Math.min(100, Math.max(0, ((ahora - inicio) / (fin - inicio)) * 100));
}
