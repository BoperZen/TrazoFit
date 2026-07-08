import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { servicioService } from '../services/servicio.service';
import { parseId } from '../utils/parse-id';
import { sendSuccess } from '../utils/http-response';

export class ServicioController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
        const resultado = await servicioService.listar();
        return response.status(StatusCodes.OK).json({
            success: true,
            data: resultado,
        });
    };

    obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
        const rawId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
        const id = parseInt(rawId ?? '', 10);
        if (isNaN(id)) {
            return response.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "ID inválido" });
        }

        const servicio = await servicioService.obtenerPorId(id);
        if (!servicio) {
            return response.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Servicio no encontrado" });
        }

        return response.status(StatusCodes.OK).json({ success: true, data: servicio });
    };

    crear = async (request: Request, response: Response, next: NextFunction) => {
        const servicio = await servicioService.crear(request.body);
        return sendSuccess(
            response,
            servicio,
            "Servicio creado correctamente",
            StatusCodes.CREATED
        );
    };

    actualizar = async (request: Request, response: Response, next: NextFunction) => {
        const id = parseId(request.params.id);
        const servicio = await servicioService.actualizar(id, request.body);
        return sendSuccess(
            response,
            servicio,
            "Servicio actualizado correctamente"
        );
    };

    toggleEstado = async (request: Request, response: Response, next: NextFunction) => {
        const rawId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
        const id = parseInt(rawId ?? '', 10);
        if (isNaN(id)) {
            return response.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "ID inválido" });
        }

        const servicio = await servicioService.toggleEstado(id);
        return response.status(StatusCodes.OK).json({
            success: true,
            message: "Estado actualizado correctamente",
            data: servicio,
        });
    };
}