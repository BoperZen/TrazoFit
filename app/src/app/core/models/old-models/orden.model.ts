import { EstadoOrden } from './estado-orden.model';
import { OrdenVideojuego } from './orden-videojuego.model';
import { Usuario } from '../usuario.model';

export interface Orden {
    id: number;
    fechaOrden: string;
    estado: EstadoOrden;
    total: number | string;

    usuarioId: number;
    usuario?: Usuario;

    videojuegos?: OrdenVideojuego[];

    createdAt: string;
    updatedAt: string;
}

export interface OrdenCreateDto {
    usuarioId: number;
    videojuegos: OrdenVideojuegoCreateDto[];
}

export interface OrdenUpdateDto {
    estado?: EstadoOrden;
}

export interface OrdenVideojuegoCreateDto {
    videojuegoId: number;
    cantidad: number;
}