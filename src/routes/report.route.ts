import { Router } from 'express';
import { Routes } from '@interfaces/route.interface';
import { ReportController } from '@controllers/report.controller';
import { authenticate } from '@middlewares/auth.middleware';

export class ReportRoute implements Routes {
  public path = '/report';
  public router = Router();
  private readonly controller: ReportController;

  constructor() {
    this.controller = new ReportController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/full-analysis`, authenticate, this.controller.getFullReport);
  }
}
