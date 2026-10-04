// Avisos del perfil que dependen de la nacionalidad o de la ocupación del autor.
// Base legal y fuentes: investigacion/legislaciones.md.
import { anioLiberacion, LEGISLACIONES, type Legislacion } from './calculo.ts';

/** Países (como vienen en los datos) cuyo plazo es más corto que el argentino. */
const PAIS_LEGISLACION: Record<string, Legislacion> = {
  'República Popular China': 'v50',
  China: 'v50',
  'República de China': 'v50',
  'Hong Kong británico': 'v50',
  'Corea del Norte': 'v50',
  Cuba: 'v50',
  Bolivia: 'v50',
  'Nueva Zelanda': 'v50',
  Egipto: 'v50',
  Filipinas: 'v50',
  Tailandia: 'v50',
  Vietnam: 'v50',
  Irán: 'v50',
  'Arabia Saudita': 'v50',
  Sudáfrica: 'v50',
  Kenia: 'v50',
  Argelia: 'v50',
  Pakistán: 'v50',
  Venezuela: 'v60',
  India: 'v60',
  'Unión de la India': 'v60',
  Bangladés: 'v60',
  Canadá: 'ca',
  Japón: 'jp',
  'Corea del Sur': 'kr',
};

export function paisesDe(p: string): string[] {
  return p.split(' / ').map((x) => x.trim()).filter(Boolean);
}

export interface PlazoMenor {
  pais: string;
  legislacion: Legislacion;
  anio: number;
}

/**
 * Art. 15 de la ley 11.723: a una obra extranjera, Argentina no la protege más que el país donde se publicó.
 * Solo tenemos la nacionalidad, así que es una aproximación: devuelve el país con el plazo más corto, si lo hay.
 */
export function plazoMenorPorArt15(p: string, muerteISO: string): PlazoMenor | null {
  const anioAr = anioLiberacion(muerteISO, 'ar');
  let menor: PlazoMenor | null = null;
  for (const pais of paisesDe(p)) {
    const legislacion = PAIS_LEGISLACION[pais];
    if (!legislacion) continue;
    const anio = anioLiberacion(muerteISO, legislacion);
    if (anio < anioAr && (!menor || anio < menor.anio)) menor = { pais, legislacion, anio };
  }
  return menor;
}

export function textoArt15(m: PlazoMenor): string {
  return (
    `Si la obra se publicó primero en ${m.pais}, en Argentina podría quedar libre en ${m.anio}: ` +
    `la ley argentina no protege una obra extranjera por más tiempo que el país donde se publicó (art. 15, ley 11.723). ` +
    `Por eso el año argentino es un máximo.`
  );
}

/** Estados de la UE (y antecesores que aparecen en los datos). */
const UE = new Set([
  'Alemania', 'Alemania Oriental', 'Austria', 'Bélgica', 'Bulgaria', 'Checoslovaquia', 'Primera República de Checoslovaquia',
  'República Socialista de Checoslovaquia', 'Chipre', 'Croacia',
  'Dinamarca', 'Eslovaquia', 'Eslovenia', 'España', 'Estonia', 'Finlandia', 'Francia', 'Grecia', 'Hungría',
  'Irlanda', 'Italia', 'Letonia', 'Lituania', 'Luxemburgo', 'Malta', 'Países Bajos', 'Polonia', 'Portugal',
  'República Checa', 'Rumania', 'Suecia',
]);

export function esDeLaUE(p: string): boolean {
  return paisesDe(p).some((pais) => UE.has(pais));
}

/** España: el + 80 aplica con seguridad a autores europeos; al resto probablemente le corresponda el plazo de su país. */
export function notaEspana(p: string, muerteISO: string): string | null {
  if (LEGISLACIONES.es.plazo(muerteISO) !== 80 || esDeLaUE(p)) return null;
  return (
    'El plazo de 80 años es para quienes murieron antes del 7/12/1987. Para un autor de fuera de la UE con obras ' +
    'publicadas primero fuera de la UE, probablemente rija el plazo de su país de origen (Directiva 2006/116/CE, art. 7). Caso a verificar.'
  );
}

const AVISOS_OCUPACION: { ocupaciones: string[]; texto: string }[] = [
  {
    ocupaciones: ['fotógrafo', 'fotógrafa'],
    texto:
      'Fotografía: en Argentina, las fotos se protegen 20 años desde su primera publicación, sin importar cuándo ' +
      'murió quien las tomó (art. 34, ley 11.723). Muchas pueden estar libres desde hace tiempo.',
  },
  {
    ocupaciones: ['director de cine', 'directora de cine', 'guionista', 'realizador', 'realizadora', 'productor de cine'],
    texto:
      'Cine: en Argentina, una película se protege 50 años desde la muerte del último entre el autor del argumento, ' +
      'el productor y el director (art. 34, ley 11.723); en la UE, 70 años desde la muerte del último entre director, ' +
      'guionista, dialoguista y compositor. El año de este autor no libera por sí solo sus películas.',
  },
  {
    ocupaciones: ['letrista', 'compositor', 'compositora', 'compositor de canciones', 'cantautor', 'cantautora', 'libretista'],
    texto:
      'Canciones: la ley argentina trata la letra y la música como obras distintas (art. 18, ley 11.723), así que ' +
      'pueden liberarse en años distintos; en la UE y en España se cuenta desde la muerte del último entre letrista y ' +
      'compositor. Caso a verificar.',
  },
];

export function avisosPorOcupacion(occ: string[]): string[] {
  return AVISOS_OCUPACION.filter((a) => a.ocupaciones.some((o) => occ.includes(o))).map((a) => a.texto);
}
