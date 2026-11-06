// core-js/validadores.js
// Validadores con expresiones regulares (Unidad 1, S3).
// Cada función devuelve true/false; `validarReserva` y `validarLaboratorio`
// devuelven una lista de mensajes de error construidos con template literals.

export const esCorreoUTP = (correo) =>
  /^[a-z0-9._%+-]+@utp\.edu\.pe$/i.test(correo ?? '');

export const esCodigoAlumno = (codigo) => /^U\d{8}$/.test(codigo ?? '');

export const esHora = (hora) => /^([01]\d|2[0-3]):[0-5]\d$/.test(hora ?? '');

// AAAA-MM-DD con mes 01-12 y día 01-31, y comprobación de fecha real
export const esFecha = (fecha) => {
  const m = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.exec(fecha ?? '');
  if (!m) return false;
  const [, anio, mes, dia] = m.map(Number);
  const d = new Date(Date.UTC(anio, mes - 1, dia));
  return d.getUTCFullYear() === anio && d.getUTCMonth() === mes - 1 && d.getUTCDate() === dia;
};

const aMinutos = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export function validarUsuario({ correo, codigo } = {}) {
  const errores = [];
  if (!esCorreoUTP(correo)) {
    errores.push(`El correo "${correo}" no es institucional (debe terminar en @utp.edu.pe)`);
  }
  if (!esCodigoAlumno(codigo)) {
    errores.push(`El código "${codigo}" no es válido (U + 8 dígitos, ej. U20231234)`);
  }
  return errores;
}

export function validarLaboratorio({ nombre, sede, capacidad } = {}) {
  const errores = [];
  if (!nombre || String(nombre).trim() === '') errores.push('El nombre es obligatorio');
  if (!sede || String(sede).trim() === '') errores.push('La sede es obligatoria');
  if (!Number.isInteger(capacidad) || capacidad < 1 || capacidad > 60) {
    errores.push(`La capacidad ${capacidad} debe ser un entero entre 1 y 60`);
  }
  return errores;
}

export function validarReserva({ fecha, horaInicio, horaFin } = {}) {
  const errores = [];
  if (!esFecha(fecha)) errores.push(`La fecha "${fecha}" debe tener el formato AAAA-MM-DD`);
  if (!esHora(horaInicio)) errores.push(`La hora de inicio "${horaInicio}" debe tener el formato HH:mm`);
  if (!esHora(horaFin)) errores.push(`La hora de fin "${horaFin}" debe tener el formato HH:mm`);
  if (esHora(horaInicio) && esHora(horaFin) && aMinutos(horaFin) <= aMinutos(horaInicio)) {
    errores.push(`La hora de fin (${horaFin}) debe ser mayor que la de inicio (${horaInicio})`);
  }
  return errores;
}
