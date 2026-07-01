import { prisma } from "../config/prisma";
import { CreateVideojuegoDto, UpdateVideojuegoDto } from "../dtos/videojuego.dto";
import { AppError } from "../utils/app-error";

export const videojuegoService = {
    async listar(page: number = 1, limit: number = 0) {
        // Si limit es 0, asumimir que se quieren todos los registros
        const paginar = limit > 0;

        const skip = paginar ? (page - 1) * limit : undefined;
        const take = paginar ? limit : undefined;
        const [totalItems, data] = await Promise.all([
            prisma.videojuego.count({ where: { publicar: true } }),
            prisma.videojuego.findMany({
                where: { publicar: true },
                skip,
                take,
                select: {
                    id: true,
                    nombre: true,
                    precio: true,
                    stock: true,
                    imagen: true,
                    categoria: true
                },
                orderBy: { createdAt: "desc" }
            })
        ]);

        const totalPages = paginar ? Math.ceil(totalItems / limit) : 1

        return {
            meta: {
                totalItems,
                totalPages,
                currentPage: paginar ? page : 1,
                limit: paginar ? limit : totalItems
            },
            data
        };
    },

    async obtenerPorId(id: number) {
        return await prisma.videojuego.findUnique({
            where: { id },
            include: {
                categoria: true,
                etiquetas: true,
                plataformas: {
                    include: {
                        plataforma: true
                    }
                }
            }
        });
    },
    async crear(data: CreateVideojuegoDto) {
        await this.validateCategoria(data.categoriaId);

        if (data.etiquetaIds?.length) {
            await this.validateEtiquetas(data.etiquetaIds);
        }

        if (data.plataformas?.length) {
            await this.validatePlataformas(
                data.plataformas.map((item) => item.plataformaId)
            );
        }

        return prisma.videojuego.create({
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion,
                precio: data.precio,
                publicar: data.publicar ?? true,
                imagen: data.imagen ?? "image-not-found.jpg",
                categoriaId: data.categoriaId,

                etiquetas: data.etiquetaIds
                    ? {
                        connect: data.etiquetaIds.map((id) => ({ id })),
                    }
                    : undefined,

                plataformas: data.plataformas
                    ? {
                        create: data.plataformas.map((item) => ({
                            plataformaId: item.plataformaId,
                            annoLanzamiento: item.annoLanzamiento,
                        })),
                    }
                    : undefined,
            },
            include: {
                categoria: true,
                etiquetas: true,
                plataformas: {
                    include: {
                        plataforma: true,
                    },
                },
            },
        });
    },

    async actualizar(id: number, data: UpdateVideojuegoDto) {
        await this.obtenerPorId(id);

        if (data.categoriaId) {
            await this.validateCategoria(data.categoriaId);
        }

        if (data.etiquetaIds?.length) {
            await this.validateEtiquetas(data.etiquetaIds);
        }

        if (data.plataformas?.length) {
            await this.validatePlataformas(
                data.plataformas.map((item) => item.plataformaId)
            );
        }

        return prisma.videojuego.update({
            where: { id },
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion,
                precio: data.precio,
                publicar: data.publicar,
                imagen: data.imagen,
                categoriaId: data.categoriaId,

                etiquetas: data.etiquetaIds
                    ? {
                        set: data.etiquetaIds.map((id) => ({ id })),
                    }
                    : undefined,

                plataformas: data.plataformas
                    ? {
                        deleteMany: {},
                        create: data.plataformas.map((item) => ({
                            plataformaId: item.plataformaId,
                            annoLanzamiento: item.annoLanzamiento,
                        })),
                    }
                    : undefined,
            },
            include: {
                categoria: true,
                etiquetas: true,
                plataformas: {
                    include: {
                        plataforma: true,
                    },
                },
            },
        });
    },

    async validateCategoria(categoriaId: number) {
        const categoria = await prisma.categoria.findUnique({
            where: { id: categoriaId },
        });

        if (!categoria) {
            throw AppError.badRequest("La categoría indicada no existe");
        }
    },

    async validateEtiquetas(etiquetaIds: number[]) {
        const count = await prisma.etiqueta.count({
            where: {
                id: {
                    in: etiquetaIds,
                },
            },
        });

        if (count !== etiquetaIds.length) {
            throw AppError.badRequest("Una o más etiquetas no existen");
        }
    },

    async validatePlataformas(plataformaIds: number[]) {
        const count = await prisma.plataforma.count({
            where: {
                id: {
                    in: plataformaIds,
                },
            },
        });

        if (count !== plataformaIds.length) {
            throw AppError.badRequest("Una o más plataformas no existen");
        }
    }
}
