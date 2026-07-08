export type Role = 'ADMIN' | 'PROFESIONAL' | 'CLIENTE';

export interface Usuario {
    id: number;
    nombre: string;
    apellidos: string;
    email: string;
    telefono?: string;
    role: Role;
    estado: boolean;
    createdAt: string;
    updatedAt: string;
}