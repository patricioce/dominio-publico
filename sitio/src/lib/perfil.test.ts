import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Autor } from './datos.ts';
import { avisos, esCasoAVerificar, filasLegislacion, iniciales, lineaDeTiempo, posicionHoy } from './perfil.ts';

const base: Autor = {
  id: 'q1', qid: 'Q1', slug: 'x-q1', n: 'Bertolt Brecht', b: '1898-02-10', d: '1956-08-14',
  bd: '10 de febrero de 1898', dd: '14 de agosto de 1956', p: 'Alemania', o: 'Literatura',
  occ: ['dramaturgo'], flags: [], src: 'wikidata', conf: 'ok', aniosMuerte: [1956],
};
const hoy = new Date(2026, 9, 24);

test('tabla: una fila por legislación, Argentina primero', () => {
  const filas = filasLegislacion(base, hoy);
  assert.equal(filas[0].legislacion, 'ar');
  assert.equal(filas[0].anio, 2027);
  assert.equal(filas[0].texto, 'Faltan 69 días');
  assert.equal(filas.find((f) => f.legislacion === 'v50')?.texto, 'Libre desde 2007');
});

test('tabla: notas de UE y España solo para autores no europeos', () => {
  const europeo = filasLegislacion(base, hoy);
  assert.equal(europeo.find((f) => f.legislacion === 'ue')?.nota, undefined);
  assert.equal(europeo.find((f) => f.legislacion === 'es')?.nota, undefined);
  const argentino = filasLegislacion({ ...base, p: 'Argentina' }, hoy);
  assert.ok(argentino.find((f) => f.legislacion === 'ue')?.nota);
  assert.ok(argentino.find((f) => f.legislacion === 'es')?.nota);
});

test('avisos: el de dominio público pagante va siempre, al final', () => {
  const lista = avisos(base);
  assert.equal(lista.length, 1);
  assert.equal(lista[0].titulo, 'Dominio público pagante');
});

test('avisos: advertencia, art. 15, ocupación y marcas', () => {
  const lista = avisos({
    ...base, p: 'República Popular China', occ: ['guionista'], c: 'Texto de la corrección.', flags: ['anio'],
  });
  assert.deepEqual(lista.map((x) => x.titulo), [
    'A tener en cuenta', 'Puede quedar libre antes', 'Según el tipo de obra', 'Dato a revisar', 'Dominio público pagante',
  ]);
});

test('avisos: muerte en varios años nombra los años de lista', () => {
  const [aviso] = avisos({ ...base, flags: ['muerte_otro_anio'], aniosMuerte: [1956, 1955] });
  assert.match(aviso.texto, /1955 y 1956/);
  assert.match(aviso.texto, /2026 y 2027/);
});

test('iniciales', () => {
  assert.equal(iniciales('Bertolt Brecht'), 'BB');
  assert.equal(iniciales('A. A. Milne'), 'AM');
  assert.equal(iniciales('Enrique Santos Discépolo'), 'SD');
  assert.equal(iniciales('Évariste Lévi-Provençal'), 'ÉL');
});

test('línea de tiempo', () => {
  const t = lineaDeTiempo(base, hoy);
  assert.equal(t.inicio, 1898);
  assert.equal(t.liberacion, 2027);
  assert.equal(t.fin, 2035);
  assert.ok(Math.abs(t.vida + t.proteccion + t.libre - 100) < 1e-9);
  assert.equal(lineaDeTiempo({ b: '', d: '1956-01-01' }, hoy).inicio, 1896);
  assert.equal(posicionHoy(2000, 2100, new Date(2050, 0, 1)), 50);
  assert.equal(posicionHoy(2000, 2010, new Date(2050, 0, 1)), 100);
});

test('caso a verificar: por los datos, por el art. 15 o por el tipo de obra', () => {
  assert.equal(esCasoAVerificar(base), false);
  assert.equal(esCasoAVerificar({ ...base, conf: 'check' }), true);
  assert.equal(esCasoAVerificar({ ...base, p: 'Bolivia' }), true);
  assert.equal(esCasoAVerificar({ ...base, occ: ['letrista'] }), true);
});

test('avisos: varias fechas en el año y además otra en otro año', () => {
  const lista = avisos({ ...base, flags: ['muerte', 'muerte_otro_anio'], aniosMuerte: [1956, 1957] });
  assert.doesNotMatch(lista[0].texto, /todas en/);
});
