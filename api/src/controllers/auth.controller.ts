import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { authService } from '../services/auth.service';

export class AuthController {

    registrar = async (request: Request, response: Response) => {
        const usuario = await authService.registrar(request.body);

        return response.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Usuario registrado correctamente',
            data: usuario
        });
    };

    login = async (request: Request, response: Response) => {
        const resultado = await authService.login(request.body);

        return response.status(StatusCodes.OK).json({
            success: true,
            message: 'Inicio de sesión exitoso',
            data: resultado
        });
    };

    us = async (request: Request, response: Response) => {
        const id = (request as any).user?.id;

        if (!id) {
            return response.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: 'Usuario no autenticado'
            });
        }

        const usuario = await authService.obtenerUsuarioActivo(id);

        return response.status(StatusCodes.OK).json({
            success: true,
            data: usuario
        });
    };
}

export const authController = new AuthController();