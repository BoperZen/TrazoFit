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
    historial: { orderBy: { createdAt: 'asc' as const } },
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

        const cita = await prisma.cita.create({
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

        await prisma.historialCita.create({
            data: {
                citaId: cita.id,
                estadoAnterior: 'PENDIENTE',
                estadoNuevo: 'PENDIENTE',
                comentario: 'Cita creada',
            }
        });

        return cita;
    },

    async cambiarEstado(id: number, data: CambiarEstadoCitaDto) {
        const cita = await this.obtenerPorId(id);
        const permitidos = TRANSICIONES[cita.estado] ?? [];

        if (!permitidos.includes(data.estado)) {
            throw AppError.badRequest(`No se puede cambiar de ${cita.estado} a ${data.estado}`);
        }

        // Motivo obligatorio al rechazar
        if (data.estado === 'RECHAZADA' && !data.comentario?.trim()) {
            throw AppError.badRequest('El motivo es obligatorio al rechazar una cita');
        }

        // Motivo obligatorio al cancelar desde ACEPTADA
        if (data.estado === 'CANCELADA' && cita.estado === 'ACEPTADA' && !data.comentario?.trim()) {
            throw AppError.badRequest('El motivo es obligatorio al cancelar una cita aceptada');
        }

        // Completar solo después de la fecha y hora
        if (data.estado === 'COMPLETADA') {
            const ahora = new Date();
            const fechaHoraFin = new Date(cita.fechaCita);
            const [horas, minutos] = cita.horaFin.split(':').map(Number);
            fechaHoraFin.setHours(horas, minutos, 0, 0);
            if (ahora < fechaHoraFin) {
                throw AppError.badRequest('No se puede completar una cita antes de su hora de fin');
            }
        }

        const [citaActualizada] = await prisma.$transaction([
            prisma.cita.update({
                where: { id },
                data: { estado: data.estado, comentarioProfesional: data.comentario },
                include: citaInclude,
            }),
            prisma.historialCita.create({
                data: {
                    citaId: id,
                    estadoAnterior: cita.estado,
                    estadoNuevo: data.estado,
                    comentario: data.comentario ?? null,
                },
            }),
        ]);

        return citaActualizada;
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