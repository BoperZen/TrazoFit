import { prisma } from "../config/prisma";

export const etiquetaService = {
    async listar() {
        return await prisma.etiqueta.findMany({
            orderBy: { nombre: "asc" }
        });
    },
     async obtenerPorId(id: number) {
        return await prisma.etiqueta.findUnique({
            where: { id }
        });
    }
};
