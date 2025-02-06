import { App } from '@/app';
import { ExampleRoute } from '@routes/example.route';
import { ValidateEnv } from '@utils/validateEnv';
import { createConnection } from 'typeorm';
import config from '../ormconfig';

ValidateEnv();

const routes = [new ExampleRoute()];
const app = new App(routes);
createConnection(config).then(() => {
  app.listen();
});
