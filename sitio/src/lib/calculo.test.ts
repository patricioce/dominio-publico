import { test } from 'node:test';
import assert from 'node:assert/strict';
import { anioLiberacion, diasHasta, estado, textoEstado } from './calculo.ts';

test('Argentina y UE: vida + 70 + 1', () => {
  assert.equal(anioLiberacion('1956-08-14'), 2027); // Brecht
  assert.equal(anioLiberacion('1956-08-14', 'ue'), 2027);
});

test('España: + 80 antes del 7/12/1987, + 70 desde ese día', () => {
  assert.equal(anioLiberacion('1956-08-14', 'es'), 2037);
  assert.equal(anioLiberacion('1987-12-06', 'es'), 2068);
  assert.equal(anioLiberacion('1987-12-07', 'es'), 2058);
});

test('Vida + 60 y vida + 50', () => {
  assert.equal(anioLiberacion('1956-08-14', 'v60'), 2017);
  assert.equal(anioLiberacion('1956-08-14', 'v50'), 2007);
});

test('Muerte el 31/12 o el 1/1 no cambia el año de liberación', () => {
  assert.equal(anioLiberacion('1956-01-01'), 2027);
  assert.equal(anioLiberacion('1956-12-31'), 2027);
});

test('Días hasta el 1 de enero', () => {
  assert.equal(diasHasta(2027, new Date(2026, 9, 1)), 92);
  assert.equal(diasHasta(2027, new Date(2026, 11, 31)), 1);
  assert.equal(diasHasta(2027, new Date(2026, 11, 31, 23, 59)), 1);
});

test('Estado y texto', () => {
  const hoy = new Date(2026, 9, 1);
  assert.equal(textoEstado(estado('1955-04-18', hoy)), 'Libre desde 2026'); // Einstein
  assert.equal(textoEstado(estado('1956-08-14', hoy)), 'Faltan 92 días');
  assert.equal(textoEstado(estado('1957-01-01', hoy)), 'Faltan 2 años');
  assert.equal(textoEstado(estado('1976-01-01', hoy)), 'Faltan 21 años');
});

test('El 1 de enero ya cuenta como libre', () => {
  const e = estado('1956-08-14', new Date(2027, 0, 1));
  assert.equal(e.libre, true);
});
