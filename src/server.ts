import { App } from '@/app';
import { ExampleRoute } from '@routes/example.route';
import { TextRoute } from '@routes/text.route';
import { ValidateEnv } from '@utils/validateEnv';
import { createConnection } from 'typeorm';
import config from '../ormconfig';
import { TextAnalysisRoute } from '@routes/text-analysis.route';
import { AuthRoute } from '@routes/auth.route';
import { ReportRoute } from '@routes/report.route';

ValidateEnv();

const routes = [new ExampleRoute(), new TextRoute(), new TextAnalysisRoute(), new AuthRoute(), new ReportRoute()];
const app = new App(routes);
createConnection(config).then(() => {
  app.listen();
});
