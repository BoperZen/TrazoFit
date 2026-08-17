import { Router } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { resenaController } from "../controllers/resena.controller";
import { createResenaSchema } from "../dtos/resena.dto";

export class ResenaRoutes {
    static get routes(): Router {
        const router = Router();
        router.get("/", asyncHandler(resenaController.listar));
        router.post("/", validateRequest(createResenaSchema), asyncHandler(resenaController.crear));
        return router;
    }
}