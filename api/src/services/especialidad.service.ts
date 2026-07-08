import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";

export const especialidadService = {
    async listar() {
        return await prisma.especialidad.findMany({
            orderBy: { nombre: "asc" }
        });
    },

    async obtenerPorId(id: number) {
        const especialidad = await prisma.especialidad.findUnique({
            where: { id }
        });

        if (!especialidad) throw AppError.notFound("Especialidad no encontrada");
        return especialidad;
    },

    async toggleEstado(id: number) {
        await this.obtenerPorId(id);
        const especialidad = await prisma.especialidad.findUnique({ where: { id } });
        return await prisma.especialidad.update({
            where: { id },
            data: { estado: !especialidad!.estado }
        });
    }
};