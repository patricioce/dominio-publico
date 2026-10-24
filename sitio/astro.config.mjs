// @ts-check
import { defineConfig } from 'astro/config';

// En GitHub Pages sin dominio propio el sitio vive en una subcarpeta (usuario.github.io/repo/):
// el flujo de publicación pasa SITIO_URL y SITIO_BASE. Sin esas variables (en local), va en la raíz.
export default defineConfig({
  site: process.env.SITIO_URL,
  base: process.env.SITIO_BASE || '/',
  trailingSlash: 'always',
});
