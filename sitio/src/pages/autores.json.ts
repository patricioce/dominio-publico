// Índice del buscador de /autores/, generado al compilar.
import { autores } from '../lib/datos';
import { indiceBuscador } from '../lib/buscador';

export function GET() {
  return new Response(JSON.stringify(indiceBuscador(autores)), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
