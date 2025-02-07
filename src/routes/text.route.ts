import { Router } from 'express';
import { Routes } from '@interfaces/route.interface';

export class TextRoute implements Routes {
  public path = '/texts/';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, (req, res) => {
      res.status(201).json({});
    });
  }
}
