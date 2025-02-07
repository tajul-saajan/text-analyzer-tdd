import request from 'supertest';
import { App } from '@/app';
import { TextRoute } from '@routes/text.route';

describe('Text CRUD Operations', () => {
  let app: App;

  beforeAll(async () => {
    app = new App([new TextRoute()]);
  });

  it('it should give us 201 from texts create endpoint', async () => {
    const response = await request(app.getServer()).post('/texts').send({ content: 'hello world' });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should throw error with empty body', async () => {
    const response = await request(app.getServer()).post('/texts').send({});
    expect(response.status).toBe(400);
  });

  it('should return 422 for invalid content (empty)', async () => {
    const newText = {
      content: '',
    };

    const response = await request(app.getServer()).post('/texts').send(newText).set('Accept', 'application/json');

    expect(response.status).toBe(422);
    expect(response.body.message).toBe('Validation failed');
    expect(response.body.errors[0].constraints.isNotEmpty).toBe('Content must not be empty');
  });
});
