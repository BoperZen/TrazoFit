import { Plataforma } from './plataforma.model';
import { Videojuego } from './videojuego.model';

export interface PlataformaVideojuego {
    plataformaId: number;
    videojuegoId: number;
    annoLanzamiento: number;
    plataforma?: Plataforma;
    videojuego?: Videojuego;
    createdAt: string;
    updatedAt: string;
}

export interface PlataformaVideojuegoCreateDto {
    plataformaId: number;
    videojuegoId: number;
    annoLanzamiento: number;
}

export interface PlataformaVideojuegoUpdateDto {
    annoLanzamiento?: number;
}