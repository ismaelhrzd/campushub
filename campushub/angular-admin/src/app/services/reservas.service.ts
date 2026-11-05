import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config';
import { Reserva } from '../models/modelos';

@Injectable({ providedIn: 'root' })
export class ReservasService {
  private http = inject(HttpClient);
  private url = `${API_URL}/reservas`;

  listar(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.url);
  }

  cancelar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
