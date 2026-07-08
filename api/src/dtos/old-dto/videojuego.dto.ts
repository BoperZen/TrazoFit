import { z } from "zod";

export const createVideojuegoSchema = z.object({
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

    publicar: z.boolean().optional(),

    precio: z
        .number({
            message: "El precio debe ser numérico",
        })
        .positive("El precio debe ser mayor a 0"),

    imagen: z
        .string()
        .trim()
        .max(255)
        .optional(),

    categoriaId: z
        .number()
        .int()
        .positive("La categoría es obligatoria"),

    etiquetaIds: z
        .array(z.number().int().positive())
        .optional(),

    plataformas: z
        .array(
            z.object({
                plataformaId: z.number().int().positive(),
                annoLanzamiento: z
                    .number()
                    .int()
                    .min(1970, "El año no puede ser menor a 1970")
                    .max(new Date().getFullYear() + 1),
            })
        )
        .optional(),
});

export const updateVideojuegoSchema = createVideojuegoSchema.partial();

export type CreateVideojuegoDto = z.infer<typeof createVideojuegoSchema>;
export type UpdateVideojuegoDto = z.infer<typeof updateVideojuegoSchema>;