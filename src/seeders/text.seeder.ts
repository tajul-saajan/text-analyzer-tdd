import { getRepository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Text } from '../entities/text';

export class TextSeeder {
  static async seed(numRecords: number = 10): Promise<void> {
    const textRepository = getRepository(Text);

    const texts = Array.from({ length: numRecords }).map(() => {
      const content = faker.lorem.sentences(3);

      const text = new Text();
      text.content = content;

      return text;
    });

    await textRepository.save(texts);
    console.log(`${numRecords} Text records have been seeded.`);
  }
}
