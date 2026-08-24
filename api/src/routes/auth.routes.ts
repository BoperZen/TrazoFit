import { Router } from 'express';
import { asyncHandler } from '../middlewares/async-handler.middleware';
import { authController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export class AuthRoutes {

    static get routes(): Router {

        const router = Router();

        router.post(
            '/registrar',
            asyncHandler(authController.registrar)
        );

        router.post(
            '/login',
            asyncHandler(authController.login)
        );

        router.get(
            '/us',
            authMiddleware,
            asyncHandler(authController.us)
        );

        return router;
    }
}