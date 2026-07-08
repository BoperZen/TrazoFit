import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";

export const categoriaService = {
    async listar() {
        return await prisma.categoria.findMany({
            orderBy: { nombre: "asc" }
        });
    },

    async obtenerPorId(id: number) {
        const categoria = await prisma.categoria.findUnique({
            where: { id }
        });

        if (!categoria) throw AppError.notFound("Categoría no encontrada");
        return categoria;
    },

    async toggleEstado(id: number) {
        await this.obtenerPorId(id);
        const categoria = await prisma.categoria.findUnique({ where: { id } });
        return await prisma.categoria.update({
            where: { id },
            data: { estado: !categoria!.estado }
        });
    }
};