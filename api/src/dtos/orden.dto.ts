import { z } from "zod";

export const createOrdenSchema = z.object({
    usuarioId: z
        .number()
        .int()
        .positive("El usuario es obligatorio"),

    videojuegos: z
        .array(
            z.object({
                videojuegoId: z.number().int().positive(),
                cantidad: z
                    .number()
                    .int()
                    .min(1, "La cantidad mínima es 1"),
            })
        )
        .min(1, "La orden debe incluir al menos un videojuego"),
});

export const updateOrdenSchema = createOrdenSchema.partial();

export type CreateOrdenDto = z.infer<typeof createOrdenSchema>;
export type UpdateOrdenDto = z.infer<typeof updateOrdenSchema>;