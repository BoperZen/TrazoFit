import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { categoriaService } from '../services/categoria.service';

export class CategoriaController { 
    listar = async (request: Request, response: Response, next: NextFunction) => {

        const resultado = await categoriaService.listar();
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

        const categoria = await categoriaService.obtenerPorId(id);
        if (!categoria) {
            return response.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Categoria no encontrado" });
        }

        return response.status(StatusCodes.OK).json({ success: true, data: categoria });

    };
}
