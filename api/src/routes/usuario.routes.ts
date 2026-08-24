import { Router } from "express"
import { UsuarioController } from "../controllers/usuario.controller"
import { asyncHandler } from "../middlewares/async-handler.middleware"

export class UsuarioRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new UsuarioController()

        router.get('/', asyncHandler(controller.listar))
        router.get('/:id', asyncHandler(controller.obtenerPorId))
        router.patch('/:id/toggle-estado', asyncHandler(controller.toggleEstado))
        router.patch('/:id', asyncHandler(controller.actualizar))

        return router
    }
}