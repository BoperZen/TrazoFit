import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction
) => {

    console.log('AUTH HEADER:', request.headers.authorization);

    const authorization = request.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
        console.log('NO HAY TOKEN');
        return response.status(401).json({
            success: false,
            message: 'Token requerido'
        });
    }

    const token = authorization.substring(7);

    try {
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error('JWT_SECRET no configurado');
        }

        const decoded = jwt.verify(token, secret);

        console.log('JWT DECODIFICADO:', decoded);

        (request as any).user = decoded;

        next();

    } catch (error) {

        console.log('JWT ERROR:', error);

        return response.status(401).json({
            success: false,
            message: 'Token inválido o expirado'
        });
    }
};