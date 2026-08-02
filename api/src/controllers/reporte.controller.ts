import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ReporteService } from '../services/reporte.service';

export class ReporteController {
  private readonly service: ReporteService;

  constructor() {
    this.service = new ReporteService();
  }

  async topProfesionales(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.service.topProfesionales();
      res.status(StatusCodes.OK).json(data);
    } catch (error) {
      next(error);
    }
  }

  async demandaMensual(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.service.demandaMensual();
      res.status(StatusCodes.OK).json(data);
    } catch (error) {
      next(error);
    }
  }

  async calificacionVsVolumen(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.service.calificacionVsVolumen();
      res.status(StatusCodes.OK).json(data);
    } catch (error) {
      next(error);
    }
  }

  async histogramaDuracion(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.service.histogramaDuracion();
      res.status(StatusCodes.OK).json(data);
    } catch (error) {
      next(error);
    }
  }
}