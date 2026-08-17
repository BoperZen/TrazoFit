import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
import { CreateResenaDto } from "../dtos/resena.dto";

export const resenaService = {

    async listar() {
        return await prisma.resena.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                cliente: { select: { id: true, nombre: true, apellidos: true } },
                cita: { select: { id: true, fechaCita: true, servicio: { select: { nombre: true } } } },
            },
        });
    },

    async crear(data: CreateResenaDto) {
        // Cita debe existir y estar COMPLETADA
        const cita = await prisma.cita.findUnique({ where: { id: data.citaId }, include: { resena: true } });
        if (!cita) throw AppError.notFound("Cita no encontrada");
        if (cita.estado !== "COMPLETADA") throw AppError.badRequest("Solo se pueden reseñar citas completadas");
        if (cita.resena) throw AppError.badRequest("Esta cita ya tiene una reseña");
        if (cita.clienteId !== data.clienteId) throw AppError.badRequest("Solo el cliente de la cita puede dejar una reseña");

        return await prisma.resena.create({
            data: {
                citaId: data.citaId,
                clienteId: data.clienteId,
                puntuacion: data.puntuacion,
                comentario: data.comentario,
            },
            include: {
                cliente: { select: { id: true, nombre: true, apellidos: true } },
                cita: { select: { id: true, fechaCita: true, servicio: { select: { nombre: true } } } },
            },
        });
    },
};