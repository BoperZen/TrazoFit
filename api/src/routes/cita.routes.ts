import { Router } from "express"
import { CitaController } from "../controllers/cita.controller"
import { asyncHandler } from "../middlewares/async-handler.middleware"
import { validateRequest } from "../middlewares/validate-request.middleware"
import { createCitaSchema, cambiarEstadoCitaSchema } from "../dtos/cita.dto"

export class CitaRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new CitaController()

        router.get('/', asyncHandler(controller.listar))
        router.get('/cliente/:clienteId', asyncHandler(controller.listarPorCliente))
        router.get('/profesional/:profesionalId', asyncHandler(controller.listarPorProfesional))
        router.post('/', validateRequest(createCitaSchema), asyncHandler(controller.crear))
        router.patch('/:id/estado', validateRequest(cambiarEstadoCitaSchema), asyncHandler(controller.cambiarEstado))
        router.get('/:id', asyncHandler(controller.obtenerPorId))

        router.use((req, res, next) => {
            console.log(req.method, req.path);
            next();
        });

        return router
    }
}