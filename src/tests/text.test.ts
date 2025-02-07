import request from 'supertest';
import { App } from '@/app';
import { TextRoute } from '@routes/text.route';

describe('Text CRUD Operations', () => {
  let app: App;

  beforeAll(() => {
    app = new App([new TextRoute()]);
  });

  it('it should give us 201 from texts create endpoint', async () => {
    const response = await request(app.getServer()).post('/texts');
    expect(response.status).toBe(201);
  });
});
