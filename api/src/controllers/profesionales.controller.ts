import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { profesionalService } from '../services/profesionales.service';
import { parseId } from '../utils/parse-id';
import { sendSuccess } from '../utils/http-response';

export class ProfesionalController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
        const resultado = await profesionalService.listar();
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

        const profesional = await profesionalService.obtenerPorId(id);
        if (!profesional) {
            return response.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Profesional no encontrado" });
        }

        return response.status(StatusCodes.OK).json({ success: true, data: profesional });
    };

    crear = async (request: Request, response: Response, next: NextFunction) => {
        const profesional = await profesionalService.crear(request.body);
        return sendSuccess(
            response,
            profesional,
            "Profesional creado correctamente",
            StatusCodes.CREATED
        );
    };

    actualizar = async (request: Request, response: Response, next: NextFunction) => {
        const id = parseId(request.params.id);
        const profesional = await profesionalService.actualizar(id, request.body);
        return sendSuccess(
            response,
            profesional,
            "Profesional actualizado correctamente"
        );
    };

    toggleDisponible = async (request: Request, response: Response, next: NextFunction) => {
        const rawId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
        const id = parseInt(rawId ?? '', 10);
        if (isNaN(id)) {
            return response.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "ID inválido" });
        }

        const profesional = await profesionalService.toggleDisponible(id);
        return response.status(StatusCodes.OK).json({
            success: true,
            message: "Disponibilidad actualizada correctamente",
            data: profesional,
        });
    };
}