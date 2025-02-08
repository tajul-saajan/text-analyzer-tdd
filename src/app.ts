import 'reflect-metadata';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { Routes } from '@interfaces/route.interface';
import { ErrorMiddleware } from '@middlewares/error.middleware';
import { NODE_ENV, PORT, ORIGIN, CREDENTIALS } from '@config';
import passport from 'passport';
import { jwtStrategy } from '@middlewares/passport';
import { requestLogger } from '@/middlewares/logger.middleware';
import slowDown from 'express-slow-down';

export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.app.use(requestLogger);
    this.app.use(passport.initialize());
    jwtStrategy(passport);

    const speedLimiter = slowDown({
      windowMs: 60 * 1000,
      delayAfter: 100,
      delayMs: 500,
    });

    this.app.use(speedLimiter);

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log('running on port', this.port);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }
}
