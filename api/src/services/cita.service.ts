import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
import { CreateCitaDto, CambiarEstadoCitaDto } from "../dtos/cita.dto";

const citaInclude = {
    cliente: { select: { id: true, nombre: true, apellidos: true, email: true, telefono: true } },
    profesional: {
        include: {
            usuario: { select: { id: true, nombre: true, apellidos: true, email: true } }
        }
    },
    servicio: { select: { id: true, nombre: true, precio: true, duracion: true, modalidad: true } },
    resena: true,
};

const TRANSICIONES: Record<string, string[]> = {
    PENDIENTE: ["ACEPTADA", "RECHAZADA", "CANCELADA"],
    ACEPTADA: ["COMPLETADA", "CANCELADA"],
    RECHAZADA: [],
    CANCELADA: [],
    COMPLETADA: [],
};

export const citaService = {

    async listar() {
        return await prisma.cita.findMany({
            orderBy: { createdAt: "desc" },
            include: citaInclude,
        });
    },

    async listarPorCliente(clienteId: number) {
        return await prisma.cita.findMany({
            where: { clienteId },
            orderBy: { fechaCita: "desc" },
            include: citaInclude,
        });
    },

    async listarPorProfesional(profesionalId: number) {
        return await prisma.cita.findMany({
            where: { profesionalId },
            orderBy: { fechaCita: "desc" },
            include: citaInclude,
        });
    },

    async obtenerPorId(id: number) {
        const cita = await prisma.cita.findUnique({ where: { id }, include: citaInclude });
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
            include: citaInclude,
        });
    },

    async cambiarEstado(id: number, data: CambiarEstadoCitaDto) {
        const cita = await this.obtenerPorId(id);
        const permitidos = TRANSICIONES[cita.estado] ?? [];

        if (!permitidos.includes(data.estado)) {
            throw AppError.badRequest(`No se puede cambiar de ${cita.estado} a ${data.estado}`);
        }

        return await prisma.cita.update({
            where: { id },
            data: {
                estado: data.estado,
                comentarioProfesional: data.comentario,
            },
            include: citaInclude,
        });
    },

    async validateCliente(clienteId: number) {
        const cliente = await prisma.usuario.findUnique({ where: { id: clienteId } });
        if (!cliente) throw AppError.badRequest("El cliente indicado no existe");
    },

    async validateProfesional(profesionalId: number) {
        const profesional = await prisma.profesional.findUnique({ where: { id: profesionalId } });
        if (!profesional) throw AppError.badRequest("El profesional indicado no existe");
    },

    async validateServicio(servicioId: number) {
        const servicio = await prisma.servicio.findUnique({ where: { id: servicioId } });
        if (!servicio) throw AppError.badRequest("El servicio indicado no existe");
    },
};