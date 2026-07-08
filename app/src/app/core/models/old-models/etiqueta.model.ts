import { Videojuego } from './videojuego.model';

export interface Etiqueta {
    id: number;
    nombre: string;
    videojuegos?: Videojuego[];
    createdAt: string;
    updatedAt: string;
}

export interface EtiquetaCreateDto {
    nombre: string;
}

export interface EtiquetaUpdateDto {
    nombre?: string;
}