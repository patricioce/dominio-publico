import { test } from 'node:test';
import assert from 'node:assert/strict';
import { avisosPorOcupacion, esDeLaUE, notaEspana, plazoMenorPorArt15 } from './avisos.ts';

test('art. 15: devuelve el plazo más corto entre las nacionalidades', () => {
  assert.deepEqual(plazoMenorPorArt15('República Popular China', '1956-05-01'), {
    pais: 'República Popular China', legislacion: 'v50', anio: 2007,
  });
  assert.equal(plazoMenorPorArt15('Venezuela / Cuba', '1956-05-01')?.pais, 'Cuba');
  assert.equal(plazoMenorPorArt15('Argentina', '1956-05-01'), null);
  assert.equal(plazoMenorPorArt15('México', '1956-05-01'), null);
});

test('art. 15 en países sin retroactividad: depende del año de muerte', () => {
  assert.equal(plazoMenorPorArt15('Canadá', '1960-01-01')?.anio, 2011);
  assert.equal(plazoMenorPorArt15('Canadá', '1972-01-01'), null); // mismo plazo que Argentina
  assert.equal(plazoMenorPorArt15('Japón', '1968-01-01'), null);
});

test('España: nota solo para autores no europeos muertos antes del 7/12/1987', () => {
  assert.ok(esDeLaUE('Alemania / Estados Unidos'));
  assert.ok(!esDeLaUE('Argentina'));
  assert.equal(notaEspana('Alemania', '1956-08-14'), null);
  assert.ok(notaEspana('Argentina', '1956-08-14'));
  assert.equal(notaEspana('Argentina', '1990-01-01'), null);
});

test('avisos por ocupación', () => {
  assert.equal(avisosPorOcupacion(['escritor', 'poeta']).length, 0);
  assert.equal(avisosPorOcupacion(['director de cine', 'guionista']).length, 1);
  assert.equal(avisosPorOcupacion(['letrista', 'director de cine']).length, 2);
});
