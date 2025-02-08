import { createConnection } from 'typeorm';
import { TextSeeder } from '@/seeders/text.seeder';
import { UserSeeder } from '@/seeders/user.seeder';

async function runSeeder() {
  try {
    await createConnection();

    await TextSeeder.seed(10);
    await UserSeeder.seed(2);

    process.exit(0);
  } catch (error) {
    console.error('Error running the seeder:', error);
    process.exit(1);
  }
}

runSeeder();
