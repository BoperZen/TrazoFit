import { Router } from "express"
import { VideojuegoController } from "../../controllers/old-controllers/videojuego.controller"
import { asyncHandler } from "../../middlewares/async-handler.middleware"
import { validateRequest } from "../../middlewares/validate-request.middleware"
import { createVideojuegoSchema, updateVideojuegoSchema } from "../../dtos/old-dto/videojuego.dto"

export class VideojuegoRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new VideojuegoController()
        //Rutas
        //locahost:3000/videojuego/
        router.get('/', asyncHandler(controller.listar))
        router.get('/:id', asyncHandler(controller.obtenerPorId))
        router.post(
            "/",
            validateRequest(createVideojuegoSchema),
            asyncHandler(controller.crear)
        )

        router.put(
            "/:id",
            validateRequest(updateVideojuegoSchema),
            asyncHandler(controller.actualizar)
        )
        return router
    }
}
