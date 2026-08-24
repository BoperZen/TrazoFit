import { Router } from "express"
import { ProfesionalController } from "../controllers/profesionales.controller"
import { asyncHandler } from "../middlewares/async-handler.middleware"
import { validateRequest } from "../middlewares/validate-request.middleware"
import { createProfesionalSchema, updateProfesionalSchema } from "../dtos/profesional.dto"

export class ProfesionalRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new ProfesionalController()

        router.get('/', asyncHandler(controller.listar))
        router.get('/usuario/:usuarioId', asyncHandler(controller.obtenerPorUsuarioId))
        router.get('/:id', asyncHandler(controller.obtenerPorId))
        router.post('/', validateRequest(createProfesionalSchema), asyncHandler(controller.crear))
        router.put('/:id', validateRequest(updateProfesionalSchema), asyncHandler(controller.actualizar))
        router.patch('/:id/toggle-disponible', asyncHandler(controller.toggleDisponible))

        return router
    }
}