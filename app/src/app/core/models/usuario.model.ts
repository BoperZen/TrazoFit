import { Orden } from './orden.model';
import { Role } from './role.model';


export interface Usuario {
    id: number;
    email: string;
    nombre?: string | null;
    role: Role;
    ordenes?: Orden[];
    createdAt: string;
    updatedAt: string;
}

export interface UsuarioCreateDto {
    email: string;
    nombre?: string | null;
    password: string;
    role?: Role;
}

export interface UsuarioUpdateDto {
    email?: string;
    nombre?: string | null;
    password?: string;
    role?: Role;
}