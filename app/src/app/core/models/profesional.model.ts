import { Usuario } from './usuario.model';
import { Especialidad } from './especialidad.model';

export type Modalidad = 'VIRTUAL' | 'PRESENCIAL' | 'MIXTA';

export interface Profesional {
    id: number;
    usuarioId: number;
    usuario?: Usuario;
    titulo: string;
    descripcion: string;
    experiencia: number;
    modalidad: Modalidad;
    provincia: string;
    canton: string;
    distrito: string;
    tarifaBase: number | string;
    disponible: boolean;
    imagen: string;
    especialidades?: { especialidad: Especialidad }[];
    createdAt: string;
    updatedAt: string;
}

export interface ProfesionalCreateDto {
    usuarioId: number;
    titulo: string;
    descripcion: string;
    experiencia: number;
    modalidad: Modalidad;
    provincia: string;
    canton: string;
    distrito: string;
    tarifaBase: number;
    disponible?: boolean;
    imagen?: string;
    especialidadIds?: number[];
}

export interface ProfesionalUpdateDto {
    titulo?: string;
    descripcion?: string;
    experiencia?: number;
    modalidad?: Modalidad;
    provincia?: string;
    canton?: string;
    distrito?: string;
    tarifaBase?: number;
    disponible?: boolean;
    imagen?: string;
    especialidadIds?: number[];
}