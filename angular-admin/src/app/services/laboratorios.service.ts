import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config';
import { Laboratorio, LaboratorioNuevo } from '../models/modelos';

@Injectable({ providedIn: 'root' })
export class LaboratoriosService {
  private http = inject(HttpClient);
  private url = `${API_URL}/laboratorios`;

  listar(filtros: { sede?: string; q?: string } = {}): Observable<Laboratorio[]> {
    let params = new HttpParams();
    if (filtros.sede) params = params.set('sede', filtros.sede);
    if (filtros.q) params = params.set('q', filtros.q);
    return this.http.get<Laboratorio[]>(this.url, { params });
  }

  obtener(id: number): Observable<Laboratorio> {
    return this.http.get<Laboratorio>(`${this.url}/${id}`);
  }

  crear(lab: LaboratorioNuevo): Observable<Laboratorio> {
    return this.http.post<Laboratorio>(this.url, lab);
  }

  actualizar(id: number, lab: LaboratorioNuevo): Observable<Laboratorio> {
    return this.http.put<Laboratorio>(`${this.url}/${id}`, lab);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
