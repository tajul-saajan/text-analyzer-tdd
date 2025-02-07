import request from 'supertest';
import { App } from '@/app';
import { ExampleRoute } from '@routes/example.route';

describe('Example Text', () => {
  let app: App;

  beforeAll(() => {
    app = new App([new ExampleRoute()]);
  });

  it('example route should return 200 with hello text', async () => {
    const response = await request(app.getServer()).get('/hello');
    expect(response.status).toBe(200);
    expect(response.body).toEqual('hello Express.js');
  });
});
