import { Router } from "express"
import { ServicioController } from "../controllers/servicio.controller"
import { asyncHandler } from "../middlewares/async-handler.middleware"
import { validateRequest } from "../middlewares/validate-request.middleware"
import { createServicioSchema, updateServicioSchema } from "../dtos/servicio.dto"

export class ServicioRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new ServicioController()

        router.get('/', asyncHandler(controller.listar))
        router.get('/:id', asyncHandler(controller.obtenerPorId))
        router.post('/', validateRequest(createServicioSchema), asyncHandler(controller.crear))
        router.put('/:id', validateRequest(updateServicioSchema), asyncHandler(controller.actualizar))
        router.patch('/:id/toggle-estado', asyncHandler(controller.toggleEstado))

        return router
    }
}