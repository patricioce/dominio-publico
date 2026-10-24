// Reglas de cálculo del año de liberación (ver "Reglas de cálculo" en CLAUDE.md
// y la investigación en investigacion/legislaciones.md).
// Funciones puras: se usan al compilar y también en el navegador para el contador.

export type Legislacion = 'ar' | 'ue' | 'es' | 'co' | 'v75' | 'v60' | 'ca' | 'jp' | 'kr' | 'v50';

interface DatosLegislacion {
  nombre: string;
  corto: string;
  /** Plazo en años contado desde la muerte. */
  plazo: (muerteISO: string) => number;
  /** Aclaración para mostrar junto al año. */
  nota?: string;
}

/** Plazo de un país que pasó de vida + 50 a vida + 70 sin revivir lo que ya estaba libre. */
const sinRetroactividad = (ultimoAnioLibre: number) => (muerteISO: string) =>
  anioDe(muerteISO) <= ultimoAnioLibre ? 50 : 70;

// El orden es el de la tabla del perfil.
export const LEGISLACIONES: Record<Legislacion, DatosLegislacion> = {
  ar: { nombre: 'Argentina (vida + 70)', corto: 'Argentina', plazo: () => 70 },
  ue: {
    nombre: 'Unión Europea (vida + 70)',
    corto: 'Unión Europea',
    plazo: () => 70,
    nota: 'Para autores de fuera de la UE con obras publicadas primero fuera de la UE, rige el plazo del país de origen si es más corto (Directiva 2006/116/CE, art. 7).',
  },
  // España: vida + 80 para quienes murieron antes del 7/12/1987 (LPI, disp. transitoria 4.ª); después, vida + 70.
  es: {
    nombre: 'España (vida + 80 / + 70)',
    corto: 'España',
    plazo: (muerteISO) => (muerteISO < '1987-12-07' ? 80 : 70),
  },
  co: { nombre: 'Colombia (vida + 80)', corto: 'Colombia', plazo: () => 80 },
  v75: { nombre: 'Guatemala y Honduras (vida + 75)', corto: 'Guatemala y Honduras', plazo: () => 75 },
  v60: { nombre: 'Vida + 60 (Venezuela, India, Bangladesh)', corto: 'Vida + 60', plazo: () => 60 },
  // Canadá, Japón y Corea del Sur pasaron a vida + 70 sin retroactividad.
  ca: {
    nombre: 'Canadá (vida + 70 desde 2022)',
    corto: 'Canadá',
    plazo: sinRetroactividad(1971),
    nota: 'Pasó a vida + 70 el 30/12/2022 sin retroactividad: lo de autores muertos hasta 1971 ya estaba libre.',
  },
  jp: {
    nombre: 'Japón (vida + 70 desde 2018)',
    corto: 'Japón',
    plazo: sinRetroactividad(1967),
    nota: 'Pasó a vida + 70 el 30/12/2018 sin retroactividad. Las obras de nacionales de los países aliados de la Segunda Guerra suman unos diez años de prórroga.',
  },
  kr: {
    nombre: 'Corea del Sur (vida + 70 desde 2013)',
    corto: 'Corea del Sur',
    plazo: sinRetroactividad(1962),
    nota: 'Pasó a vida + 70 en 2013 sin retroactividad: lo de autores muertos antes de 1963 ya estaba libre.',
  },
  v50: {
    nombre: 'Vida + 50 (China, Cuba, Bolivia, Nueva Zelanda…)',
    corto: 'Vida + 50',
    plazo: () => 50,
    nota: 'Nueva Zelanda debe pasar a vida + 70 antes de mayo de 2028; todavía no se sabe si será retroactivo.',
  },
};

/** México no se calcula: hay varias lecturas sobre cómo se aplicaron sus extensiones. */
export const NOTA_MEXICO =
  'México protege vida + 100, el plazo más largo del mundo. Lo extendió varias veces (20, 25, 30, 50, 75 y 100 años) ' +
  'y no hay acuerdo sobre cómo se aplica cada cambio a quienes murieron antes, así que no calculamos un año.';

export const LEGISLACION_PRINCIPAL: Legislacion = 'ar';

export function anioDe(iso: string): number {
  return parseInt(iso.slice(0, 4), 10);
}

/** Año de liberación = año de muerte + plazo + 1 (se libera el 1 de enero). */
export function anioLiberacion(muerteISO: string, leg: Legislacion = LEGISLACION_PRINCIPAL): number {
  return anioDe(muerteISO) + LEGISLACIONES[leg].plazo(muerteISO) + 1;
}

/** Días desde hoy hasta el 1 de enero del año dado, en fechas de calendario. */
export function diasHasta(anio: number, hoy: Date): number {
  const hoyUTC = Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  return Math.ceil((Date.UTC(anio, 0, 1) - hoyUTC) / 86_400_000);
}

export type Estado =
  | { libre: true; anio: number }
  | { libre: false; anio: number; anios: number; dias: number };

export function estado(muerteISO: string, hoy: Date, leg: Legislacion = LEGISLACION_PRINCIPAL): Estado {
  return estadoDelAnio(anioLiberacion(muerteISO, leg), hoy);
}

/** Estado a partir del año de liberación ya calculado (lo usa el navegador para actualizar la página). */
export function estadoDelAnio(anio: number, hoy: Date): Estado {
  if (anio <= hoy.getFullYear()) return { libre: true, anio };
  return { libre: false, anio, anios: anio - hoy.getFullYear(), dias: diasHasta(anio, hoy) };
}

export function plural(n: number, singular: string, pluralTxt: string): string {
  return `${n.toLocaleString('es-AR')} ${n === 1 ? singular : pluralTxt}`;
}

/** "Libre desde 2026", "Faltan 92 días" (último año) o "Faltan 27 años". */
export function textoEstado(e: Estado): string {
  if (e.libre) return `Libre desde ${e.anio}`;
  if (e.anios === 1) return `Faltan ${plural(e.dias, 'día', 'días')}`;
  return `Faltan ${plural(e.anios, 'año', 'años')}`;
}
