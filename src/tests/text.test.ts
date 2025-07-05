import request from 'supertest';
import { App } from '@/app';
import { TextRoute } from '@routes/text.route';
import { getRepository, Repository } from 'typeorm';
import { Text } from '@/entities/text';
import { TextService } from '@services/textService';
import { HttpException } from '@exceptions/httpException';
import passport from 'passport';

describe('Text create Tests', () => {
  let app: App;

  beforeAll(async () => {
    app = new App([new TextRoute()]);
    jest.spyOn(passport, 'authenticate').mockImplementation((strategy: string, options?: any) => (req, res, next) => next());
  });

  afterAll(async () => {
    const repository = getRepository(Text);
    await repository.clear();
  });

  it('it should give us 201 from texts create endpoint', async () => {
    const response = await request(app.getServer()).post('/texts').send({ content: 'hello world' });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should throw error with empty body', async () => {
    const response = await request(app.getServer()).post('/texts').send({});
    expect(response.status).toBe(422);
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

async function createTexts(repository: Repository<Text>, count: number) {
  for (let i = 1; i <= count; i++) {
    await repository.save({
      content: `Text content ${i}`,
    });
  }
}

describe('Text list with Pagination Tests', () => {
  let app: App;

  beforeAll(async () => {
    app = new App([new TextRoute()]);
    jest.spyOn(passport, 'authenticate').mockImplementation((strategy: string, options?: any) => (req, res, next) => next());
    const repository = getRepository(Text);
    await repository.clear();

    await createTexts(repository, 50);
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

describe('Text update API Tests', () => {
  let app: App;

  beforeAll(async () => {
    app = new App([new TextRoute()]);
    const repository = getRepository(Text);
    await repository.clear();

    await createTexts(repository, 50);

    jest.spyOn(passport, 'authenticate').mockImplementation((strategy: string, options?: any) => (req, res, next) => next());
  });

  it('should update text content successfully', async () => {
    const updatedContent = {
      content: 'Updated content after modification',
    };

    const response = await request(app.getServer()).put('/texts/77').send(updatedContent).set('Accept', 'application/json');

    expect(response.status).toBe(202);
    expect(response.body.content).toBe(updatedContent.content);
  });

  it('should return 404 for non-existent text id', async () => {
    const updatedContent = {
      content: 'This should fail',
    };

    const response = await request(app.getServer()).put('/texts/999').send(updatedContent).set('Accept', 'application/json');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Text not found');
  });
});

describe('Text API Delete Tests', () => {
  let app: App;

  beforeAll(async () => {
    app = new App([new TextRoute()]);
    jest.spyOn(passport, 'authenticate').mockImplementation((strategy: string, options?: any) => (req, res, next) => next());
    const repository = getRepository(Text);
    await repository.clear();

    await createTexts(repository, 5);
  });

  it('should delete text successfully', async () => {
    const response = await request(app.getServer()).delete('/texts/105').set('Accept', 'application/json');

    expect(response.status).toBe(204);
  });

  it('should return 404 for non-existent text id', async () => {
    const response = await request(app.getServer()).delete('/texts/999').set('Accept', 'application/json');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Text not found');
  });
});

describe('Text get functionality', () => {
  let textService: TextService;

  beforeAll(async () => {
    textService = new TextService();
  });

  it('should get the text with correct id', async () => {
    const text = await textService.getText(106);

    expect(text).toHaveProperty('id');
  });

  it('should get the text with incorrect id', async () => {
    try {
      await textService.getText(999);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });
});
