import { z } from "zod";

export const createServicioSchema = z.object({
    profesionalId: z
        .number()
        .int()
        .positive("El profesional es obligatorio"),

    categoriaId: z
        .number()
        .int()
        .positive("La categoría es obligatoria"),

    nombre: z
        .string()
        .trim()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(150, "El nombre no puede superar 150 caracteres"),

    descripcion: z
        .string()
        .trim()
        .min(10, "La descripción debe tener al menos 10 caracteres")
        .max(500, "La descripción no puede superar 500 caracteres"),

    precio: z
        .number()
        .positive("El precio debe ser mayor a 0"),

    duracion: z
        .number()
        .int()
        .positive("La duración debe ser mayor a 0"),

    modalidad: z.enum(["VIRTUAL", "PRESENCIAL", "MIXTA"]),

    estado: z.boolean().optional(),

    especialidadIds: z
        .array(z.number().int().positive())
        .optional(),
});

export const updateServicioSchema = createServicioSchema.partial();

export type CreateServicioDto = z.infer<typeof createServicioSchema>;
export type UpdateServicioDto = z.infer<typeof updateServicioSchema>;