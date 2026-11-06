export type EstadoLaboratorio = 'disponible' | 'mantenimiento';
export type EstadoReserva = 'pendiente' | 'aprobada' | 'rechazada';
export type RolUsuario = 'estudiante' | 'admin';

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  codigo: string;
  rol: RolUsuario;
}

export interface Laboratorio {
  id: number;
  nombre: string;
  sede: string;
  capacidad: number;
  equipos: string[];
  estado: EstadoLaboratorio;
}

// Al crear, el id lo asigna json-server
export type LaboratorioNuevo = Omit<Laboratorio, 'id'>;

export interface Reserva {
  id: number;
  codigo: string;
  laboratorioId: number;
  usuarioId: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  motivo: string;
  estado: EstadoReserva;
  creadoEn: string;
}
