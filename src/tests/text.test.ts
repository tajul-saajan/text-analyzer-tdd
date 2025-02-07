import request from 'supertest';
import { App } from '@/app';
import { TextRoute } from '@routes/text.route';
import { getRepository } from 'typeorm';
import { Text } from '@/entities/text';

describe('Text create Tests', () => {
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

describe('Text list with Pagination Tests', () => {
  let app: App;

  beforeAll(async () => {
    app = new App([new TextRoute()]);
  });

  beforeEach(async () => {
    const repository = getRepository(Text);
    await repository.clear();

    for (let i = 1; i <= 50; i++) {
      await repository.save({
        content: `Text content ${i}`,
      });
    }
  });

  it('should return the first page with a default page size of 10', async () => {
    const response = await request(app.getServer()).get('/texts?page=1&pageSize=10').set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.texts).toHaveLength(10);
    expect(response.body.total).toBe(50);
    expect(response.body.totalPages).toBe(5);
    expect(response.body.page).toBe(1);
    expect(response.body.per_page).toBe(10);
  });

  it('should return the second page with a page size of 10', async () => {
    const response = await request(app.getServer()).get('/texts?page=2&pageSize=10').set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.texts).toHaveLength(10);
    expect(response.body.total).toBe(50);
    expect(response.body.totalPages).toBe(5);
    expect(response.body.page).toBe(2);
  });

  it('should return the last page when page is set to the highest number', async () => {
    const response = await request(app.getServer()).get('/texts?page=5&pageSize=10').set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.texts).toHaveLength(10);
    expect(response.body.total).toBe(50);
    expect(response.body.totalPages).toBe(5);
    expect(response.body.page).toBe(5);
  });

  it('should return the default page when no query parameters are passed', async () => {
    const response = await request(app.getServer()).get('/texts').set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.texts).toHaveLength(10);
    expect(response.body.page).toBe(1);
    expect(response.body.per_page).toBe(10);
  });
});
