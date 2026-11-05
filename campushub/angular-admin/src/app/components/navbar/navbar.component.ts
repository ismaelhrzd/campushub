import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand navbar-dark bg-dark mb-4">
      <div class="container">
        <a class="navbar-brand" routerLink="/laboratorios">CampusHub · Admin</a>
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <a class="nav-link" routerLink="/laboratorios" routerLinkActive="active"
               [routerLinkActiveOptions]="{ exact: true }">Laboratorios</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" routerLink="/laboratorios/nuevo" routerLinkActive="active">Nuevo laboratorio</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" routerLink="/reservas" routerLinkActive="active">Reservas</a>
          </li>
        </ul>
      </div>
    </nav>
  `,
})
export class NavbarComponent {}
