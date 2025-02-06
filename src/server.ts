import { App } from '@/app';
import { ExampleRoute } from '@routes/example.route';
import { ValidateEnv } from '@utils/validateEnv';

ValidateEnv();

const routes = [new ExampleRoute()];
const app = new App(routes);

app.listen();
