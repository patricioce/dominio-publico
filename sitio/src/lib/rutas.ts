// Arma URLs internas respetando el `base` de Astro (por si el sitio se publica en un subdirectorio).
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function url(ruta: string): string {
  return `${BASE}${ruta}`;
}
