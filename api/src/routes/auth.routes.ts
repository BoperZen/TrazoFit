import { Router } from 'express';
import { asyncHandler } from '../middlewares/async-handler.middleware';
import { authController } from '../controllers/auth.controller';

export class AuthRoutes {
    static get routes(): Router {
        const router = Router();
        // /auth/us ---> Consigue Usuario logged
        router.get('/us', asyncHandler(authController.us));
        return router;
    }
}