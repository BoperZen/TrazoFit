import { Router } from "express";
import { EstadoOrdenController } from "../../controllers/old-controllers/estado-orden.controller";
import { asyncHandler } from "../../middlewares/async-handler.middleware";

export class EstadoOrdenRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new EstadoOrdenController()
        //Rutas
        //locahost:3000/estadoOrden/
        router.get('/', asyncHandler(controller.listar))
        router.get('/:id', asyncHandler(controller.obtenerPorId))
        return router
    }
}
