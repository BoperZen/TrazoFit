import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from "http-status-codes"
import { estadoOrdenService } from '../../services/old-services/estado-orden.service'

export class EstadoOrdenController {
    listar = async (request: Request, response: Response, next: NextFunction) => {

        const resultado = await estadoOrdenService.listar()
        return response.status(StatusCodes.OK).json({
            success: true,
            data: resultado,
        })

    }

    obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {

        const rawId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id
        const id = rawId?.trim()

        if (!id) {
            return response.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "ID de estado inválido" })
        }

        const estadoOrden = await estadoOrdenService.obtenerPorId(id)
        if (!estadoOrden) {
            return response.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Estado de orden no encontrado" })
        }

        return response.status(StatusCodes.OK).json({ success: true, data: estadoOrden })

    }
}