import { Router } from 'express';
import { Routes } from '@interfaces/route.interface';
import { TextController } from '@controllers/text.controller';
import { authenticate } from '@/middlewares/auth.middleware';

export class TextRoute implements Routes {
  public path = '/texts';
  public router = Router();

  private textController: TextController;

  constructor() {
    this.textController = new TextController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authenticate, this.textController.getTexts);
    this.router.post(`${this.path}`, authenticate, this.textController.createText);
    this.router.put(`${this.path}/:id`, authenticate, this.textController.updateText);
    this.router.delete(`${this.path}/:id`, authenticate, this.textController.deleteText);
  }
}
