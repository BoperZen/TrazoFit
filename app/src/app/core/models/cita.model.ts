import { Usuario } from './usuario.model';
import { Profesional } from './profesional.model';
import { Servicio } from './servicio.model';

export type ModalidadCita = 'VIRTUAL' | 'PRESENCIAL';
export type EstadoCita = 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA' | 'CANCELADA' | 'COMPLETADA';

export interface Cita {
    id: number;
    clienteId: number;
    cliente?: Usuario;
    profesionalId: number;
    profesional?: Profesional;
    servicioId: number;
    servicio?: Servicio;
    fechaCita: string;
    horaInicio: string;
    horaFin: string;
    modalidad: ModalidadCita;
    estado: EstadoCita;
    comentarioCliente?: string;
    comentarioProfesional?: string;
    montoEstimado: number | string;
    createdAt: string;
    updatedAt: string;
    resena?: Resena;
    historial?: HistorialCita[];
}

export interface CitaCreateDto {
    clienteId: number;
    profesionalId: number;
    servicioId: number;
    fechaCita: string;
    horaInicio: string;
    horaFin: string;
    modalidad: ModalidadCita;
    comentarioCliente?: string;
}

export interface CitaCambiarEstadoDto {
    estado: 'ACEPTADA' | 'RECHAZADA' | 'COMPLETADA' | 'CANCELADA';
    comentario?: string;
}

export interface Resena {
    id: number;
    puntuacion: number;
    comentario?: string;
    clienteId: number;
    citaId: number;
    createdAt: string;
    updatedAt: string;
}

export interface ResenaCreateDto {
    citaId: number;
    clienteId: number;
    puntuacion: number;
    comentario?: string;
}

export interface HistorialCita {
    id: number;
    citaId: number;
    estadoAnterior: EstadoCita;
    estadoNuevo: EstadoCita;
    comentario?: string;
    createdAt: string;
}