import { PlataformaVideojuego } from "./plataforma-videojuego.model";


export interface Plataforma {
    id: number;
    nombre: string;
    videojuegos?: PlataformaVideojuego[];
    createdAt: string;
    updatedAt: string;
}

export interface PlataformaCreateDto {
    nombre: string;
}

export interface PlataformaUpdateDto {
    nombre?: string;
}