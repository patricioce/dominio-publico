import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Autor } from './datos.ts';
import { coincide, indiceBuscador, normalizar } from './buscador.ts';

const autor = (n: string, d: string, extra: Partial<Autor> = {}): Autor => ({
  id: n, slug: n.toLowerCase(), n, b: '1900-01-01', d, bd: '', dd: '', p: 'Argentina', o: 'Literatura',
  occ: ['poeta'], flags: [], src: 'wikidata', conf: 'ok', aniosMuerte: [Number(d.slice(0, 4))], ...extra,
});

test('normalizar quita tildes y mayúsculas', () => {
  assert.equal(normalizar('Discépolo ÑANDÚ'), 'discepolo nandu');
});

test('índice ordenado por año de liberación y notoriedad', () => {
  const idx = indiceBuscador([
    autor('B', '1956-01-01', { sl: 5 }),
    autor('C', '1955-01-01', { sl: 1 }),
    autor('A', '1956-01-01', { sl: 50 }),
  ]);
  assert.deepEqual(idx.map((e) => e.n), ['C', 'A', 'B']);
  assert.equal(idx[0].f, 2026);
  assert.equal(idx[0].a, 1);
  assert.equal(indiceBuscador([autor('X', '1956-01-01', { p: 'Francia' })])[0].a, undefined);
});

test('búsqueda: todas las palabras, sin tildes, en cualquier orden', () => {
  const [e] = indiceBuscador([autor('Enrique Santos Discépolo', '1951-12-23', { occ: ['letrista'] })]);
  assert.ok(coincide(e, 'discepolo'));
  assert.ok(coincide(e, 'letrista argentina'));
  assert.ok(coincide(e, 'SANTOS enrique'));
  assert.ok(!coincide(e, 'discepolo francia'));
  assert.ok(coincide(e, '   '));
});
