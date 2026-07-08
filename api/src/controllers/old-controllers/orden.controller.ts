import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { ordenService } from '../../services/old-services/orden.service';
import { sendSuccess } from '../../utils/http-response';
import { parseId } from '../../utils/parse-id';

export class OrdenController {
    listar = async (request: Request, response: Response, next: NextFunction) => {

        const ordenes = await ordenService.listar();

        return response.status(StatusCodes.OK).json({
            success: true,
            data: ordenes
        });

    };
    listarPorUsuario = async (request: Request, response: Response, next: NextFunction) => {

        //Del token se extrae el ID del usuario y su rol para filtrar las órdenes
        //const { id: usuarioId, role } = req.user; 

        // SIMULACIÓN TEMPORAL URL (?usuarioId=2&role=ADMIN)
        // Si no vienen en la URL, usamos valores por defecto para que no se rompa
        const queryId = parseInt(request.query.usuarioId as string, 10);

        const usuarioId = !isNaN(queryId) ? queryId : 2; // Por defecto Ana (id: 2 de nuestro seed)
        const role = (request.query.role as any) || "USER"; // Por defecto USER

        const ordenes = await ordenService.listarPorUsuario(usuarioId, role);

        return response.status(StatusCodes.OK).json({
            success: true,
            data: ordenes
        });

    }

    obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
        const rawId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
        const ordenId = parseInt(rawId ?? '', 10);
        if (isNaN(ordenId)) {
            return response.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "ID de orden inválido" });
        }
        const resultado = await ordenService.obtenerPorId(ordenId);
        if (!resultado) {
            return response.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "La resultado no existe o no tiene permisos para verla"
            });
        }
        return response.status(StatusCodes.OK).json({
            success: true,
            data: resultado
        });

    }
    crear = async (request: Request, response: Response, next: NextFunction) => {
        const orden = await ordenService.create(request.body);
        return sendSuccess(
            response,
            orden,
            "Orden creada correctamente",
            StatusCodes.CREATED
        );
    }
    actualizar = async (request: Request, response: Response, next: NextFunction) => {        
        const id = parseId(request.params.id);
        const orden = await ordenService.update(id, request.body);
        return sendSuccess(response, orden, "Orden actualizada correctamente");
    }

}