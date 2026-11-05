import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LaboratoriosService } from '../../services/laboratorios.service';
import { Laboratorio } from '../../models/modelos';
import { EstadoReservaPipe } from '../../pipes/estado-reserva.pipe';

@Component({
  selector: 'app-lab-detail',
  standalone: true,
  imports: [NgClass, RouterLink, EstadoReservaPipe],
  template: `
    @if (error()) {
      <div class="alert alert-danger">{{ error() }}</div>
    }
    @if (lab(); as l) {
      <div class="card shadow-sm">
        <div class="card-body">
          <h2 class="h4">{{ l.nombre }}
            <span class="badge ms-2" [ngClass]="l.estado === 'disponible' ? 'text-bg-success' : 'text-bg-warning'">
              {{ l.estado | estadoReserva }}
            </span>
          </h2>
          <dl class="row mb-0">
            <dt class="col-sm-3">Sede</dt><dd class="col-sm-9">{{ l.sede }}</dd>
            <dt class="col-sm-3">Capacidad</dt><dd class="col-sm-9">{{ l.capacidad }} personas</dd>
            <dt class="col-sm-3">Equipos</dt>
            <dd class="col-sm-9">
              @for (e of l.equipos; track e) {
                <span class="badge text-bg-secondary me-1">{{ e }}</span>
              }
            </dd>
          </dl>
        </div>
        <div class="card-footer bg-white">
          <a class="btn btn-outline-secondary me-2" routerLink="/laboratorios">Volver</a>
          <a class="btn btn-primary" [routerLink]="['/laboratorios', l.id, 'editar']">Editar</a>
        </div>
      </div>
    }
  `,
})
export class LabDetailComponent implements OnInit {
  @Input() id!: string; // viene de la ruta /laboratorios/:id
  private servicio = inject(LaboratoriosService);
  lab = signal<Laboratorio | null>(null);
  error = signal('');

  ngOnInit(): void {
    this.servicio.obtener(Number(this.id)).subscribe({
      next: (l) => this.lab.set(l),
      error: () => this.error.set('No se encontró el laboratorio'),
    });
  }
}
