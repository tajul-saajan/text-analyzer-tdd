import { createConnection, getConnection } from 'typeorm';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Setup in-memory SQLite for testing (you can change this to MySQL for integration tests)
beforeAll(async () => {
  await createConnection({
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    logging: false,
    entities: [],
  });
});

// Clean up after tests
afterAll(async () => {
  const connection = getConnection();
  await connection.dropDatabase();
  await connection.close();
});
