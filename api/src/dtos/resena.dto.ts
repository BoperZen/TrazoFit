import { z } from "zod";

export const createResenaSchema = z.object({
    citaId: z.number().int().positive("La cita es obligatoria"),
    clienteId: z.number().int().positive("El cliente es obligatorio"),
    puntuacion: z.number().int().min(1, "Mínimo 1").max(5, "Máximo 5"),
    comentario: z.string().trim().max(500).optional(),
});

export type CreateResenaDto = z.infer<typeof createResenaSchema>;