import { Component, OnInit, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LaboratoriosService } from '../../services/laboratorios.service';
import { Laboratorio } from '../../models/modelos';
import { EstadoReservaPipe } from '../../pipes/estado-reserva.pipe';
import { ResaltarDirective } from '../../directives/resaltar.directive';
import { sedesUnicas } from '../../../core/estadisticas';

@Component({
  selector: 'app-lab-list',
  standalone: true,
  imports: [NgClass, FormsModule, RouterLink, EstadoReservaPipe, ResaltarDirective],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="h4 m-0">Laboratorios</h2>
      <a class="btn btn-primary" routerLink="/laboratorios/nuevo">+ Nuevo</a>
    </div>

    <div class="row g-2 mb-3">
      <div class="col-md-6">
        <input class="form-control" placeholder="Buscar (nombre, equipo...)"
               [(ngModel)]="texto" (ngModelChange)="cargar()">
      </div>
      <div class="col-md-4">
        <select class="form-select" [(ngModel)]="sede" (ngModelChange)="cargar()">
          <option value="">Todas las sedes</option>
          @for (s of sedes(); track s) {
            <option [value]="s">{{ s }}</option>
          }
        </select>
      </div>
    </div>

    @if (error()) {
      <div class="alert alert-danger">{{ error() }}</div>
    }

    <table class="table table-hover bg-white shadow-sm align-middle">
      <thead class="table-light">
        <tr><th>Nombre</th><th>Sede</th><th>Capacidad</th><th>Equipos</th><th>Estado</th><th class="text-end">Acciones</th></tr>
      </thead>
      <tbody>
        @for (lab of laboratorios(); track lab.id) {
          <tr [appResaltar]="lab.estado === 'mantenimiento'">
            <td><a [routerLink]="['/laboratorios', lab.id]">{{ lab.nombre }}</a></td>
            <td>{{ lab.sede }}</td>
            <td>{{ lab.capacidad }}</td>
            <td>{{ lab.equipos.join(', ') }}</td>
            <td>
              <span class="badge estado-badge"
                    [ngClass]="{
                      'text-bg-success': lab.estado === 'disponible',
                      'text-bg-warning': lab.estado === 'mantenimiento'
                    }">{{ lab.estado | estadoReserva }}</span>
            </td>
            <td class="text-end">
              <a class="btn btn-sm btn-outline-secondary me-1" [routerLink]="['/laboratorios', lab.id, 'editar']">Editar</a>
              <button class="btn btn-sm btn-outline-danger" (click)="eliminar(lab)">Eliminar</button>
            </td>
          </tr>
        } @empty {
          <tr><td colspan="6" class="text-center text-muted py-4">No hay laboratorios para mostrar</td></tr>
        }
      </tbody>
    </table>
  `,
})
export class LabListComponent implements OnInit {
  private servicio = inject(LaboratoriosService);

  laboratorios = signal<Laboratorio[]>([]);
  sedes = signal<string[]>([]);
  error = signal('');
  texto = '';
  sede = '';

  ngOnInit(): void {
    // Todas las sedes (con core-js: Set) para llenar el filtro
    this.servicio.listar().subscribe({
      next: (labs) => this.sedes.set(sedesUnicas(labs)),
      error: () => this.error.set('No se pudo conectar con el API (¿corriste npm run api?)'),
    });
    this.cargar();
  }

  cargar(): void {
    this.servicio.listar({ sede: this.sede, q: this.texto }).subscribe({
      next: (labs) => {
        this.laboratorios.set(labs);
        this.error.set('');
      },
      error: () => this.error.set('No se pudo conectar con el API (¿corriste npm run api?)'),
    });
  }

  eliminar(lab: Laboratorio): void {
    if (!confirm(`¿Eliminar ${lab.nombre}?`)) return;
    this.servicio.eliminar(lab.id).subscribe({
      next: () => this.laboratorios.update((lista) => lista.filter((l) => l.id !== lab.id)), // sin recargar la página
      error: () => this.error.set(`No se pudo eliminar ${lab.nombre}`),
    });
  }
}
