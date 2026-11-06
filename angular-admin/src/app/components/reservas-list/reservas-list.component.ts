import { Component, OnInit, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { forkJoin } from 'rxjs';
import { LaboratoriosService } from '../../services/laboratorios.service';
import { ReservasService } from '../../services/reservas.service';
import { Laboratorio, Reserva } from '../../models/modelos';
import { EstadoReservaPipe } from '../../pipes/estado-reserva.pipe';
import { reservasPorEstado } from '../../../core/estadisticas';

@Component({
  selector: 'app-reservas-list',
  standalone: true,
  imports: [NgClass, EstadoReservaPipe],
  template: `
    <h2 class="h4 mb-3">Reservas</h2>

    @if (error()) {
      <div class="alert alert-danger">{{ error() }}</div>
    }

    <div class="mb-3">
      @for (e of estados; track e) {
        <span class="badge me-2 fs-6"
              [ngClass]="{
                'text-bg-warning': e === 'pendiente',
                'text-bg-success': e === 'aprobada',
                'text-bg-danger': e === 'rechazada'
              }">{{ e | estadoReserva }}: {{ totales()[e] }}</span>
      }
    </div>

    <table class="table table-hover bg-white shadow-sm align-middle">
      <thead class="table-light">
        <tr><th>Código</th><th>Laboratorio</th><th>Fecha</th><th>Horario</th><th>Motivo</th><th>Estado</th><th></th></tr>
      </thead>
      <tbody>
        @for (r of reservas(); track r.id) {
          <tr>
            <td>{{ r.codigo }}</td>
            <td>{{ nombreLab(r.laboratorioId) }}</td>
            <td>{{ r.fecha }}</td>
            <td>{{ r.horaInicio }} – {{ r.horaFin }}</td>
            <td>{{ r.motivo }}</td>
            <td>
              <span class="badge estado-badge"
                    [ngClass]="{
                      'text-bg-warning': r.estado === 'pendiente',
                      'text-bg-success': r.estado === 'aprobada',
                      'text-bg-danger': r.estado === 'rechazada'
                    }">{{ r.estado | estadoReserva }}</span>
            </td>
            <td class="text-end">
              <button class="btn btn-sm btn-outline-danger" (click)="cancelar(r)">Cancelar</button>
            </td>
          </tr>
        } @empty {
          <tr><td colspan="7" class="text-center text-muted py-4">No hay reservas</td></tr>
        }
      </tbody>
    </table>
  `,
})
export class ReservasListComponent implements OnInit {
  private labsService = inject(LaboratoriosService);
  private reservasService = inject(ReservasService);

  readonly estados = ['pendiente', 'aprobada', 'rechazada'] as const;
  reservas = signal<Reserva[]>([]);
  laboratorios = signal<Laboratorio[]>([]);
  totales = signal({ pendiente: 0, aprobada: 0, rechazada: 0 });
  error = signal('');

  ngOnInit(): void {
    forkJoin({ labs: this.labsService.listar(), reservas: this.reservasService.listar() }).subscribe({
      next: ({ labs, reservas }) => {
        this.laboratorios.set(labs);
        this.reservas.set(reservas);
        this.totales.set(reservasPorEstado(reservas));
      },
      error: () => this.error.set('No se pudo conectar con el API (¿corriste npm run api?)'),
    });
  }

  nombreLab(id: number): string {
    return this.laboratorios().find((l) => l.id === id)?.nombre ?? `#${id}`;
  }

  cancelar(r: Reserva): void {
    if (!confirm(`¿Cancelar la reserva ${r.codigo}?`)) return;
    this.reservasService.cancelar(r.id).subscribe({
      next: () => {
        this.reservas.update((lista) => lista.filter((x) => x.id !== r.id));
        this.totales.set(reservasPorEstado(this.reservas()));
      },
      error: () => this.error.set(`No se pudo cancelar ${r.codigo}`),
    });
  }
}
