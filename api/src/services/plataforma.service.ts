import { prisma } from "../config/prisma";

export const plataformaService = {
    async listar() {
        return await prisma.plataforma.findMany({
            orderBy: { nombre: "asc" }
        });
    },
    async obtenerPorId(id: number) {
        return await prisma.plataforma.findUnique({
            where: { id }
        });
    }
};
