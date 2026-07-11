import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/api-response.model';
import { Cita } from '../models/cita.model';

@Injectable({ providedIn: 'root' })
export class CitaService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/cita`;

  listar() {
    return this.http.get<ApiResponse<Cita[]>>(this.apiUrl);
  }

  obtenerPorId(id: number) {
    return this.http.get<ApiResponse<Cita>>(`${this.apiUrl}/${id}`);
  }

  crear(data: any) {
    return this.http.post<ApiResponse<Cita>>(this.apiUrl, data);
  }
}