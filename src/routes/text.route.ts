import { Router } from 'express';
import { Routes } from '@interfaces/route.interface';
import { TextController } from '@controllers/text.controller';

export class TextRoute implements Routes {
  public path = '/texts';
  public router = Router();

  private textController: TextController;

  constructor() {
    this.textController = new TextController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.textController.getTexts);
    this.router.post(`${this.path}`, this.textController.createText);
    this.router.put(`${this.path}/:id`, this.textController.updateText);
  }
}
