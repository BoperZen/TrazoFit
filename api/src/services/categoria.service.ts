import { prisma } from "../config/prisma";

export const categoriaService = {
    async listar() {
        return await prisma.categoria.findMany({
            orderBy: { nombre: "asc" }
        });
    },
    async obtenerPorId(id: number) {
        return await prisma.categoria.findUnique({
            where: { id }
        });
    }
};
