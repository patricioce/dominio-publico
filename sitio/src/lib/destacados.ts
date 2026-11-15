// Autores destacados para la portada (carrusel) y utilidades de fotos.
// Funciones puras salvo cargarCitas(), que lee datos/citas.json al compilar.
import fs from 'node:fs';
import path from 'node:path';
import type { Autor } from './datos.ts';
import { anioLiberacion } from './calculo.ts';

export interface Cita {
  id: string;
  texto: string;
  resaltar?: string;
  fuente: string;
  verificar?: boolean;
}

export function cargarCitas(): Cita[] {
  const archivo = path.resolve(process.cwd(), '../datos/citas.json');
  if (!fs.existsSync(archivo)) return [];
  return (JSON.parse(fs.readFileSync(archivo, 'utf8')) as { citas: Cita[] }).citas;
}

/** Miniatura de Wikimedia Commons (Special:FilePath acepta ?width=). */
export function urlFoto(img: string | undefined, ancho: number): string | null {
  if (!img) return null;
  return `${img.replace(/^http:\/\//, 'https://')}?width=${ancho}`;
}

export interface Destacado {
  autor: Autor;
  cita?: Cita;
}

/**
 * Fichas curadas ya libres en Argentina, con foto primero y por notoriedad.
 * Las que tienen cita se intercalan para que el carrusel alterne "las dos fechas" y "la cita".
 */
export function destacados(autores: Autor[], citas: Cita[], hoy: Date, cantidad = 10): Destacado[] {
  const porId = new Map(citas.map((c) => [c.id, c]));
  const elegibles = autores
    .filter((a) => a.bio && anioLiberacion(a.d) <= hoy.getFullYear())
    .sort((x, y) => Number(!!y.img) - Number(!!x.img) || Number(porId.has(y.id)) - Number(porId.has(x.id)) || (y.sl ?? 0) - (x.sl ?? 0))
    .slice(0, cantidad)
    .map((autor) => ({ autor, cita: porId.get(autor.id) }));
  const conCita = elegibles.filter((d) => d.cita);
  const sinCita = elegibles.filter((d) => !d.cita);
  const salida: Destacado[] = [];
  while (conCita.length || sinCita.length) {
    if (sinCita.length) salida.push(sinCita.shift()!);
    if (conCita.length) salida.push(conCita.shift()!);
  }
  return salida;
}
