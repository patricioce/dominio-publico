import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Autor } from './datos.ts';
import { aniosConDatos, anioMuerteDe, esArgentino, gruposDelAnio, periodoVida } from './anios.ts';

function autor(datos: Partial<Autor>): Autor {
  return {
    id: 'x', n: 'X', b: '', d: '1956-01-01', bd: '', dd: '', p: '', o: 'Literatura',
    occ: [], flags: [], src: 'wikidata', conf: 'ok', slug: 'x', aniosMuerte: [1956],
    ...datos,
  };
}

test('año de muerte y de liberación por la ley argentina', () => {
  assert.equal(anioMuerteDe(2027), 1956);
  assert.deepEqual(aniosConDatos([autor({ aniosMuerte: [1956, 1957] }), autor({ aniosMuerte: [1950] })]), [2021, 2027, 2028]);
});

test('argentinos: por la consulta de argentinos o por el país', () => {
  assert.ok(esArgentino({ consultas: ['argentinos'], p: '' }));
  assert.ok(esArgentino({ p: 'Argentina, Uruguay' }));
  assert.ok(!esArgentino({ consultas: ['general'], p: 'Uruguay' }));
});

test('período de vida con nacimiento dudoso o faltante', () => {
  assert.equal(periodoVida({ b: '1898-02-10', bd: '10 de febrero de 1898', flags: [] }, 1956), '1898–1956');
  assert.equal(periodoVida({ b: '1886-01-01', bd: '1886 o 1888', flags: ['nacimiento'] }, 1956), '1886 o 1888–1956');
  assert.equal(periodoVida({ b: '', bd: '', flags: ['sin_nacimiento'] }, 1956), '?–1956');
});

test('grupos: orden de categorías, curados primero, solo periodistas al final', () => {
  const grupos = gruposDelAnio(
    [
      autor({ id: 'a', n: 'A', sl: 50 }),
      autor({ id: 'b', n: 'B', sl: 5, bio: 'Ficha curada' }),
      autor({ id: 'c', n: 'C', sl: 90, solo_periodista: true }),
      autor({ id: 'd', n: 'D', o: 'Música' }),
      autor({ id: 'e', n: 'E', aniosMuerte: [1957] }),
    ],
    2027,
  );
  assert.deepEqual(grupos.map((g) => g.categoria), ['Literatura', 'Música']);
  assert.deepEqual(grupos[0].autores.map((a) => a.id), ['b', 'a', 'c']);
});
