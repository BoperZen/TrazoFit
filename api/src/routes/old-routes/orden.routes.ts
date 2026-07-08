import { Router } from "express";
import { OrdenController } from "../../controllers/old-controllers/orden.controller";
import { asyncHandler } from "../../middlewares/async-handler.middleware";
import { createOrdenSchema, updateOrdenSchema } from "../../dtos/old-dto/orden.dto";
import { validateRequest } from "../../middlewares/validate-request.middleware";

export class OrdenRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new OrdenController()
        //Rutas
        //locahost:3000/orden/
        router.get('/', asyncHandler(controller.listar))
        router.get('/usuario/', asyncHandler(controller.listarPorUsuario))
        router.get('/:id', asyncHandler(controller.obtenerPorId))
         router.post(
                    "/",
                    validateRequest(createOrdenSchema),
                    asyncHandler(controller.crear)
                )
        
                router.put(
                    "/:id",
                    validateRequest(updateOrdenSchema),
                    asyncHandler(controller.actualizar)
                )
        return router
    }
}
