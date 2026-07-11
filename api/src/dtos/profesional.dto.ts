import { z } from "zod";

export const createProfesionalSchema = z.object({
    usuarioId: z.coerce.number().int().positive("El usuario es obligatorio"),

    titulo: z
        .string()
        .trim()
        .min(3, "El título debe tener al menos 3 caracteres")
        .max(150, "El título no puede superar 150 caracteres"),

    descripcion: z
        .string()
        .trim()
        .min(10, "La descripción debe tener al menos 10 caracteres")
        .max(500, "La descripción no puede superar 500 caracteres"),

    experiencia: z.coerce.number().int().min(0, "La experiencia no puede ser negativa"),

    modalidad: z.enum(["VIRTUAL", "PRESENCIAL", "MIXTA"]),

    provincia: z
        .string()
        .trim()
        .min(2, "La provincia es obligatoria"),

    canton: z
        .string()
        .trim()
        .min(2, "El cantón es obligatorio"),

    distrito: z
        .string()
        .trim()
        .min(2, "El distrito es obligatorio"),

    tarifaBase: z.coerce.number().positive("La tarifa debe ser mayor a 0"),

    disponible: z.boolean().optional(),

    imagen: z
        .string()
        .trim()
        .max(255)
        .optional(),

    especialidadIds: z
        .array(z.number().int().positive())
        .optional(),
});

export const updateProfesionalSchema = createProfesionalSchema.partial();

export type CreateProfesionalDto = z.infer<typeof createProfesionalSchema>;
export type UpdateProfesionalDto = z.infer<typeof updateProfesionalSchema>;