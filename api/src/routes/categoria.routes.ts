import { Router } from "express";
import { CategoriaController } from "../controllers/categoria.controller";
import { asyncHandler } from "../middlewares/async-handler.middleware";

export class CategoriaRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new CategoriaController()
        //Rutas
        //locahost:3000/categoria/
        router.get('/', asyncHandler(controller.listar))
        router.get('/:id', asyncHandler(controller.obtenerPorId))
        return router
    }
}
