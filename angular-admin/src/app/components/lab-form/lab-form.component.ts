import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LaboratoriosService } from '../../services/laboratorios.service';
import { LaboratorioNuevo } from '../../models/modelos';
import { validadorRegex } from '../../validators/regex.validator';
import { validarLaboratorio } from '../../../core/validadores';

@Component({
  selector: 'app-lab-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <h2 class="h4 mb-3">{{ id ? 'Editar laboratorio' : 'Nuevo laboratorio' }}</h2>

    @if (errores().length) {
      <div class="alert alert-danger">
        <ul class="mb-0">
          @for (e of errores(); track e) { <li>{{ e }}</li> }
        </ul>
      </div>
    }

    <form [formGroup]="form" (ngSubmit)="guardar()" class="card card-body shadow-sm">
      <div class="mb-3">
        <label class="form-label" for="nombre">Nombre</label>
        <input id="nombre" class="form-control" formControlName="nombre" placeholder="Lab A-301"
               [class.is-invalid]="invalido('nombre')">
        @if (invalido('nombre')) {
          <div class="invalid-feedback">
            @if (form.controls.nombre.hasError('required')) { El nombre es obligatorio }
            @else if (form.controls.nombre.hasError('formatoNombre')) { Usa el formato "Lab A-301" }
          </div>
        }
      </div>

      <div class="mb-3">
        <label class="form-label" for="sede">Sede</label>
        <input id="sede" class="form-control" formControlName="sede" [class.is-invalid]="invalido('sede')">
        @if (invalido('sede')) { <div class="invalid-feedback">La sede es obligatoria</div> }
      </div>

      <div class="mb-3">
        <label class="form-label" for="capacidad">Capacidad (1 a 60)</label>
        <input id="capacidad" type="number" class="form-control" formControlName="capacidad"
               [class.is-invalid]="invalido('capacidad')">
        @if (invalido('capacidad')) { <div class="invalid-feedback">La capacidad debe estar entre 1 y 60</div> }
      </div>

      <div class="mb-3">
        <label class="form-label" for="equipos">Equipos (separados por coma)</label>
        <input id="equipos" class="form-control" formControlName="equipos" placeholder="PC i7, Proyector">
      </div>

      <div class="mb-3">
        <label class="form-label" for="estado">Estado</label>
        <select id="estado" class="form-select" formControlName="estado">
          <option value="disponible">Disponible</option>
          <option value="mantenimiento">Mantenimiento</option>
        </select>
      </div>

      <div>
        <a class="btn btn-outline-secondary me-2" routerLink="/laboratorios">Cancelar</a>
        <button class="btn btn-primary" type="submit" [disabled]="form.invalid">Guardar</button>
      </div>
    </form>
  `,
})
export class LabFormComponent implements OnInit {
  @Input() id?: string; // presente en /laboratorios/:id/editar
  private fb = inject(FormBuilder);
  private servicio = inject(LaboratoriosService);
  private router = inject(Router);

  errores = signal<string[]>([]);

  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, validadorRegex(/^Lab [A-Z]-\d{3}$/, 'formatoNombre')]],
    sede: ['', Validators.required],
    capacidad: [20, [Validators.required, Validators.min(1), Validators.max(60)]],
    equipos: [''],
    estado: ['disponible' as 'disponible' | 'mantenimiento'],
  });

  ngOnInit(): void {
    if (!this.id) return;
    this.servicio.obtener(Number(this.id)).subscribe((lab) =>
      this.form.patchValue({ ...lab, equipos: lab.equipos.join(', ') }),
    );
  }

  invalido(campo: 'nombre' | 'sede' | 'capacidad'): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.dirty || c.touched);
  }

  guardar(): void {
    const v = this.form.getRawValue();
    const lab: LaboratorioNuevo = {
      nombre: v.nombre.trim(),
      sede: v.sede.trim(),
      capacidad: Number(v.capacidad),
      equipos: v.equipos.split(',').map((e) => e.trim()).filter(Boolean),
      estado: v.estado,
    };

    // Segunda validación reutilizando core-js
    const errores = validarLaboratorio(lab);
    this.errores.set(errores);
    if (errores.length) return;

    const peticion = this.id
      ? this.servicio.actualizar(Number(this.id), lab)
      : this.servicio.crear(lab);

    peticion.subscribe({
      next: () => this.router.navigate(['/laboratorios']),
      error: () => this.errores.set(['No se pudo guardar. Revisa que el API esté encendido.']),
    });
  }
}
