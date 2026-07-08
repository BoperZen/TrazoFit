import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { usuarioService } from '../services/usuario.service';

export class UsuarioController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
        const resultado = await usuarioService.listar();
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

        const usuario = await usuarioService.obtenerPorId(id);
        if (!usuario) {
            return response.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Usuario no encontrado" });
        }

        return response.status(StatusCodes.OK).json({ success: true, data: usuario });
    };

    toggleEstado = async (request: Request, response: Response, next: NextFunction) => {
        const rawId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
        const id = parseInt(rawId ?? '', 10);
        if (isNaN(id)) {
            return response.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "ID inválido" });
        }

        const usuario = await usuarioService.toggleEstado(id);
        return response.status(StatusCodes.OK).json({
            success: true,
            message: "Estado actualizado correctamente",
            data: usuario,
        });
    };
}