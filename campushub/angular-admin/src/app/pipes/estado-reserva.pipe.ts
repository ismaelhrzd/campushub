import { Pipe, PipeTransform } from '@angular/core';

// Pipe personalizado: {{ reserva.estado | estadoReserva }} → "✅ Aprobada"
@Pipe({ name: 'estadoReserva', standalone: true })
export class EstadoReservaPipe implements PipeTransform {
  private textos: Record<string, string> = {
    pendiente: '⏳ Pendiente',
    aprobada: '✅ Aprobada',
    rechazada: '❌ Rechazada',
    disponible: '🟢 Disponible',
    mantenimiento: '🛠️ Mantenimiento',
  };

  transform(estado: string): string {
    return this.textos[estado] ?? estado;
  }
}
