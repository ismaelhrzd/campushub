// core-js/estadisticas.js
// Estadísticas con map / filter / reduce, Map y Set (Unidad 1, S2, S4, S5).

// Reservas por estado con reduce: el valor inicial es un objeto acumulador
export const reservasPorEstado = (reservas) =>
  reservas.reduce(
    (acc, r) => ({ ...acc, [r.estado]: (acc[r.estado] ?? 0) + 1 }),
    { pendiente: 0, aprobada: 0, rechazada: 0 },
  );

// Ocupación por laboratorio con Map: laboratorioId -> horas aprobadas
export const ocupacionPorLaboratorio = (reservas) => {
  const mapa = new Map();
  reservas
    .filter((r) => r.estado === 'aprobada')
    .forEach((r) => {
      const [hi, mi] = r.horaInicio.split(':').map(Number);
      const [hf, mf] = r.horaFin.split(':').map(Number);
      const horas = (hf * 60 + mf - (hi * 60 + mi)) / 60;
      mapa.set(r.laboratorioId, (mapa.get(r.laboratorioId) ?? 0) + horas);
    });
  return mapa;
};

// Sedes únicas con Set
export const sedesUnicas = (laboratorios) => [...new Set(laboratorios.map((l) => l.sede))];

// Ranking de laboratorios más reservados: sort sobre una copia (spread)
export const rankingLaboratorios = (laboratorios, reservas, top = 5) => {
  const conteo = new Map();
  reservas.forEach((r) => conteo.set(r.laboratorioId, (conteo.get(r.laboratorioId) ?? 0) + 1));
  return [...laboratorios]
    .map((l) => ({ ...l, totalReservas: conteo.get(l.id) ?? 0 }))
    .sort((a, b) => b.totalReservas - a.totalReservas || a.nombre.localeCompare(b.nombre))
    .slice(0, top);
};

// Generador de códigos con closure: RES-0001, RES-0002...
export const crearGeneradorCodigos = (prefijo = 'RES', inicio = 0) => {
  let contador = inicio; // variable privada capturada por la closure
  return () => `${prefijo}-${String(++contador).padStart(4, '0')}`;
};
