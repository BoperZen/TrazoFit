import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/api-response.model';
import { Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/usuario`;

  listar() {
    return this.http.get<ApiResponse<Usuario[]>>(this.apiUrl);
  }

  obtenerPorId(id: number) {
    return this.http.get<ApiResponse<Usuario>>(`${this.apiUrl}/${id}`);
  }

  toggleEstado(id: number) {
    return this.http.patch<ApiResponse<Usuario>>(`${this.apiUrl}/${id}/toggle-estado`, {});
  }
}