import { Router } from "express";
import { PlataformaController } from "../controllers/plataforma.controller";
import { asyncHandler } from "../middlewares/async-handler.middleware";

export class PlataformaRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new PlataformaController()
        //Rutas
        //locahost:3000/plataforma/
        router.get('/', asyncHandler(controller.listar))
        router.get('/:id', asyncHandler(controller.obtenerPorId))
        return router
    }
}
