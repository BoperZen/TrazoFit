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

export interface Resena {
  id:         number;
  puntuacion: number;
  comentario?: string;
  clienteId:  number;
  citaId:     number;
  createdAt:  string;
  updatedAt:  string;
}