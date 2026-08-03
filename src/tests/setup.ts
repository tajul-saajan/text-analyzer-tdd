import { createConnection, getConnection } from 'typeorm';
import dotenv from 'dotenv';

// Load environment variables. A developer's own .env wins; .env.test then fills
// in anything missing so the suite passes on a clean clone. dotenv does not
// override variables that are already set, so this order is deliberate.
dotenv.config();
dotenv.config({ path: '.env.test' });

// Setup in-memory SQLite for testing (you can change this to MySQL for integration tests)
beforeAll(async () => {
  await createConnection({
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    logging: false,
    entities: [__dirname + '/../entities/*.{ts,js}'],
  });
});

// Clean up after tests
afterAll(async () => {
  const connection = getConnection();
  await connection.dropDatabase();
  await connection.close();
});
