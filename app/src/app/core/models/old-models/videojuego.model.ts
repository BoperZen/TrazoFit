import { Categoria } from '../categoria.model';
import { Etiqueta } from './etiqueta.model';
import { OrdenVideojuego } from './orden-videojuego.model';
import { PlataformaVideojuego } from './plataforma-videojuego.model';

export interface Videojuego {
    id: number;
    nombre: string;
    descripcion: string;
    publicar: boolean;

    // Prisma Decimal normalmente llega al frontend como string o number,
    // depende de cómo lo convierta el API.
    precio: number | string;

    stock: number;
    imagen: string;

    categoriaId: number;
    categoria?: Categoria;

    ordenes?: OrdenVideojuego[];
    plataformas?: PlataformaVideojuego[];
    etiquetas?: Etiqueta[];

    createdAt: string;
    updatedAt: string;
}

export interface VideojuegoCreateDto {
    nombre: string;
    descripcion: string;
    publicar?: boolean;
    precio: number;
    stock?: number;
    imagen?: string;
    categoriaId: number;

    plataformaIds?: number[];
    etiquetaIds?: number[];
}

export interface VideojuegoUpdateDto {
    nombre?: string;
    descripcion?: string;
    publicar?: boolean;
    precio?: number;
    stock?: number;
    imagen?: string;
    categoriaId?: number;

    plataformaIds?: number[];
    etiquetaIds?: number[];
}