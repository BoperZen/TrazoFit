import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
import { CreateProfesionalDto, UpdateProfesionalDto } from "../dtos/profesional.dto";

export const profesionalService = {
    async listar() {
        return await prisma.profesional.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                usuario: {
                    select: {
                        nombre: true,
                        apellidos: true,
                        email: true,
                    }
                },
                especialidades: {
                    include: { especialidad: true }
                }
            }
        });
    },

    async obtenerPorId(id: number) {
        const profesional = await prisma.profesional.findUnique({
            where: { id },
            include: {
                usuario: {
                    select: {
                        nombre: true,
                        apellidos: true,
                        email: true,
                        telefono: true,
                    }
                },
                servicios: true,
                especialidades: {
                    include: { especialidad: true }
                }
            }
        });

        if (!profesional) throw AppError.notFound("Profesional no encontrado");
        return profesional;
    },

    async crear(data: CreateProfesionalDto) {
        await this.validateUsuario(data.usuarioId);

        if (data.especialidadIds?.length) {
            await this.validateEspecialidades(data.especialidadIds);
        }

        return await prisma.profesional.create({
            data: {
                usuarioId: data.usuarioId,
                titulo: data.titulo,
                descripcion: data.descripcion,
                experiencia: data.experiencia,
                modalidad: data.modalidad,
                provincia: data.provincia,
                canton: data.canton,
                distrito: data.distrito,
                tarifaBase: data.tarifaBase,
                disponible: data.disponible ?? true,
                imagen: data.imagen ?? "profile-not-found.jpg",
                especialidades: data.especialidadIds
                    ? {
                        create: data.especialidadIds.map((id) => ({
                            especialidad: { connect: { id } }
                        }))
                    }
                    : undefined,
            },
            include: {
                usuario: true,
                especialidades: {
                    include: { especialidad: true }
                }
            }
        });
    },

    async actualizar(id: number, data: UpdateProfesionalDto) {
        await this.obtenerPorId(id);

        if (data.especialidadIds?.length) {
            await this.validateEspecialidades(data.especialidadIds);
        }

        return await prisma.profesional.update({
            where: { id },
            data: {
                titulo: data.titulo,
                descripcion: data.descripcion,
                experiencia: data.experiencia,
                modalidad: data.modalidad,
                provincia: data.provincia,
                canton: data.canton,
                distrito: data.distrito,
                tarifaBase: data.tarifaBase,
                disponible: data.disponible,
                imagen: data.imagen,
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
                usuario: true,
                especialidades: {
                    include: { especialidad: true }
                }
            }
        });
    },

    async toggleDisponible(id: number) {
        await this.obtenerPorId(id);
        const profesional = await prisma.profesional.findUnique({ where: { id } });
        return await prisma.profesional.update({
            where: { id },
            data: { disponible: !profesional!.disponible }
        });
    },

    async validateUsuario(usuarioId: number) {
        const usuario = await prisma.usuario.findUnique({
            where: { id: usuarioId }
        });
        if (!usuario) throw AppError.badRequest("El usuario indicado no existe");
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