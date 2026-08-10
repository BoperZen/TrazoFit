import { z } from "zod";

export const createCitaSchema = z.object({
    clienteId: z.number().int().positive("El cliente es obligatorio"),
    profesionalId: z.number().int().positive("El profesional es obligatorio"),
    servicioId: z.number().int().positive("El servicio es obligatorio"),
    fechaCita: z.string().min(1, "La fecha es obligatoria"),
    horaInicio: z.string().min(1, "La hora de inicio es obligatoria"),
    horaFin: z.string().min(1, "La hora de fin es obligatoria"),
    modalidad: z.enum(["VIRTUAL", "PRESENCIAL"]),
    comentarioCliente: z.string().trim().max(500).optional(),
});

export const cambiarEstadoCitaSchema = z.object({
    estado: z.enum(["ACEPTADA", "RECHAZADA", "COMPLETADA", "CANCELADA"]),
    comentario: z.string().trim().max(500).optional(),
});

export type CreateCitaDto = z.infer<typeof createCitaSchema>;
export type CambiarEstadoCitaDto = z.infer<typeof cambiarEstadoCitaSchema>;