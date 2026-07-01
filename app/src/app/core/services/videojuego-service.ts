// core/services/videojuego.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiPaginatedResponse, ApiResponse } from '../models/api-response.model';
import { Videojuego } from '../models/videojuego.model';

@Injectable({ providedIn: 'root' })
export class VideojuegoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/videojuego`;
  //localhost:3000/videojuego
  listar() {
    return this.http.get<ApiPaginatedResponse<Videojuego>>(this.apiUrl);
  }

  obtenerPorId(id: number) {
    return this.http.get<ApiResponse<Videojuego>>(`${this.apiUrl}/${id}`);
  }

  getImageUrl(imageName: string): string {
    return `${environment.imageUrl}/${imageName}`;
  }
}
