import { Router } from "express";
import { EspecialidadController } from "../controllers/especialidad.controller";
import { asyncHandler } from "../middlewares/async-handler.middleware";

export class EspecialidadRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new EspecialidadController()
        //Rutas
        //locahost:3000/especialidad/
        router.get('/', asyncHandler(controller.listar))
        router.get('/:id', asyncHandler(controller.obtenerPorId))
         router.patch('/:id/toggle-estado', asyncHandler(controller.toggleEstado))
        return router
    }
}
