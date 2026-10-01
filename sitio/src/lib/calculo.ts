// Reglas de cálculo del año de liberación (ver "Reglas de cálculo" en CLAUDE.md).
// Funciones puras: se usan al compilar y también en el navegador para el contador.

export type Legislacion = 'ar' | 'ue' | 'es' | 'v60' | 'v50';

interface DatosLegislacion {
  nombre: string;
  corto: string;
  /** Plazo en años contado desde la muerte. */
  plazo: (muerteISO: string) => number;
}

export const LEGISLACIONES: Record<Legislacion, DatosLegislacion> = {
  ar: { nombre: 'Argentina (vida + 70)', corto: 'Argentina', plazo: () => 70 },
  ue: { nombre: 'Unión Europea (vida + 70)', corto: 'Unión Europea', plazo: () => 70 },
  // España: vida + 80 para quienes murieron antes del 7/12/1987; después, vida + 70.
  es: {
    nombre: 'España (vida + 80 / + 70)',
    corto: 'España',
    plazo: (muerteISO) => (muerteISO < '1987-12-07' ? 80 : 70),
  },
  // Canadá, Nueva Zelanda y Japón pasaron a vida + 70 sin retroactividad: no van en vida + 50.
  v60: { nombre: 'Vida + 60 (India, Bangladesh, Venezuela)', corto: 'Vida + 60', plazo: () => 60 },
  v50: { nombre: 'Vida + 50 (China, Egipto…)', corto: 'Vida + 50', plazo: () => 50 },
};

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
  const anio = anioLiberacion(muerteISO, leg);
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
