import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
import { CreateCitaDto } from "../dtos/cita.dto";

export const citaService = {
    async listar() {
        return await prisma.cita.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                cliente: {
                    select: {
                        nombre: true,
                        apellidos: true,
                        email: true,
                    }
                },
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
                servicio: {
                    select: {
                        nombre: true,
                        precio: true,
                        duracion: true,
                    }
                }
            }
        });
    },

    async obtenerPorId(id: number) {
        const cita = await prisma.cita.findUnique({
            where: { id },
            include: {
                cliente: {
                    select: {
                        nombre: true,
                        apellidos: true,
                        email: true,
                        telefono: true,
                    }
                },
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
                servicio: true,
            }
        });

        if (!cita) throw AppError.notFound("Cita no encontrada");
        return cita;
    },

    async crear(data: CreateCitaDto) {
        await this.validateCliente(data.clienteId);
        await this.validateProfesional(data.profesionalId);
        await this.validateServicio(data.servicioId);

        const servicio = await prisma.servicio.findUnique({
            where: { id: data.servicioId }
        });

        return await prisma.cita.create({
            data: {
                clienteId: data.clienteId,
                profesionalId: data.profesionalId,
                servicioId: data.servicioId,
                fechaCita: new Date(data.fechaCita),
                horaInicio: data.horaInicio,
                horaFin: data.horaFin,
                modalidad: data.modalidad,
                estado: "PENDIENTE",
                comentarioCliente: data.comentarioCliente,
                montoEstimado: servicio!.precio,
            },
            include: {
                cliente: true,
                profesional: true,
                servicio: true,
            }
        });
    },

    async validateCliente(clienteId: number) {
        const cliente = await prisma.usuario.findUnique({
            where: { id: clienteId }
        });
        if (!cliente) throw AppError.badRequest("El cliente indicado no existe");
    },

    async validateProfesional(profesionalId: number) {
        const profesional = await prisma.profesional.findUnique({
            where: { id: profesionalId }
        });
        if (!profesional) throw AppError.badRequest("El profesional indicado no existe");
    },

    async validateServicio(servicioId: number) {
        const servicio = await prisma.servicio.findUnique({
            where: { id: servicioId }
        });
        if (!servicio) throw AppError.badRequest("El servicio indicado no existe");
    },
};