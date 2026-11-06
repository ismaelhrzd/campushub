import { Routes } from '@angular/router';
import { LabListComponent } from './components/lab-list/lab-list.component';
import { LabFormComponent } from './components/lab-form/lab-form.component';
import { LabDetailComponent } from './components/lab-detail/lab-detail.component';
import { ReservasListComponent } from './components/reservas-list/reservas-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'laboratorios', pathMatch: 'full' },
  { path: 'laboratorios', component: LabListComponent },
  // "nuevo" va antes de ":id" para que no se interprete como un id
  { path: 'laboratorios/nuevo', component: LabFormComponent },
  { path: 'laboratorios/:id/editar', component: LabFormComponent },
  { path: 'laboratorios/:id', component: LabDetailComponent },
  { path: 'reservas', component: ReservasListComponent },
  { path: '**', redirectTo: 'laboratorios' },
];
