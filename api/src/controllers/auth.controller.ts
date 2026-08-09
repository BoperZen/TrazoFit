import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { usuarioService } from '../services/usuario.service';

export class AuthController {
    us = async (request: Request, response: Response) => {
        const id = parseInt(process.env.MOCK_USER_ID ?? '', 10);

        if (isNaN(id)) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'MOCK_USER_ID no configurado en .env',
            });
        }

        const usuario = await usuarioService.obtenerPorId(id);
        return response.status(StatusCodes.OK).json({ success: true, data: usuario });
    };
}

export const authController = new AuthController();