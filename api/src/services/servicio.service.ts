import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
import { CreateServicioDto, UpdateServicioDto } from "../dtos/servicio.dto";

export const servicioService = {
    async listar() {
        return await prisma.servicio.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                profesional: {
                    include: {
                        usuario: {
                            select: {
                                nombre: true,
                                apellidos: true,
                            }
                        }
                    }
                },
                categoria: true,
                especialidades: {
                    include: { especialidad: true }
                }
            }
        });
    },

    async listarPorProfesional(profesionalId: number) {
        return await prisma.servicio.findMany({
            where: { profesionalId },
            orderBy: { nombre: 'asc' },
            include: {
                categoria: true,
                profesional: { include: { usuario: { select: { nombre: true, apellidos: true } } } },
            }
        });
    },

    async obtenerPorId(id: number) {
        const servicio = await prisma.servicio.findUnique({
            where: { id },
            include: {
                profesional: {
                    include: {
                        usuario: {
                            select: {
                                nombre: true,
                                apellidos: true,
                                email: true,
                            }
                        }
                    }
                },
                categoria: true,
                especialidades: {
                    include: { especialidad: true }
                }
            }
        });

        if (!servicio) throw AppError.notFound("Servicio no encontrado");
        return servicio;
    },

    async crear(data: CreateServicioDto) {
        await this.validateProfesional(data.profesionalId);
        await this.validateCategoria(data.categoriaId);

        if (data.especialidadIds?.length) {
            await this.validateEspecialidades(data.especialidadIds);
        }

        return await prisma.servicio.create({
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion,
                precio: data.precio,
                duracion: data.duracion,
                modalidad: data.modalidad,
                estado: data.estado ?? true,
                profesionalId: data.profesionalId,
                categoriaId: data.categoriaId,
                especialidades: data.especialidadIds
                    ? {
                        create: data.especialidadIds.map((id) => ({
                            especialidad: { connect: { id } }
                        }))
                    }
                    : undefined,
            },
            include: {
                profesional: true,
                categoria: true,
                especialidades: {
                    include: { especialidad: true }
                }
            }
        });
    },

    async actualizar(id: number, data: UpdateServicioDto) {
        await this.obtenerPorId(id);

        if (data.categoriaId) await this.validateCategoria(data.categoriaId);
        if (data.profesionalId) await this.validateProfesional(data.profesionalId);
        if (data.especialidadIds?.length) await this.validateEspecialidades(data.especialidadIds);

        return await prisma.servicio.update({
            where: { id },
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion,
                precio: data.precio,
                duracion: data.duracion,
                modalidad: data.modalidad,
                estado: data.estado,
                categoriaId: data.categoriaId,
                especialidades: data.especialidadIds
                    ? {
                        deleteMany: {},
                        create: data.especialidadIds.map((id) => ({
                            especialidad: { connect: { id } }
                        }))
                    }
                    : undefined,
            },
            include: {
                profesional: true,
                categoria: true,
                especialidades: {
                    include: { especialidad: true }
                }
            }
        });
    },

    async toggleEstado(id: number) {
        await this.obtenerPorId(id);
        const servicio = await prisma.servicio.findUnique({ where: { id } });
        return await prisma.servicio.update({
            where: { id },
            data: { estado: !servicio!.estado }
        });
    },

    async validateProfesional(profesionalId: number) {
        const profesional = await prisma.profesional.findUnique({
            where: { id: profesionalId }
        });
        if (!profesional) throw AppError.badRequest("El profesional indicado no existe");
    },

    async validateCategoria(categoriaId: number) {
        const categoria = await prisma.categoria.findUnique({
            where: { id: categoriaId }
        });
        if (!categoria) throw AppError.badRequest("La categoría indicada no existe");
    },

    async validateEspecialidades(especialidadIds: number[]) {
        const count = await prisma.especialidad.count({
            where: { id: { in: especialidadIds } }
        });
        if (count !== especialidadIds.length) {
            throw AppError.badRequest("Una o más especialidades no existen");
        }
    }
};