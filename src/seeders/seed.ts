import { createConnection } from 'typeorm';
import { TextSeeder } from './text.seeder';

async function runSeeder() {
  try {
    await createConnection();

    await TextSeeder.seed(10);

    process.exit(0);
  } catch (error) {
    console.error('Error running the seeder:', error);
    process.exit(1);
  }
}

runSeeder();
