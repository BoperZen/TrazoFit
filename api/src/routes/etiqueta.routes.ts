import { Router } from "express";
import { EtiquetaController } from "../controllers/etiqueta.controller";
import { asyncHandler } from "../middlewares/async-handler.middleware";

export class EtiquetaRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new EtiquetaController()
        //Rutas
        //locahost:3000/etiqueta/
        router.get('/', asyncHandler(controller.listar))
        router.get('/:id', asyncHandler(controller.obtenerPorId))
        return router
    }
}
