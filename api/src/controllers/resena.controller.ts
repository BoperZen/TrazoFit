import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { resenaService } from "../services/resena.service";
import { sendSuccess } from "../utils/http-response";

export class ResenaController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
        const resultado = await resenaService.listar();
        return sendSuccess(response, resultado);
    };

    crear = async (request: Request, response: Response, next: NextFunction) => {
        const resena = await resenaService.crear(request.body);
        return sendSuccess(response, resena, "Reseña creada correctamente", StatusCodes.CREATED);
    };
}

export const resenaController = new ResenaController();