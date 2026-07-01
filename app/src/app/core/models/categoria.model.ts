import { Videojuego } from './videojuego.model';

export interface Categoria {
    id: number;
    nombre: string;
    descripcion?: string | null;
    videojuegos?: Videojuego[];
    createdAt: string;
    updatedAt: string;
}

export interface CategoriaCreateDto {
    nombre: string;
    descripcion?: string | null;
}

export interface CategoriaUpdateDto {
    nombre?: string;
    descripcion?: string | null;
}