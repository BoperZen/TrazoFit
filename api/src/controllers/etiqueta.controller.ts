import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { etiquetaService } from '../services/etiqueta.service';

export class EtiquetaController {
    listar = async (request: Request, response: Response, next: NextFunction) => {

        const resultado = await etiquetaService.listar();
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

        const etiqueta = await etiquetaService.obtenerPorId(id);
        if (!etiqueta) {
            return response.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Etiqueta no encontrado" });
        }

        return response.status(StatusCodes.OK).json({ success: true, data: etiqueta });

    };
}
