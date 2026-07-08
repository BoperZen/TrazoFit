import { Orden } from './orden.model';
import { Videojuego } from './videojuego.model';

export interface OrdenVideojuego {
    ordenId: number;
    videojuegoId: number;
    cantidad: number;
    precioFixed: number | string;

    orden?: Orden;
    videojuego?: Videojuego;

    createdAt: string;
    updatedAt: string;
}

export interface OrdenVideojuegoUpdateDto {
    cantidad?: number;
}