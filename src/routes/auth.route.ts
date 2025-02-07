import { Router } from 'express';
import { Routes } from '@interfaces/route.interface';
import { AuthController } from '@controllers/auth.controller';
import { authenticate } from '@middlewares/auth.middleware';

export class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public authController: AuthController;

  constructor() {
    this.authController = new AuthController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, this.authController.register);
    this.router.post(`${this.path}/login`, this.authController.login);
    this.router.get(`${this.path}/profile`, authenticate, this.authController.getProfile);
  }
}
