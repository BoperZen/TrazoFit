import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { citaService } from '../services/cita.service';
import { sendSuccess } from '../utils/http-response';

export class CitaController {

    listar = async (request: Request, response: Response, next: NextFunction) => {
        const resultado = await citaService.listar();
        return sendSuccess(response, resultado);
    };

    listarPorCliente = async (request: Request, response: Response, next: NextFunction) => {
        const rawId = Array.isArray(request.params['clienteId']) ? request.params['clienteId'][0] : request.params['clienteId'];
        const id = parseInt(rawId ?? '', 10);
        if (isNaN(id)) return response.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "ID inválido" });
        const resultado = await citaService.listarPorCliente(id);
        return sendSuccess(response, resultado);
    };

    listarPorProfesional = async (request: Request, response: Response, next: NextFunction) => {
        const rawId = Array.isArray(request.params['profesionalId']) ? request.params['profesionalId'][0] : request.params['profesionalId'];
        const id = parseInt(rawId ?? '', 10);
        if (isNaN(id)) return response.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "ID inválido" });
        const resultado = await citaService.listarPorProfesional(id);
        return sendSuccess(response, resultado);
    };

    obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
        const rawId = Array.isArray(request.params['id']) ? request.params['id'][0] : request.params['id'];
        const id = parseInt(rawId ?? '', 10);
        if (isNaN(id)) return response.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "ID inválido" });
        const cita = await citaService.obtenerPorId(id);
        return response.status(StatusCodes.OK).json({ success: true, data: cita });
    };

    crear = async (request: Request, response: Response, next: NextFunction) => {
        const cita = await citaService.crear(request.body);
        return sendSuccess(response, cita, "Cita registrada correctamente", StatusCodes.CREATED);
    };

    // Super tieso que es el typescript puse un 'Id' en vez de un 'id' y no lo quiso, no quiso funcionar el cabron
    cambiarEstado = async (request: Request, response: Response, next: NextFunction) => {
        const rawId = Array.isArray(request.params['id']) ? request.params['id'][0] : request.params['id'];
        const id = parseInt(rawId ?? '', 10);
        if (isNaN(id)) return response.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "ID inválido" });
        const cita = await citaService.cambiarEstado(id, request.body);
        return sendSuccess(response, cita, "Estado de cita actualizado correctamente");
    };
}