import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiPaginatedResponse, ApiResponse } from '../models/api-response.model';
import { Profesional } from '../models/profesional.model';

@Injectable({ providedIn: 'root' })
export class ProfesionalService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/profesional`;

  listar() {
    return this.http.get<ApiPaginatedResponse<Profesional>>(this.apiUrl);
  }

  obtenerPorId(id: number) {
    return this.http.get<ApiResponse<Profesional>>(`${this.apiUrl}/${id}`);
  }

  getImageUrl(imageName: string): string {
    return `${environment.imageUrl}/${imageName}`;
  }
  toggleDisponible(id: number) {
    return this.http.patch<ApiResponse<Profesional>>(`${this.apiUrl}/${id}/toggle-disponible`, {});
  }
  crear(data: any) {
    return this.http.post<ApiResponse<Profesional>>(this.apiUrl, data);
  }

  actualizar(id: number, data: any) {
    return this.http.put<ApiResponse<Profesional>>(`${this.apiUrl}/${id}`, data);
  }
  subirImagen(formData: FormData) {
  return this.http.post<{ message: string; fileName: string }>(
    `${environment.apiUrl}/images/upload`,
    formData
  );
}

}