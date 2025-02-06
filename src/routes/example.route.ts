import { Router } from 'express';
import { Routes } from '@interfaces/route.interface';

export class ExampleRoute implements Routes {
  public path = '/';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}hello`, (req, res) => {
        res.json('hello Express.js');
    });
  }
}
