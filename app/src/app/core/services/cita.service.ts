import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/api-response.model';
import { Cita, CitaCreateDto, CitaCambiarEstadoDto } from '../models/cita.model';

@Injectable({ providedIn: 'root' })
export class CitaService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/api/cita`;

    listar() {
        return this.http.get<ApiResponse<Cita[]>>(this.apiUrl);
    }

    listarPorCliente(clienteId: number) {
        return this.http.get<ApiResponse<Cita[]>>(`${this.apiUrl}/cliente/${clienteId}`);
    }

    listarPorProfesional(profesionalId: number) {
        return this.http.get<ApiResponse<Cita[]>>(`${this.apiUrl}/profesional/${profesionalId}`);
    }

    obtenerPorId(id: number) {
        return this.http.get<ApiResponse<Cita>>(`${this.apiUrl}/${id}`);
    }

    crear(data: CitaCreateDto) {
        return this.http.post<ApiResponse<Cita>>(this.apiUrl, data);
    }

    cambiarEstado(id: number, data: CitaCambiarEstadoDto) {
        return this.http.patch<ApiResponse<Cita>>(`${this.apiUrl}/${id}/estado`, data);
    }
}