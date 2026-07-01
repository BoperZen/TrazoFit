import { Role } from "../../generated/prisma"
import { prisma } from "../config/prisma"
import { CreateOrdenDto, UpdateOrdenDto } from "../dtos/orden.dto"
import { AppError } from "../utils/app-error"
import { EstadoOrdenMap } from "../utils/enum-mappers"

export const ordenService = {
    async listar() {
        const ordenes = await prisma.orden.findMany({
            include: {
                usuario: {
                    omit: {
                        password: true,
                    },
                },
            },
            orderBy: { fechaOrden: "asc" }
        })
        return ordenes.map((orden) => ({
            ...orden,
            estadoDescripcion: EstadoOrdenMap[orden.estado]
        }))
    },
    async listarPorUsuario(usuarioId: number, role: Role) {
        const filtro = role === Role.ADMIN ? {} : { usuarioId }
        const ordenes = await prisma.orden.findMany({
            where: filtro,
            include: {
                usuario: {
                    omit: {
                        password: true,
                    },
                }
            },
            orderBy: { fechaOrden: "desc" }
        })
        return ordenes.map((orden) => ({
            ...orden,
            estadoDescripcion: EstadoOrdenMap[orden.estado]
        }))
    },
    async obtenerPorId(ordenId: number) {
        const orden = await prisma.orden.findFirst({
            where: { id: ordenId },
            include: {
                usuario: {
                    omit: {
                        password: true,
                    },
                },
                videojuegos: {
                    include: {
                        videojuego: {
                            select: { nombre: true, imagen: true }
                        }
                    }
                }
            }
        })
        return {
            ...orden,
            estadoDescripcion: EstadoOrdenMap[orden?.estado as keyof typeof EstadoOrdenMap]
        }
    },
    async create(data: CreateOrdenDto) {
        await this.validateUsuario(data.usuarioId)
        const videojuegoIds = data.videojuegos.map((item) => item.videojuegoId)
        const videojuegosMap = await this.obtenerVideojuegosValidosConPrecio(
            videojuegoIds
        )
        const detalleOrden = this.crearDetalleOrden(
            data.videojuegos,
            videojuegosMap
        )
        return prisma.orden.create({
            data: {
                usuarioId: data.usuarioId,
                videojuegos: {
                    create: detalleOrden,
                },
            },
            include: {
                usuario: {
                    select: {
                        id: true,
                        email: true,
                        nombre: true,
                        role: true,
                    },
                },
                videojuegos: {
                    include: {
                        videojuego: true,
                    },
                },
            },
        })
    },
    async update(id: number, data: UpdateOrdenDto) {
        await this.obtenerPorId(id)
        if (data.usuarioId) {
            await this.validateUsuario(data.usuarioId)
        }
        let detalleOrden:
            | {
                videojuegoId: number
                cantidad: number
                precioFixed: any
            }[] | undefined
        if (data.videojuegos) {
            const videojuegoIds = data.videojuegos.map(
                (item) => item.videojuegoId
            )
            const videojuegosMap = await this.obtenerVideojuegosValidosConPrecio(
                videojuegoIds
            )
            detalleOrden = this.crearDetalleOrden(
                data.videojuegos,
                videojuegosMap
            )
        }
        return prisma.orden.update({
            where: { id },
            data: {
                usuarioId: data.usuarioId,
                videojuegos: detalleOrden
                    ? {
                        deleteMany: {},
                        create: detalleOrden,
                    }
                    : undefined,
            },
            include: {
                usuario: {
                    select: {
                        id: true,
                        email: true,
                        nombre: true,
                        role: true,
                    },
                },
                videojuegos: {
                    include: {
                        videojuego: true,
                    },
                },
            },
        })
    },
    async validateUsuario(usuarioId: number) {
        const usuario = await prisma.usuario.findUnique({
            where: { id: usuarioId },
        })
        if (!usuario) {
            throw AppError.badRequest("El usuario indicado no existe")
        }
    },
    async validateVideojuegos(videojuegoIds: number[]) {
        const uniqueIds = [...new Set(videojuegoIds)]
        if (uniqueIds.length !== videojuegoIds.length) {
            throw AppError.badRequest("La orden contiene videojuegos repetidos")
        }

        const count = await prisma.videojuego.count({
            where: {
                id: {
                    in: uniqueIds,
                },
                publicar: true,
            },
        })

        if (count !== uniqueIds.length) {
            throw AppError.badRequest(
                "Uno o más videojuegos no existen o no están publicados"
            )
        }
    },
    async obtenerVideojuegosValidosConPrecio(videojuegoIds: number[]) {
        const uniqueIds = [...new Set(videojuegoIds)]
        if (uniqueIds.length !== videojuegoIds.length) {
            throw AppError.badRequest("La orden contiene videojuegos repetidos")
        }
        const videojuegos = await prisma.videojuego.findMany({
            where: {
                id: {
                    in: uniqueIds,
                },
                publicar: true,
            },
            select: {
                id: true,
                precio: true,
            },
        })
        if (videojuegos.length !== uniqueIds.length) {
            throw AppError.badRequest(
                "Uno o más videojuegos no existen o no están publicados"
            )
        }
        return new Map(videojuegos.map((videojuego) => [videojuego.id, videojuego]))
    },
    crearDetalleOrden(
        videojuegos: { videojuegoId: number; cantidad: number }[],
        videojuegosMap: Map<number, { id: number; precio: any }>
    ) {
        return videojuegos.map((item) => {
            const videojuego = videojuegosMap.get(item.videojuegoId)

            if (!videojuego) {
                throw AppError.badRequest("Videojuego no encontrado")
            }

            return {
                videojuegoId: item.videojuegoId,
                cantidad: item.cantidad,
                precioFixed: videojuego.precio,
            }
        })
    }
}