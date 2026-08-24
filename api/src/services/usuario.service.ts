import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";

export const usuarioService = {
    async listar() {
        return await prisma.usuario.findMany({
            orderBy: { nombre: "asc" },
            select: {
                id: true,
                nombre: true,
                apellidos: true,
                email: true,
                telefono: true,
                role: true,
                estado: true,
                createdAt: true,
            }
        });
    },

    async obtenerPorId(id: number) {
        const usuario = await prisma.usuario.findUnique({
            where: { id },
            select: {
                id: true,
                nombre: true,
                apellidos: true,
                email: true,
                telefono: true,
                role: true,
                estado: true,
                createdAt: true,
            }
        });

        if (!usuario) throw AppError.notFound("Usuario no encontrado");
        return usuario;
    },

    async actualizar(id: number, data: {
        nombre: string;
        apellidos: string;
        email: string;
        telefono?: string;
    }) {
        await this.obtenerPorId(id);

        return await prisma.usuario.update({
            where: { id },
            data: {
                nombre: data.nombre,
                apellidos: data.apellidos,
                email: data.email,
                telefono: data.telefono,
            },
            select: {
                id: true,
                nombre: true,
                apellidos: true,
                email: true,
                telefono: true,
                role: true,
                estado: true,
                createdAt: true,
            }
        });
    },

    async toggleEstado(id: number) {
        await this.obtenerPorId(id);
        const usuario = await prisma.usuario.findUnique({ where: { id } });
        return await prisma.usuario.update({
            where: { id },
            data: { estado: !usuario!.estado }
        });
    }
};