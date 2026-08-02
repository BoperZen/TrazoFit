import { Router } from 'express';
import { ReporteController } from '../controllers/reporte.controller';

export class ReporteRoutes {
    static get routes(): Router {
        const router = Router();
        const reporteController = new ReporteController();

        router.get('/top-profesionales', (req, res, next) => reporteController.topProfesionales(req, res, next));
        router.get('/demanda-mensual', (req, res, next) => reporteController.demandaMensual(req, res, next));
        router.get('/calificacion-volumen', (req, res, next) => reporteController.calificacionVsVolumen(req, res, next));
        router.get('/histograma-duracion', (req, res, next) => reporteController.histogramaDuracion(req, res, next));

        return router;
    }
}
