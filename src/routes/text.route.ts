import { Router } from 'express';
import { Routes } from '@interfaces/route.interface';
import { TextController } from '@controllers/text.controller';

export class TextRoute implements Routes {
  public path = '/texts/';
  public router = Router();

  private textController: TextController;

  constructor() {
    this.textController = new TextController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, this.textController.createText);
  }
}
