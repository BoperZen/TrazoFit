import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiPaginatedResponse, ApiResponse } from '../models/api-response.model';
import { Categoria } from '../models/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriaService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/categoria`;

  listar() {
    return this.http.get<ApiPaginatedResponse<Categoria>>(this.apiUrl);
  }

  obtenerPorId(id: number) {
    return this.http.get<ApiResponse<Categoria>>(`${this.apiUrl}/${id}`);
  }

  // ✅ Agregar el método toggleEstado
  toggleEstado(id: number) {
    return this.http.patch<ApiResponse<Categoria>>(`${this.apiUrl}/${id}/toggle-estado`, {});
  }

  // También puedes agregar otros métodos útiles:
  crear(categoria: Partial<Categoria>) {
    return this.http.post<ApiResponse<Categoria>>(this.apiUrl, categoria);
  }

  actualizar(id: number, categoria: Partial<Categoria>) {
    return this.http.put<ApiResponse<Categoria>>(`${this.apiUrl}/${id}`, categoria);
  }

  eliminar(id: number) {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}