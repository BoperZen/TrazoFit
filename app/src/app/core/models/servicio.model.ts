import { Categoria } from './categoria.model';
import { Especialidad } from './especialidad.model';
import { Profesional } from './profesional.model';

export type ModalidadServicio = 'VIRTUAL' | 'PRESENCIAL' | 'MIXTA';

export interface Servicio {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number | string;
    duracion: number;
    modalidad: ModalidadServicio;
    estado: boolean;
    profesionalId: number;
    profesional?: Profesional;
    categoriaId: number;
    categoria?: Categoria;
    especialidades?: { especialidad: Especialidad }[];
    createdAt: string;
    updatedAt: string;
}

export interface ServicioCreateDto {
    nombre: string;
    descripcion: string;
    precio: number;
    duracion: number;
    modalidad: ModalidadServicio;
    estado?: boolean;
    profesionalId: number;
    categoriaId: number;
    especialidadIds?: number[];
}

export interface ServicioUpdateDto {
    nombre?: string;
    descripcion?: string;
    precio?: number;
    duracion?: number;
    modalidad?: ModalidadServicio;
    estado?: boolean;
    categoriaId?: number;
    especialidadIds?: number[];
}