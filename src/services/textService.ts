import { Service } from 'typedi';
import { Text } from '@/entities/text';

@Service()
export class TextService {
  async createText(content: string) {
    const text = new Text();
    text.content = content;
    return await text.save();
  }
}
