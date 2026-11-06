// core-js/core.test.js  →  node --test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { esCorreoUTP, esCodigoAlumno, esHora, esFecha, validarReserva, validarLaboratorio } from './validadores.js';
import { Usuario, Laboratorio, Reserva } from './modelos.js';
import {
  reservasPorEstado, ocupacionPorLaboratorio, sedesUnicas, rankingLaboratorios, crearGeneradorCodigos,
} from './estadisticas.js';

const reserva = (extra = {}) =>
  new Reserva({ laboratorioId: 1, fecha: '2026-11-20', horaInicio: '08:00', horaFin: '10:00', ...extra });

test('correo institucional válido e inválido', () => {
  assert.equal(esCorreoUTP('u20231234@utp.edu.pe'), true);
  assert.equal(esCorreoUTP('alguien@gmail.com'), false);
});

test('código de alumno: U + 8 dígitos', () => {
  assert.equal(esCodigoAlumno('U20231234'), true);
  assert.equal(esCodigoAlumno('U2023123'), false);
  assert.equal(esCodigoAlumno('20231234'), false);
});

test('hora HH:mm y fecha AAAA-MM-DD', () => {
  assert.equal(esHora('23:59'), true);
  assert.equal(esHora('24:00'), false);
  assert.equal(esFecha('2026-11-20'), true);
  assert.equal(esFecha('2026-02-30'), false);
});

test('validarReserva devuelve mensajes con template literals', () => {
  const errores = validarReserva({ fecha: '2026-11-20', horaInicio: '10:00', horaFin: '09:00' });
  assert.equal(errores.length, 1);
  assert.match(errores[0], /09:00.*10:00/);
  assert.deepEqual(validarReserva({ fecha: '2026-11-20', horaInicio: '08:00', horaFin: '10:00' }), []);
});

test('validarLaboratorio exige capacidad entre 1 y 60', () => {
  assert.equal(validarLaboratorio({ nombre: 'Lab A-301', sede: 'Lima Centro', capacidad: 61 }).length, 1);
  assert.equal(validarLaboratorio({ nombre: 'Lab A-301', sede: 'Lima Centro', capacidad: 30 }).length, 0);
});

test('Reserva.duracionHoras', () => {
  assert.equal(reserva({ horaInicio: '08:00', horaFin: '10:30' }).duracionHoras(), 2.5);
});

test('reservas solapadas se cruzan', () => {
  assert.equal(reserva().seCruzaCon(reserva({ horaInicio: '09:00', horaFin: '11:00' })), true);
});

test('reservas contiguas no se cruzan', () => {
  assert.equal(reserva().seCruzaCon(reserva({ horaInicio: '10:00', horaFin: '11:00' })), false);
});

test('otro laboratorio u otro día no se cruzan', () => {
  assert.equal(reserva().seCruzaCon(reserva({ laboratorioId: 2 })), false);
  assert.equal(reserva().seCruzaCon(reserva({ fecha: '2026-11-21' })), false);
});

test('Usuario: getters y perfil sin contraseña', () => {
  const u = new Usuario({ id: 1, nombre: 'Ana Torres', rol: 'admin', password: 'x' });
  assert.equal(u.esAdmin, true);
  assert.equal(u.iniciales, 'AT');
  assert.equal('password' in u.perfil(), false);
});

test('Laboratorio: etiqueta, disponibilidad y equipos', () => {
  const l = new Laboratorio({ nombre: 'Lab A-301', sede: 'Lima Centro', equipos: ['PC i7'], estado: 'mantenimiento' });
  assert.equal(l.etiqueta, 'Lab A-301 (Lima Centro)');
  assert.equal(l.estaDisponible, false);
  assert.equal(l.tieneEquipo('pc i7'), true);
});

test('reservasPorEstado con reduce', () => {
  const datos = [reserva({ estado: 'aprobada' }), reserva({ estado: 'aprobada' }), reserva({ estado: 'pendiente' })];
  assert.deepEqual(reservasPorEstado(datos), { pendiente: 1, aprobada: 2, rechazada: 0 });
});

test('ocupación por laboratorio (Map) solo cuenta aprobadas', () => {
  const datos = [
    reserva({ estado: 'aprobada' }),
    reserva({ estado: 'aprobada', horaInicio: '10:00', horaFin: '11:00' }),
    reserva({ estado: 'pendiente', laboratorioId: 2 }),
  ];
  const mapa = ocupacionPorLaboratorio(datos);
  assert.equal(mapa.get(1), 3);
  assert.equal(mapa.has(2), false);
});

test('sedes únicas con Set', () => {
  const labs = [{ sede: 'Lima Sur' }, { sede: 'Lima Sur' }, { sede: 'Arequipa' }];
  assert.deepEqual(sedesUnicas(labs), ['Lima Sur', 'Arequipa']);
});

test('ranking no modifica el arreglo original', () => {
  const labs = [{ id: 1, nombre: 'A' }, { id: 2, nombre: 'B' }];
  const datos = [reserva({ laboratorioId: 2 }), reserva({ laboratorioId: 2 }), reserva({ laboratorioId: 1 })];
  const ranking = rankingLaboratorios(labs, datos);
  assert.equal(ranking[0].id, 2);
  assert.equal(labs[0].id, 1);
});

test('generador de códigos con closure y padStart', () => {
  const siguiente = crearGeneradorCodigos();
  assert.equal(siguiente(), 'RES-0001');
  assert.equal(siguiente(), 'RES-0002');
  assert.equal(crearGeneradorCodigos('RES', 20)(), 'RES-0021');
});
