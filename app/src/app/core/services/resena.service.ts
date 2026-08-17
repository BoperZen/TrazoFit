import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/api-response.model';
import { Resena, ResenaCreateDto } from '../models/cita.model';

@Injectable({ providedIn: 'root' })
export class ResenaService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/api/resena`;

    listar() {
        return this.http.get<ApiResponse<Resena[]>>(this.apiUrl);
    }

    crear(data: ResenaCreateDto) {
        return this.http.post<ApiResponse<Resena>>(this.apiUrl, data);
    }
}