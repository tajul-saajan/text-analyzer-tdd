import { getRepository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { User } from '@/entities/user';
import bcrypt from 'bcryptjs';

export class UserSeeder {
  static async seed(numRecords: number = 10): Promise<void> {
    const userRepository = getRepository(User);

    const texts = Array.from({ length: numRecords }).map(async () => {
      const name = faker.person.firstName();
      const email = faker.internet.email();
      const password = 'aaaaaa';

      const user = new User();
      user.name = name;
      user.email = email;
      user.password = await bcrypt.hash(password, 10);

      return user;
    });

    await userRepository.save(await Promise.all(texts));
    console.log(`${numRecords} User records have been seeded.`);
  }
}
