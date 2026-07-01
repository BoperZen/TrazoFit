import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { videojuegoService } from '../services/videojuego.service';
import { parseId } from '../utils/parse-id';
import { sendSuccess } from '../utils/http-response';

export class VideojuegoController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
        const { page, limit } = request.query;
        const parsedPage = parseInt(page as string, 10) || 1;
        const parsedLimit = parseInt(limit as string, 10) || 10;
        const resultado = await videojuegoService.listar(parsedPage, parsedLimit);
        return response.status(StatusCodes.OK).json({
            success: true,
            meta: resultado.meta,
            data: resultado.data,
        });
    };
    obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
        //Nullish Coalescing (??)
        const rawId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
        const id = parseInt(rawId ?? '', 10);
        if (isNaN(id)) {
            return response.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "ID inválido" });
        }
        const videojuego = await videojuegoService.obtenerPorId(id);
        if (!videojuego) {
            return response.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Videojuego no encontrado" });
        }
        return response.status(StatusCodes.OK).json({ success: true, data: videojuego });
    };
    crear = async (request: Request, response: Response, next: NextFunction) => {
        const videojuego = await videojuegoService.crear(request.body);
        return sendSuccess(
            response,
            videojuego,
            "Videojuego creado correctamente",
            StatusCodes.CREATED
        );
    }
    actualizar = async (request: Request, response: Response, next: NextFunction) => {
        const id = parseId(request.params.id);
        const videojuego = await videojuegoService.actualizar(id, request.body);
        return sendSuccess(
            response,
            videojuego,
            "Videojuego actualizado correctamente"
        );
    }
}
